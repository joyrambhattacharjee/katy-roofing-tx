/* Katy Roofing Company TX — progressive enhancement only.
   The site works without this file: nav links are real anchors,
   forms fall back to a mailto action. */

(function () {
  "use strict";

  /* Mobile nav toggle */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* Footer year */
  Array.prototype.forEach.call(
    document.querySelectorAll("[data-year]"),
    function (el) {
      el.textContent = new Date().getFullYear();
    }
  );

  /* Lead form: validate, then compose an email to the company
     in the visitor's own mail client. No server involved. */
  var EMAIL = "info@katyroofingcompanytx.com";

  Array.prototype.forEach.call(
    document.querySelectorAll("form.js-lead-form"),
    function (form) {
      var fields = form.querySelectorAll("[data-required]");
      var success = form.nextElementSibling;

      function checkField(field) {
        var wrap = field.closest(".field");
        if (!wrap) return true;
        var valid = field.value.trim() !== "";
        wrap.classList.toggle("is-invalid", !valid);
        return valid;
      }

      fields.forEach(function (field) {
        field.addEventListener("input", function () {
          if (field.closest(".field").classList.contains("is-invalid")) {
            checkField(field);
          }
        });
      });

      form.addEventListener("submit", function (e) {
        /* Honeypot: silently drop bot submissions */
        var pot = form.querySelector("[name='company_website']");
        if (pot && pot.value) {
          e.preventDefault();
          return;
        }

        var firstInvalid = null;
        fields.forEach(function (field) {
          if (!checkField(field) && !firstInvalid) {
            firstInvalid = field;
          }
        });

        if (firstInvalid) {
          e.preventDefault();
          firstInvalid.focus();
          return;
        }

        var get = function (name) {
          var el = form.querySelector("[name='" + name + "']");
          return el ? el.value.trim() : "";
        };

        var page = get("form_page") || document.title;
        var name = get("full_name");
        var subject =
          "Roofing request from " + name + " — " + page;

        var lines = [
          "New roofing request from the " + page + " page.",
          "",
          "Name: " + name,
          "Phone: " + get("phone"),
          "Email: " + get("email"),
          "Property type: " + get("property_type"),
          "Service needed: " + get("service"),
          "",
          "Message:",
          get("message") || "(none)",
          "",
          "Submitted from: " + window.location.href
        ];

        var href =
          "mailto:" + EMAIL +
          "?subject=" + encodeURIComponent(subject) +
          "&body=" + encodeURIComponent(lines.join("\r\n"));

        e.preventDefault();
        window.location.href = href;

        if (success) {
          form.style.display = "none";
          success.classList.add("is-visible");
          success.setAttribute("tabindex", "-1");
          success.focus();
        }
      });
    }
  );
})();
