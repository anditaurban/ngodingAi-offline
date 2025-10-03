const notif = document.getElementById('purchase-notification');
const text = document.getElementById('purchase-text');

const names = ["Ahmad", "Karin", "Budi", "Rina", "Andi", "Dewi", "Rudi", "Ayu", "Fajar", "Lina", "Bagus", "Rahma"];
const cities = ["Jakarta", "Depok", "Bogor", "Tangerang", "Bekasi"];

const batches = [
    {type: "Offline Batch 7", date: "(11 Okt 2025)"},
    {type: "Offline Batch 8", date: "(18 Okt 2025)"}
];

function generatePurchase() {
    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const batch = batches[Math.floor(Math.random() * batches.length)];
    return `${name} dari ${city} mendaftar ${batch.type} ${batch.date}`;
}

function showPurchaseNotification() {
    text.textContent = generatePurchase();
    notif.classList.remove('opacity-0');
    notif.classList.add('opacity-100');

    // Hilang setelah 5 detik
    setTimeout(() => {
        notif.classList.remove('opacity-100');
        notif.classList.add('opacity-0');
    }, 5000);

    // Jadwal kemunculan berikutnya (acak antara 20–30 detik)
    const nextTime = Math.floor(Math.random() * (30000 - 20000 + 1)) + 20000;
    setTimeout(showPurchaseNotification, nextTime);
}

// Pertama kali muncul setelah 7 detik halaman dibuka
setTimeout(showPurchaseNotification, 7000);

 // Gallery Slider Variables
    let currentSlideIndex = 0;
    const totalSlides = 3;

    // Testimonial Slider Variables
    let currentTestimonialIndex = 0;
    const totalTestimonialSlides = 3;

    // Gallery Slider Functions
    function showSlide(index) {
        const slides = document.getElementById('gallerySlides');
        const dots = document.querySelectorAll('.gallery-dot');
        
        if (!slides) return;
        
        if (index >= totalSlides) currentSlideIndex = 0;
        if (index < 0) currentSlideIndex = totalSlides - 1;
        
        slides.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlideIndex);
        });
    }

    function nextSlide() {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }

    function prevSlide() {
        currentSlideIndex--;
        showSlide(currentSlideIndex);
    }

    function currentSlide(index) {
        currentSlideIndex = index - 1;
        showSlide(currentSlideIndex);
    }

    // Testimonial Slider Functions
    function showTestimonialSlide(index) {
        const slides = document.getElementById('testimonialSlides');
        const dots = document.querySelectorAll('.testimonial-dot');
        
        if (!slides) return;
        
        if (index >= totalTestimonialSlides) currentTestimonialIndex = 0;
        if (index < 0) currentTestimonialIndex = totalTestimonialSlides - 1;
        
        slides.style.transform = `translateX(-${currentTestimonialIndex * 100}%)`;
        
        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentTestimonialIndex);
        });
    }

    function nextTestimonialSlide() {
        currentTestimonialIndex++;
        showTestimonialSlide(currentTestimonialIndex);
    }

    function prevTestimonialSlide() {
        currentTestimonialIndex--;
        showTestimonialSlide(currentTestimonialIndex);
    }

    function currentTestimonialSlide(index) {
        currentTestimonialIndex = index - 1;
        showTestimonialSlide(currentTestimonialIndex);
    }

    // Auto slide for gallery (optional)
    setInterval(nextSlide, 5000); // Change slide every 5 seconds

    // Auto slide for testimonials (optional)
    setInterval(nextTestimonialSlide, 7000); // Change testimonial slide every 7 seconds

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Add dynamic seat counter (simulation)
    function updateSeatCount() {
        const seatElements = document.querySelectorAll('[class*="kursi tersisa"]');
        seatElements.forEach(element => {
            // Simulate seat booking by randomly decreasing available seats
            if (Math.random() < 0.1) { // 10% chance to decrease
                const currentText = element.textContent;
                const currentCount = parseInt(currentText.match(/\d+/)[0]);
                if (currentCount > 0) {
                    element.textContent = currentText.replace(/\d+/, currentCount - 1);
                }
            }
        });
    }

    // Update seat count every 30 seconds (simulation)
    setInterval(updateSeatCount, 30000);

    // Touch/Swipe support for gallery
    let startX = 0;
    let endX = 0;

    const gallerySlider = document.querySelector('.gallery-slider');
    if (gallerySlider) {
        gallerySlider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        });

        gallerySlider.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            handleGallerySwipe();
        });
    }

    function handleGallerySwipe() {
        const threshold = 50; // minimum distance for swipe
        const diff = startX - endX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextSlide(); // swipe left - next slide
            } else {
                prevSlide(); // swipe right - previous slide
            }
        }
    }

    // Touch/Swipe support for testimonials
    let testimonialStartX = 0;
    let testimonialEndX = 0;

    const testimonialSlider = document.querySelector('.testimonial-slider');
    if (testimonialSlider) {
        testimonialSlider.addEventListener('touchstart', function(e) {
            testimonialStartX = e.touches[0].clientX;
        });

        testimonialSlider.addEventListener('touchend', function(e) {
            testimonialEndX = e.changedTouches[0].clientX;
            handleTestimonialSwipe();
        });
    }

    function handleTestimonialSwipe() {
        const threshold = 50; // minimum distance for swipe
        const diff = testimonialStartX - testimonialEndX;

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                nextTestimonialSlide(); // swipe left - next slide
            } else {
                prevTestimonialSlide(); // swipe right - previous slide
            }
        }
    }

    window.addEventListener("load", () => {
    const el = document.getElementById("batch-scroll");
    el.scrollLeft = el.scrollWidth; // auto scroll ke ujung kanan
  });