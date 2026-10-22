import { API_URL } from "../config/api.js";

export class ApiError extends Error {
  constructor(message, status = 0, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const readResponse = async (response) => {
  if (response.status === 204) return null;

  const text = await response.text();
  if (!text) return null;

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("json")) return text;

  try {
    return JSON.parse(text);
  } catch {
    throw new ApiError("El servidor devolvió una respuesta inválida.", response.status);
  }
};

const getErrorMessage = (data, status) => {
  if (typeof data === "string" && data.trim()) return data;
  return (
    data?.message ||
    data?.error ||
    data?.title ||
    `La solicitud falló con el código ${status}.`
  );
};

export const httpRequest = async (path, options = {}) => {
  const { body, headers, ...requestOptions } = options;
  const requestHeaders = new Headers(headers);

  if (body !== undefined && !requestHeaders.has("Content-Type")) {
    requestHeaders.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...requestOptions,
      headers: requestHeaders,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await readResponse(response);

    if (!response.ok) {
      throw new ApiError(getErrorMessage(data, response.status), response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError("No se pudo conectar con la API .NET.", 0, error);
  }
};
