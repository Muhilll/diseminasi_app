import { Component, For, Show, createMemo, createSignal, onMount } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import DataTable from "../../../components/ui/DataTable";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { usePagePermissions } from "../../../hooks/usePagePermissions";
import { useToast } from "../../../hooks/useToast";
import { uploadImageWithSignature } from "../../../services/uploads";
import { attendanceAPI } from "../service/attendance.api";
import type { AttendanceRecord, TodayAttendanceStatus } from "../type/attendance";
import { createAttendanceColumns } from "./attendance.columns";

const DAY_TABS = [
  { key: "all", label: "Semua", day: null },
  { key: "0", label: "Minggu", day: 0 },
  { key: "1", label: "Senin", day: 1 },
  { key: "2", label: "Selasa", day: 2 },
  { key: "3", label: "Rabu", day: 3 },
  { key: "4", label: "Kamis", day: 4 },
  { key: "5", label: "Jumat", day: 5 },
  { key: "6", label: "Sabtu", day: 6 },
] as const;

function getDayOfWeekFromDateStr(dateStr: string): number {
  const [y, m, d] = dateStr.split("-").map(Number);
  if (!y || !m || !d) return -1;
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const AttendancePage: Component = () => {
  const permissions = usePagePermissions();
  const { toast, showToast, clearToast } = useToast();

  const [records, setRecords] = createSignal<AttendanceRecord[]>([]);
  const [today, setToday] = createSignal<TodayAttendanceStatus | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const [coords, setCoords] = createSignal<{ lat: number; lng: number } | null>(null);
  const [geoError, setGeoError] = createSignal<string | null>(null);
  const [isLocating, setIsLocating] = createSignal(false);

  const [modalMode, setModalMode] = createSignal<"check-in" | "check-out" | null>(null);
  const [photoFile, setPhotoFile] = createSignal<File | null>(null);
  const [note, setNote] = createSignal("");
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [activeDayTab, setActiveDayTab] = createSignal<string>("all");
  const [selectedDate, setSelectedDate] = createSignal<string>("");

  const dateFilteredRecords = createMemo(() => {
    const date = selectedDate();
    if (!date) return records();
    return records().filter((r) => r.attendance_date === date);
  });

  const tabCounts = createMemo(() => {
    const base = dateFilteredRecords();
    const counts: Record<string, number> = { all: base.length };
    for (let d = 0; d <= 6; d++) counts[String(d)] = 0;
    for (const r of base) {
      const dow = getDayOfWeekFromDateStr(r.attendance_date);
      if (dow >= 0 && dow <= 6) counts[String(dow)] += 1;
    }
    return counts;
  });

  const visibleRecords = createMemo(() => {
    const tab = activeDayTab();
    const base = dateFilteredRecords();
    if (tab === "all") return base;
    const dayNum = Number(tab);
    return base.filter((r) => getDayOfWeekFromDateStr(r.attendance_date) === dayNum);
  });

  const refreshLocation = () => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    setGeoError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setIsLocating(false);
      },
      (err) => {
        setGeoError(err.message || "Failed to acquire GPS location");
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    const [todayRes, listRes] = await Promise.all([
      attendanceAPI.getToday(),
      attendanceAPI.getAll(),
    ]);

    if (todayRes.success && todayRes.data) {
      setToday(todayRes.data);
    }
    if (listRes.success && listRes.data) {
      setRecords(listRes.data);
    } else if (!listRes.success) {
      setError(listRes.error || "Failed to load attendances");
    }
    setIsLoading(false);
  };

  onMount(() => {
    fetchData();
    refreshLocation();
  });

  const distanceMeters = createMemo(() => {
    const c = coords();
    const s = today()?.settings;
    if (!c || !s) return null;
    return Math.round(haversineMeters(c.lat, c.lng, s.latitude, s.longitude));
  });

  const hasOpenCheckIn = createMemo(() => {
    const att = today()?.attendance;
    return (
      !!att &&
      !att.check_out_time &&
      att.check_in_status !== "legacy" &&
      att.check_out_status !== "missed_checkout"
    );
  });

  const hasCompletedToday = createMemo(() => {
    const t = today();
    const att = t?.attendance;
    return (
      !!t &&
      !!att &&
      att.attendance_date === t.today_date &&
      !!att.check_out_time &&
      att.check_in_status !== "legacy"
    );
  });

  const isInsideRadius = createMemo(() => {
    const dist = distanceMeters();
    const s = today()?.settings;
    return dist !== null && !!s && dist <= s.radius_meters;
  });

  const checkInDisabledReason = createMemo(() => {
    if (!today()?.schedule?.is_active) return "Tidak ada jadwal aktif hari ini";
    if (!coords()) return "Lokasi GPS belum tersedia";
    if (!isInsideRadius()) return "Anda berada di luar radius absensi";
    return null;
  });

  const checkOutDisabledReason = createMemo(() => {
    if (!hasOpenCheckIn()) return "Lakukan Absen Masuk terlebih dahulu";
    if (!coords()) return "Lokasi GPS belum tersedia";
    if (!isInsideRadius()) return "Anda berada di luar radius absensi";
    return null;
  });

  const openModal = (mode: "check-in" | "check-out") => {
    setPhotoFile(null);
    setNote("");
    setModalMode(mode);
    refreshLocation();
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const mode = modalMode();
    const c = coords();
    const file = photoFile();
    if (!mode) return;

    if (!c) {
      showToast("error", "GPS location is required. Please enable location access.");
      return;
    }
    const setting = today()?.settings;
    if (setting && distanceMeters() !== null && distanceMeters()! > setting.radius_meters) {
      showToast(
        "error",
        `Outside allowed attendance radius (${distanceMeters()}m > ${setting.radius_meters}m)`,
      );
      return;
    }
    if (!file) {
      showToast("error", "Photo is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const uploaded = await uploadImageWithSignature("attendance", file);
      const payload = {
        latitude: c.lat,
        longitude: c.lng,
        image: uploaded.secureUrl,
        image_public_id: uploaded.publicId,
        note: note().trim() || undefined,
      };

      const res =
        mode === "check-in"
          ? await attendanceAPI.checkIn(payload)
          : await attendanceAPI.checkOut(payload);

      if (res.success) {
        setModalMode(null);
        await fetchData();
        showToast("success", res.message || "Attendance recorded");
      } else {
        showToast("error", res.error || "Failed to record attendance");
      }
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    const id = deletingId();
    if (!id) return;
    setIsLoading(true);
    const res = await attendanceAPI.delete(id);
    if (res.success) {
      setDeletingId(null);
      await fetchData();
      showToast("success", res.message || "Attendance deleted");
    } else {
      showToast("error", res.error || "Failed to delete attendance");
    }
    setIsLoading(false);
  };

  const columns = createMemo(() =>
    createAttendanceColumns({
      canDelete: permissions.canDelete(),
      onDelete: (id) => setDeletingId(id),
    }),
  );

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title="Attendance"
        description="Check in and check out using your current location and photo evidence."
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <div
        class="form-section"
        style={{
          "margin-bottom": "20px",
          display: "grid",
          gap: "16px",
        }}
      >
        <div
          style={{
            display: "flex",
            "justify-content": "space-between",
            "align-items": "flex-start",
            gap: "12px",
            "flex-wrap": "wrap",
          }}
        >
          <div style={{ display: "grid", gap: "6px" }}>
            <div style={{ "font-size": "15px", "font-weight": "700" }}>
              Today ({today()?.today_date || "-"}) —{" "}
              <span
                style={{
                  color: today()?.schedule?.is_active
                    ? "var(--green-700)"
                    : "var(--red-600)",
                }}
              >
                {today()?.schedule?.is_active ? "Jadwal Aktif" : "Tidak Ada Jadwal (Off)"}
              </span>
            </div>

            <Show when={today()?.settings}>
              {(s) => (
                <div style={{ "font-size": "13px", color: "var(--gray-500)" }}>
                  Target: <strong>{s().location_name}</strong> (Radius{" "}
                  {s().radius_meters}m) | Batas Masuk &le; {s().check_in_deadline} |
                  Batas Keluar &le; {s().check_out_deadline}
                </div>
              )}
            </Show>

            <div style={{ "font-size": "13px", color: "var(--gray-700)" }}>
              <Show
                when={coords()}
                fallback={
                  <span style={{ color: "var(--red-600)" }}>
                    {geoError() || (isLocating() ? "Acquiring GPS..." : "Location unavailable")}
                  </span>
                }
              >
                {(c) => (
                  <>
                    GPS: {c().lat.toFixed(5)}, {c().lng.toFixed(5)}
                    <Show when={distanceMeters() !== null && today()?.settings}>
                      {" "}
                      —{" "}
                      <strong
                        style={{
                          color: isInsideRadius()
                            ? "var(--green-700)"
                            : "var(--red-600)",
                        }}
                      >
                        {distanceMeters()}m (
                        {isInsideRadius() ? "Inside Radius" : "Outside Radius"})
                      </strong>
                    </Show>
                  </>
                )}
              </Show>
            </div>
          </div>

          <button
            type="button"
            class="btn-secondary"
            onClick={refreshLocation}
            disabled={isLocating()}
          >
            {isLocating() ? "Locating..." : "Refresh GPS"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            "grid-template-columns": "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              border: "1px solid var(--gray-200)",
              "border-radius": "10px",
              background: "var(--gray-50)",
              display: "grid",
              gap: "8px",
            }}
          >
            <div style={{ "font-weight": "700", "font-size": "14px" }}>
              1. Absen Masuk (Check-In)
            </div>
            <Show
              when={hasOpenCheckIn() || hasCompletedToday()}
              fallback={
                <>
                  <Show when={permissions.canCreate()}>
                    <button
                      type="button"
                      class="btn-create"
                      style={{
                        width: "100%",
                        "justify-content": "center",
                        ...(checkInDisabledReason()
                          ? { opacity: "0.45", cursor: "not-allowed" }
                          : {}),
                      }}
                      disabled={!!checkInDisabledReason()}
                      onClick={() => openModal("check-in")}
                    >
                      Absen Masuk (Check-In)
                    </button>
                  </Show>
                  <Show when={checkInDisabledReason()}>
                    <small style={{ color: "var(--gray-500)", "font-size": "12px" }}>
                      {checkInDisabledReason()}
                    </small>
                  </Show>
                </>
              }
            >
              <div style={{ "font-size": "13px", color: "var(--green-700)", "font-weight": "600" }}>
                Sudah Absen Masuk ({today()?.attendance?.attendance_date}) —{" "}
                {today()?.attendance?.check_in_status === "late" ? "Late" : "On Time"}
              </div>
            </Show>
          </div>

          <div
            style={{
              padding: "14px 16px",
              border: "1px solid var(--gray-200)",
              "border-radius": "10px",
              background: "var(--gray-50)",
              display: "grid",
              gap: "8px",
            }}
          >
            <div style={{ "font-weight": "700", "font-size": "14px" }}>
              2. Absen Keluar (Check-Out)
            </div>
            <Show
              when={hasCompletedToday()}
              fallback={
                <>
                  <Show when={permissions.canUpdate()}>
                    <button
                      type="button"
                      class="btn-create"
                      style={{
                        width: "100%",
                        "justify-content": "center",
                        ...(checkOutDisabledReason()
                          ? { opacity: "0.45", cursor: "not-allowed" }
                          : {}),
                      }}
                      disabled={!!checkOutDisabledReason()}
                      onClick={() => openModal("check-out")}
                    >
                      Absen Keluar (Check-Out)
                    </button>
                  </Show>
                  <Show when={checkOutDisabledReason()}>
                    <small style={{ color: "var(--gray-500)", "font-size": "12px" }}>
                      {checkOutDisabledReason()}
                    </small>
                  </Show>
                </>
              }
            >
              <div style={{ "font-size": "13px", color: "var(--green-700)", "font-weight": "600" }}>
                Sudah Absen Keluar —{" "}
                {today()?.attendance?.check_out_status === "late_checkout"
                  ? "Late Checkout"
                  : "On Time"}
              </div>
            </Show>
          </div>
        </div>
      </div>

      <Modal open={!!modalMode()} onClose={() => setModalMode(null)}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>
              {modalMode() === "check-in"
                ? "Absen Masuk (Check-In)"
                : "Absen Keluar (Check-Out)"}
            </h2>
            <button
              type="button"
              class="btn-secondary"
              onClick={() => setModalMode(null)}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSubmit} class="user-form">
            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="attendance_photo">Photo Evidence</label>
              <div class="file-input-field">
                <label for="attendance_photo" class="file-input-button">
                  Choose Image
                </label>
                <span class="file-input-name">
                  {photoFile()?.name || "No file chosen"}
                </span>
                <input
                  id="attendance_photo"
                  class="file-input-native"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => setPhotoFile(e.currentTarget.files?.[0] || null)}
                  disabled={isSubmitting()}
                />
              </div>
            </div>

            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="attendance_note">Note (Optional)</label>
              <textarea
                id="attendance_note"
                class="form-textarea"
                rows={3}
                value={note()}
                onInput={(e) => setNote(e.currentTarget.value)}
                placeholder="Notes..."
                disabled={isSubmitting()}
              />
            </div>

            <button
              type="submit"
              class="btn-submit"
              style={{ "grid-column": "1 / -1" }}
              disabled={isSubmitting()}
            >
              {isSubmitting()
                ? "Submitting..."
                : modalMode() === "check-in"
                  ? "Submit Check-In"
                  : "Submit Check-Out"}
            </button>
          </form>
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingId()}
        title="Delete Attendance"
        message="Are you sure you want to delete this attendance record?"
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />

      <div
        class="form-section"
        style={{
          padding: "14px 18px",
          "margin-bottom": "16px",
          display: "flex",
          "justify-content": "space-between",
          "align-items": "center",
          gap: "12px",
          "flex-wrap": "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "6px", "flex-wrap": "wrap" }}>
          <For each={DAY_TABS}>
            {(tab) => {
              const isSelected = () => activeDayTab() === tab.key;
              return (
                <button
                  type="button"
                  class={isSelected() ? "btn-create" : "btn-secondary"}
                  style={{
                    padding: "6px 12px",
                    "font-size": "13px",
                    gap: "6px",
                  }}
                  onClick={() => setActiveDayTab(tab.key)}
                >
                  <span>{tab.label}</span>
                  <span
                    style={{
                      padding: "1px 7px",
                      "border-radius": "999px",
                      "font-size": "11px",
                      background: isSelected()
                        ? "rgba(255,255,255,0.22)"
                        : "var(--gray-100)",
                      color: isSelected() ? "#fff" : "var(--gray-700)",
                    }}
                  >
                    {tabCounts()[tab.key] ?? 0}
                  </span>
                </button>
              );
            }}
          </For>
        </div>

        <div style={{ display: "flex", "align-items": "center", gap: "8px", "flex-wrap": "wrap" }}>
          <input
            type="date"
            value={selectedDate()}
            onChange={(e) => setSelectedDate(e.currentTarget.value)}
            aria-label="Filter by date"
            style={{
              height: "34px",
              padding: "0 10px",
              border: "1px solid var(--gray-200)",
              "border-radius": "var(--radius-sm)",
              background: "#fff",
              color: "var(--gray-900)",
              "font-size": "13px",
              "font-family": "inherit",
            }}
          />
          <Show when={today()?.today_date}>
            {(todayDate) => (
              <button
                type="button"
                class="btn-secondary"
                style={{ padding: "6px 10px", "font-size": "12.5px" }}
                onClick={() => {
                  setSelectedDate(todayDate());
                  setActiveDayTab("all");
                }}
              >
                Hari Ini
              </button>
            )}
          </Show>
          <Show when={selectedDate()}>
            <button
              type="button"
              class="btn-secondary"
              style={{ padding: "6px 10px", "font-size": "12.5px" }}
              onClick={() => setSelectedDate("")}
            >
              Reset
            </button>
          </Show>
        </div>
      </div>

      <DataTable
        rows={visibleRecords()}
        columns={columns()}
        isLoading={isLoading()}
        emptyMessage="No attendance records found."
        itemsPerPage={10}
      />
    </div>
  );
};

export default AttendancePage;
