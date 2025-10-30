document.addEventListener("DOMContentLoaded", () => {
    const animatedElements = document.querySelectorAll("[data-animate]");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: "0px 0px -60px 0px"
            }
        );

        animatedElements.forEach((el) => observer.observe(el));
    } else {
        animatedElements.forEach((el) => el.classList.add("is-visible"));
    }

    const navToggle = document.querySelector(".nav-toggle");
    const mobileNav = document.querySelector(".mobile-nav");

    const closeMobileNav = () => {
        mobileNav.classList.remove("open");
        if (navToggle) {
            navToggle.setAttribute("aria-expanded", "false");
        }
    };

    if (navToggle && mobileNav) {
        navToggle.addEventListener("click", () => {
            const expanded = navToggle.getAttribute("aria-expanded") === "true";
            navToggle.setAttribute("aria-expanded", String(!expanded));
            mobileNav.classList.toggle("open");
        });

        mobileNav.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeMobileNav);
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1024) {
                closeMobileNav();
            }
        });
    }

    const contactForm = document.querySelector(".contact-form");
    if (contactForm) {
        const responseEl = contactForm.querySelector(".form-response");
        const requiredFields = ["Имя", "Телефон", "Email"];

        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const formData = new FormData(contactForm);
            const missingField = requiredFields.find((field) => {
                const value = formData.get(field);
                return !value || String(value).trim().length === 0;
            });

            if (missingField) {
                responseEl.textContent = "Пожалуйста, заполните обязательные поля.";
                responseEl.style.color = "#ffe082";
                return;
            }

            responseEl.textContent = "Отправка...";
            responseEl.style.color = "#e0f7fa";

            const targetEmail = (contactForm.getAttribute("action") || "").replace("mailto:", "") || "info@pinepro.kz";
            const subject = encodeURIComponent("Заявка с сайта PINE PRO");
            const formEntries = [];

            formData.forEach((value, key) => {
                formEntries.push(`${key}: ${value}`);
            });

            const body = encodeURIComponent(formEntries.join("\n"));

            // Отправка письма через почтовый клиент пользователя.
            window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`;

            setTimeout(() => {
                responseEl.textContent = "Спасибо! Мы свяжемся с вами в ближайшее время.";
                responseEl.style.color = "#c8f7ff";
                contactForm.reset();
            }, 600);
        });
    }
});
