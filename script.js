'use strict';

const root = document.documentElement;
const menuButton = document.getElementById('menuButton');
const mainNav = document.getElementById('mainNav');
const progressBar = document.getElementById('progressBar');
const backToTop = document.getElementById('backToTop');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

menuButton?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  document.body.classList.toggle('nav-open', open);
  menuButton.setAttribute('aria-expanded', String(open));
});

mainNav?.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    document.body.classList.remove('nav-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const launchDate = new Date('2026-11-20T07:00:00+07:00').getTime();
const days = document.getElementById('days');
const hours = document.getElementById('hours');
const minutes = document.getElementById('minutes');
const seconds = document.getElementById('seconds');
const countdownNote = document.getElementById('countdownNote');

function setValue(element, value) {
  if (element) element.textContent = String(value).padStart(2, '0');
}

function updateCountdown() {
  const distance = launchDate - Date.now();
  if (distance <= 0) {
    [days, hours, minutes, seconds].forEach(item => setValue(item, 0));
    if (countdownNote) countdownNote.textContent = 'Kỳ thi đã bắt đầu';
    return;
  }

  const day = 86400000;
  const hour = 3600000;
  const minute = 60000;

  setValue(days, Math.floor(distance / day));
  setValue(hours, Math.floor((distance % day) / hour));
  setValue(minutes, Math.floor((distance % hour) / minute));
  setValue(seconds, Math.floor((distance % minute) / 1000));
}

updateCountdown();
setInterval(updateCountdown, 1000);

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach(item => observer.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('visible'));
}

const sections = [...document.querySelectorAll('main section[id]')];
const navLinks = [...document.querySelectorAll('.main-nav a')];

function handleScroll() {
  const scrollTop = window.scrollY;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  if (progressBar) progressBar.style.width = `${scrollable > 0 ? (scrollTop / scrollable) * 100 : 0}%`;
  backToTop?.classList.toggle('show', scrollTop > 550);

  let current = '';
  sections.forEach(section => {
    if (scrollTop >= section.offsetTop - 150) current = section.id;
  });
  navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}

window.addEventListener('scroll', handleScroll, { passive: true });
handleScroll();
backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

let fontSize = Number(localStorage.getItem('courseFontSize')) || 16;
function applyFontSize() {
  root.style.setProperty('--base-size', `${fontSize}px`);
  localStorage.setItem('courseFontSize', String(fontSize));
}
applyFontSize();

document.querySelectorAll('[data-font]').forEach(button => {
  button.addEventListener('click', () => {
    const action = button.dataset.font;
    if (action === 'up') fontSize = Math.min(19, fontSize + 1);
    if (action === 'down') fontSize = Math.max(14, fontSize - 1);
    if (action === 'reset') fontSize = 16;
    applyFontSize();
    showToast(`Cỡ chữ: ${fontSize}px`);
  });
});

document.getElementById('copyAddress')?.addEventListener('click', async () => {
  const address = 'Phòng 301, Khu 3, Đại học Cần Thơ, số 1 đường Lý Tự Trọng';
  try {
    await navigator.clipboard.writeText(address);
  } catch {
    const area = document.createElement('textarea');
    area.value = address;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    document.execCommand('copy');
    area.remove();
  }
  showToast('Đã sao chép địa chỉ.');
});
