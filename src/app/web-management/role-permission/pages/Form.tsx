import type { Component } from "solid-js";
import LookupSelect from "../../../../components/ui/LookupSelect";
import { useRolePermissionForm } from "../hook/useRolePermissionForm";
import { useRolePermissionOptions } from "../hook/useRolePermissionOptions";
import type { RolePermissionFormProps } from "../type/role-permission-props";

const RolePermissionForm: Component<RolePermissionFormProps> = (props) => {
  const { formData, handleChange } = useRolePermissionForm({
    initialData: () => props.initialData,
  });
  const { roles, menus, isOptionsLoading } = useRolePermissionOptions();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

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
