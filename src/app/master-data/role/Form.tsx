import { Component, createEffect, createSignal } from "solid-js";
import type { Role, RoleFormData } from "./services/types";

interface RoleFormProps {
  initialData?: Role;
  onSubmit: (data: RoleFormData) => void;
  isLoading?: boolean;
}

const RoleForm: Component<RoleFormProps> = (props) => {
  const [formData, setFormData] = createSignal<RoleFormData>({
    code: props.initialData?.code || "",
    name: props.initialData?.name || "",
  });

  createEffect(() => {
    const role = props.initialData;
    setFormData({
      code: role?.code || "",
      name: role?.name || "",
    });
  });

  const handleChange = (field: keyof RoleFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="code">Code</label>
        <input
          id="code"
          type="text"
          value={formData().code}
          onChange={(e) => handleChange("code", e.target.value)}
          placeholder="ADMIN"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData().name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Administrator"
          required
          disabled={props.isLoading}
        />
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Role" : "Add Role"}
      </button>
    </form>
  );
};

export default RoleForm;
