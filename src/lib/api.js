// Set per environment: .env.development locally, .env.production (or the
// Vercel env vars) for the deployed site. VITE_API_URL is the name Vercel
// uses; API_URL is kept so existing local .env files keep working.
export const API_URL = (
  import.meta.env.VITE_API_URL ??
  import.meta.env.API_URL ??
  ""
).replace(/\/+$/, "");

export const buildQuery = (params) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const string = query.toString();
  return string ? `?${string}` : "";
};

// GET a JSON endpoint; throws an Error with the API's message on failure
export async function apiGet(path, { signal } = {}) {
  if (!API_URL) {
    throw new Error("The API URL is not configured (API_URL).");
  }

  const response = await fetch(`${API_URL}${path}`, { signal });
  const data = await response.json();

  if (!response.ok || data.success === false) {
    throw new Error(
      data.detail || data.message || `Request failed (${response.status}).`
    );
  }

  return data;
}
