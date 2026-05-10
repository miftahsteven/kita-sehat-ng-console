const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4003";

export async function apiFetch(path: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  let data;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    data = await response.json();
  } else {
    const text = await response.text();
    if (!response.ok) {
      throw new Error(text || `Error ${response.status}: ${response.statusText}`);
    }
    data = { data: text };
  }

  if (!response.ok) {
    const isLoginPage = typeof window !== "undefined" && window.location.pathname.includes("/admin/login");
    
    if (response.status === 401 && !isLoginPage) {
      localStorage.removeItem("user");
      window.location.href = "/admin/login";
    }
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
}
