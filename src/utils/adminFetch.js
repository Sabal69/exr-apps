const API_BASE = "http://localhost:4242";

export async function adminFetch(url, options = {}) {
    const accessToken = localStorage.getItem("adminToken");

    if (!accessToken) {
        forceLogout();
        throw new Error("No access token");
    }

    // ⚠️ DO NOT force Content-Type (breaks FormData)
    const headers = {
        ...(options.headers || {}),
        Authorization: `Bearer ${accessToken}`,
    };

    let res = await fetch(url, {
        ...options,
        headers,
    });

    // ✅ If forbidden → logout immediately (no infinite loop)
    if (res.status === 401 || res.status === 403) {
        forceLogout();
        throw new Error("Invalid or expired token");
    }

    return res;
}

/* ===============================
   FORCE LOGOUT
================================ */
function forceLogout() {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRefreshToken");
    window.location.replace("/admin/login");
}