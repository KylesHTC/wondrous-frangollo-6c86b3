/* OCC V104 / MASTER 43.42 — resilient sign-in hotfix */
(function () {
  const VALID_ROLES = ["Jobseeker", "Resident", "Business", "Funder"];

  function safeStoredRole() {
    try {
      const raw = localStorage.getItem("occV30State");
      if (!raw) return "";
      const saved = JSON.parse(raw);
      return VALID_ROLES.includes(saved && saved.role) ? saved.role : "";
    } catch (err) {
      return "";
    }
  }

  function showRoleChooserFallback() {
    const onboarding = document.getElementById("onboarding");
    if (onboarding) onboarding.classList.add("active");
    document.body.classList.add("onboarding-open");
    document.querySelectorAll(".onboard-screen").forEach(function (screen) {
      screen.classList.toggle("active", screen.getAttribute("data-onboard") === "role");
    });
    if (onboarding) onboarding.scrollTop = 0;
  }

  function targetForRole(role) {
    if (role === "Business") return "business-hub";
    if (role === "Resident") return "resident-hub";
    if (role === "Funder") return "partners-funders";
    return "work-home";
  }

  function forceSignIn(event) {
    event.preventDefault();
    event.stopImmediatePropagation();

    const emailInput = document.getElementById("loginEmail");
    const email = emailInput ? emailInput.value.trim() : "";
    if (!email) {
      if (typeof toast === "function") toast("Enter an email to sign in");
      else alert("Enter an email to sign in");
      return;
    }

    let role = safeStoredRole();

    try {
      if (typeof state !== "undefined") {
        state.email = email;
        if (!state.name) state.name = "Kristian Roberts";
        if (VALID_ROLES.includes(state.role)) role = state.role;
        if (typeof save === "function") save();
        if (typeof renderAll === "function") {
          try { renderAll(); } catch (renderErr) { console.warn("OCC render warning", renderErr); }
        }
      }
    } catch (err) {
      console.warn("OCC login state warning", err);
    }

    if (!VALID_ROLES.includes(role)) {
      if (typeof onboardNav === "function") onboardNav("role");
      else showRoleChooserFallback();
      return;
    }

    if (typeof hideOnboarding === "function" && typeof nav === "function") {
      hideOnboarding();
      nav(targetForRole(role));
      return;
    }

    /* Last-resort DOM fallback if the main app script has failed. */
    const onboarding = document.getElementById("onboarding");
    if (onboarding) onboarding.classList.remove("active");
    document.body.classList.remove("onboarding-open");
    document.querySelectorAll(".screen").forEach(function (screen) {
      screen.classList.toggle("active", screen.getAttribute("data-screen") === targetForRole(role));
    });
    window.scrollTo(0, 0);
  }

  function attach() {
    const button = document.getElementById("signInDemo");
    if (!button || button.dataset.occLoginHotfix === "1") return;
    button.dataset.occLoginHotfix = "1";
    button.addEventListener("click", forceSignIn, true);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", attach);
  else attach();
})();
