import type { Component } from "solid-js";
import { useDisseminationDetailForm } from "../hook/useDisseminationDetailForm";
import type { DisseminationDetailFormProps } from "../type/dissemination-detail-props";

const DisseminationDetailForm: Component<DisseminationDetailFormProps> = (props) => {
  const { formData, handleChange } = useDisseminationDetailForm({
    initialData: () => props.initialData,
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="basis">Basis / Directive</label>
        <textarea
          id="basis"
          value={formData().basis}
          onInput={(e) => handleChange("basis", e.currentTarget.value)}
          placeholder="Directive or basis"
          required
          disabled={props.isLoading}
          rows={5}
          class="form-textarea"
        />
      </div>

      <div class="form-group">
        <label for="methode">Methodology</label>
        <input
          id="methode"
          type="text"
          value={formData().methode}
          onChange={(e) => handleChange("methode", e.target.value)}
          placeholder="Methodology"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="material">Material Focus</label>
        <input
          id="material"
          type="text"
          value={formData().material}
          onChange={(e) => handleChange("material", e.target.value)}
          placeholder="Material focus"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="participants">Participants</label>
        <input
          id="participants"
          type="text"
          value={formData().participants}
          onChange={(e) => handleChange("participants", e.target.value)}
          placeholder="Participants"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="date">Date</label>
        <input
          id="date"
          type="date"
          value={formData().date}
          onChange={(e) => handleChange("date", e.target.value)}
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="location">Location</label>
        <input
          id="location"
          type="text"
          value={formData().location}
          onChange={(e) => handleChange("location", e.target.value)}
          placeholder="Venue or location"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="image">Image URL</label>
        <input
          id="image"
          type="text"
          value={formData().image}
          onChange={(e) => handleChange("image", e.target.value)}
          placeholder="Image URL"
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group" style={{ "grid-column": "1 / -1" }}>
        <label for="result">Key Results</label>
        <textarea
          id="result"
          value={formData().result}
          onInput={(e) => handleChange("result", e.currentTarget.value)}
          placeholder="Result or conclusion"
          required
          disabled={props.isLoading}
          rows={5}
          class="form-textarea"
        />
      </div>

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading
          ? "Loading..."
          : props.initialData
            ? "Update Dissemination Detail"
            : "Add Dissemination Detail"}
      </button>
    </form>
  );
};

export default DisseminationDetailForm;
