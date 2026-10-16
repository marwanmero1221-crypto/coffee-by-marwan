
/* =========================================
   COFFEE SHOP - COMPLETE JAVASCRIPT
   Responsive | Mobile | Tablet | Desktop
========================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {

    // =====================================
    // 1. MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");

    if (menuToggle && navMenu) {

        const menuIcon = menuToggle.querySelector("i");

        function setMenu(open) {
            navMenu.classList.toggle("active", open);

            menuToggle.setAttribute("aria-expanded", String(open));
            menuToggle.setAttribute(
                "aria-label",
                open ? "Close navigation menu" : "Open navigation menu"
            );

            if (menuIcon) {
                menuIcon.classList.toggle("fa-bars", !open);
                menuIcon.classList.toggle("fa-xmark", open);
            }
        }

        menuToggle.setAttribute("aria-controls", "main-navigation");
        menuToggle.setAttribute("aria-expanded", "false");
        navMenu.id = "main-navigation";

        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();
            setMenu(!navMenu.classList.contains("active"));
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                setMenu(false);

                navLinks.forEach((item) =>
                    item.classList.remove("active")
                );

                link.classList.add("active");
            });
        });

        document.addEventListener("click", (event) => {
            if (
                navMenu.classList.contains("active") &&
                !navMenu.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                setMenu(false);
            }
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                setMenu(false);
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                setMenu(false);
            }
        });
    }


    // =====================================
    // 2. IMAGE FALLBACKS
    // =====================================

    function createImageFallback(label = "Coffee Shop") {
        const safeLabel = String(label)
            .replace(/[&<>"']/g, "")
            .slice(0, 45);

        const svg = `
            <svg xmlns="http://www.w3.org/2000/svg"
                 width="600" height="450" viewBox="0 0 600 450">
                <rect width="600" height="450" fill="#fff0df"/>
                <circle cx="300" cy="185" r="95" fill="#4b101c"/>
                <path d="M245 140h105v100a52 52 0 0 1-105 0z"
                      fill="#f4a21c"/>
                <path d="M350 160h28a30 30 0 0 1 0 60h-28"
                      fill="none" stroke="#f4a21c" stroke-width="15"/>
                <path d="M265 115q-18-22 0-42M300 115q-18-22 0-42M335 115q-18-22 0-42"
                      fill="none" stroke="#4b101c" stroke-width="9"
                      stroke-linecap="round"/>
                <text x="300" y="340" text-anchor="middle"
                      font-family="Arial,sans-serif" font-size="25"
                      font-weight="bold" fill="#3b0d19">${safeLabel}</text>
            </svg>
        `;

        return "data:image/svg+xml;charset=UTF-8," +
            encodeURIComponent(svg);
    }

    document.querySelectorAll("img").forEach((img) => {

        img.addEventListener("error", () => {
            if (img.dataset.fallbackApplied === "true") return;

            img.dataset.fallbackApplied = "true";

            const label =
                img.alt ||
                img.closest(".testimonial-card")?.querySelector("h3")
                    ?.textContent ||
                "Coffee Shop";

            img.src = createImageFallback(label);
            img.classList.add("image-fallback");
        });

        // Handle images that failed before this script loaded.
        if (img.complete && img.naturalWidth === 0 && img.src) {
            img.dispatchEvent(new Event("error"));
        }
    });


    // =====================================
    // 3. TESTIMONIAL SLIDER
    // =====================================

    const testimonialWrapper =
        document.querySelector(".testimonial-wrapper");

    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const dotsContainer = document.querySelector(".slider-dots");

    if (testimonialWrapper) {

        const cards = Array.from(
            testimonialWrapper.querySelectorAll(".testimonial-card")
        );

        let currentIndex = 0;
        let touchStartX = 0;
        let touchEndX = 0;

        // Show one testimonial on mobile, three on larger screens.
        function getVisibleCount() {
            if (window.innerWidth <= 600) return 1;
            if (window.innerWidth <= 900) return 1;
            return Math.min(3, cards.length);
        }

        // Rebuild dots to match the real number of testimonials.
        function buildDots() {
            if (!dotsContainer) return;

            dotsContainer.innerHTML = "";

            cards.forEach((_, index) => {
                const dot = document.createElement("button");

                dot.type = "button";
                dot.className = "dot";
                dot.setAttribute(
                    "aria-label",
                    `Show testimonial ${index + 1}`
                );

                dot.addEventListener("click", () => {
                    currentIndex = index;
                    renderSlider();
                });

                dotsContainer.appendChild(dot);
            });
        }

        function renderSlider() {
            if (!cards.length) {
                if (prevBtn) prevBtn.hidden = true;
                if (nextBtn) nextBtn.hidden = true;
                if (dotsContainer) dotsContainer.hidden = true;
                return;
            }

            const visibleCount = getVisibleCount();

            cards.forEach((card, index) => {
                // On desktop, rotate the cards without duplicating content.
                const position =
                    (index - currentIndex + cards.length) % cards.length;

                const visible = position < visibleCount;

               card.style.display = visible ? "block" : "none";
               card.setAttribute("aria-hidden", String(!visible));
                card.style.order = String(position);
                card.setAttribute("aria-hidden", String(!visible));
            });

            // Keep controls useful even if there is only one card.
            const showControls = cards.length > 1;

            if (prevBtn) prevBtn.hidden = !showControls;
            if (nextBtn) nextBtn.hidden = !showControls;

            if (dotsContainer) {
                dotsContainer.hidden = !showControls;

                const dots = dotsContainer.querySelectorAll(".dot");

                dots.forEach((dot, index) => {
                    dot.classList.toggle(
                        "active-dot",
                        index === currentIndex
                    );

                    dot.setAttribute(
                        "aria-current",
                        index === currentIndex ? "true" : "false"
                    );
                });
            }
        }

        function goToNext() {
            if (!cards.length) return;

            currentIndex = (currentIndex + 1) % cards.length;
            renderSlider();
        }

        function goToPrevious() {
            if (!cards.length) return;

            currentIndex =
                (currentIndex - 1 + cards.length) % cards.length;

            renderSlider();
        }

        if (prevBtn) {
            prevBtn.setAttribute("aria-label", "Previous testimonial");
            prevBtn.addEventListener("click", goToPrevious);
        }

        if (nextBtn) {
            nextBtn.setAttribute("aria-label", "Next testimonial");
            nextBtn.addEventListener("click", goToNext);
        }

        // Touch/swipe support.
        testimonialWrapper.addEventListener("touchstart", (event) => {
            touchStartX = event.changedTouches[0].screenX;
        }, { passive: true });

        testimonialWrapper.addEventListener("touchend", (event) => {
            touchEndX = event.changedTouches[0].screenX;

            const difference = touchEndX - touchStartX;

            if (Math.abs(difference) < 45) return;

            // Swipe direction works for the English LTR layout.
            if (difference < 0) {
                goToNext();
            } else {
                goToPrevious();
            }
        }, { passive: true });

        buildDots();
        renderSlider();

        window.addEventListener("resize", renderSlider);
    }


    // =====================================
    // 4. REVEAL ANIMATIONS
    // =====================================

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealElements = document.querySelectorAll(
        ".hero-text, .hero-image, .about-image, .about-content, " +
        ".menu-card, .testimonial-card, .gallery-item, " +
        ".contact-item, .contact-form"
    );

    if (reduceMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("revealed");
        });
    } else {
        revealElements.forEach((element) => {
            element.classList.add("reveal");
        });

        const observer = new IntersectionObserver(
            (entries, observerInstance) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("revealed");
                        observerInstance.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach((element) => {
            observer.observe(element);
        });
    }


    // =====================================
    // 5. CONTACT FORM VALIDATION
    // =====================================

    const contactForm = document.getElementById("contactForm");

    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!contactForm.checkValidity()) {
                contactForm.reportValidity();
                return;
            }

            const nameInput =
                contactForm.querySelector('input[type="text"]');

            const emailInput =
                contactForm.querySelector('input[type="email"]');

            const messageInput =
                contactForm.querySelector("textarea");

            const name = nameInput?.value.trim() || "";
            const email = emailInput?.value.trim() || "";
            const message = messageInput?.value.trim() || "";

            if (!name || !email || !message) {
                alert("Please fill in all fields.");
                return;
            }

            // This front-end form does not send emails by itself.
            alert(
                "Thank you, " + name +
                "! Your information has been validated. " +
                "Connect an email service or backend to send your message."
            );
        });
    }


    // =====================================
    // 6. ACTIVE NAVIGATION ON SCROLL
    // =====================================

    const pageSections = document.querySelectorAll(
        "main section[id]"
    );

    if ("IntersectionObserver" in window && pageSections.length) {

        const sectionObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    const sectionId = entry.target.id;

                    navLinks.forEach((link) => {
                        const isActive =
                            link.getAttribute("href") === "#" + sectionId;

                        link.classList.toggle("active", isActive);
                    });
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px",
                threshold: 0
            }
        );

        pageSections.forEach((section) => {
            sectionObserver.observe(section);
        });
    }


    // =====================================
    // 7. CURRENT YEAR IN FOOTER
    // =====================================

    const footerText = document.querySelector(".footer-content p");

    if (footerText) {
        footerText.textContent =
            `© ${new Date().getFullYear()} Coffee Shop`;
    }


    // =====================================
    // 8. SOCIAL LINKS SAFETY
    // =====================================

    document.querySelectorAll(
        ".social-icons a, .footer-social a"
    ).forEach((link) => {
        if (
            !link.getAttribute("href") ||
            link.getAttribute("href") === "#"
        ) {
            link.addEventListener("click", (event) => {
                event.preventDefault();
            });
        }
    });


    console.log("Coffee Shop website initialized successfully!");
});
