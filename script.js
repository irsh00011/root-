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


// Spider web Our Creative: doll first, click to web out photos, click again back to doll
const spiderBtn = document.getElementById('spiderBtn');
const spiderStage = document.getElementById('spiderStage');
const webWrap = document.getElementById('webWrap');
const webSvg = document.getElementById('webSvg');
const spiderLabel = document.getElementById('spiderLabel');
if (spiderBtn && spiderStage && webWrap && webSvg) {
  // Random-looking but fixed ties between photo boxes, so the web looks the same every time
  const ties = [[0,4],[1,5],[2,6],[3,7],[4,8],[5,9],[0,3],[2,5],[6,9],[1,4],[3,8]];
  function drawWeb() {
    const wrap = spiderStage.getBoundingClientRect();
    const cards = [...webWrap.querySelectorAll('.fcard')];
    const spider = spiderBtn.getBoundingClientRect();
    const sx = spider.left - wrap.left + spider.width / 2;
    const sy = spider.top - wrap.top + spider.height / 2;
    const centres = cards.map(c => {
      const r = c.getBoundingClientRect();
      return [r.left - wrap.left + r.width / 2, r.top - wrap.top + r.height / 2];
    });
    webSvg.setAttribute('viewBox', `0 0 ${wrap.width} ${wrap.height}`);
    webSvg.setAttribute('width', wrap.width);
    webSvg.setAttribute('height', wrap.height);
    let lines = '';
    // Web strands from the doll to every photo
    centres.forEach(([x, y]) => { lines += `<line x1="${sx}" y1="${sy}" x2="${x}" y2="${y}"/>`; });
    // Random cross-ties between photo boxes
    ties.forEach(([a, b]) => {
      if (centres[a] && centres[b]) lines += `<line x1="${centres[a][0]}" y1="${centres[a][1]}" x2="${centres[b][0]}" y2="${centres[b][1]}"/>`;
    });
    webSvg.innerHTML = lines;
  }
  spiderBtn.addEventListener('click', () => {
    const open = spiderStage.classList.toggle('open');
    spiderBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    webWrap.hidden = !open;
    spiderLabel.textContent = open ? 'Click again to come back to him' : 'Click for photos';
    if (open) {
      requestAnimationFrame(() => { drawWeb(); webWrap.scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    } else {
      webSvg.innerHTML = '';
    }
  });
  window.addEventListener('resize', () => { if (!webWrap.hidden) drawWeb(); });
}
