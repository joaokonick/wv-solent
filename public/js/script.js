'use strict';

/* ══════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════ */
const themeBtn = document.getElementById('themeToggle');
if (localStorage.getItem('wv-theme') === 'light') document.body.classList.add('light');
if (themeBtn) {
  themeBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light');
    localStorage.setItem('wv-theme', isLight ? 'light' : 'dark');
    themeBtn.setAttribute('aria-label', isLight ? 'Toggle dark mode' : 'Toggle light mode');
  });
}

document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════
     NAV SCROLL
  ══════════════════════════════════════════ */
  const hdr = document.getElementById('hdr');
  if (hdr) {
    const onScroll = () => hdr.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════════════════════════════════════
     MOBILE BURGER
  ══════════════════════════════════════════ */
  const burger = document.getElementById('navBurger');
  const links = document.getElementById('navLinks');
  if (burger && links) {
    burger.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ══════════════════════════════════════════
     SCROLL REVEAL
  ══════════════════════════════════════════ */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.js-reveal').forEach(el => io.observe(el));

  const ios = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); ios.unobserve(e.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.js-stagger').forEach(el => ios.observe(el));

  /* ══════════════════════════════════════════
     AJAX SEARCH
  ══════════════════════════════════════════ */
  const searchToggle = document.getElementById('searchToggle');
  const searchBox = document.getElementById('searchBox');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  let searchTimer = null;

  if (searchToggle && searchBox) {
    searchToggle.addEventListener('click', () => {
      const hidden = searchBox.hidden;
      searchBox.hidden = !hidden;
      searchToggle.setAttribute('aria-expanded', String(hidden));
      if (hidden) setTimeout(() => searchInput && searchInput.focus(), 50);
    });

    document.addEventListener('click', e => {
      if (!searchBox.contains(e.target) && e.target !== searchToggle) {
        searchBox.hidden = true;
        searchToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', () => {
      clearTimeout(searchTimer);
      const q = searchInput.value.trim();
      if (q.length < 2) { searchResults.innerHTML = ''; return; }

      searchResults.innerHTML = '<div class="sr-empty">Searching...</div>';
      searchTimer = setTimeout(() => {
        // AJAX call to /api/search
        fetch('/api/search?q=' + encodeURIComponent(q))
          .then(r => r.json())
          .then(data => {
            if (!data.habitats.length && !data.experiences.length) {
              searchResults.innerHTML = '<div class="sr-empty">No results found for "' + q + '"</div>';
              return;
            }
            let html = '';
            if (data.habitats.length) {
              html += '<div class="sr-section-title">Habitats</div>';
              data.habitats.forEach(h => {
                html += '<a class="sr-item" href="/habitats/' + h.id + '">' +
                  '<span class="sr-item__icon">' + h.icon + '</span>' +
                  '<div><div class="sr-item__name">' + h.name + '</div>' +
                  '<div class="sr-item__sub">' + h.tagline + '</div></div></a>';
              });
            }
            if (data.experiences.length) {
              html += '<div class="sr-section-title">Experiences</div>';
              data.experiences.forEach(e => {
                html += '<a class="sr-item" href="/activity/' + e.id + '">' +
                  '<span class="sr-item__icon">&#127775;</span>' +
                  '<div><div class="sr-item__name">' + e.name + '</div>' +
                  '<div class="sr-item__sub">' + e.habitat_name + ' &mdash; ' + e.type + '</div></div></a>';
              });
            }
            searchResults.innerHTML = html;
          })
          .catch(() => {
            searchResults.innerHTML = '<div class="sr-empty">Search unavailable. Please try again.</div>';
          });
      }, 300);
    });
  }

  /* ══════════════════════════════════════════
     AJAX EVENTS (year + category filter)
  ══════════════════════════════════════════ */
  const evList = document.getElementById('evList');
  const yearSelect = document.getElementById('yearSelect');
  const catBtns = document.querySelectorAll('.ev-cat-btn');

  if (evList) {
    let currentYear = (typeof initialYear !== 'undefined') ? initialYear : String(new Date().getFullYear());
    let currentCat = (typeof initialCat !== 'undefined') ? initialCat : 'all';

    function loadEvents() {
      evList.innerHTML = '<div class="ev-loading"><div class="spinner"></div><p>Loading events...</p></div>';
      const url = '/api/events?year=' + encodeURIComponent(currentYear) + '&category=' + encodeURIComponent(currentCat);

      // AJAX call to /api/events
      fetch(url)
        .then(r => r.json())
        .then(events => {
          if (!events.length) {
            evList.innerHTML = '<div class="ev-empty"><p>No events found for this selection.</p></div>';
            return;
          }
          const now = new Date();
          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          let html = '';
          events.forEach(ev => {
            const d = new Date(ev.event_date);
            const isPast = d < now;
            html += '<a class="evitem' + (isPast ? ' evitem--past' : '') + '" href="/events/' + ev.id + '">' +
              '<div class="evitem__date">' +
              '<span class="evitem__day">' + d.getUTCDate() + '</span>' +
              '<span class="evitem__mo">' + months[d.getUTCMonth()] + '</span>' +
              '<span class="evitem__yr">' + d.getUTCFullYear() + '</span>' +
              '</div>' +
              '<div class="evitem__body">' +
              '<div class="evitem__top">' +
              '<span class="ev-badge" style="background:' + ev.badge_color + '18;color:' + ev.badge_color + ';border-color:' + ev.badge_color + '44">' + ev.badge + '</span>' +
              (isPast ? '<span class="evitem__past-tag">Past Event</span>' : '') +
              '<span class="evitem__loc">&#128205; ' + ev.location + '</span>' +
              '</div>' +
              '<h2>' + ev.title + '</h2>' +
              '<p class="evitem__desc">' + ev.description + '</p>' +
              '<p class="evitem__time">&#128336; ' + ev.event_time + '</p>' +
              '</div>' +
              '</a>';
          });
          evList.innerHTML = html;
        })
        .catch(() => {
          evList.innerHTML = '<div class="ev-empty"><p>Could not load events. Please refresh the page.</p></div>';
        });
    }

    // Year select
    if (yearSelect) {
      yearSelect.addEventListener('change', () => {
        currentYear = yearSelect.value;
        loadEvents();
      });
    }

    // Category buttons
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCat = btn.dataset.cat;
        loadEvents();
      });
    });

    // Initial load
    loadEvents();
  }

  /* ══════════════════════════════════════════
     FAQ ACCORDION
  ══════════════════════════════════════════ */
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const isOpen = btn.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.faq-btn').forEach(b => {
        b.setAttribute('aria-expanded', 'false');
        const a = document.getElementById(b.getAttribute('aria-controls'));
        if (a) a.hidden = true;
      });
      if (!isOpen) {
        btn.setAttribute('aria-expanded', 'true');
        const a = document.getElementById(btn.getAttribute('aria-controls'));
        if (a) a.hidden = false;
      }
    });
  });

  /* ══════════════════════════════════════════
     CONTACT FORM — client-side validation + char count
  ══════════════════════════════════════════ */
  const msg = document.getElementById('message');
  const count = document.getElementById('charCount');
  const nameInp = document.getElementById('name');
  const emailInp = document.getElementById('email');
  const nameErr = document.getElementById('nameErr');
  const emailErr = document.getElementById('emailErr');
  const cform = document.getElementById('cform');

  if (msg && count) {
    msg.addEventListener('input', () => {
      const n = Math.min(msg.value.length, 1000);
      count.textContent = n + ' / 1000';
      if (msg.value.length > 1000) msg.value = msg.value.slice(0, 1000);
      count.style.color = n > 900 ? '#e07070' : '';
    });
  }

  if (nameInp && nameErr) {
    nameInp.addEventListener('blur', () => {
      if (nameInp.value.trim().length < 2) {
        nameErr.textContent = 'Please enter your full name.';
        nameInp.style.borderColor = 'rgba(200,80,80,.6)';
      } else {
        nameErr.textContent = '';
        nameInp.style.borderColor = '';
      }
    });
    nameInp.addEventListener('focus', () => { nameErr.textContent = ''; nameInp.style.borderColor = ''; });
  }

  if (emailInp && emailErr) {
    emailInp.addEventListener('blur', () => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInp.value && !re.test(emailInp.value.trim())) {
        emailErr.textContent = 'Please enter a valid email address.';
        emailInp.style.borderColor = 'rgba(200,80,80,.6)';
      } else {
        emailErr.textContent = '';
        emailInp.style.borderColor = '';
      }
    });
    emailInp.addEventListener('focus', () => { emailErr.textContent = ''; emailInp.style.borderColor = ''; });
  }

  // Client-side validation before submit
  if (cform) {
    cform.addEventListener('submit', e => {
      let valid = true;
      if (nameInp && nameInp.value.trim().length < 2) {
        nameErr.textContent = 'Please enter your full name.';
        nameInp.style.borderColor = 'rgba(200,80,80,.6)';
        valid = false;
      }
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailInp && !re.test(emailInp.value.trim())) {
        emailErr.textContent = 'Please enter a valid email address.';
        emailInp.style.borderColor = 'rgba(200,80,80,.6)';
        valid = false;
      }
      if (!valid) { e.preventDefault(); return; }
      const btn = cform.querySelector('.btn--submit');
      if (btn) { btn.textContent = 'Sending...'; btn.disabled = true; }
    });
  }

  /* ══════════════════════════════════════════
     ACTIVE NAV LINK
  ══════════════════════════════════════════ */
  const path = window.location.pathname;
  document.querySelectorAll('.nav__a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (href !== '/' && path.startsWith(href)))
      a.style.color = 'var(--accent)';
  });

  /* ══════════════════════════════════════════
     ANIMAL EXPLORER GAME
  ══════════════════════════════════════════ */
  const board = document.getElementById('explorerBoard');
  if (board) {

    const animals = [
      { name: 'African Lion', img: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=600', habitat: 'Savannah Plains', fact: 'Lions are the only cats that live in groups called prides.', options: ['African Lion', 'Snow Leopard', 'Cheetah', 'Tiger'] },
      { name: 'Jaguar', img: 'https://images.pexels.com/photos/145939/pexels-photo-145939.jpeg?auto=compress&cs=tinysrgb&w=600', habitat: 'Rainforest Canopy', fact: 'Jaguars are excellent swimmers and often hunt in water.', options: ['Leopard', 'Jaguar', 'Puma', 'Ocelot'] },
      { name: 'Polar Bear', img: 'https://images.pexels.com/photos/87833/pexels-photo-87833.jpeg?auto=compress&cs=tinysrgb&w=600', habitat: 'Arctic Tundra', fact: 'Polar bear fur is actually transparent, not white!', options: ['Polar Bear', 'Grizzly Bear', 'Arctic Fox', 'Walrus'] },
      { name: 'Giraffe', img: 'https://images.pexels.com/photos/1035508/pexels-photo-1035508.jpeg?auto=compress&cs=tinysrgb&w=600', habitat: 'Savannah Plains', fact: 'Giraffes only need 5 to 30 minutes of sleep per day.', options: ['Giraffe', 'Okapi', 'Camel', 'Zebra'] },
      { name: 'Manta Ray', img: 'https://images.pexels.com/photos/1001682/pexels-photo-1001682.jpeg?auto=compress&cs=tinysrgb&w=600', habitat: 'Ocean Discovery', fact: 'Manta rays have the largest brain-to-body ratio of any fish.', options: ['Manta Ray', 'Hammerhead Shark', 'Stingray', 'Whale Shark'] },
      { name: 'Komodo Dragon', img: 'https://images.pexels.com/photos/1108701/pexels-photo-1108701.jpeg?auto=compress&cs=tinysrgb&w=600', habitat: 'Reptile World', fact: 'Komodo dragons can run up to 20 km/h over short distances.', options: ['Iguana', 'Monitor Lizard', 'Komodo Dragon', 'Crocodile'] },
      { name: 'African Elephant', img: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=600', habitat: 'Savannah Plains', fact: 'Elephants are the only animals that cannot jump.', options: ['African Elephant', 'Hippo', 'Rhino', 'Buffalo'] },
      { name: 'Morpho Butterfly', img: 'https://images.pexels.com/photos/326055/pexels-photo-326055.jpeg?auto=compress&cs=tinysrgb&w=600', habitat: 'Rainforest Canopy', fact: 'The Blue Morpho butterfly uses light refraction to create its colour.', options: ['Monarch Butterfly', 'Morpho Butterfly', 'Painted Lady', 'Swallowtail'] }
    ];

    let score = 0, animalIndex = 0, tilesRevealed = 0;
    const TOTAL = animals.length;

    const animalImg = document.getElementById('animalImg');
    const scoreVal = document.getElementById('scoreVal');
    const animalNum = document.getElementById('animalNum');
    const tilesLeft = document.getElementById('tilesLeft');
    const hintText = document.getElementById('hintText');
    const scoreBar = document.getElementById('scoreBar');
    const hintBar = document.getElementById('hintBar');
    const startScreen = document.getElementById('explorerStart');
    const boardWrap = document.getElementById('boardWrap');
    const guessDiv = document.getElementById('explorerGuess');
    const optionsDiv = document.getElementById('explorerOptions');
    const resultDiv = document.getElementById('explorerResult');
    const resultInner = document.getElementById('resultInner');
    const nextBtn = document.getElementById('nextAnimal');
    const completeDiv = document.getElementById('explorerComplete');
    const finalScore = document.getElementById('finalScore');
    const finalMsg = document.getElementById('finalMsg');
    const restartBtn = document.getElementById('restartGame');
    const startBtn = document.getElementById('startGame');

    function startGame() {
      startScreen.hidden = true;
      scoreBar.hidden = false;
      hintBar.hidden = false;
      boardWrap.classList.add('active');
      loadAnimal(0);
    }

    function loadAnimal(idx) {
      const a = animals[idx];
      tilesRevealed = 0;
      animalImg.src = a.img;
      animalImg.alt = 'Mystery animal';
      animalImg.style.filter = 'blur(14px) brightness(0.3)';
      animalNum.textContent = (idx + 1) + ' / ' + TOTAL;
      tilesLeft.textContent = '9';
      hintText.textContent = 'Click tiles to reveal the animal. Guess early for more points!';
      guessDiv.hidden = true;
      resultDiv.hidden = true;
      board.innerHTML = '';

      for (let i = 0; i < 9; i++) {
        const tile = document.createElement('button');
        tile.className = 'explorer-tile';
        tile.textContent = '?';
        tile.setAttribute('aria-label', 'Reveal tile ' + (i + 1));
        tile.addEventListener('click', () => revealTile(tile, a));
        board.appendChild(tile);
      }
    }

    function revealTile(tile, animal) {
      if (tile.classList.contains('revealed')) return;
      tile.classList.add('revealed');
      tilesRevealed++;
      const remaining = 9 - tilesRevealed;
      tilesLeft.textContent = remaining;
      // progressively unblur as more tiles are revealed
      const blurAmount = Math.max(0, 14 - (tilesRevealed * 2));
      const brightness = Math.min(1, 0.3 + (tilesRevealed * 0.08));
      animalImg.style.filter = 'blur(' + blurAmount + 'px) brightness(' + brightness + ')';

      if (tilesRevealed === 3) {
        hintText.textContent = 'Habitat hint: ' + animal.habitat + '. Keep going or guess now!';
      }
      if (tilesRevealed >= 5) showGuess(animal);
    }

    function showGuess(animal) {
      if (!guessDiv.hidden) return;
      guessDiv.hidden = false;
      optionsDiv.innerHTML = '';
      const opts = [...animal.options].sort(() => Math.random() - 0.5);
      opts.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'explorer-opt';
        btn.textContent = opt;
        btn.addEventListener('click', () => checkGuess(opt, animal));
        optionsDiv.appendChild(btn);
      });
    }

    function checkGuess(guess, animal) {
      const remaining = 9 - tilesRevealed;
      const pointsEarned = guess === animal.name ? Math.max(1, remaining + 1) * 2 : 0;
      score += pointsEarned;
      scoreVal.textContent = score;

      board.querySelectorAll('.explorer-tile').forEach(t => t.classList.add('revealed'));
      animalImg.style.filter = 'none';
      animalImg.alt = animal.name;
      guessDiv.hidden = true;

      optionsDiv.querySelectorAll('.explorer-opt').forEach(b => {
        if (b.textContent === animal.name) b.classList.add('correct');
        else if (b.textContent === guess && guess !== animal.name) b.classList.add('wrong');
      });

      const correct = guess === animal.name;
      resultInner.innerHTML =
        '<h3>' + (correct ? '&#9989; Correct!' : '&#10060; Not quite!') + '</h3>' +
        '<p>It was the <strong>' + animal.name + '</strong>!</p>' +
        '<p style="font-size:.85rem;color:var(--muted)">' + animal.fact + '</p>' +
        (correct
          ? '<p style="color:var(--accent);font-weight:600">+' + pointsEarned + ' points!</p>'
          : '<p style="color:#e07070">No points this time.</p>');

      resultDiv.hidden = false;
    }

    if (startBtn) startBtn.addEventListener('click', startGame);

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        animalIndex++;
        if (animalIndex >= TOTAL) {
          boardWrap.classList.remove('active');
          guessDiv.hidden = true;
          resultDiv.hidden = true;
          completeDiv.hidden = false;
          finalScore.textContent = score;
          const max = TOTAL * 10;
          finalMsg.textContent = score >= max * 0.8
            ? 'Outstanding! You are a true Wildlife Champion!'
            : score >= max * 0.5
              ? 'Great work, Junior Ranger! Keep exploring!'
              : 'Keep practising — visit us to learn more!';
        } else {
          loadAnimal(animalIndex);
        }
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        score = 0; animalIndex = 0;
        scoreVal.textContent = '0';
        completeDiv.hidden = true;
        boardWrap.classList.add('active');
        loadAnimal(0);
      });
    }
  }

}); // end DOMContentLoaded