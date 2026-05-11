import { toast } from "sonner";

export async function apiFetch(endpoint, options = {}) {
  const baseURL =
    window.location.hostname === "localhost"
      ? "http://localhost:4000/api"
      : "https://tu-dominio.com/api";

  const isFormData = options.body instanceof FormData;

  const fetchOptions = {
    method: options.method || "GET",
    headers: isFormData
      ? options.headers || {}
      : {
          "Content-Type": "application/json",
          ...(options.headers || {})
        },
  };

  // 🔐 TOKEN JWT
  const token = localStorage.getItem("token");
  if (token) {
    fetchOptions.headers["Authorization"] = `Bearer ${token}`;
  }

  // BODY
  if (options.body) {
    fetchOptions.body = isFormData
      ? options.body
      : JSON.stringify(options.body);
  }

  let res;
  try {
    res = await fetch(baseURL + endpoint, fetchOptions);
  } catch (err) {
    toast.error("Error de conexión con el servidor");
    return { ok: false, status: 0, data: null };
  }

  // Intentar parsear JSON
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  // 🔥 TOKEN EXPIRADO O INVÁLIDO
  if (res.status === 401) {
    localStorage.removeItem("token");
    toast.error("Sesión expirada. Inicia sesión nuevamente.");
    window.location.href = "/login";
    return { ok: false, status: 401, data: null };
  }

  return { ok: res.ok, status: res.status, data };
}
