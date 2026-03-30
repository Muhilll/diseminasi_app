import type { Component } from "solid-js";
import { useDisseminationForm } from "../hook/useDisseminationForm";
import type { DisseminationFormProps } from "../type/dissemination-props";

const DisseminationForm: Component<DisseminationFormProps> = (props) => {
  const { formData, handleChange } = useDisseminationForm({
    initialData: () => props.initialData,
  });

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    props.onSubmit(formData());
  };

  return (
    <form onSubmit={handleSubmit} class="user-form">
      <div class="form-group">
        <label>User</label>
        <div class="form-static-value">{props.currentUserName}</div>
        <p class="form-helper-text">Dissemination will be saved under the current login user.</p>
      </div>

      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          type="text"
          value={formData().title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Dissemination title"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="province">Province</label>
        <input
          id="province"
          type="text"
          value={formData().province}
          onChange={(e) => handleChange("province", e.target.value)}
          placeholder="Province"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="city">City</label>
        <input
          id="city"
          type="text"
          value={formData().city}
          onChange={(e) => handleChange("city", e.target.value)}
          placeholder="City"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="district">District</label>
        <input
          id="district"
          type="text"
          value={formData().district}
          onChange={(e) => handleChange("district", e.target.value)}
          placeholder="District"
          required
          disabled={props.isLoading}
        />
      </div>

      <div class="form-group">
        <label for="village">Village</label>
        <input
          id="village"
          type="text"
          value={formData().village}
          onChange={(e) => handleChange("village", e.target.value)}
          placeholder="Village"
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

      <button type="submit" class="btn-submit" disabled={props.isLoading}>
        {props.isLoading
          ? "Loading..."
          : props.initialData
            ? "Update Dissemination"
            : "Add Dissemination"}
      </button>
    </form>
  );
};

export default DisseminationForm;
