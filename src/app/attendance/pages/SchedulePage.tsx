import { Component, For, Show, createMemo, createSignal, onMount } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import DataTable, { type DataTableColumn } from "../../../components/ui/DataTable";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { usePagePermissions } from "../../../hooks/usePagePermissions";
import { useToast } from "../../../hooks/useToast";
import { attendanceSchedulesAPI } from "../service/attendance.api";
import type { ScheduleDay, UserSchedule } from "../type/attendance";

const DAY_NAMES = [
  { day: 0, short: "Min", tab: "Minggu", full: "Minggu — Malam Senin" },
  { day: 1, short: "Sen", tab: "Senin", full: "Senin — Malam Selasa" },
  { day: 2, short: "Sel", tab: "Selasa", full: "Selasa — Malam Rabu" },
  { day: 3, short: "Rab", tab: "Rabu", full: "Rabu — Malam Kamis" },
  { day: 4, short: "Kam", tab: "Kamis", full: "Kamis — Malam Jumat" },
  { day: 5, short: "Jum", tab: "Jumat", full: "Jumat — Malam Sabtu" },
  { day: 6, short: "Sab", tab: "Sabtu", full: "Sabtu — Bersih Bersama" },
];

const SchedulePage: Component = () => {
  const permissions = usePagePermissions();
  const { toast, showToast, clearToast } = useToast();

  const [rows, setRows] = createSignal<UserSchedule[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [viewMode, setViewMode] = createSignal<"by-day" | "by-user">("by-day");
  const [activeDay, setActiveDay] = createSignal<number>(0);
  const [daySearch, setDaySearch] = createSignal("");

  const [editingUser, setEditingUser] = createSignal<UserSchedule | null>(null);
  const [draftDays, setDraftDays] = createSignal<ScheduleDay[]>([]);
  const [isSaving, setIsSaving] = createSignal(false);

  const [addingDay, setAddingDay] = createSignal<{ day: number; full: string } | null>(
    null,
  );
  const [selectedAddUserId, setSelectedAddUserId] = createSignal("");
  const [removingTarget, setRemovingTarget] = createSignal<{
    userId: number;
    userName: string;
    day: number;
    dayName: string;
  } | null>(null);

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

  const activeDayGroup = createMemo(
    () => groupedByDay().find((g) => g.day === activeDay()) ?? groupedByDay()[0],
  );

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

  const availableUsersForAddDay = createMemo(() => {
    const target = addingDay();
    if (!target) return [];
    return rows().filter(
      (u) => !u.schedules.find((s) => s.day_of_week === target.day)?.is_active,
    );
  });

  const openAddModal = (day: number, full: string, e: MouseEvent) => {
    e.stopPropagation();
    setSelectedAddUserId("");
    setAddingDay({ day, full });
  };

  const handleAddMember = async (e: Event) => {
    e.preventDefault();
    const target = addingDay();
    const userId = Number(selectedAddUserId());
    if (!target || !userId) return;

    setIsSaving(true);
    const res = await attendanceSchedulesAPI.updateByUserId(userId, [
      { day_of_week: target.day, is_active: true },
    ]);
    if (res.success) {
      setAddingDay(null);
      setActiveDay(target.day);
      await fetchSchedules();
      showToast("success", "Anggota ditambahkan ke jadwal");
    } else {
      showToast("error", res.error || "Gagal menambahkan anggota");
    }
    setIsSaving(false);
  };

  const handleConfirmRemove = async () => {
    const target = removingTarget();
    if (!target) return;

    setIsSaving(true);
    const res = await attendanceSchedulesAPI.updateByUserId(target.userId, [
      { day_of_week: target.day, is_active: false },
    ]);
    if (res.success) {
      setRemovingTarget(null);
      await fetchSchedules();
      showToast("success", `${target.userName} dihapus dari ${target.dayName}`);
    } else {
      showToast("error", res.error || "Gagal menghapus anggota");
    }
    setIsSaving(false);
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

      <Modal open={!!addingDay()} onClose={() => setAddingDay(null)}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>Tambah Anggota — {addingDay()?.full}</h2>
            <button
              type="button"
              class="btn-secondary"
              onClick={() => setAddingDay(null)}
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleAddMember} class="user-form">
            <div class="form-group" style={{ "grid-column": "1 / -1" }}>
              <label for="add_member_select">Pilih Anggota</label>
              <select
                id="add_member_select"
                value={selectedAddUserId()}
                onChange={(e) => setSelectedAddUserId(e.currentTarget.value)}
                required
                disabled={isSaving()}
              >
                <option value="">-- Pilih user --</option>
                <For each={availableUsersForAddDay()}>
                  {(u) => (
                    <option value={String(u.user_id)}>
                      {u.user_name} ({u.user_email})
                    </option>
                  )}
                </For>
              </select>
            </div>

            <button
              type="submit"
              class="btn-submit"
              style={{ "grid-column": "1 / -1" }}
              disabled={isSaving() || !selectedAddUserId()}
            >
              {isSaving() ? "Menyimpan..." : "Tambahkan"}
            </button>
          </form>
        </div>
      </Modal>

      <ConfirmModal
        open={!!removingTarget()}
        title="Hapus dari Jadwal"
        message={`Hapus ${removingTarget()?.userName || ""} dari jadwal ${removingTarget()?.dayName || ""}?`}
        confirmLabel={isSaving() ? "Menghapus..." : "Hapus"}
        confirmLoading={isSaving()}
        onConfirm={handleConfirmRemove}
        onCancel={() => setRemovingTarget(null)}
      />

      <Show when={viewMode() === "by-day"}>
        <Show when={isLoading()}>
          <div class="form-section">Loading schedules...</div>
        </Show>

        <Show when={!isLoading()}>
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
                <For each={groupedByDay()}>
                  {(group) => {
                    const isSelected = () => activeDay() === group.day;
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
                        onClick={() => setActiveDay(group.day)}
                      >
                        <span>{group.tab}</span>
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
                          {group.members.length}
                        </span>
                      </button>
                    );
                  }}
                </For>
              </div>
            </div>

            <Show when={activeDayGroup()}>
              {(group) => (
                <div class="app-table-card" style={{ "border-top-left-radius": "0" }}>
                  <div
                    style={{
                      display: "flex",
                      "align-items": "center",
                      "justify-content": "space-between",
                      gap: "12px",
                      "flex-wrap": "wrap",
                      padding: "16px 20px",
                      "border-bottom": "1px solid var(--gray-100)",
                      background: "var(--gray-50)",
                    }}
                  >
                    <strong style={{ "font-size": "15px", color: "var(--gray-900)" }}>
                      {group().full} ({group().members.length} anggota)
                    </strong>

                    <div
                      style={{
                        display: "flex",
                        "align-items": "center",
                        gap: "10px",
                        "flex-wrap": "wrap",
                      }}
                    >
                      <div style={{ position: "relative", width: "240px", "max-width": "100%", "flex-shrink": "0" }}>
                        <span
                          aria-hidden="true"
                          style={{
                            position: "absolute",
                            left: "11px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            color: "var(--gray-400)",
                            display: "flex",
                            "pointer-events": "none",
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
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
                          placeholder="Cari anggota..."
                          value={daySearch()}
                          onInput={(e) => setDaySearch(e.currentTarget.value)}
                          style={{
                            width: "100%",
                            height: "36px",
                            padding: "0 10px 0 32px",
                            border: "1px solid var(--gray-200)",
                            "border-radius": "var(--radius-sm)",
                            background: "#fff",
                            color: "var(--gray-900)",
                            "font-size": "13px",
                            "font-family": "inherit",
                            outline: "none",
                          }}
                        />
                      </div>

                      <Show when={permissions.canUpdate()}>
                        <button
                          type="button"
                          class="btn-create"
                          style={{
                            height: "36px",
                            padding: "0 14px",
                            "font-size": "12.5px",
                            "flex-shrink": "0",
                          }}
                          onClick={(e) => openAddModal(group().day, group().full, e)}
                        >
                          + Tambah
                        </button>
                      </Show>
                    </div>
                  </div>

                  <div style={{ padding: "18px 20px" }}>
                    <Show
                      when={group().members.length > 0}
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
                        <For each={group().members}>
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
                                  class="btn-icon btn-delete"
                                  title="Hapus dari hari ini"
                                  style={{
                                    width: "auto",
                                    padding: "5px 10px",
                                    "font-size": "12px",
                                    "flex-shrink": "0",
                                  }}
                                  onClick={() =>
                                    setRemovingTarget({
                                      userId: member.user_id,
                                      userName: member.user_name,
                                      day: group().day,
                                      dayName: group().full,
                                    })
                                  }
                                >
                                  Hapus
                                </button>
                              </Show>
                            </div>
                          )}
                        </For>
                      </div>
                    </Show>
                  </div>
                </div>
              )}
            </Show>
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
