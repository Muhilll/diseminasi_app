import { Component, For, Show, createMemo, createSignal, onMount } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import DataTable from "../../../components/ui/DataTable";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { usePagePermissions } from "../../../hooks/usePagePermissions";
import { useToast } from "../../../hooks/useToast";
import { uploadImageWithSignature } from "../../../services/uploads";
import { attendanceAPI, attendanceLeavesAPI } from "../service/attendance.api";
import type {
  AttendanceLeave,
  AttendanceRecord,
  TodayAttendanceStatus,
} from "../type/attendance";
import { createAttendanceColumns, createLeaveColumns, haversineMeters } from "./attendance.columns";

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

const AttendancePage: Component = () => {
  const permissions = usePagePermissions();
  const { toast, showToast, clearToast } = useToast();

  const [records, setRecords] = createSignal<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = createSignal<AttendanceLeave[]>([]);
  const [today, setToday] = createSignal<TodayAttendanceStatus | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [sectionTab, setSectionTab] = createSignal<"history" | "leaves">("history");

  const [leaveModalOpen, setLeaveModalOpen] = createSignal(false);
  const [leaveDate, setLeaveDate] = createSignal("");
  const [leaveReason, setLeaveReason] = createSignal("");
  const [leaveFile, setLeaveFile] = createSignal<File | null>(null);
  const [isSubmittingLeave, setIsSubmittingLeave] = createSignal(false);

  const [reviewTarget, setReviewTarget] = createSignal<{
    leave: AttendanceLeave;
    action: "approve" | "reject";
  } | null>(null);
  const [reviewNote, setReviewNote] = createSignal("");
  const [isReviewing, setIsReviewing] = createSignal(false);

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

  const groupedByTab = createMemo(() => {
    const date = selectedDate();
    const buckets: Record<string, AttendanceRecord[]> = {
      all: [],
      "0": [],
      "1": [],
      "2": [],
      "3": [],
      "4": [],
      "5": [],
      "6": [],
    };

    for (const r of records()) {
      if (date && r.attendance_date !== date) continue;
      buckets.all.push(r);
      const dow = getDayOfWeekFromDateStr(r.attendance_date);
      if (dow >= 0 && dow <= 6) {
        buckets[String(dow)].push(r);
      }
    }

    return buckets;
  });

  const tabCounts = createMemo(() => {
    const buckets = groupedByTab();
    const counts: Record<string, number> = {};
    for (const key of Object.keys(buckets)) {
      counts[key] = buckets[key].length;
    }
    return counts;
  });

  const visibleRecords = createMemo(() => groupedByTab()[activeDayTab()] ?? []);

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
    const [todayRes, listRes, leavesRes] = await Promise.all([
      attendanceAPI.getToday(),
      attendanceAPI.getAll(),
      attendanceLeavesAPI.getAll(),
    ]);

    if (todayRes.success && todayRes.data) {
      setToday(todayRes.data);
    }
    if (listRes.success && listRes.data) {
      setRecords(listRes.data);
    } else if (!listRes.success) {
      setError(listRes.error || "Failed to load attendances");
    }
    if (leavesRes.success && leavesRes.data) {
      setLeaves(leavesRes.data);
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
      att.check_in_status !== "izin"
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

  const isApprovedLeaveToday = createMemo(() => {
    const att = today()?.attendance;
    const leave = today()?.today_leave;
    return att?.check_in_status === "izin" || leave?.status === "approved";
  });

  const pendingLeavesCount = createMemo(
    () => leaves().filter((l) => l.status === "pending").length,
  );

  const canCheckInSchedule = createMemo(
    () => !!(today()?.can_check_in ?? today()?.schedule?.is_active),
  );

  const checkInDisabledReason = createMemo(() => {
    if (isApprovedLeaveToday()) return "Izin disetujui untuk hari ini";
    if (!canCheckInSchedule()) return "Tidak ada jadwal aktif hari ini";
    if (!coords()) return "Lokasi GPS belum tersedia";
    if (!isInsideRadius()) return "Anda berada di luar radius absensi";
    return null;
  });

  const openLeaveModal = () => {
    setLeaveDate(today()?.today_date || "");
    setLeaveReason("");
    setLeaveFile(null);
    setLeaveModalOpen(true);
  };

  const handleLeaveSubmit = async (e: Event) => {
    e.preventDefault();
    if (!leaveDate() || !leaveReason().trim()) {
      showToast("error", "Tanggal dan alasan izin wajib diisi");
      return;
    }

    setIsSubmittingLeave(true);
    try {
      let attachment: string | undefined;
      let attachment_public_id: string | undefined;
      const file = leaveFile();
      if (file) {
        const uploaded = await uploadImageWithSignature("attendance", file);
        attachment = uploaded.secureUrl;
        attachment_public_id = uploaded.publicId;
      }

      const res = await attendanceLeavesAPI.submit({
        leave_date: leaveDate(),
        reason: leaveReason().trim(),
        attachment,
        attachment_public_id,
      });

      if (res.success) {
        setLeaveModalOpen(false);
        await fetchData();
        showToast("success", res.message || "Pengajuan izin berhasil dikirim");
      } else {
        showToast("error", res.error || "Gagal mengajukan izin");
      }
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  const handleReviewSubmit = async (e: Event) => {
    e.preventDefault();
    const target = reviewTarget();
    if (!target) return;

    setIsReviewing(true);
    const res = await attendanceLeavesAPI.review(target.leave.id, {
      action: target.action,
      review_note: reviewNote().trim() || undefined,
    });
    if (res.success) {
      setReviewTarget(null);
      setReviewNote("");
      await fetchData();
      showToast("success", res.message || "Review izin disimpan");
    } else {
      showToast("error", res.error || "Gagal memproses izin");
    }
    setIsReviewing(false);
  };

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
      settings: today()?.settings ?? null,
    }),
  );

  const leaveColumns = createMemo(() =>
    createLeaveColumns({
      canReview: permissions.canReport(),
      onReview: (leave, action) => {
        setReviewNote("");
        setReviewTarget({ leave, action });
      },
    }),
  );

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title="Attendance"
        description="Check in, check out, or submit leave (Izin) for scheduled days."
        action={
          <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
            <Show when={permissions.canCreate()}>
              <button type="button" class="btn-secondary" onClick={openLeaveModal}>
                Ajukan Izin
              </button>
            </Show>
            <button
              type="button"
              class={sectionTab() === "history" ? "btn-create" : "btn-secondary"}
              onClick={() => setSectionTab("history")}
            >
              Riwayat Absensi
            </button>
            <button
              type="button"
              class={sectionTab() === "leaves" ? "btn-create" : "btn-secondary"}
              onClick={() => setSectionTab("leaves")}
            >
              Pengajuan Izin ({pendingLeavesCount()})
            </button>
          </div>
        }
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
                  color: canCheckInSchedule()
                    ? "var(--green-700)"
                    : "var(--red-600)",
                }}
              >
                {today()?.schedule?.is_active
                  ? "Jadwal Aktif"
                  : canCheckInSchedule()
                    ? `Jadwal Lintas Hari (${today()?.check_in_target_date})`
                    : "Tidak Ada Jadwal (Off)"}
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
              when={isApprovedLeaveToday()}
              fallback={
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
              }
            >
              <div style={{ "font-size": "13px", color: "#1e40af", "font-weight": "600" }}>
                Izin Disetujui Hari Ini
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

      <Modal open={leaveModalOpen()} onClose={() => setLeaveModalOpen(false)}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>Ajukan Izin</h2>
            <button
              type="button"
              class="btn-secondary"
              onClick={() => setLeaveModalOpen(false)}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleLeaveSubmit} class="user-form">
            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="leave_date">Tanggal Jadwal</label>
              <input
                id="leave_date"
                type="date"
                min={today()?.today_date || undefined}
                value={leaveDate()}
                onChange={(e) => setLeaveDate(e.currentTarget.value)}
                required
                disabled={isSubmittingLeave()}
              />
              <small class="form-helper-text">
                Hanya dapat memilih hari ini atau tanggal ke depan yang sesuai jadwal aktif Anda.
              </small>
            </div>

            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="leave_reason">Alasan / Keterangan</label>
              <textarea
                id="leave_reason"
                class="form-textarea"
                rows={3}
                value={leaveReason()}
                onInput={(e) => setLeaveReason(e.currentTarget.value)}
                placeholder="Tuliskan alasan izin..."
                required
                disabled={isSubmittingLeave()}
              />
            </div>

            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="leave_attachment">Bukti Foto (Opsional)</label>
              <div class="file-input-field">
                <label for="leave_attachment" class="file-input-button">
                  Choose Image
                </label>
                <span class="file-input-name">
                  {leaveFile()?.name || "No file chosen"}
                </span>
                <input
                  id="leave_attachment"
                  class="file-input-native"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLeaveFile(e.currentTarget.files?.[0] || null)}
                  disabled={isSubmittingLeave()}
                />
              </div>
            </div>

            <button
              type="submit"
              class="btn-submit"
              style={{ "grid-column": "1 / -1" }}
              disabled={isSubmittingLeave()}
            >
              {isSubmittingLeave() ? "Mengirim..." : "Kirim Pengajuan Izin"}
            </button>
          </form>
        </div>
      </Modal>

      <Modal open={!!reviewTarget()} onClose={() => setReviewTarget(null)}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>
              {reviewTarget()?.action === "approve" ? "Approve Izin" : "Reject Izin"} —{" "}
              {reviewTarget()?.leave.user?.name}
            </h2>
            <button
              type="button"
              class="btn-secondary"
              onClick={() => setReviewTarget(null)}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleReviewSubmit} class="user-form">
            <div style={{ "grid-column": "1 / -1", "font-size": "13.5px", color: "var(--gray-700)" }}>
              <strong>Tanggal:</strong> {reviewTarget()?.leave.leave_date}
              <br />
              <strong>Alasan:</strong> {reviewTarget()?.leave.reason}
            </div>

            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="review_note">Catatan Reviewer (Opsional)</label>
              <textarea
                id="review_note"
                class="form-textarea"
                rows={3}
                value={reviewNote()}
                onInput={(e) => setReviewNote(e.currentTarget.value)}
                placeholder="Catatan..."
                disabled={isReviewing()}
              />
            </div>

            <button
              type="submit"
              class="btn-submit"
              style={{ "grid-column": "1 / -1" }}
              disabled={isReviewing()}
            >
              {isReviewing()
                ? "Memproses..."
                : reviewTarget()?.action === "approve"
                  ? "Konfirmasi Approve"
                  : "Konfirmasi Reject"}
            </button>
          </form>
        </div>
      </Modal>

      <Show when={sectionTab() === "leaves"}>
        <DataTable
          rows={leaves()}
          columns={leaveColumns()}
          isLoading={isLoading()}
          emptyMessage="Belum ada pengajuan izin."
          itemsPerPage={10}
        />
      </Show>

      <Show when={sectionTab() === "history"}>
        <Show
        when={permissions.canReport()}
        fallback={
          <DataTable
            rows={records()}
            columns={columns()}
            isLoading={isLoading()}
            emptyMessage="No attendance records found."
            itemsPerPage={10}
          />
        }
      >
        <div>
          <div
            style={{
              display: "flex",
              "justify-content": "space-between",
              "align-items": "flex-end",
              gap: "12px",
              "flex-wrap": "wrap",
              "border-bottom": "3px solid var(--green-800)",
            }}
          >
            <div style={{ display: "flex", gap: "4px", "flex-wrap": "wrap" }}>
              <For each={DAY_TABS}>
                {(tab) => {
                  const isSelected = () => activeDayTab() === tab.key;
                  return (
                    <button
                      type="button"
                      style={{
                        display: "inline-flex",
                        "align-items": "center",
                        gap: "6px",
                        padding: "9px 14px",
                        border: "none",
                        "border-top-left-radius": "6px",
                        "border-top-right-radius": "6px",
                        background: isSelected() ? "var(--green-800)" : "var(--gray-200)",
                        color: isSelected() ? "#fff" : "var(--gray-700)",
                        "font-size": "13px",
                        "font-weight": "600",
                        "font-family": "inherit",
                        cursor: "pointer",
                        transition: "background 0.15s, color 0.15s",
                      }}
                      onClick={() => setActiveDayTab(tab.key)}
                    >
                      <span>{tab.label}</span>
                      <span
                        style={{
                          padding: "1px 6px",
                          "border-radius": "999px",
                          "font-size": "11px",
                          background: isSelected()
                            ? "rgba(255,255,255,0.22)"
                            : "rgba(255,255,255,0.7)",
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

            <div
              style={{
                display: "flex",
                "align-items": "center",
                gap: "8px",
                "padding-bottom": "6px",
                "flex-wrap": "wrap",
              }}
            >
              <input
                type="date"
                value={selectedDate()}
                onChange={(e) => setSelectedDate(e.currentTarget.value)}
                aria-label="Filter by date"
                style={{
                  height: "32px",
                  padding: "0 10px",
                  border: "1px solid var(--gray-200)",
                  "border-radius": "var(--radius-sm)",
                  background: "#fff",
                  color: "var(--gray-900)",
                  "font-size": "12.5px",
                  "font-family": "inherit",
                }}
              />
              <Show when={today()?.today_date}>
                {(todayDate) => (
                  <button
                    type="button"
                    class="btn-secondary"
                    style={{ padding: "5px 10px", "font-size": "12px" }}
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
                  style={{ padding: "5px 10px", "font-size": "12px" }}
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
      </Show>
      </Show>
    </div>
  );
};

export default AttendancePage;
