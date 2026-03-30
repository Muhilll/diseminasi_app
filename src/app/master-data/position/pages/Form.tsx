import { Component } from "solid-js";
import { usePositionForm } from "../hook/usePositionForm";
import type { PositionFormProps } from "../type/position-props";

const PositionForm: Component<PositionFormProps> = (props) => {
  const { formData, handleChange } = usePositionForm({
    initialData: () => props.initialData,
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label for="category">Category</label>
        <input
          id="category"
          type="text"
          value={formData().category}
          onChange={(e) => handleChange("category", e.target.value)}
          placeholder="expertise"
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
          placeholder="Ahli Regulasi"
          required
          disabled={props.isLoading}
        />
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading ? "Loading..." : props.initialData ? "Update Position" : "Add Position"}
      </button>
    </form>
  );
};

export default PositionForm;
