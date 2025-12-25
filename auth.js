<!-- auth.js -->
<script>
/*
  ============================
  DOTS6027 PRIVATE CONSOLE AUTH
  ============================
*/

const ALLOWED_EMAILS = [
  "lastwarners2024@gmail.com"
  // "bessingerbackup2024@gmail.com"  // intentionally disabled
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
  } catch (e) {
    return null;
  }
}

/* ---- Google callback ---- */
function handleCredentialResponse(response) {
  if (!response || !response.credential) {
    denyAccess();
    return;
  }

  const payload = parseJwt(response.credential);

  if (!payload || !payload.email) {
    denyAccess();
    return;
  }

  if (!isEmailAllowed(payload.email)) {
    denyAccess();
    return;
  }

  // AUTH PASSED
  document.documentElement.style.display = "block";
}

/* ---- Init Google OAuth ---- */
function initAuth() {
  if (!window.google || !google.accounts || !google.accounts.id) {
    denyAccess();
    return;
  }

  google.accounts.id.initialize({
    client_id: "364562868570-c6aepmq35baauehtalrt1bvujv4nm6c8.apps.googleusercontent.com",
    callback: handleCredentialResponse,
    auto_select: true
  });

  google.accounts.id.prompt(notification => {
    if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
      denyAccess();
    }
  });
}

/* ---- Hide page until auth ---- */
document.documentElement.style.display = "none";

/* ---- Load when ready ---- */
window.addEventListener("load", initAuth);
</script>
