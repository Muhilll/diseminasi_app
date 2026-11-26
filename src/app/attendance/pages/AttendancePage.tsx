import { Component, Show, createMemo, createSignal, onMount } from "solid-js";
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
          display: "flex",
          "justify-content": "space-between",
          "align-items": "center",
          gap: "16px",
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
                  : "var(--gray-500)",
              }}
            >
              {today()?.schedule?.is_active ? "Scheduled Active" : "Off Schedule"}
            </span>
          </div>

          <Show when={today()?.settings}>
            {(s) => (
              <div style={{ "font-size": "13px", color: "var(--gray-500)" }}>
                Target: <strong>{s().location_name}</strong> (Radius{" "}
                {s().radius_meters}m) | Masuk &le; {s().check_in_deadline} | Keluar
                &le; {s().check_out_deadline}
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
                        color:
                          distanceMeters()! <= today()!.settings!.radius_meters
                            ? "var(--green-700)"
                            : "var(--red-600)",
                      }}
                    >
                      {distanceMeters()}m (
                      {distanceMeters()! <= today()!.settings!.radius_meters
                        ? "Inside Radius"
                        : "Outside Radius"}
                      )
                    </strong>
                  </Show>
                </>
              )}
            </Show>
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px", "flex-wrap": "wrap" }}>
          <button
            type="button"
            class="btn-secondary"
            onClick={refreshLocation}
            disabled={isLocating()}
          >
            {isLocating() ? "Locating..." : "Refresh GPS"}
          </button>

          <Show when={permissions.canCreate() && !hasOpenCheckIn() && !hasCompletedToday()}>
            <button
              type="button"
              class="btn-create"
              disabled={!today()?.schedule?.is_active}
              onClick={() => openModal("check-in")}
            >
              Absen Masuk (Check-In)
            </button>
          </Show>

          <Show when={permissions.canUpdate() && hasOpenCheckIn()}>
            <button
              type="button"
              class="btn-create"
              onClick={() => openModal("check-out")}
            >
              Absen Keluar (Check-Out)
            </button>
          </Show>

          <Show when={hasCompletedToday()}>
            <span
              style={{
                padding: "8px 14px",
                "border-radius": "8px",
                background: "var(--green-100)",
                color: "var(--green-800)",
                "font-weight": "600",
                "font-size": "13px",
              }}
            >
              Completed Today
            </span>
          </Show>
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

      <DataTable
        rows={records()}
        columns={columns()}
        isLoading={isLoading()}
        emptyMessage="No attendance records found."
        itemsPerPage={10}
      />
    </div>
  );
};

export default AttendancePage;
