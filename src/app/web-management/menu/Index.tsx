import { Component, Show, createSignal, onMount } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { useToast } from "../../../hooks/useToast";
import MenuTable from "./Data";
import MenuForm from "./Form";
import { menuAPI } from "./services/api";
import type { Menu, MenuFormData } from "./services/types";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const MenuPage: Component = () => {
  const [menus, setMenus] = createSignal<Menu[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingMenu, setEditingMenu] = createSignal<Menu | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingMenuId, setDeletingMenuId] = createSignal<string | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const fetchMenus = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await menuAPI.getAll();
      if (result.success && result.data) setMenus(result.data);
      else setError(result.error || "Failed to fetch menus");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: MenuFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        ...data,
        parent_id: data.parent_id ? data.parent_id : null,
      };

      const result = editingMenu()
        ? await menuAPI.update(String(editingMenu()!.id), payload)
        : await menuAPI.create(payload);

      if (result.success) {
        setEditingMenu(null);
        setShowForm(false);
        await fetchMenus();
        showToast("success", result.message || "Menu saved successfully");
      } else {
        const message = result.error || "Operation failed";
        setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (menu: Menu) => {
    setEditingMenu(menu);
    setShowForm(true);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    const id = deletingMenuId();
    if (!id) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await menuAPI.delete(id);
      if (result.success) {
        setDeletingMenuId(null);
        await fetchMenus();
        showToast("success", result.message || "Menu deleted successfully");
      } else {
        const message = result.error || "Failed to delete menu";
        setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchMenus);

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title="Menu Management"
        description="Manage web navigation menus and parent-child structure."
        action={
          <button class="btn-create" onClick={() => { setShowForm(true); setEditingMenu(null); }}>
            <IconPlusCircle />
            Add New Menu
          </button>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showForm()} onClose={() => { setEditingMenu(null); setShowForm(false); }}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{editingMenu() ? "Edit Menu" : "Add New Menu"}</h2>
            <button onClick={() => { setEditingMenu(null); setShowForm(false); }} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>
          <MenuForm initialData={editingMenu() || undefined} onSubmit={handleSubmit} isLoading={isLoading()} />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingMenuId()}
        title="Delete Menu"
        message="Are you sure you want to delete this menu? This action cannot be undone."
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingMenuId(null)}
      />

      <MenuTable
        menus={menus()}
        isLoading={isLoading()}
        onEdit={handleEdit}
        onDelete={(id) => setDeletingMenuId(id)}
      />
    </div>
  );
};

export default MenuPage;
