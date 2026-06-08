/* ============================================================
   Interview-request modal: self-contained, progressive enhancement.
   Any element with [data-open-interview] opens the dialog.
   Those triggers should also be links to contact.html so that,
   if JS or <dialog> is unavailable, the click still reaches a
   working contact path instead of doing nothing.
   Submits to Web3Forms (serverless); works on static hosting.
   ============================================================ */
(function () {
  "use strict";

  var ACCESS_KEY = "392138a4-7414-4a02-902a-e96734239b09";

  // If the browser can't do modal dialogs, leave the triggers as plain
  // links to contact.html (no enhancement).
  var test = document.createElement("dialog");
  if (typeof test.showModal !== "function") return;

  var markup =
    '<dialog class="interview" id="interviewDialog" aria-labelledby="interviewTitle">' +
      '<div data-view="form">' +
        '<div class="dlg-head">' +
          '<div>' +
            '<h2 id="interviewTitle">Request an interview</h2>' +
            '<p>Hiring in Alaska oil &amp; gas? Send a note and I\'ll respond within one business day.</p>' +
          '</div>' +
          '<button class="dlg-close" type="button" data-close-interview aria-label="Close dialog">&times;</button>' +
        '</div>' +
        '<form class="interview-form" id="interviewForm">' +
          '<input type="hidden" name="access_key" value="' + ACCESS_KEY + '">' +
          '<input type="hidden" name="subject" value="Interview request from samgreenalaska.github.io">' +
          '<input type="hidden" name="from_name" value="Career Site Interview Request">' +
          '<input type="checkbox" name="botcheck" class="hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
          '<div class="field">' +
            '<label for="f-name">Your name</label>' +
            '<input id="f-name" name="name" type="text" required autocomplete="name">' +
          '</div>' +
          '<div class="field">' +
            '<label for="f-email">Email</label>' +
            '<input id="f-email" name="email" type="email" required autocomplete="email">' +
          '</div>' +
          '<div class="field">' +
            '<label for="f-company">Company / role you\'re hiring for</label>' +
            '<input id="f-company" name="company_role" type="text" required>' +
          '</div>' +
          '<div class="field">' +
            '<label for="f-message">Message <span class="optional">(optional)</span></label>' +
            '<textarea id="f-message" name="message"></textarea>' +
          '</div>' +
          '<button class="btn btn--primary dlg-submit" type="submit" id="submitBtn">Send request</button>' +
          '<p class="form-status" id="formStatus" role="status" aria-live="polite"></p>' +
          '<p class="fallback">Prefer email? Reach me directly at ' +
            '<a href="mailto:samgreenalaska@gmail.com">samgreenalaska@gmail.com</a>.</p>' +
        '</form>' +
      '</div>' +
      '<div data-view="success" class="success-panel" hidden>' +
        '<div class="mark" aria-hidden="true">&#10003;</div>' +
        '<h2>Request sent</h2>' +
        '<p>Thanks, your message is on its way. I\'ll be in touch within one business day.</p>' +
        '<button class="btn btn--steel" type="button" data-close-interview>Close</button>' +
      '</div>' +
    '</dialog>';

  function init() {
    var wrap = document.createElement("div");
    wrap.innerHTML = markup;
    var dialog = wrap.firstElementChild;
    document.body.appendChild(dialog);

    var form      = dialog.querySelector("#interviewForm");
    var statusEl  = dialog.querySelector("#formStatus");
    var submitBtn = dialog.querySelector("#submitBtn");
    var formView  = dialog.querySelector('[data-view="form"]');
    var okView    = dialog.querySelector('[data-view="success"]');

    function resetToForm() {
      form.reset();
      statusEl.textContent = "";
      statusEl.classList.remove("error");
      submitBtn.disabled = false;
      submitBtn.textContent = "Send request";
      formView.hidden = false;
      okView.hidden = true;
    }

    // Open from any trigger (links to contact.html, upgraded here)
    document.querySelectorAll("[data-open-interview]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        resetToForm();
        dialog.showModal();
        var first = dialog.querySelector("#f-name");
        if (first) first.focus();
      });
    });

    // Close: buttons + backdrop click
    dialog.querySelectorAll("[data-close-interview]").forEach(function (btn) {
      btn.addEventListener("click", function () { dialog.close(); });
    });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });

    // Submit -> Web3Forms
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      statusEl.textContent = "";
      statusEl.classList.remove("error");
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      var payload = {};
      new FormData(form).forEach(function (v, k) { payload[k] = v; });

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            formView.hidden = true;
            okView.hidden = false;
          } else {
            throw new Error(data.message || "Submission failed");
          }
        })
        .catch(function (err) {
          statusEl.classList.add("error");
          statusEl.textContent =
            "Something went wrong sending your message. Please try again, or email me directly using the link below.";
          submitBtn.disabled = false;
          submitBtn.textContent = "Send request";
          console.error("Web3Forms error:", err);
        });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
