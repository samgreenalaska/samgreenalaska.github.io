// Frames the dashboard on Cavern and keeps this page's address in step with it.
// Used by dashboard/index.html and by 404.html, which GitHub Pages serves for every
// path it has no file for, so /dashboard/machines/glados works without a stub page.
// Address in: /dashboard/<path> here frames <DASH>/dashboard/<path>.
// Address out: the frame posts its path after each page or swap (static/app.js).
// Sign-in: Google refuses to load in a frame, so when the frame's login page asks,
// this page takes the whole tab to Google. Google comes back to the dashboard, which
// sends the tab here with #handoff=<code>; the frame trades the code for its cookie.
(function () {
  "use strict";
  var DASH = "https://cavern.tail334c08.ts.net";
  var PREFIX = "/dashboard";
  var SAFE = /^\/dashboard(\/[A-Za-z0-9_-]+)*\/?$/;
  var HANDOFF = /^#handoff=([A-Za-z0-9_-]{20,100})$/;
  // Pages that are part of signing in, never a place to come back to.
  var SIGN_IN = /^\/dashboard\/(login|waiting|auth)(\/|$)/;
  var TRIED = "sd-signin-at";
  var NEXT = "sd-next";

  var frame = document.getElementById("dashboard-frame");
  // On 404.html this runs for every missing page; only /dashboard paths are ours.
  if (!frame || !/^\/dashboard(\/|$)/.test(location.pathname)) return;

  function get(key) {
    try { return sessionStorage.getItem(key); } catch (e) { return null; }
  }
  function set(key, value) {
    try {
      if (value === null) sessionStorage.removeItem(key);
      else sessionStorage.setItem(key, value);
      return true;
    } catch (e) { return false; }
  }

  var path = location.pathname;
  if (!SAFE.test(path)) path = PREFIX + "/";
  var handoff = HANDOFF.exec(location.hash);
  if (handoff) {
    var next = get(NEXT);
    set(NEXT, null);
    if (!next || !SAFE.test(next)) next = PREFIX + "/";
    // The code is single use; drop it from the address and history at once.
    history.replaceState(null, "", next);
    var rest = next.slice(PREFIX.length);
    frame.src = DASH + PREFIX + "/auth/handoff?code=" + handoff[1] +
      (rest && rest !== "/" ? "&next=" + encodeURIComponent(rest) : "");
  } else {
    frame.src = DASH + path;
  }

  function signIn(how) {
    // Just went to Google and came back still signed out: the browser kept no
    // cookie. Let the login page offer its buttons instead of looping.
    var last = Number(get(TRIED) || 0);
    if (how === "auto" && Date.now() - last < 60000) {
      frame.contentWindow.postMessage({ dashboardSignIn: "manual" }, DASH);
      return;
    }
    if (!set(TRIED, String(Date.now()))) {
      frame.contentWindow.postMessage({ dashboardSignIn: "manual" }, DASH);
      return;
    }
    if (!SIGN_IN.test(path)) set(NEXT, path);
    location.replace(DASH + PREFIX + "/auth/google?doorway=1");
  }

  window.addEventListener("message", function (event) {
    if (event.origin !== DASH || event.source !== frame.contentWindow) return;
    var data = event.data || {};
    if (data.dashboardSignIn === "auto") {
      signIn("auto");
      return;
    }
    var next = data.dashboardPath;
    if (typeof next !== "string" || !SAFE.test(next)) return;
    if (next === PREFIX) next = PREFIX + "/";
    // Signed in and on a real page: the next sign-out may go straight to Google again.
    if (!SIGN_IN.test(next)) {
      set(TRIED, null);
      path = next;
    }
    // replaceState, not pushState: the frame's own navigations already sit in the
    // tab's history, so Back steps the frame back and it reports the old path again.
    if (next !== location.pathname) history.replaceState(null, "", next);
    var title = typeof data.title === "string" ? data.title.slice(0, 80) : "";
    document.title = title && title !== "Dashboard" ? title + " | Dashboard" : "Dashboard";
  });
})();
