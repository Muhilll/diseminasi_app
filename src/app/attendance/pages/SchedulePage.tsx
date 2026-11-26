import { Component, For, Show, createSignal, onMount } from "solid-js";
import DataTable, { type DataTableColumn } from "../../../components/ui/DataTable";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { usePagePermissions } from "../../../hooks/usePagePermissions";
import { useToast } from "../../../hooks/useToast";
import { attendanceSchedulesAPI } from "../service/attendance.api";
import type { ScheduleDay, UserSchedule } from "../type/attendance";

const DAY_NAMES = [
  { day: 0, short: "Min", full: "Minggu (Malam Senin)" },
  { day: 1, short: "Sen", full: "Senin (Malam Selasa)" },
  { day: 2, short: "Sel", full: "Selasa (Malam Rabu)" },
  { day: 3, short: "Rab", full: "Rabu (Malam Kamis)" },
  { day: 4, short: "Kam", full: "Kamis (Malam Jumat)" },
  { day: 5, short: "Jum", full: "Jumat (Malam Sabtu)" },
  { day: 6, short: "Sab", full: "Sabtu (Bersih Bersama)" },
];

const SchedulePage: Component = () => {
  const permissions = usePagePermissions();
  const { toast, showToast, clearToast } = useToast();

  const [rows, setRows] = createSignal<UserSchedule[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingUser, setEditingUser] = createSignal<UserSchedule | null>(null);
  const [draftDays, setDraftDays] = createSignal<ScheduleDay[]>([]);
  const [isSaving, setIsSaving] = createSignal(false);

  const fetchSchedules = async () => {
    setIsLoading(true);
    setError(null);
    const res = await attendanceSchedulesAPI.getAll();
    if (res.success && res.data) {
      setRows(res.data);
    } else {
      setError(res.error || "Failed to load schedules");
    }
    setIsLoading(false);
  };

  onMount(fetchSchedules);

  const openEdit = (user: UserSchedule) => {
    setEditingUser(user);
    setDraftDays(
      DAY_NAMES.map(({ day }) => ({
        day_of_week: day,
        is_active: !!user.schedules.find((s) => s.day_of_week === day)?.is_active,
      })),
    );
  };

  const toggleDay = (day: number) => {
    setDraftDays((prev) =>
      prev.map((item) =>
        item.day_of_week === day ? { ...item, is_active: !item.is_active } : item,
      ),
    );
  };

  const handleSave = async (e: Event) => {
    e.preventDefault();
    const user = editingUser();
    if (!user) return;

    setIsSaving(true);
    const res = await attendanceSchedulesAPI.updateByUserId(
      user.user_id,
      draftDays(),
    );
    if (res.success) {
      setEditingUser(null);
      await fetchSchedules();
      showToast("success", res.message || "Schedule updated");
    } else {
      showToast("error", res.error || "Failed to update schedule");
    }
    setIsSaving(false);
  };

  const columns: DataTableColumn<UserSchedule>[] = [
    { header: "No", cell: (_, index) => <>{index + 1}</> },
    {
      header: "User",
      cell: (row) => (
        <div>
          <strong>{row.user_name}</strong>
          <div style={{ "font-size": "12px", color: "var(--gray-500)" }}>
            {row.user_email}
          </div>
        </div>
      ),
    },
    { header: "Role", cell: (row) => <>{row.role_code}</> },
    {
      header: "Active Days",
      cell: (row) => (
        <div style={{ display: "flex", gap: "6px", "flex-wrap": "wrap" }}>
          <For each={DAY_NAMES}>
            {({ day, short }) => {
              const active = !!row.schedules.find((s) => s.day_of_week === day)
                ?.is_active;
              return (
                <span
                  style={{
                    padding: "2px 8px",
                    "border-radius": "999px",
                    "font-size": "11.5px",
                    "font-weight": "600",
                    background: active ? "var(--green-100)" : "var(--gray-100)",
                    color: active ? "var(--green-800)" : "var(--gray-400)",
                  }}
                >
                  {short}
                </span>
              );
            }}
          </For>
        </div>
      ),
    },
    {
      header: "Actions",
      headerStyle: { "text-align": "right" },
      cellClass: "td-actions",
      cell: (row) => (
        <div class="action-btns">
          <Show when={permissions.canUpdate()}>
            <button
              type="button"
              class="btn-secondary"
              style={{ padding: "6px 12px", "font-size": "12.5px" }}
              onClick={() => openEdit(row)}
            >
              Edit
            </button>
          </Show>
        </div>
      ),
    },
  ];

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title="Attendance Schedule"
        description="Manage weekly active attendance days for each user."
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={!!editingUser()} onClose={() => setEditingUser(null)}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>Edit Schedule — {editingUser()?.user_name}</h2>
            <button
              type="button"
              class="btn-secondary"
              onClick={() => setEditingUser(null)}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} class="user-form">
            <div style={{ "grid-column": "1 / -1", display: "grid", gap: "10px" }}>
              <For each={DAY_NAMES}>
                {({ day, full }) => {
                  const checked = () =>
                    !!draftDays().find((d) => d.day_of_week === day)?.is_active;
                  return (
                    <label
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "10px",
                        padding: "10px 12px",
                        border: "1px solid var(--gray-200)",
                        "border-radius": "8px",
                        cursor: "pointer",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked()}
                        onChange={() => toggleDay(day)}
                        disabled={isSaving()}
                      />
                      <span>{full}</span>
                    </label>
                  );
                }}
              </For>
            </div>

            <button
              type="submit"
              class="btn-submit"
              style={{ "grid-column": "1 / -1" }}
              disabled={isSaving()}
            >
              {isSaving() ? "Saving..." : "Save Schedule"}
            </button>
          </form>
        </div>
      </Modal>

      <DataTable
        rows={rows()}
        columns={columns}
        isLoading={isLoading()}
        emptyMessage="No user schedules found."
        itemsPerPage={10}
      />
    </div>
  );
};

export default SchedulePage;
