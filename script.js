const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.nav');
menuButton?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
document.querySelectorAll('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton?.setAttribute('aria-expanded', 'false');
}));
document.getElementById('year').textContent = new Date().getFullYear();
document.querySelectorAll('.faq-list details').forEach(item => {
  item.addEventListener('toggle', () => {
    const mark = item.querySelector('summary b');
    if (mark) mark.textContent = item.open ? '−' : '＋';
  });
});
