// Entrance video: fade in smoothly as soon as it can play
const heroVideo = document.getElementById('heroVideo');
if (heroVideo) {
  const showVideo = () => heroVideo.classList.add('loaded');
  if (heroVideo.readyState >= 3) showVideo();
  else heroVideo.addEventListener('canplay', showVideo, { once: true });
}

// Scroll reveal + pop for every item as it comes into view
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Collection popup — only on the collection page
const cards = [...document.querySelectorAll('figure.card')];
const popup = document.getElementById('popup');
if (popup && cards.length) {
  const img = document.getElementById('popupImg');
  const nameEl = document.getElementById('popupName');
  const wa = document.getElementById('popupWa');
  let current = 0;
  function open(i) {
    current = (i + cards.length) % cards.length;
    const card = cards[current];
    const pic = card.querySelector('img');
    const name = card.dataset.name;
    img.src = pic.src;
    img.alt = name;
    nameEl.textContent = name;
    wa.href = 'https://wa.me/919840030443?text=' + encodeURIComponent('Hi Roots Handicraft, I am interested in ' + name + '.');
    popup.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function close() {
    popup.hidden = true;
    document.body.style.overflow = '';
  }
  cards.forEach((c, i) => c.addEventListener('click', () => open(i)));
  document.getElementById('popupClose').addEventListener('click', close);
  document.getElementById('popupBackdrop').addEventListener('click', close);
  document.getElementById('popupPrev').addEventListener('click', e => { e.stopPropagation(); open(current - 1); });
  document.getElementById('popupNext').addEventListener('click', e => { e.stopPropagation(); open(current + 1); });
  document.addEventListener('keydown', e => {
    if (popup.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open(current - 1);
    if (e.key === 'ArrowRight') open(current + 1);
  });
}
