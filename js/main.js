// ---------- Sticky header shadow ----------
const header = document.getElementById('siteHeader');
const onScroll = () => {
  header.classList.toggle('scrolled', window.scrollY > 8);
};
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// ---------- Mobile nav ----------
const navToggle = document.getElementById('navToggle');
const mobileNav = document.getElementById('mobileNav');
navToggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Scroll reveal ----------
const revealTargets = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);
revealTargets.forEach((el) => revealObserver.observe(el));

// ---------- Steps connector line ----------
const stepsWrap = document.querySelector('.steps');
if (stepsWrap) {
  const stepsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          stepsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );
  stepsObserver.observe(stepsWrap);
}

// ---------- Hero gauge needle sweep ----------
window.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    setTimeout(() => {
      const needle = document.getElementById('gaugeNeedle');
      const fill = document.querySelector('.gauge-fill');
      if (needle) needle.style.transform = 'rotate(28deg)';
      if (fill) fill.style.strokeDashoffset = '145';
    }, 350);
  });
});

// ---------- FAQ accordion ----------
document.querySelectorAll('.faq-question').forEach((btn) => {
  btn.addEventListener('click', () => {
    const answer = btn.nextElementSibling;
    const isOpen = btn.getAttribute('aria-expanded') === 'true';

    document.querySelectorAll('.faq-question').forEach((other) => {
      other.setAttribute('aria-expanded', 'false');
      other.nextElementSibling.style.maxHeight = null;
    });

    if (!isOpen) {
      btn.setAttribute('aria-expanded', 'true');
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// ---------- Modal (Get Started / Login) ----------
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');

const modalCopy = {
  signup: {
    title: "We're still building sign up",
    body: "Credit Kawach isn't open for sign ups just yet. Reach out and we'll get you set up personally as soon as it's ready.",
  },
  login: {
    title: "We're still building login",
    body: "There's no live account to log into yet. Reach out and we'll let you know the moment Credit Kawach is ready for you.",
  },
};

let lastFocused = null;

function openModal(kind) {
  const copy = modalCopy[kind] || modalCopy.signup;
  modalTitle.textContent = copy.title;
  modalOverlay.querySelector('.modal p').textContent = copy.body;
  lastFocused = document.activeElement;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  modalClose.focus();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('[data-open-modal]').forEach((btn) => {
  btn.addEventListener('click', () => openModal(btn.getAttribute('data-open-modal')));
});
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
  if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

// ---------- Contact form ----------
const contactForm = document.getElementById('contactForm');
const contactSubmit = document.getElementById('contactSubmit');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (contactForm._honey.value) return; // honeypot triggered, silently drop

  contactSubmit.disabled = true;
  contactSubmit.textContent = 'Sending…';
  formStatus.textContent = '';
  formStatus.className = 'form-status';

  try {
    const res = await fetch(contactForm.action, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(contactForm),
    });

    if (res.ok) {
      formStatus.textContent = "Message sent. We'll get back to you soon.";
      formStatus.classList.add('success');
      contactForm.reset();
    } else {
      throw new Error('Request failed');
    }
  } catch (err) {
    formStatus.textContent = "That didn't go through. Please email support@creditkawach.com directly.";
    formStatus.classList.add('error');
  } finally {
    contactSubmit.disabled = false;
    contactSubmit.textContent = 'Send message';
  }
});
