import { Component } from "solid-js";
import { useGradeForm } from "../hook/useGradeForm";
import type { GradeFormProps } from "../type/grade-props";

const GradeForm: Component<GradeFormProps> = (props) => {
  const { formData, handleChange } = useGradeForm({
    initialData: () => props.initialData,
  });

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
