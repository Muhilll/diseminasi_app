import { Component } from "solid-js";
import LookupSelect from "../../../../components/ui/LookupSelect";
import { useUserForm } from "../hook/useUserForm";
import { useUserOptions } from "../hook/useUserOptions";
import type { UserFormProps } from "../type/user-props";

const UserForm: Component<UserFormProps> = (props) => {
  const isEditMode = () => !!props.initialData;
  const { formData, handleChange } = useUserForm({
    initialData: () => props.initialData,
  });
  const { grades, positions, roles, isOptionsLoading } = useUserOptions();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          type="text"
          value={formData().name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="Full name"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          type="email"
          value={formData().email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="user@example.com"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          value={formData().password}
          onChange={(e) => handleChange("password", e.target.value)}
          placeholder={isEditMode() ? "Leave blank if unchanged" : "********"}
          required={!isEditMode()}
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="employee_id">Employee ID</label>
        <input
          id="employee_id"
          type="text"
          value={formData().employee_id}
          onChange={(e) => handleChange("employee_id", e.target.value)}
          placeholder="EMP-001"
          required
          disabled={props.isLoading}
        />
      </div>

      <LookupSelect
        id="grade_id"
        label="Grade ID"
        value={String(formData().grade_id)}
        options={grades()}
        placeholder="Select grade"
        required
        disabled={props.isLoading || isOptionsLoading()}
        getValue={(grade) => String(grade.id)}
        getLabel={(grade) => `${grade.grade} - ${grade.des}`}
        onChange={(value) => handleChange("grade_id", value)}
      />

      <LookupSelect
        id="position_id"
        label="Position ID"
        value={String(formData().position_id)}
        options={positions()}
        placeholder="Select position"
        required
        disabled={props.isLoading || isOptionsLoading()}
        getValue={(position) => String(position.id)}
        getLabel={(position) => position.des}
        onChange={(value) => handleChange("position_id", value)}
      />

      <LookupSelect
        id="role_id"
        label="Role ID"
        value={String(formData().role_id)}
        options={roles()}
        placeholder="Select role"
        required
        disabled={props.isLoading || isOptionsLoading()}
        getValue={(role) => String(role.id)}
        getLabel={(role) => `${role.name} (${role.code})`}
        onChange={(value) => handleChange("role_id", value)}
      />

      <div class="form-group">
        <label for="signature_image">Signature Image URL</label>
        <input
          id="signature_image"
          type="text"
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
