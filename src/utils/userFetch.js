const API_BASE = "http://localhost:4242";

export async function userFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options.headers,
        },
    });

    /* ===============================
       AUTO LOGOUT IF TOKEN EXPIRED
    ================================ */
    if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";
        return;
    }

    return res;
}