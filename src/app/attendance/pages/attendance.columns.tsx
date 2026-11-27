import type { DataTableColumn } from "../../../components/ui/DataTable";
import { formatDate } from "../../../utils/helpers";
import type { AttendanceLeave, AttendanceRecord, AttendanceSetting } from "../type/attendance";

const IconTrash = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const STATUS_STYLE: Record<string, { label: string; bg: string; color: string }> = {
  on_time: { label: "On Time", bg: "#dcfce7", color: "#166534" },
  late: { label: "Late", bg: "#fef3c7", color: "#92400e" },
  late_checkout: { label: "Late Checkout", bg: "#fef3c7", color: "#92400e" },
  missed_checkout: { label: "Missed Checkout", bg: "#fee2e2", color: "#991b1b" },
  izin: { label: "Izin", bg: "#dbeafe", color: "#1e40af" },
  legacy: { label: "Legacy", bg: "#f3f4f6", color: "#4b5563" },
  pending: { label: "Pending", bg: "#fef3c7", color: "#92400e" },
  approved: { label: "Approved", bg: "#dcfce7", color: "#166534" },
  rejected: { label: "Rejected", bg: "#fee2e2", color: "#991b1b" },
};

function getThumbnailUrl(url: string | null | undefined): string {
  if (!url) return "";
  const marker = "/image/upload/";
  const idx = url.indexOf(marker);
  if (idx === -1 || url.includes("/image/upload/w_")) return url;
  return `${url.slice(0, idx + marker.length)}w_160,h_120,c_fill,q_auto,f_auto/${url.slice(idx + marker.length)}`;
}

function formatTime(value: string | null) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function StatusBadge(props: { status: string | null }) {
  if (!props.status) return <span style={{ color: "var(--gray-400)" }}>-</span>;
  const cfg = STATUS_STYLE[props.status] ?? {
    label: props.status,
    bg: "#f3f4f6",
    color: "#374151",
  };
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        "border-radius": "999px",
        "font-size": "11px",
        "font-weight": "600",
        background: cfg.bg,
        color: cfg.color,
      }}
    >
      {cfg.label}
    </span>
  );
}

export function haversineMeters(lat1: number, lng1: number, lat2: number, lng2: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatDistanceLabel(
  lat: number | null,
  lng: number | null,
  settings: AttendanceSetting | null | undefined,
): string | null {
  if (lat === null || lng === null || !settings) return null;
  const meters = Math.round(haversineMeters(lat, lng, settings.latitude, settings.longitude));
  return `${meters} m`;
}

export const createAttendanceColumns = (params: {
  canDelete: boolean;
  onDelete: (id: string) => void;
  settings?: AttendanceSetting | null;
}): DataTableColumn<AttendanceRecord>[] => [
  { header: "No", cell: (_, index) => <>{index + 1}</> },
  {
    header: "Date",
    cell: (row) => <>{formatDate(row.attendance_date, "id-ID")}</>,
  },
  {
    header: "User",
    cell: (row) => <>{row.user?.name || row.user_id}</>,
  },
  {
    header: "Check-In",
    cell: (row) => (
      <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
        <div class="table-image-thumb">
          {row.check_in_image ? (
            <img
              src={getThumbnailUrl(row.check_in_image)}
              alt="Check-In"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <span>-</span>
          )}
        </div>
        <div>
          <div style={{ "font-weight": "600" }}>{formatTime(row.check_in_time)}</div>
          <StatusBadge status={row.check_in_status} />
          {formatDistanceLabel(row.check_in_lat, row.check_in_lng, params.settings) && (
            <div style={{ "font-size": "12px", color: "var(--gray-500)" }}>
              Jarak: {formatDistanceLabel(row.check_in_lat, row.check_in_lng, params.settings)}
            </div>
          )}
          {row.check_in_note && (
            <div style={{ "font-size": "12px", color: "var(--gray-500)" }}>
              {row.check_in_note}
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    header: "Check-Out",
    cell: (row) => (
      <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
        {row.check_out_image ? (
          <div class="table-image-thumb">
            <img
              src={getThumbnailUrl(row.check_out_image)}
              alt="Check-Out"
              loading="lazy"
              decoding="async"
            />
          </div>
        ) : null}
        <div>
          <div style={{ "font-weight": "600" }}>{formatTime(row.check_out_time)}</div>
          <StatusBadge status={row.check_out_status} />
          {formatDistanceLabel(row.check_out_lat, row.check_out_lng, params.settings) && (
            <div style={{ "font-size": "12px", color: "var(--gray-500)" }}>
              Jarak: {formatDistanceLabel(row.check_out_lat, row.check_out_lng, params.settings)}
            </div>
          )}
          {row.check_out_note && (
            <div style={{ "font-size": "12px", color: "var(--gray-500)" }}>
              {row.check_out_note}
            </div>
          )}
        </div>
      </div>
    ),
  },
  {
    header: "Actions",
    headerStyle: { "text-align": "right" },
    cellClass: "td-actions",
    cell: (row) => (
      <div class="action-btns">
        {params.canDelete && (
          <button
            class="btn-icon btn-delete"
            title="Delete"
            onClick={() => params.onDelete(String(row.id))}
          >
            <IconTrash />
          </button>
        )}
      </div>
    ),
  },
];

export const createLeaveColumns = (params: {
  canReview: boolean;
  onReview: (leave: AttendanceLeave, action: "approve" | "reject") => void;
}): DataTableColumn<AttendanceLeave>[] => [
  { header: "No", cell: (_, index) => <>{index + 1}</> },
  {
    header: "Tanggal Izin",
    cell: (row) => <>{formatDate(row.leave_date, "id-ID")}</>,
  },
  {
    header: "User",
    cell: (row) => <>{row.user?.name || row.user_id}</>,
  },
  {
    header: "Alasan",
    cell: (row) => <>{row.reason}</>,
  },
  {
    header: "Bukti",
    cell: (row) => (
      <div class="table-image-thumb">
        {row.attachment ? (
          <img
            src={getThumbnailUrl(row.attachment)}
            alt="Bukti Izin"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span>-</span>
        )}
      </div>
    ),
  },
  {
    header: "Status",
    cell: (row) => (
      <div>
        <StatusBadge status={row.status} />
        {row.review_note && (
          <div style={{ "font-size": "12px", color: "var(--gray-500)", "margin-top": "3px" }}>
            {row.review_note}
          </div>
        )}
      </div>
    ),
  },
  {
    header: "Actions",
    headerStyle: { "text-align": "right" },
    cellClass: "td-actions",
    cell: (row) => (
      <div class="action-btns" style={{ gap: "6px" }}>
        {params.canReview && row.status === "pending" && (
          <>
            <button
              type="button"
              class="btn-create"
              style={{ padding: "5px 10px", "font-size": "12px" }}
              onClick={() => params.onReview(row, "approve")}
            >
              Approve
            </button>
            <button
              type="button"
              class="btn-secondary"
              style={{
                padding: "5px 10px",
                "font-size": "12px",
                color: "var(--red-600)",
                "border-color": "var(--red-100)",
              }}
              onClick={() => params.onReview(row, "reject")}
            >
              Reject
            </button>
          </>
        )}
      </div>
    ),
  },
];
