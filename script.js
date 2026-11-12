(() => {
  const menuToggle = document.getElementById('menuToggle');
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');
  const sections = document.querySelectorAll('main section[id]');
  const progress = document.getElementById('scrollProgress');
  const cursorGlow = document.getElementById('cursorGlow');

  // Accessible mobile navigation
  if (menuToggle && navbar) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });

    navLinks.forEach(link => link.addEventListener('click', () => {
      navbar.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    }));
  }

  // Scroll progress and active navigation state
  const updateScrollUI = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const percentage = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (progress) progress.style.width = `${percentage}%`;

    let activeSection = sections[0];
    const marker = window.innerHeight * 0.36;
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= marker) activeSection = section;
    });
    if (activeSection) {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.toggle('active', link.hash === `#${activeSection.id}`);
      });
    }
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  window.addEventListener('resize', updateScrollUI);
  updateScrollUI();

  // Reveal elements as they enter the viewport
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    revealElements.forEach(element => observer.observe(element));
  } else {
    revealElements.forEach(element => element.classList.add('visible'));
  }

  // Lightweight typing effect (no external library required)
  const typedRole = document.getElementById('typedRole');
  const roles = ['modern websites', 'responsive web apps', 'PHP & MySQL projects'];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (typedRole && !reduceMotion) {
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let deleting = true;
    const type = () => {
      const current = roles[roleIndex];
      typedRole.textContent = current.slice(0, charIndex);
      if (deleting) {
        charIndex--;
        if (charIndex < 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }
      } else {
        charIndex++;
        if (charIndex > roles[roleIndex].length) {
          deleting = true;
          window.setTimeout(type, 1300);
          return;
        }
      }
      window.setTimeout(type, deleting ? 42 : 75);
    };
    window.setTimeout(type, 1300);
  }

  // Subtle pointer glow on devices with a fine pointer
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    window.addEventListener('pointermove', event => {
      cursorGlow.style.left = `${event.clientX}px`;
      cursorGlow.style.top = `${event.clientY}px`;
    }, { passive: true });
  }

  // Gentle project-card tilt on desktop only
  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 5;
        const rotateX = (0.5 - y) * 5;
        card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  // Footer year
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  // Contact form opens WhatsApp with a pre-filled message; visitor sends it there.
  const contactForm = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');
  if (contactForm) {
    contactForm.addEventListener('submit', event => {
      event.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if (!name || !email || !message) {
        if (formNote) formNote.textContent = 'Please complete all fields.';
        return;
      }
      const messageText = `Portfolio enquiry\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
      if (formNote) formNote.textContent = 'WhatsApp is opening with your message ready. Press Send in WhatsApp to deliver it.';
      window.open(`https://wa.me/923700293329?text=${encodeURIComponent(messageText)}`, '_blank', 'noopener,noreferrer');
    });
  }
})();
