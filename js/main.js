/* Alberti Home Buyers LLC — Landing interactions */

(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ---------- Year ---------- */
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky navbar ---------- */
  const navbar = $("#navbar");
  const onScrollNav = () => {
    if (!navbar) return;
    navbar.classList.toggle("scrolled", window.scrollY > 12);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = $("#menu-toggle");
  const navLinks = $("#nav-links");

  const closeMenu = () => {
    if (!toggle || !navLinks) return;
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
    navLinks.classList.remove("open");
  };

  if (toggle && navLinks) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open menu" : "Close menu");
      navLinks.classList.toggle("open", !open);
    });

    navLinks.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.classList.contains("open")) return;
      if (!navLinks.contains(e.target) && !toggle.contains(e.target)) closeMenu();
    });
  }

  /* ---------- Scroll reveals ---------- */
  const reveals = $$(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = el.dataset.delay || 0;
          el.style.setProperty("--delay", delay);
          el.classList.add("in");
          io.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  /* ---------- Animated counters ---------- */
  const counters = $$("[data-count]");
  const animateCount = (el) => {
    const target = Number(el.dataset.count) || 0;
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(target * eased);
      el.textContent = `${prefix}${value}${suffix}`;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          cio.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- FAQ accordion ---------- */
  $$(".faq-item").forEach((item) => {
    const btn = item.querySelector(".faq-q");
    const panel = item.querySelector(".faq-a");
    if (!btn || !panel) return;

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close siblings
      $$(".faq-item.open").forEach((other) => {
        if (other === item) return;
        other.classList.remove("open");
        const ob = other.querySelector(".faq-q");
        const op = other.querySelector(".faq-a");
        if (ob) ob.setAttribute("aria-expanded", "false");
        if (op) op.hidden = true;
      });

      item.classList.toggle("open", !isOpen);
      btn.setAttribute("aria-expanded", String(!isOpen));
      panel.hidden = isOpen;
    });
  });

  /* ---------- Offer form ---------- */
  const form = $("#offer-form");
  const success = $("#form-success");

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const validatePhone = (v) => v.replace(/\D/g, "").length >= 10;

  if (form) {
    // Live phone formatting
    const phoneInput = form.querySelector("#phone");
    if (phoneInput) {
      phoneInput.addEventListener("input", () => {
        let digits = phoneInput.value.replace(/\D/g, "").slice(0, 10);
        if (digits.length >= 7) {
          phoneInput.value = `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        } else if (digits.length >= 4) {
          phoneInput.value = `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
        } else if (digits.length >= 1) {
          phoneInput.value = `(${digits}`;
        } else {
          phoneInput.value = "";
        }
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const fields = {
        name: form.querySelector("#name"),
        phone: form.querySelector("#phone"),
        email: form.querySelector("#email"),
        address: form.querySelector("#address"),
        condition: form.querySelector("#condition"),
        timeline: form.querySelector("#timeline"),
      };

      let valid = true;
      Object.values(fields).forEach((f) => f && f.classList.remove("error"));

      if (!fields.name?.value.trim()) {
        fields.name?.classList.add("error");
        valid = false;
      }
      if (!fields.phone || !validatePhone(fields.phone.value)) {
        fields.phone?.classList.add("error");
        valid = false;
      }
      if (!fields.email || !validateEmail(fields.email.value)) {
        fields.email?.classList.add("error");
        valid = false;
      }
      if (!fields.address?.value.trim()) {
        fields.address?.classList.add("error");
        valid = false;
      }
      if (!fields.condition?.value) {
        fields.condition?.classList.add("error");
        valid = false;
      }
      if (!fields.timeline?.value) {
        fields.timeline?.classList.add("error");
        valid = false;
      }

      if (!valid) {
        const firstErr = form.querySelector(".error");
        firstErr?.focus();
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      const label = btn?.querySelector(".btn-label");
      const loading = btn?.querySelector(".btn-loading");

      if (btn) btn.disabled = true;
      if (label) label.hidden = true;
      if (loading) loading.hidden = false;

      // Simulate submission — production would POST to a backend / form service
      setTimeout(() => {
        form.querySelectorAll(".field, .form-row, .btn-full, .form-fine").forEach((el) => {
          el.style.display = "none";
        });
        if (success) {
          success.hidden = false;
        }
        // Soft analytics hook
        try {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "cash_offer_submit" });
        } catch (_) { /* no-op */ }
      }, 900);
    });

    // Clear error state on input
    form.querySelectorAll("input, select, textarea").forEach((el) => {
      el.addEventListener("input", () => el.classList.remove("error"));
      el.addEventListener("change", () => el.classList.remove("error"));
    });
  }

  /* ---------- Mobile call bar ---------- */
  const mobileBar = $("#mobile-bar");
  if (mobileBar) {
    document.body.classList.add("has-mobile-bar");
    const showBar = () => {
      const past = window.scrollY > window.innerHeight * 0.55;
      mobileBar.classList.toggle("visible", past);
    };
    showBar();
    window.addEventListener("scroll", showBar, { passive: true });
  }

  /* ---------- Smooth anchor offset for older browsers ---------- */
  $$('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      // Move focus for a11y
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      history.pushState(null, "", id);
    });
  });

  /* ---------- Subtle magnetic hover on primary CTAs (desktop) ---------- */
  if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    $$(".btn-primary").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transform = `translate(${x * 0.08}px, ${y * 0.12 - 2}px)`;
      });
      btn.addEventListener("pointerleave", () => {
        btn.style.transform = "";
      });
    });
  }
})();
