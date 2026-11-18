'use strict';
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => '$' + n.toLocaleString('en-US');

  const products = [
    { id: 1, name: 'Galaxy S26', desc: 'Flagship performance with an advanced AI camera.', price: 999, img: 'images/hero-phone.jpg' },
    { id: 2, name: 'Galaxy Watch', desc: 'Track health, sleep and workouts all day.', price: 299, img: 'images/watch.jpg' },
    { id: 3, name: 'Galaxy Buds', desc: 'Adaptive noise cancelling and rich, clear sound.', price: 149, img: 'images/buds.jpg' },
    { id: 4, name: 'Neo TV', desc: '4K display with deep contrast and smart features.', price: 1299, img: 'images/tv.jpg' }
  ];
  const appliances = [['AI Refrigerator', 'fridge.jpg'], ['Smart Washing Machine', 'washing-machine.jpg'], ['Robot Vacuum', 'vacuum.jpg'], ['Air Conditioner', 'ac.jpg']];
  const stories = [
    ['Innovation', 'Designing the next decade', 'How our engineers rethink everyday devices.'],
    ['AI Technology', 'Intelligence that adapts', 'On-device AI that learns how you live.'],
    ['Smart Home', 'One home, one ecosystem', 'Connect every appliance in a single app.'],
    ['Future of Mobile', 'Beyond the slab', 'Foldable and flexible ideas taking shape.']
  ];
  const cats = ['Smartphones', 'Tablets', 'Watches', 'Buds', 'TV', 'Monitors', 'Refrigerators', 'Washing Machines'];
  const slides = [
    ['Galaxy Future', 'Powerful technology. Designed for your life.'],
    ['Pure Sound', 'Buds that disappear. Music that doesn’t.'],
    ['Smart Living', 'Every device, one connected home.']
  ];
  const cart = new Map();

  const ph = (src, alt) => `<div class="ph"><img src="${src}" alt="${alt}" loading="lazy" onerror="this.remove()"></div>`;

  // ---------- rendering ----------
  function render() {
    $('#cats').innerHTML = cats.map(c => `<a href="#featured">${c}</a>`).join('');
    $('#products').innerHTML = products.map(p => `
      <article class="card">${ph(p.img, p.name)}<h3>${p.name}</h3><p>${p.desc}</p>
      <span class="price">${money(p.price)}</span>
      <div class="btns"><a href="#" class="btn btn--ghost">Learn more</a>
      <button class="btn" data-add="${p.id}">Buy now</button></div></article>`).join('');
    $('#appl').innerHTML = appliances.map(([n, f]) => `
      <article class="card">${ph('images/' + f, n)}<h3>${n}</h3><a href="#" class="link">Discover</a></article>`).join('');
    $('#stor').innerHTML = stories.map(([c, t, d], i) => `
      <article class="card">${ph('images/story' + (i + 1) + '.jpg', t)}<span class="tag">${c}</span>
      <h3>${t}</h3><p>${d}</p><a href="#" class="link">Read more</a></article>`).join('');
  }

  // ---------- panels ----------
  const overlay = $('#overlay');
  function closeAll() {
    $('#drawer').classList.remove('on');
    $('#drawer').setAttribute('aria-hidden', 'true');
    overlay.classList.remove('on');
    $('#search').hidden = true;
    document.body.style.overflow = '';
  }
  function openCart() { closeAll(); $('#drawer').classList.add('on'); $('#drawer').setAttribute('aria-hidden', 'false'); overlay.classList.add('on'); $('#cartClose').focus(); }
  function openSearch() { closeAll(); $('#search').hidden = false; document.body.style.overflow = 'hidden'; $('#searchInput').focus(); runSearch(); }

  function initMenu() {
    const btn = $('#menuBtn'), nav = $('#nav');
    btn.addEventListener('click', () => btn.setAttribute('aria-expanded', nav.classList.toggle('open')));
    $$('a', nav).forEach(a => a.addEventListener('click', () => { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); }));
  }

  function runSearch() {
    const q = $('#searchInput').value.trim().toLowerCase();
    const hits = products.filter(p => p.name.toLowerCase().includes(q));
    $('#results').innerHTML = hits.length
      ? hits.map(p => `<li><span>${p.name} — ${money(p.price)}</span><button data-add="${p.id}">Add to cart</button></li>`).join('')
      : '<li>No products found.</li>';
  }

  // ---------- cart ----------
  function renderCart() {
    const list = $('#cartList');
    let total = 0, count = 0;
    list.innerHTML = cart.size ? '' : '<li class="empty">Your cart is empty.</li>';
    cart.forEach((qty, id) => {
      const p = products.find(x => x.id === id);
      total += p.price * qty; count += qty;
      list.insertAdjacentHTML('beforeend', `<li>${ph(p.img, p.name)}
        <div><strong>${p.name}</strong><br><small>${money(p.price)}</small>
        <div class="qty"><button data-dec="${id}" aria-label="Decrease quantity">−</button><span>${qty}</span><button data-inc="${id}" aria-label="Increase quantity">+</button></div></div>
        <button class="rm" data-rm="${id}">Remove</button></li>`);
    });
    $('#total').textContent = money(total);
    $('#cartCount').textContent = count;
  }
  function change(id, d) {
    const n = (cart.get(id) || 0) + d;
    n > 0 ? cart.set(id, n) : cart.delete(id);
    renderCart();
  }

  // ---------- hero carousel ----------
  let cur = 0, timer;
  function showSlide(i) {
    cur = (i + slides.length) % slides.length;
    const t = $('#heroText');
    t.classList.add('fade');
    setTimeout(() => {
      $('#heroTitle').textContent = slides[cur][0];
      $('#heroSub').textContent = slides[cur][1];
      t.classList.remove('fade');
    }, 300);
    $$('#heroDots button').forEach((b, k) => b.classList.toggle('on', k === cur));
  }
  function initHero() {
    $('#heroDots').innerHTML = slides.map((_, i) => `<button aria-label="Slide ${i + 1}"></button>`).join('');
    $$('#heroDots button').forEach((b, i) => b.addEventListener('click', () => { showSlide(i); restart(); }));
    $$('#heroDots button')[0].classList.add('on');
    restart();
    function restart() { clearInterval(timer); timer = setInterval(() => showSlide(cur + 1), 6000); }
  }

  // ---------- product carousel ----------
  function initCarousel() {
    const tr = $('#products');
    const step = () => (tr.querySelector('.card')?.offsetWidth || 300) + 24;
    $('#next').addEventListener('click', () => tr.scrollBy({ left: step(), behavior: 'smooth' }));
    $('#prev').addEventListener('click', () => tr.scrollBy({ left: -step(), behavior: 'smooth' }));
  }

  // ---------- misc ----------
  function initReveal() {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
    $$('.reveal').forEach(el => io.observe(el));
  }
  function initTop() {
    const b = $('#topBtn');
    addEventListener('scroll', () => b.classList.toggle('on', scrollY > 600), { passive: true });
    b.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  }
  function initNewsletter() {
    $('#newsForm').addEventListener('submit', e => {
      e.preventDefault();
      const v = $('#email').value.trim(), m = $('#newsMsg');
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
      m.className = 'msg ' + (ok ? 'ok' : 'err');
      m.textContent = ok ? 'Thanks for subscribing!' : 'Enter a valid email, for example name@mail.com.';
      if (ok) e.target.reset();
    });
  }
  function initTheme() {
    const set = t => { document.documentElement.dataset.theme = t; try { localStorage.setItem('nova-theme', t); } catch (_) {} };
    let saved = null;
    try { saved = localStorage.getItem('nova-theme'); } catch (_) {}
    set(saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
    $('#themeBtn').addEventListener('click', () => set(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'));
  }

  // ---------- events ----------
  document.addEventListener('click', e => {
    const t = e.target.closest('button');
    if (!t) return;
    const d = t.dataset;
    if (d.add) { change(+d.add, 1); openCart(); }
    else if (d.inc) change(+d.inc, 1);
    else if (d.dec) change(+d.dec, -1);
    else if (d.rm) { cart.delete(+d.rm); renderCart(); }
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

  render(); renderCart();
  initMenu(); initHero(); initCarousel(); initReveal(); initTop(); initNewsletter(); initTheme();
  $('#searchBtn').addEventListener('click', openSearch);
  $('#searchClose').addEventListener('click', closeAll);
  $('#searchInput').addEventListener('input', runSearch);
  $('#cartBtn').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeAll);
  overlay.addEventListener('click', closeAll);
  $('#checkout').addEventListener('click', () => alert(cart.size ? 'Demo checkout: connect your payment provider here.' : 'Your cart is empty.'));
})();
