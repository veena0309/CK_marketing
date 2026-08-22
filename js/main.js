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

// ---------- Hero buyer risk report: tabs ----------
const buyerReports = [
  {
    company: 'Sharma Textiles Pvt. Ltd.',
    meta: 'GSTIN 27AAACS1234F1Z5 · Mumbai',
    score: 742,
    fillOffset: 55,
    bars: [88, 81, 68],
    grade: 'A · Low risk',
    gradeRisky: false,
    kycChip: 'KYC verified',
    riskChip: 'Risk unchanged · 30d',
  },
  {
    company: 'Mehta Traders',
    meta: 'GSTIN 24AABCM5678K1Z2 · Ahmedabad',
    score: 671,
    fillOffset: 120,
    bars: [70, 64, 72],
    grade: 'B · Moderate risk',
    gradeRisky: false,
    kycChip: 'KYC verified',
    riskChip: 'Risk unchanged · 30d',
  },
  {
    company: 'Kulkarni Bros.',
    meta: 'GSTIN 27AACCK4321P1Z9 · Pune',
    score: 588,
    fillOffset: 175,
    bars: [52, 41, 58],
    grade: 'D · High risk',
    gradeRisky: true,
    kycChip: 'KYC verified',
    riskChip: 'Risk rising · 30d',
  },
];

const reportTabs = document.getElementById('reportTabs');
const reportCompany = document.getElementById('reportCompany');
const reportMeta = document.getElementById('reportMeta');
const gaugeFill = document.getElementById('gaugeFill');
const gaugeScore = document.getElementById('gaugeScore');
const reportBars = document.getElementById('reportBars');
const reportGradeBadge = document.getElementById('reportGradeBadge');
const chipKyc = document.getElementById('chipKyc');
const chipRisk = document.getElementById('chipRisk');

function renderBuyerReport(index) {
  const data = buyerReports[index];
  reportCompany.textContent = data.company;
  reportMeta.textContent = data.meta;
  gaugeScore.textContent = data.score;
  gaugeFill.style.strokeDashoffset = String(data.fillOffset);
  reportGradeBadge.textContent = data.grade;
  reportGradeBadge.classList.toggle('grade-risky', data.gradeRisky);
  chipKyc.lastChild.textContent = ' ' + data.kycChip;
  chipRisk.lastChild.textContent = ' ' + data.riskChip;

  const barFills = reportBars.querySelectorAll('.report-bar-fill');
  const barNums = reportBars.querySelectorAll('.report-bar-num');
  data.bars.forEach((val, i) => {
    barFills[i].style.width = val + '%';
    barNums[i].textContent = val;
  });
}

if (reportTabs) {
  reportTabs.addEventListener('click', (e) => {
    const tab = e.target.closest('.report-tab');
    if (!tab) return;
    reportTabs.querySelectorAll('.report-tab').forEach((t) => {
      t.classList.remove('active');
      t.setAttribute('aria-selected', 'false');
    });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');
    renderBuyerReport(Number(tab.dataset.buyer));
  });
}

window.addEventListener('DOMContentLoaded', () => {
  gaugeFill.style.strokeDashoffset = '283';
  requestAnimationFrame(() => {
    setTimeout(() => renderBuyerReport(0), 350);
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
