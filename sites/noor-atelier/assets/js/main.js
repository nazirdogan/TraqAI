/* Noor Atelier — progressive enhancement only. Every page works without this. */
(function () {
  'use strict';

  /* ---- mobile navigation ------------------------------------------- */
  var toggle = document.querySelector('.nav__toggle');
  var links = document.getElementById('nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      links.classList.toggle('is-open', !open);
    });

    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && links.classList.contains('is-open')) {
        toggle.setAttribute('aria-expanded', 'false');
        links.classList.remove('is-open');
        toggle.focus();
      }
    });
  }

  /* ---- header hairline once scrolled ------------------------------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- FAQ accordion ------------------------------------------------ */
  Array.prototype.forEach.call(document.querySelectorAll('.faq__q'), function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq__item');
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      item.classList.toggle('is-open', !open);
    });
  });

  /* ---- reveal on scroll --------------------------------------------- */
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    Array.prototype.forEach.call(reveals, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    Array.prototype.forEach.call(reveals, function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 90) + 'ms';
      io.observe(el);
    });
  }

  /* ---- prefill the enquiry form from ?service= ---------------------- */
  var service = new URLSearchParams(window.location.search).get('service');
  var serviceField = document.getElementById('service');
  if (service && serviceField) {
    Array.prototype.forEach.call(serviceField.options, function (opt) {
      if (opt.value.toLowerCase() === service.toLowerCase()) {
        serviceField.value = opt.value;
      }
    });
  }

  /* ---- current year -------------------------------------------------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = String(new Date().getFullYear());
  });
})();
