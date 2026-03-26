import { Component, createEffect, createSignal, onMount } from "solid-js";
import { userAPI } from "./services/api";
import type {
  User,
  UserFormData,
} from "./services/types";
import { Grade } from "../grade/services/types";
import { Position } from "../position/services/types";
import { Role } from "../role/services/types";

interface UserFormProps {
  initialData?: User;
  onSubmit: (data: UserFormData) => void;
  isLoading?: boolean;
}

const UserForm: Component<UserFormProps> = (props) => {
  const isEditMode = () => !!props.initialData;
  const [grades, setGrades] = createSignal<Grade[]>([]);
  const [positions, setPositions] = createSignal<Position[]>([]);
  const [roles, setRoles] = createSignal<Role[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = createSignal(false);

  const [formData, setFormData] = createSignal<UserFormData>({
    email: props.initialData?.email || "",
    password: "",
    employee_id: props.initialData?.employee_id || "",
    name: props.initialData?.name || "",
    grade_id: props.initialData?.grade_id ? String(props.initialData.grade_id) : "",
    position_id: props.initialData?.position_id ? String(props.initialData.position_id) : "",
    signature_image: props.initialData?.signature_image || "",
    role_id: props.initialData?.role_id ? String(props.initialData.role_id) : "",
  });

  createEffect(() => {
    const user = props.initialData;

    setFormData({
      email: user?.email || "",
      password: "",
      employee_id: user?.employee_id || "",
      name: user?.name || "",
      grade_id: user?.grade_id ? String(user.grade_id) : "",
      position_id: user?.position_id ? String(user.position_id) : "",
      signature_image: user?.signature_image || "",
      role_id: user?.role_id ? String(user.role_id) : "",
    });
  });

  const handleChange = (field: keyof UserFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  const loadOptions = async () => {
    setIsOptionsLoading(true);

    try {
      const [gradesResult, positionsResult, rolesResult] = await Promise.all([
        userAPI.getGrades(),
        userAPI.getPositions(),
        userAPI.getRoles(),
      ]);

      if (gradesResult.success && gradesResult.data) {
        setGrades(gradesResult.data);
      }

      if (positionsResult.success && positionsResult.data) {
        setPositions(positionsResult.data);
      }

      if (rolesResult.success && rolesResult.data) {
        setRoles(rolesResult.data);
      }
    } finally {
      setIsOptionsLoading(false);
    }
  };

  onMount(loadOptions);

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

      <div class="form-group">
        <label for="grade_id">Grade ID</label>
        <select
          id="grade_id"
          value={String(formData().grade_id)}
          onChange={(e) => handleChange("grade_id", e.target.value)}
          required
          disabled={props.isLoading || isOptionsLoading()}
        >
          <option value="">Select grade</option>
          {grades().map((grade) => (
            <option
              value={String(grade.id)}
              selected={String(formData().grade_id) === String(grade.id)}
            >
              {grade.grade} - {grade.des}
            </option>
          ))}
        </select>
      </div>

      <div class="form-group">
        <label for="position_id">Position ID</label>
        <select
          id="position_id"
          value={String(formData().position_id)}
          onChange={(e) => handleChange("position_id", e.target.value)}
          required
          disabled={props.isLoading || isOptionsLoading()}
        >
          <option value="">Select position</option>
          {positions().map((position) => (
            <option
              value={String(position.id)}
              selected={String(formData().position_id) === String(position.id)}
            >
              {position.des}
            </option>
          ))}
        </select>
      </div>

      <div class="form-group">
        <label for="role_id">Role ID</label>
        <select
          id="role_id"
          value={String(formData().role_id)}
          onChange={(e) => handleChange("role_id", e.target.value)}
          required
          disabled={props.isLoading || isOptionsLoading()}
        >
          <option value="">Select role</option>
          {roles().map((role) => (
            <option
              value={String(role.id)}
              selected={String(formData().role_id) === String(role.id)}
            >
              {role.name} ({role.code})
            </option>
          ))}
        </select>
      </div>

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
