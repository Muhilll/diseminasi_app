import { Component, createEffect, createSignal } from "solid-js";
import type { Grade, GradeFormData } from "./services/types";

interface GradeFormProps {
  initialData?: Grade;
  onSubmit: (data: GradeFormData) => void;
  isLoading?: boolean;
}

const GradeForm: Component<GradeFormProps> = (props) => {
  const [formData, setFormData] = createSignal<GradeFormData>({
    level: props.initialData?.level || "",
    grade: props.initialData?.grade || "",
    des: props.initialData?.des || "",
  });

  createEffect(() => {
    const grade = props.initialData;
    setFormData({
      level: grade?.level || "",
      grade: grade?.grade || "",
      des: grade?.des || "",
    });
  });

  const handleChange = (field: keyof GradeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="level">Level</label>
        <input
          id="level"
          type="number"
          value={String(formData().level)}
          onChange={(e) => handleChange("level", e.target.value)}
          placeholder="1"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="grade">Grade</label>
        <input
          id="grade"
          type="text"
          value={formData().grade}
          onChange={(e) => handleChange("grade", e.target.value)}
          placeholder="Ia"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="des">Description</label>
        <input
          id="des"
          type="text"
          value={formData().des}
          onChange={(e) => handleChange("des", e.target.value)}
          placeholder="Golongan Ia"
          required
          disabled={props.isLoading}
        />
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Grade" : "Add Grade"}
      </button>
    </form>
  );
};

export default GradeForm;
