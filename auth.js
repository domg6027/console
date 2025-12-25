/*
  ============================
  DOTS6027 PRIVATE CONSOLE AUTH
  ============================
*/

const ALLOWED_EMAILS = [
  "lastwarners2024@gmail.com"
  // "bessingerbackup2024@gmail.com" // intentionally disabled
];

const DENY_REDIRECT = "index.html";

/* ---- Hard fail helper ---- */
function denyAccess() {
  window.location.replace(DENY_REDIRECT);
}

/* ---- Validate email ---- */
function isEmailAllowed(email) {
  return ALLOWED_EMAILS.includes(email);
}

/* ---- Decode JWT (Google ID token) ---- */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/* ---- Google callback ---- */
function handleCredentialResponse(response) {
  if (!response?.credential) {
    denyAccess();
    return;
  }

  const payload = parseJwt(response.credential);

  if (!payload?.email || !isEmailAllowed(payload.email)) {
    denyAccess();
    return;
  }

  /* ---- AUTH PASSED ---- */
  document.documentElement.style.display = "block";
}

/* ---- Init Google OAuth ---- */
function initAuth() {
  if (!window.google?.accounts?.id) {
    denyAccess();
    return;
  }

  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID,   // injected via HTML, not hardcoded
    callback: handleCredentialResponse,
    auto_select: true
  });

  google.accounts.id.prompt(notification => {
    if (
      notification.isNotDisplayed() ||
      notification.isSkippedMoment()
    ) {
      denyAccess();
    }
  });
}

/* ---- Hide page until auth ---- */
document.documentElement.style.display = "none";

/* ---- Load when ready ---- */
window.addEventListener("load", initAuth);
