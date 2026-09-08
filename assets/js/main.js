/* Timothee Afonso — portfolio
   1. Apparition des sections au scroll (fondu + translation, comme sur Framer)
   2. Bascule thème clair / sombre, mémorisée dans localStorage
   3. Formulaire de contact : envoi via Formspree (AJAX)

   La langue est portée par la page elle-même (<html lang>), le sélecteur FR/EN
   de la navigation est un simple lien : seules les quelques chaînes produites
   par ce script ont besoin d'être traduites ici. */

(function () {
  'use strict';

  var FORMSPREE_ID = 'xljewzve';

  var LANG = document.documentElement.lang === 'fr' ? 'fr' : 'en';
  var T = {
    en: {
      toLight: 'Switch to light theme',
      toDark:  'Switch to dark theme',
      fill:    'Please fill in every field.',
      sending: 'Sending…',
      sent:    'Thanks — your message has been sent.',
      error:   'Something went wrong. Please try again or email me directly.',
      config:  'Contact form is not configured yet (missing Formspree ID).'
    },
    fr: {
      toLight: 'Passer au thème clair',
      toDark:  'Passer au thème sombre',
      fill:    'Merci de remplir tous les champs.',
      sending: 'Envoi en cours…',
      sent:    'Merci — votre message a bien été envoyé.',
      error:   'Une erreur est survenue. Réessayez ou écrivez-moi directement.',
      config:  'Formulaire non configuré (ID Formspree manquant).'
    }
  }[LANG];

  /* ---------- 1. Apparition au scroll ------------------------------------ */
  var revealables = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });

    revealables.forEach(function (el) { observer.observe(el); });
  }

  /* ---------- 2. Thème clair / sombre ------------------------------------- */
  /* Le thème est déjà posé sur <html> par le script du <head> : ici on ne gère
     que la bascule, sa mémorisation et le suivi des préférences système. */
  var root = document.documentElement;
  var toggle = document.querySelector('.nav__theme');
  var media = window.matchMedia('(prefers-color-scheme: light)');

  function label() {
    if (!toggle) return;
    var text = root.getAttribute('data-theme') === 'light' ? T.toDark : T.toLight;
    toggle.setAttribute('aria-label', text);
    toggle.setAttribute('title', text);
  }

  function apply(theme, animate) {
    if (animate) {
      root.classList.add('theme-switching');
      window.setTimeout(function () { root.classList.remove('theme-switching'); }, 320);
    }
    root.setAttribute('data-theme', theme);
    label();
  }

  label();

  if (toggle) {
    toggle.addEventListener('click', function () {
      var theme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      apply(theme, true);
      try { localStorage.setItem('theme', theme); } catch (e) { /* mode privé */ }
    });
  }

  /* Tant que rien n'a été choisi, on suit les réglages du système. */
  media.addEventListener('change', function (event) {
    var stored;
    try { stored = localStorage.getItem('theme'); } catch (e) { stored = null; }
    if (stored !== 'light' && stored !== 'dark') apply(event.matches ? 'light' : 'dark', true);
  });

  /* ---------- 3. Formulaire de contact (Formspree) ------------------------ */
  var form = document.querySelector('.form');
  if (!form) return;

  var status = form.querySelector('.form__status');
  var submit = form.querySelector('.form__submit');

  function endpoint() {
    var action = (form.getAttribute('action') || '').trim();
    if (action && action.indexOf('YOUR_FORM_ID') === -1) return action;
    if (FORMSPREE_ID && FORMSPREE_ID !== 'YOUR_FORM_ID') {
      return 'https://formspree.io/f/' + FORMSPREE_ID;
    }
    return null;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var name = (form.elements.name.value || '').trim();
    var email = (form.elements.email.value || '').trim();
    var message = (form.elements.message.value || '').trim();

    if (!name || !email || !message) {
      if (status) status.textContent = T.fill;
      return;
    }

    var url = endpoint();
    if (!url) {
      if (status) status.textContent = T.config;
      return;
    }

    if (status) status.textContent = T.sending;
    if (submit) submit.disabled = true;

    var data = new FormData(form);

    fetch(url, {
      method: 'POST',
      body: data,
      headers: { Accept: 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          form.reset();
          if (status) status.textContent = T.sent;
          return;
        }
        return response.json().then(function (payload) {
          var detail = payload && payload.errors
            ? payload.errors.map(function (e) { return e.message; }).join(' ')
            : T.error;
          if (status) status.textContent = detail || T.error;
        }).catch(function () {
          if (status) status.textContent = T.error;
        });
      })
      .catch(function () {
        if (status) status.textContent = T.error;
      })
      .then(function () {
        if (submit) submit.disabled = false;
      });
  });
})();
