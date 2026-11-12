// Frames the dashboard on Cave and keeps this page's address in step with it.
// Used by dashboard/index.html and by 404.html, which GitHub Pages serves for every
// path it has no file for, so /dashboard/machines/glados works without a stub page.
// Address in: /dashboard/<path> here frames <DASH>/dashboard/<path>.
// Address out: the frame posts its path after each page or swap (static/app.js).
(function () {
  "use strict";
  var DASH = "https://cave.tail334c08.ts.net";
  var PREFIX = "/dashboard";
  var SAFE = /^\/dashboard(\/[A-Za-z0-9_-]+)*\/?$/;

  var frame = document.getElementById("dashboard-frame");
  // On 404.html this runs for every missing page; only /dashboard paths are ours.
  if (!frame || !/^\/dashboard(\/|$)/.test(location.pathname)) return;
  var path = location.pathname;
  if (!SAFE.test(path)) path = PREFIX + "/";
  frame.src = DASH + path;

  window.addEventListener("message", function (event) {
    if (event.origin !== DASH || event.source !== frame.contentWindow) return;
    var data = event.data || {};
    var next = data.dashboardPath;
    if (typeof next !== "string" || !SAFE.test(next)) return;
    if (next === PREFIX) next = PREFIX + "/";
    // replaceState, not pushState: the frame's own navigations already sit in the
    // tab's history, so Back steps the frame back and it reports the old path again.
    if (next !== location.pathname) history.replaceState(null, "", next);
    var title = typeof data.title === "string" ? data.title.slice(0, 80) : "";
    document.title = title && title !== "Dashboard" ? title + " | Dashboard" : "Dashboard";
  });
})();
