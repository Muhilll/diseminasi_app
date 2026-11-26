import { Component, Show, createSignal, onMount } from "solid-js";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { usePagePermissions } from "../../../hooks/usePagePermissions";
import { useToast } from "../../../hooks/useToast";
import { attendanceSettingsAPI } from "../service/attendance.api";

const SettingsPage: Component = () => {
  const permissions = usePagePermissions();
  const { toast, showToast, clearToast } = useToast();

  const [locationName, setLocationName] = createSignal("Basecamp");
  const [latitude, setLatitude] = createSignal("");
  const [longitude, setLongitude] = createSignal("");
  const [radiusMeters, setRadiusMeters] = createSignal("100");
  const [checkInDeadline, setCheckInDeadline] = createSignal("21:00");
  const [checkOutDeadline, setCheckOutDeadline] = createSignal("17:00");
  const [isLoading, setIsLoading] = createSignal(false);
  const [isLocating, setIsLocating] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const loadSettings = async () => {
    setIsLoading(true);
    setError(null);
    const res = await attendanceSettingsAPI.get();
    if (res.success && res.data) {
      setLocationName(res.data.location_name);
      setLatitude(String(res.data.latitude));
      setLongitude(String(res.data.longitude));
      setRadiusMeters(String(res.data.radius_meters));
      setCheckInDeadline(res.data.check_in_deadline);
      setCheckOutDeadline(res.data.check_out_deadline);
    } else {
      setError(res.error || "Failed to load attendance settings");
    }
    setIsLoading(false);
  };

  onMount(loadSettings);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast("error", "Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toFixed(6));
        setLongitude(pos.coords.longitude.toFixed(6));
        setIsLocating(false);
        showToast("success", "Current coordinates captured");
      },
      (err) => {
        setIsLocating(false);
        showToast("error", err.message || "Failed to get current location");
      },
      { enableHighAccuracy: true, timeout: 10000 },
    );
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const res = await attendanceSettingsAPI.update({
      location_name: locationName().trim(),
      latitude: Number(latitude()),
      longitude: Number(longitude()),
      radius_meters: Number(radiusMeters()),
      check_in_deadline: checkInDeadline(),
      check_out_deadline: checkOutDeadline(),
    });

    if (res.success) {
      showToast("success", res.message || "Attendance settings saved");
    } else {
      const msg = res.error || "Failed to save settings";
      setError(msg);
      showToast("error", msg);
    }
    setIsLoading(false);
  };

  const isReadOnly = () => isLoading() || !permissions.canUpdate();

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title="Attendance Settings"
        description="Configure attendance location, allowed radius, check-in deadline, and check-out deadline."
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <div class="form-section" style={{ "max-width": "680px" }}>
        <form onSubmit={handleSubmit} class="user-form">
          <div class="form-group">
            <label for="location_name">Location Name</label>
            <input
              id="location_name"
              type="text"
              value={locationName()}
              onInput={(e) => setLocationName(e.currentTarget.value)}
              required
              disabled={isReadOnly()}
            />
          </div>

          <div
            style={{
              display: "grid",
              "grid-template-columns": "1fr 1fr",
              gap: "14px",
            }}
          >
            <div class="form-group">
              <label for="latitude">Latitude</label>
              <input
                id="latitude"
                type="number"
                step="any"
                value={latitude()}
                onInput={(e) => setLatitude(e.currentTarget.value)}
                required
                disabled={isReadOnly()}
              />
            </div>

            <div class="form-group">
              <label for="longitude">Longitude</label>
              <input
                id="longitude"
                type="number"
                step="any"
                value={longitude()}
                onInput={(e) => setLongitude(e.currentTarget.value)}
                required
                disabled={isReadOnly()}
              />
            </div>
          </div>

          <Show when={permissions.canUpdate()}>
            <div>
              <button
                type="button"
                class="btn-secondary"
                onClick={handleUseCurrentLocation}
                disabled={isLoading() || isLocating()}
              >
                {isLocating() ? "Locating..." : "Use Current Location"}
              </button>
            </div>
          </Show>

          <div class="form-group">
            <label for="radius_meters">Allowed Radius (meters)</label>
            <input
              id="radius_meters"
              type="number"
              min="10"
              max="50000"
              value={radiusMeters()}
              onInput={(e) => setRadiusMeters(e.currentTarget.value)}
              required
              disabled={isReadOnly()}
            />
          </div>

          <div
            style={{
              display: "grid",
              "grid-template-columns": "1fr 1fr",
              gap: "14px",
            }}
          >
            <div class="form-group">
              <label for="check_in_deadline">Batas Absen Masuk</label>
              <input
                id="check_in_deadline"
                type="time"
                value={checkInDeadline()}
                onInput={(e) => setCheckInDeadline(e.currentTarget.value)}
                required
                disabled={isReadOnly()}
              />
            </div>

            <div class="form-group">
              <label for="check_out_deadline">Batas Absen Keluar</label>
              <input
                id="check_out_deadline"
                type="time"
                value={checkOutDeadline()}
                onInput={(e) => setCheckOutDeadline(e.currentTarget.value)}
                required
                disabled={isReadOnly()}
              />
            </div>
          </div>

          <small class="form-helper-text">
            Jika batas absen keluar lebih kecil/sama dengan batas absen masuk (mis. masuk 21:00, keluar 09:00 atau 17:00), sistem otomatis menghitungnya sebagai shift lintas hari (esok harinya).
          </small>

          <Show when={permissions.canUpdate()}>
            <button type="submit" class="btn-submit" disabled={isLoading()}>
              {isLoading() ? "Saving..." : "Save Settings"}
            </button>
          </Show>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
