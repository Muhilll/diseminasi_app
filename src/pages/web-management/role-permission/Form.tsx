import { Component, createEffect, createSignal, onMount } from "solid-js";
import LookupSelect from "../../../components/ui/LookupSelect";
import { lookupAPI } from "../../../services/lookups";
import type { Menu } from "../menu/services/types";
import type { Role } from "../../master-data/role/services/types";
import type {
  RolePermission,
  RolePermissionFormData,
} from "./services/types";

interface RolePermissionFormProps {
  initialData?: RolePermission;
  onSubmit: (data: RolePermissionFormData) => void;
  isLoading?: boolean;
}

const RolePermissionForm: Component<RolePermissionFormProps> = (props) => {
  const [roles, setRoles] = createSignal<Role[]>([]);
  const [menus, setMenus] = createSignal<Menu[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = createSignal(false);

  const [formData, setFormData] = createSignal<RolePermissionFormData>({
    role_id: props.initialData?.role_id ? String(props.initialData.role_id) : "",
    menu_id: props.initialData?.menu_id ? String(props.initialData.menu_id) : "",
    can_read: props.initialData?.can_read ?? false,
    can_create: props.initialData?.can_create ?? false,
    can_update: props.initialData?.can_update ?? false,
    can_delete: props.initialData?.can_delete ?? false,
    can_report: props.initialData?.can_report ?? false,
  });

  createEffect(() => {
    const item = props.initialData;
    setFormData({
      role_id: item?.role_id ? String(item.role_id) : "",
      menu_id: item?.menu_id ? String(item.menu_id) : "",
      can_read: item?.can_read ?? false,
      can_create: item?.can_create ?? false,
      can_update: item?.can_update ?? false,
      can_delete: item?.can_delete ?? false,
      can_report: item?.can_report ?? false,
    });
  });

  const handleChange = (field: keyof RolePermissionFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  const loadOptions = async () => {
    setIsOptionsLoading(true);
    try {
      const [rolesResult, menusResult] = await Promise.all([
        lookupAPI.getRoles(),
        lookupAPI.getMenus(),
      ]);

      if (rolesResult.success && rolesResult.data) setRoles(rolesResult.data);
      if (menusResult.success && menusResult.data) setMenus(menusResult.data);
    } finally {
      setIsOptionsLoading(false);
    }
  };

  onMount(loadOptions);

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <LookupSelect
        id="role_id"
        label="Role"
        value={formData().role_id}
        options={roles()}
        placeholder="Select role"
        required
        disabled={props.isLoading || isOptionsLoading()}
        getValue={(role) => String(role.id)}
        getLabel={(role) => `${role.name} (${role.code})`}
        onChange={(value) => handleChange("role_id", value)}
      />

      <LookupSelect
        id="menu_id"
        label="Menu"
        value={formData().menu_id}
        options={menus()}
        placeholder="Select menu"
        required
        disabled={props.isLoading || isOptionsLoading()}
        getValue={(menu) => String(menu.id)}
        getLabel={(menu) => menu.name}
        onChange={(value) => handleChange("menu_id", value)}
      />

      <div class="permission-grid">
        <label class="checkbox-field">
          <input
            type="checkbox"
            checked={formData().can_read}
            onChange={(e) => handleChange("can_read", e.target.checked)}
            disabled={props.isLoading}
          />
          <span>Can Read</span>
        </label>

        <label class="checkbox-field">
          <input
            type="checkbox"
            checked={formData().can_create}
            onChange={(e) => handleChange("can_create", e.target.checked)}
            disabled={props.isLoading}
          />
          <span>Can Create</span>
        </label>

        <label class="checkbox-field">
          <input
            type="checkbox"
            checked={formData().can_update}
            onChange={(e) => handleChange("can_update", e.target.checked)}
            disabled={props.isLoading}
          />
          <span>Can Update</span>
        </label>

        <label class="checkbox-field">
          <input
            type="checkbox"
            checked={formData().can_delete}
            onChange={(e) => handleChange("can_delete", e.target.checked)}
            disabled={props.isLoading}
          />
          <span>Can Delete</span>
        </label>

        <label class="checkbox-field">
          <input
            type="checkbox"
            checked={formData().can_report}
            onChange={(e) => handleChange("can_report", e.target.checked)}
            disabled={props.isLoading}
          />
          <span>Can Report</span>
        </label>
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading
          ? "Loading..."
          : props.initialData
            ? "Update Role Permission"
            : "Add Role Permission"}
      </button>
    </form>
  );
};

export default RolePermissionForm;
