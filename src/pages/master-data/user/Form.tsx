import { Component, createSignal } from "solid-js";
import type { User, UserFormData } from "./services/types";

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

const UserForm: Component<UserFormProps> = (props) => {
  const [formData, setFormData] = createSignal<UserFormData>({
    email:           props.initialData?.email           || "",
    password:        props.initialData?.password        || "",
    employee_id:     props.initialData?.employee_id     || "",
    name:            props.initialData?.name            || "",
    grade_id:        props.initialData?.grade_id        || "",
    position_id:     props.initialData?.position_id     || "",
    signature_image: props.initialData?.signature_image || "",
    role_id:         props.initialData?.role_id         || "",
  });

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">

      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name" type="text"
          value={formData().name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Full name"
          required disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email" type="email"
          value={formData().email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="user@example.com"
          required disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password" type="password"
          value={formData().password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder="••••••••"
          required disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="employee_id">Employee ID</label>
        <input
          id="employee_id" type="text"
          value={formData().employee_id}
          onChange={(e) => handleChange("employee_id", e.target.value)}
          placeholder="EMP-001"
          required disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="grade_id">Grade ID</label>
        <input
          id="grade_id" type="text"
          value={formData().grade_id}
          onChange={(e) => handleChange("grade_id", e.target.value)}
          placeholder="Grade"
          required disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="position_id">Position ID</label>
        <input
          id="position_id" type="text"
          value={formData().position_id}
          onChange={(e) => handleChange("position_id", e.target.value)}
          placeholder="Position"
          required disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="role_id">Role ID</label>
        <input
          id="role_id" type="text"
          value={formData().role_id}
          onChange={(e) => handleChange("role_id", e.target.value)}
          placeholder="Role"
          required disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="signature_image">Signature Image URL</label>
        <input
          id="signature_image" type="text"
          value={formData().signature_image || ""}
          onChange={(e) => handleChange("signature_image", e.target.value)}
          placeholder="https://..."
          disabled={props.isLoading}
        />
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update User" : "Add User"}
      </button>

    </form>
  );
};

export default UserForm;