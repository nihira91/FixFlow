/**
 * script.js
 * Adds:
 * - Scroll fade-up animation for feature cards
 * - Navbar shadow on scroll
 * - Learn More smooth scroll
 * - Mockup floating animation stays clean
 */

document.addEventListener("DOMContentLoaded", () => {

    /* -----------------------------------------------------
       1. NAVBAR SHADOW ON SCROLL
    ----------------------------------------------------- */
    const navbar = document.getElementById("navbar");

    window.addEventListener("scroll", () => {
        if (window.scrollY > 20) {
            navbar.classList.add("shadow-lg", "bg-white/90", "backdrop-blur");
        } else {
            navbar.classList.remove("shadow-lg", "bg-white/90", "backdrop-blur");
        }
    });

    /* -----------------------------------------------------
       2. SCROLL TO FEATURES (Learn More button)
    ----------------------------------------------------- */
    const learnMoreBtn = document.getElementById("learnMoreBtn");
    const featuresSection = document.getElementById("featuresSection");

    learnMoreBtn.addEventListener("click", () => {
        featuresSection.scrollIntoView({ behavior: "smooth" });
    });

    /* -----------------------------------------------------
       3. FEATURE CARDS FADE-UP ANIMATION
    ----------------------------------------------------- */
    const cards = document.querySelectorAll(".feature-card");

    // Initial hidden state (JS controlled so Tailwind doesn't overwrite)
    cards.forEach(card => {
        card.style.opacity = "0";
        card.style.transform = "translateY(40px) scale(0.95)";
        card.style.transition = "all 0.8s cubic-bezier(0.22, 1, 0.36, 1)";
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index)=> {
            if (entry.isIntersecting) {

                // Show animation
                setTimeout(() => {    
                    entry.target.style.opacity = "1";
                    entry.target.style.transform = "translateY(0) scale(1)";
                }, index * 150);   

            observer.unobserve(entry.target);
        }              
        });
    }, { threshold: 0.2 });

    cards.forEach(card => observer.observe(card));

});
