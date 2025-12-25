<!-- include.js -->
<script>
/*
  ============================
  UNIVERSAL HTML INCLUDE LOADER
  ============================
*/

async function loadInclude(id, file) {
  const target = document.getElementById(id);
  if (!target) return;

  try {
    const response = await fetch(file, { cache: "no-cache" });
    if (!response.ok) return;

    const html = await response.text();
    target.innerHTML = html;
  } catch {
    /* silent fail */
  }
}

/* ---- Load standard includes ---- */
document.addEventListener("DOMContentLoaded", () => {
  loadInclude("include-header", "header.html");
  loadInclude("include-nav", "nav.html");
  loadInclude("include-footer", "footer.html");
});
</script>
