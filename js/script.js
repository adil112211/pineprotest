document.addEventListener('DOMContentLoaded', () => {
  const nav = document.querySelector('.nav');
  const navToggle = document.querySelector('.nav__toggle');
  const navLinks = document.querySelectorAll('.nav__link');
  const form = document.getElementById('contact-form');
  const statusEl = document.getElementById('form-status');

  if (nav && navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isExpanded));
      nav.classList.toggle('nav--open');
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (nav.classList.contains('nav--open')) {
          nav.classList.remove('nav--open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const animatedElements = document.querySelectorAll('[data-animate]');

  if (reduceMotion) {
    animatedElements.forEach((el) => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  }

  if (form && statusEl) {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = new FormData(form);
      const payload = Object.fromEntries(formData.entries());

      statusEl.textContent = 'Отправляем данные...';
      statusEl.classList.remove('form__status--success', 'form__status--error');

      try {
        // Для подключения собственного сервиса отправки писем замените адрес ниже.
        const response = await fetch('https://formsubmit.co/ajax/info@pinepro.kz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Ошибка запроса: ${response.status}`);
        }

        await response.json();
        form.reset();
        statusEl.textContent = 'Спасибо! Мы свяжемся с вами в ближайшее время.';
        statusEl.classList.add('form__status--success');
      } catch (error) {
        console.error(error);
        statusEl.textContent = 'Не удалось отправить заявку. Попробуйте ещё раз или свяжитесь по email.';
        statusEl.classList.add('form__status--error');
      }
    });
  }
});
