/* Mobile navigation toggle: progressive enhancement.
   The nav links are visible by default if JS fails on desktop;
   on mobile the CSS hides them until .is-open is added. */
(function () {
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  // Close the menu when a link is tapped (mobile)
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A" && links.classList.contains("is-open")) {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
})();
