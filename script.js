// ================================
// MOBILE MENU
// ================================

const menuToggle = document.getElementById("menuToggle");
const navMenu = document.querySelector(".nav-menu");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    const icon = menuToggle.querySelector("i");

    if (navMenu.classList.contains("active")) {
        icon.classList.remove("fa-bars");
        icon.classList.add("fa-xmark");
    } else {
        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    }
});


// ================================
// CLOSE MOBILE MENU
// ================================

const navLinks = document.querySelectorAll(".nav-link");

navLinks.forEach(link => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");

        const icon = menuToggle.querySelector("i");

        icon.classList.remove("fa-xmark");
        icon.classList.add("fa-bars");
    });
});


// ================================
// ACTIVE NAVIGATION LINK
// ================================

const sections = document.querySelectorAll("section");

window.addEventListener("scroll", () => {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.offsetHeight;

        if (
            window.scrollY >= sectionTop &&
            window.scrollY < sectionTop + sectionHeight
        ) {
            currentSection = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === `#${currentSection}`) {
            link.classList.add("active");
        }

    });

});


// ================================
// TESTIMONIAL SLIDER
// ================================

const testimonialCards = document.querySelectorAll(".testimonial-card");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const dots = document.querySelectorAll(".dot");

let currentSlide = 0;


// Show selected testimonial
function showSlide(index) {

    if (index >= testimonialCards.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = testimonialCards.length - 1;
    } else {
        currentSlide = index;
    }

    testimonialCards.forEach((card, i) => {

        if (i === currentSlide) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

    // Update dots
    dots.forEach((dot, i) => {

        dot.classList.remove("active-dot");

        if (i === currentSlide) {
            dot.classList.add("active-dot");
        }

    });
}


// Next button
nextBtn.addEventListener("click", () => {

    showSlide(currentSlide + 1);

});


// Previous button
prevBtn.addEventListener("click", () => {

    showSlide(currentSlide - 1);

});


// Dots navigation
dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {

        showSlide(index);

    });

});


// Start slider
showSlide(0);


// ================================
// AUTO SLIDER
// ================================

let autoSlide = setInterval(() => {

    showSlide(currentSlide + 1);

}, 5000);


// Stop auto slider when hovering
const testimonialSlider = document.querySelector(".testimonial-slider");

testimonialSlider.addEventListener("mouseenter", () => {

    clearInterval(autoSlide);

});


// Start again after mouse leaves
testimonialSlider.addEventListener("mouseleave", () => {

    autoSlide = setInterval(() => {

        showSlide(currentSlide + 1);

    }, 5000);

});


// ================================
// CONTACT FORM
// ================================

const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const name = contactForm.querySelector(
        'input[type="text"]'
    ).value.trim();

    const email = contactForm.querySelector(
        'input[type="email"]'
    ).value.trim();

    const message = contactForm.querySelector(
        "textarea"
    ).value.trim();


    if (name === "" || email === "" || message === "") {

        alert("Please fill in all fields.");

        return;

    }


    // Simple email validation
    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        alert("Please enter a valid email address.");

        return;

    }


    alert(
        `Thank you ${name}! Your message has been submitted successfully.`
    );


    // Reset form
    contactForm.reset();

});


// ================================
// SMOOTH SCROLL
// ================================

navLinks.forEach(link => {

    link.addEventListener("click", function (event) {

        const targetId = this.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const targetSection =
            document.querySelector(targetId);

        if (targetSection) {

            event.preventDefault();

            targetSection.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});


// ================================
// SCROLL REVEAL ANIMATION
// ================================

const revealElements = document.querySelectorAll(
    ".about-container, .menu-card, .testimonial-card, .gallery-item, .contact-item, .contact-form"
);


// Initial style
revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform = "translateY(30px)";

    element.style.transition =
        "opacity 0.7s ease, transform 0.7s ease";

});


// Reveal function
function revealOnScroll() {

    const windowHeight = window.innerHeight;

    revealElements.forEach(element => {

        const elementTop =
            element.getBoundingClientRect().top;

        if (elementTop < windowHeight - 100) {

            element.style.opacity = "1";

            element.style.transform =
                "translateY(0)";

        }

    });

}


// Run on scroll
window.addEventListener(
    "scroll",
    revealOnScroll
);


// Run when page loads
revealOnScroll();


// ================================
// GALLERY IMAGE CLICK EFFECT
// ================================

const galleryImages =
    document.querySelectorAll(".gallery-item img");

galleryImages.forEach(image => {

    image.addEventListener("click", () => {

        const overlay = document.createElement("div");

        overlay.classList.add("image-overlay");

        overlay.innerHTML = `
            <div class="image-popup">
                <button class="close-image">
                    &times;
                </button>

                <img src="${image.src}" alt="${image.alt}">
            </div>
        `;

        document.body.appendChild(overlay);


        // Close button
        const closeButton =
            overlay.querySelector(".close-image");

        closeButton.addEventListener("click", () => {

            overlay.remove();

        });


        // Click outside image
        overlay.addEventListener("click", (event) => {

            if (event.target === overlay) {

                overlay.remove();

            }

        });

    });

});


// ================================
// GALLERY POPUP CSS
// ================================

const popupStyle = document.createElement("style");

popupStyle.innerHTML = `

    .image-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
    }

    .image-popup {
        position: relative;
        max-width: 900px;
        max-height: 90vh;
    }

    .image-popup img {
        max-width: 100%;
        max-height: 85vh;
        object-fit: contain;
        border-radius: 10px;
    }

    .close-image {
        position: absolute;
        top: -45px;
        right: 0;
        width: 40px;
        height: 40px;
        border: none;
        background: white;
        color: #3b0d19;
        border-radius: 50%;
        font-size: 28px;
        cursor: pointer;
        line-height: 40px;
    }

    .close-image:hover {
        background: #f4a21c;
        color: white;
    }

`;

document.head.appendChild(popupStyle);


// ================================
// CURRENT YEAR
// ================================

const footerText =
    document.querySelector(".footer p");

if (footerText) {

    const currentYear =
        new Date().getFullYear();

    footerText.innerHTML =
        `© ${currentYear} Coffee Shop`;

}


// ================================
// CONSOLE MESSAGE
// ================================

console.log(
    "Coffee Shop website JavaScript loaded successfully ☕"
);