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


// Our Creative fan deck: click a side photo to bring it front, click front photo to open collection
const fanDeck = document.getElementById('fanDeck');
if (fanDeck) {
  const fanCards = [...fanDeck.querySelectorAll('.fan-card')];
  const fanName = document.getElementById('fanName');
  let active = 4;
  function layoutFan() {
    const step = window.innerWidth <= 640 ? 42 : 72;
    fanCards.forEach((card, i) => {
      const d = i - active;
      const scale = Math.max(0.62, 1 - Math.abs(d) * 0.09);
      const rot = d * 7;
      card.style.transform = `translateX(-50%) translateX(${d * step}px) rotate(${rot}deg) scale(${scale})`;
      card.style.zIndex = 20 - Math.abs(d);
      card.style.opacity = Math.abs(d) > 4 ? 0 : 1;
      card.style.pointerEvents = Math.abs(d) > 4 ? 'none' : 'auto';
    });
    if (fanName) fanName.textContent = fanCards[active].querySelector('img').alt;
  }
  fanCards.forEach((card, i) => card.addEventListener('click', e => {
    if (i !== active) { e.preventDefault(); active = i; layoutFan(); }
  }));
  document.getElementById('fanPrev')?.addEventListener('click', () => { active = (active - 1 + fanCards.length) % fanCards.length; layoutFan(); });
  document.getElementById('fanNext')?.addEventListener('click', () => { active = (active + 1) % fanCards.length; layoutFan(); });
  layoutFan();
  window.addEventListener('resize', layoutFan);
}
