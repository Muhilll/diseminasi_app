import { Component, For, Show, createMemo, createSignal, onMount } from "solid-js";
import DataTable, { type DataTableColumn } from "../../../components/ui/DataTable";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { usePagePermissions } from "../../../hooks/usePagePermissions";
import { useToast } from "../../../hooks/useToast";
import { attendanceSchedulesAPI } from "../service/attendance.api";
import type { ScheduleDay, UserSchedule } from "../type/attendance";

const DAY_NAMES = [
  { day: 0, short: "Min", full: "Minggu — Malam Senin" },
  { day: 1, short: "Sen", full: "Senin — Malam Selasa" },
  { day: 2, short: "Sel", full: "Selasa — Malam Rabu" },
  { day: 3, short: "Rab", full: "Rabu — Malam Kamis" },
  { day: 4, short: "Kam", full: "Kamis — Malam Jumat" },
  { day: 5, short: "Jum", full: "Jumat — Malam Sabtu" },
  { day: 6, short: "Sab", full: "Sabtu — Bersih Bersama" },
];

const IconChevron = (props: { open: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
    style={{
      transform: props.open ? "rotate(90deg)" : "rotate(0deg)",
      transition: "transform 0.15s ease",
    }}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const SchedulePage: Component = () => {
  const permissions = usePagePermissions();
  const { toast, showToast, clearToast } = useToast();

  const [rows, setRows] = createSignal<UserSchedule[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [viewMode, setViewMode] = createSignal<"by-day" | "by-user">("by-day");
  const [openDays, setOpenDays] = createSignal<Record<number, boolean>>({
    0: true,
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: false,
  });
  const [daySearch, setDaySearch] = createSignal("");

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

  const toggleDayAccordion = (day: number) => {
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const setAllDaysOpen = (open: boolean) => {
    setOpenDays({ 0: open, 1: open, 2: open, 3: open, 4: open, 5: open, 6: open });
  };

  const groupedByDay = createMemo(() => {
    const query = daySearch().trim().toLowerCase();
    return DAY_NAMES.map((meta) => {
      const members = rows().filter((u) => {
        const isActive = !!u.schedules.find((s) => s.day_of_week === meta.day)
          ?.is_active;
        if (!isActive) return false;
        if (!query) return true;
        return (
          u.user_name.toLowerCase().includes(query) ||
          u.user_email.toLowerCase().includes(query)
        );
      });
      return { ...meta, members };
    });
  });

  const openEdit = (user: UserSchedule) => {
    setEditingUser(user);
    setDraftDays(
      DAY_NAMES.map(({ day }) => ({
        day_of_week: day,
        is_active: !!user.schedules.find((s) => s.day_of_week === day)?.is_active,
      })),
    );
  };

  const toggleDraftDay = (day: number) => {
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
        action={
          <div style={{ display: "flex", gap: "8px", "flex-wrap": "wrap" }}>
            <button
              type="button"
              class={viewMode() === "by-day" ? "btn-create" : "btn-secondary"}
              onClick={() => setViewMode("by-day")}
            >
              Per Hari
            </button>
            <button
              type="button"
              class={viewMode() === "by-user" ? "btn-create" : "btn-secondary"}
              onClick={() => setViewMode("by-user")}
            >
              Per User
            </button>
          </div>
        }
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
                        onChange={() => toggleDraftDay(day)}
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

      <Show when={viewMode() === "by-day"}>
        <div
          class="form-section"
          style={{
            padding: "14px 20px",
            "margin-bottom": "16px",
            display: "flex",
            "justify-content": "space-between",
            "align-items": "center",
            gap: "12px",
            "flex-wrap": "wrap",
          }}
        >
          <div style={{ position: "relative", width: "min(100%, 320px)" }}>
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--gray-400)",
                display: "flex",
                "pointer-events": "none",
              }}
            >
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="search"
              placeholder="Cari nama atau email anggota..."
              value={daySearch()}
              onInput={(e) => setDaySearch(e.currentTarget.value)}
              style={{
                width: "100%",
                height: "38px",
                padding: "0 12px 0 36px",
                border: "1px solid var(--gray-200)",
                "border-radius": "var(--radius-sm)",
                background: "var(--gray-50)",
                color: "var(--gray-900)",
                "font-size": "13.5px",
                "font-family": "inherit",
                outline: "none",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              class="btn-secondary"
              onClick={() => setAllDaysOpen(true)}
            >
              Buka Semua
            </button>
            <button
              type="button"
              class="btn-secondary"
              onClick={() => setAllDaysOpen(false)}
            >
              Tutup Semua
            </button>
          </div>
        </div>

        <Show when={isLoading()}>
          <div class="form-section">Loading schedules...</div>
        </Show>

        <Show when={!isLoading()}>
          <div style={{ display: "grid", gap: "12px" }}>
            <For each={groupedByDay()}>
              {(group) => {
                const isOpen = () => !!openDays()[group.day];
                return (
                  <div class="app-table-card">
                    <button
                      type="button"
                      onClick={() => toggleDayAccordion(group.day)}
                      style={{
                        width: "100%",
                        display: "flex",
                        "align-items": "center",
                        "justify-content": "space-between",
                        padding: "16px 20px",
                        background: isOpen() ? "var(--gray-50)" : "#fff",
                        border: "none",
                        cursor: "pointer",
                        "text-align": "left",
                        "font-family": "inherit",
                      }}
                    >
                      <div style={{ display: "flex", "align-items": "center", gap: "10px" }}>
                        <IconChevron open={isOpen()} />
                        <strong style={{ "font-size": "15px", color: "var(--gray-900)" }}>
                          {group.full}
                        </strong>
                      </div>
                      <span
                        style={{
                          padding: "3px 10px",
                          "border-radius": "999px",
                          "font-size": "12px",
                          "font-weight": "600",
                          background: "var(--green-100)",
                          color: "var(--green-800)",
                        }}
                      >
                        {group.members.length} anggota
                      </span>
                    </button>

                    <Show when={isOpen()}>
                      <div
                        style={{
                          padding: "14px 20px 18px",
                          "border-top": "1px solid var(--gray-100)",
                        }}
                      >
                        <Show
                          when={group.members.length > 0}
                          fallback={
                            <div style={{ color: "var(--gray-400)", "font-size": "13px" }}>
                              Tidak ada anggota terjadwal di hari ini.
                            </div>
                          }
                        >
                          <div
                            style={{
                              display: "grid",
                              "grid-template-columns": "repeat(auto-fill, minmax(260px, 1fr))",
                              gap: "10px",
                            }}
                          >
                            <For each={group.members}>
                              {(member) => (
                                <div
                                  style={{
                                    display: "flex",
                                    "align-items": "center",
                                    "justify-content": "space-between",
                                    gap: "10px",
                                    padding: "10px 14px",
                                    border: "1px solid var(--gray-200)",
                                    "border-radius": "8px",
                                    background: "#fff",
                                  }}
                                >
                                  <div style={{ "min-width": "0" }}>
                                    <div
                                      style={{
                                        "font-weight": "600",
                                        "font-size": "13.5px",
                                        color: "var(--gray-900)",
                                        overflow: "hidden",
                                        "text-overflow": "ellipsis",
                                        "white-space": "nowrap",
                                      }}
                                    >
                                      {member.user_name}
                                    </div>
                                    <div
                                      style={{
                                        "font-size": "12px",
                                        color: "var(--gray-500)",
                                        overflow: "hidden",
                                        "text-overflow": "ellipsis",
                                        "white-space": "nowrap",
                                      }}
                                    >
                                      {member.user_email}
                                    </div>
                                  </div>

                                  <Show when={permissions.canUpdate()}>
                                    <button
                                      type="button"
                                      class="btn-secondary"
                                      style={{
                                        padding: "5px 10px",
                                        "font-size": "12px",
                                        "flex-shrink": "0",
                                      }}
                                      onClick={() => openEdit(member)}
                                    >
                                      Edit
                                    </button>
                                  </Show>
                                </div>
                              )}
                            </For>
                          </div>
                        </Show>
                      </div>
                    </Show>
                  </div>
                );
              }}
            </For>
          </div>
        </Show>
      </Show>

      <Show when={viewMode() === "by-user"}>
        <DataTable
          rows={rows()}
          columns={columns}
          isLoading={isLoading()}
          emptyMessage="No user schedules found."
          itemsPerPage={10}
        />
      </Show>
    </div>
  );
};

export default SchedulePage;
