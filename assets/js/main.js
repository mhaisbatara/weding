/* ========================================================
   UNDANGAN DIGITAL PERNIKAHAN: AFIANA & AGUS
   Interactive Scripts & Animations
   ======================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. EXTRACT URL PARAMETERS (e.g. ?to=Nama+Tamu&play=1)
  const urlParams = new URLSearchParams(window.location.search);
  const guestParam = urlParams.get('to') || urlParams.get('u') || urlParams.get('guest');
  const shouldAutoPlay = urlParams.get('play') === '1' || urlParams.get('play') === 'true';

  // Display Guest Name on Cover Page (index.html)
  const guestGreetingEl = document.getElementById('guestGreeting');
  const guestNameDisplayEl = document.getElementById('guestNameDisplay');
  if (guestParam && guestGreetingEl && guestNameDisplayEl) {
    const cleanGuestName = decodeURIComponent(guestParam.replace(/\+/g, ' '));
    guestNameDisplayEl.textContent = cleanGuestName;
    guestGreetingEl.style.display = 'block';
  }

  // Display Guest Name on Detail Page (undangan.html)
  const welcomeGuestEl = document.getElementById('welcomeGuest');
  const welcomeGuestNameEl = document.getElementById('welcomeGuestName');
  if (welcomeGuestEl && welcomeGuestNameEl) {
    if (guestParam) {
      const cleanGuestName = decodeURIComponent(guestParam.replace(/\+/g, ' '));
      welcomeGuestNameEl.textContent = cleanGuestName;
      welcomeGuestEl.style.display = 'inline-block';
    } else {
      welcomeGuestEl.style.display = 'none';
    }
  }

  // 2. FALLING PETALS PARTICLE GENERATOR
  const petalsContainer = document.getElementById('petalsContainer');
  if (petalsContainer) {
    const PETAL_COUNT = 18;
    for (let i = 0; i < PETAL_COUNT; i++) {
      const petal = document.createElement('div');
      petal.className = 'petal';
      
      const size = Math.random() * 12 + 10; // 10px - 22px
      petal.style.width = `${size}px`;
      petal.style.height = `${size * 1.3}px`;
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.animationDuration = `${Math.random() * 6 + 7}s`; // 7s - 13s
      petal.style.animationDelay = `${Math.random() * 5}s`;
      
      petalsContainer.appendChild(petal);
    }
  }

  // 3. ENVELOPE OPENING ANIMATION (on index.html)
  const btnOpen = document.getElementById('btnOpenInvitation');
  const envelopeOverlay = document.getElementById('envelopeOverlay');
  const envelopeBox = document.getElementById('envelopeBox');

  if (btnOpen) {
    btnOpen.addEventListener('click', (e) => {
      e.preventDefault();

      if (envelopeOverlay && envelopeBox) {
        // Show overlay
        envelopeOverlay.classList.add('active');

        // Play harp / opening chord
        playOpeningChime();

        // Trigger envelope flap opening & letter slide
        setTimeout(() => {
          envelopeBox.classList.add('is-open');
        }, 300);

        // Transition to detail page
        setTimeout(() => {
          const params = new URLSearchParams();
          if (guestParam) params.set('to', guestParam);
          params.set('play', '1');
          window.location.href = 'undangan.html?' + params.toString();
        }, 1500);
      } else {
        // Direct navigation fallback
        const params = new URLSearchParams();
        if (guestParam) params.set('to', guestParam);
        params.set('play', '1');
        window.location.href = 'undangan.html?' + params.toString();
      }
    });
  }

  // Audio opening chime chord
  function playOpeningChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const notes = [261.63, 329.63, 392.00, 523.25, 659.25]; // C E G C E
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.06, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 1.3);
      });
    } catch (e) {
      console.log('Chime notice:', e);
    }
  }

  // 4. ENHANCED SCROLL REVEAL OBSERVER (Sections & Images)
  const revealElements = document.querySelectorAll(
    '.reveal-on-scroll, .img-reveal-zoom, .img-reveal-left, .img-reveal-right, .gallery-item, .couple-grid'
  );
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Re-trigger shimmer animation
          if (entry.target.classList.contains('img-shimmer')) {
            entry.target.classList.remove('img-shimmer');
            void entry.target.offsetWidth; // trigger reflow
            entry.target.classList.add('img-shimmer');
          }
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // 4B. INTERACTIVE 3D PERSPECTIVE TILT ON HOVER / MOUSEMOVE
  const tiltableItems = document.querySelectorAll('.gallery-item, .couple-arch-photo, .hero-arch-frame');
  tiltableItems.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // 5. BACKGROUND MUSIC MANAGEMENT (on undangan.html)
  const musicToggleBtn = document.getElementById('musicToggleBtn');
  const bgAudio = document.getElementById('bgAudio');
  let isAudioPlaying = false;
  let bgAudioContext = null;

  // Romantic instrumental synthesizer fallback
  function createPianoSynth() {
    if (bgAudioContext) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      bgAudioContext = new AudioCtx();
      
      const chords = [
        [261.63, 329.63, 392.00, 523.25], // C
        [220.00, 261.63, 329.63, 440.00], // Am
        [174.61, 220.00, 261.63, 349.23], // F
        [196.00, 246.94, 293.66, 392.00]  // G
      ];
      let step = 0;

      function playStep() {
        if (!isAudioPlaying || !bgAudioContext) return;
        const currentChord = chords[Math.floor(step / 4) % chords.length];
        const freq = currentChord[step % currentChord.length];
        
        const osc = bgAudioContext.createOscillator();
        const gain = bgAudioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, bgAudioContext.currentTime);
        
        gain.gain.setValueAtTime(0.08, bgAudioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, bgAudioContext.currentTime + 2.2);
        
        osc.connect(gain);
        gain.connect(bgAudioContext.destination);
        
        osc.start();
        osc.stop(bgAudioContext.currentTime + 2.3);
        
        step++;
        setTimeout(playStep, 600);
      }
      playStep();
    } catch (e) {
      console.log('Synth notice:', e);
    }
  }

  function playMusic() {
    if (!musicToggleBtn) return;
    if (bgAudio) {
      bgAudio.play()
        .then(() => {
          isAudioPlaying = true;
          musicToggleBtn.classList.add('playing');
        })
        .catch(() => {
          isAudioPlaying = true;
          createPianoSynth();
          musicToggleBtn.classList.add('playing');
        });
    } else {
      isAudioPlaying = true;
      createPianoSynth();
      musicToggleBtn.classList.add('playing');
    }
  }

  function pauseMusic() {
    if (!musicToggleBtn) return;
    isAudioPlaying = false;
    musicToggleBtn.classList.remove('playing');
    if (bgAudio) bgAudio.pause();
    if (bgAudioContext && bgAudioContext.state === 'running') {
      bgAudioContext.suspend();
    }
  }

  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (isAudioPlaying) {
        pauseMusic();
      } else {
        if (bgAudioContext && bgAudioContext.state === 'suspended') {
          bgAudioContext.resume();
          isAudioPlaying = true;
          musicToggleBtn.classList.add('playing');
        } else {
          playMusic();
        }
      }
    });

    if (shouldAutoPlay) {
      playMusic();
      
      const triggerAudioOnFirstTouch = () => {
        if (!isAudioPlaying) playMusic();
        document.removeEventListener('click', triggerAudioOnFirstTouch);
        document.removeEventListener('touchstart', triggerAudioOnFirstTouch);
      };
      document.addEventListener('click', triggerAudioOnFirstTouch, { once: true });
      document.addEventListener('touchstart', triggerAudioOnFirstTouch, { once: true });
    }
  }

  // 6. COUNTDOWN TIMER (16 Oktober 2026 08:00 WIB)
  const targetDate = new Date('2026-10-16T08:00:00+07:00').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    const daysEl = document.getElementById('countDays');
    const hoursEl = document.getElementById('countHours');
    const minutesEl = document.getElementById('countMinutes');
    const secondsEl = document.getElementById('countSeconds');

    if (!daysEl) return;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minutesEl.textContent = '00';
      secondsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minutesEl.textContent = String(minutes).padStart(2, '0');
    secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  if (document.getElementById('countDays')) {
    setInterval(updateCountdown, 1000);
    updateCountdown();
  }

  // 7. GOOGLE MAPS EMBED TOGGLE
  const btnToggleMap = document.getElementById('btnToggleMap');
  const mapWrapper = document.getElementById('mapWrapper');
  if (btnToggleMap && mapWrapper) {
    btnToggleMap.addEventListener('click', () => {
      mapWrapper.classList.toggle('show');
      if (mapWrapper.classList.contains('show')) {
        btnToggleMap.textContent = 'Tutup Peta Lokasi';
        mapWrapper.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        btnToggleMap.innerHTML = `
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          Petunjuk Lokasi (Maps)
        `;
      }
    });
  }

  // 8. PHOTO GALLERY LIGHTBOX MODAL
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  if (lightboxModal && lightboxImg) {
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const imgSrc = item.getAttribute('data-img');
        if (imgSrc) {
          lightboxImg.src = imgSrc;
          lightboxModal.classList.add('active');
        }
      });
    });

    if (lightboxClose) {
      lightboxClose.addEventListener('click', () => {
        lightboxModal.classList.remove('active');
      });
    }

    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // 9. COPY ACCOUNT NUMBER WITH TOAST
  const toastNotice = document.getElementById('toastNotice');
  let toastTimer = null;

  function showToast(message) {
    if (!toastNotice) return;
    toastNotice.textContent = message;
    toastNotice.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 2800);
  }

  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const copyTarget = btn.getAttribute('data-copy');
      if (copyTarget) {
        navigator.clipboard.writeText(copyTarget).then(() => {
          showToast(`Berhasil disalin: ${copyTarget}`);
        }).catch(() => {
          showToast(`Tersalin: ${copyTarget}`);
        });
      }
    });
  });

  // 10. GUESTBOOK / UCAPAN & DOA RESTU (LocalStorage)
  const rsvpForm = document.getElementById('rsvpForm');
  const wishesContainer = document.getElementById('wishesList');

  const defaultWishes = [
    {
      name: 'Rahmat Hidayat & Istri',
      message: 'Barakallahu lakum wa baraka alaikum wa jama\'a bainakuma fii khoir. Selamat menempuh lembaran baru Afiana dan mas Agus!',
      time: '15 menit yang lalu'
    },
    {
      name: 'Dinda Maharani Putri',
      message: 'Selamat berbahagia sahabat tersayang Afi & mas Agus! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah selamanya. Aamiin ya Rabb.',
      time: '1 jam yang lalu'
    },
    {
      name: 'Dimas Prasetyo',
      message: 'Lancar sampai hari H bro Agus & mba Afiana! Bahagia dan berkah selalu untuk keluarga kecil kalian.',
      time: '3 jam yang lalu'
    }
  ];

  function getSavedWishes() {
    const saved = localStorage.getItem('afiana_agus_wishes');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultWishes;
      }
    }
    return defaultWishes;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  function renderWishes() {
    if (!wishesContainer) return;
    const wishes = getSavedWishes();
    wishesContainer.innerHTML = '';
    
    wishes.forEach(item => {
      const wishDiv = document.createElement('div');
      wishDiv.className = 'wish-item';
      wishDiv.innerHTML = `
        <div class="wish-header">
          <span class="wish-name">${escapeHTML(item.name)}</span>
          <span style="color: var(--accent-gold); font-size: 0.85rem;">🕊️</span>
        </div>
        <p class="wish-text">${escapeHTML(item.message)}</p>
        <span class="wish-time">${escapeHTML(item.time || 'Baru saja')}</span>
      `;
      wishesContainer.appendChild(wishDiv);
    });
  }

  if (rsvpForm) {
    rsvpForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('rsvpName');
      const messageInput = document.getElementById('rsvpMessage');

      if (!nameInput.value.trim() || !messageInput.value.trim()) {
        showToast('Mohon lengkapi nama dan pesan doa');
        return;
      }

      const newWish = {
        name: nameInput.value.trim(),
        message: messageInput.value.trim(),
        time: 'Baru saja'
      };

      const wishes = getSavedWishes();
      wishes.unshift(newWish);
      localStorage.setItem('afiana_agus_wishes', JSON.stringify(wishes));
      
      renderWishes();
      rsvpForm.reset();
      showToast('Alhamdulillah! Doa restu berhasil dikirim.');
    });

    renderWishes();
  }
});
