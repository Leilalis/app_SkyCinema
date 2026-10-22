console.log("Сайт подключён к JavaScript!");

/* тема*/ 
const themeBtn = document.querySelector("#themeBtn");

function getSavedTheme() {
    try {
        return localStorage.getItem("theme");
    } catch (e) {
        return null;
    }
}

function saveTheme(theme) {
    try {
        localStorage.setItem("theme", theme);
    } catch (e) {
    }
}

if (getSavedTheme() === "dark") {
    document.body.classList.add("dark");
}

themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    saveTheme(isDark ? "dark" : "light");
});

/* вверх */
const scrollTopBtn = document.querySelector("#scrollTopBtn");

window.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
        scrollTopBtn.classList.add("visible");
    } else {
        scrollTopBtn.classList.remove("visible");
    }
});

scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

/* фильтры */
const filterButtons = document.querySelectorAll(".filter-btn");
const movies = document.querySelectorAll(".movie");
const filterCount = document.querySelector("#filterCount");

function filterMovies(category) {
    let visibleCount = 0;
    
    movies.forEach((movie) => {
        if (category === "all" || movie.dataset.category === category) {
            movie.classList.remove("hidden");
            visibleCount++;
        } else {
            movie.classList.add("hidden");
        }
    });
    
    if (filterCount) {
        filterCount.textContent = visibleCount;
    }
}

filterMovies("all");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.filter;
        filterMovies(category);
    });
})

/* бургер */
const burgerBtn = document.querySelector("#burgerBtn");
const mobileNav = document.querySelector("#mobileNav");
const overlay = document.querySelector("#overlay");

function openMenu() {
    mobileNav.classList.add("open");
    burgerBtn.classList.add("active");
    overlay.classList.add("active");
    document.body.style.overflow = "hidden"; 
}

function closeMenu() {
    mobileNav.classList.remove("open");
    burgerBtn.classList.remove("active");
    overlay.classList.remove("active");
    document.body.style.overflow = ""; 
}

burgerBtn.addEventListener("click", () => {
    if (mobileNav.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }
});

const mobileLinks = mobileNav.querySelectorAll("a");
mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
});

overlay.addEventListener("click", closeMenu);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileNav.classList.contains("open")) {
        closeMenu();
    }
});

/* слайдер */
const slides = [
    { video: "doomteas.mp4", poster: "doomtr.png", title: "Мстители: Доктор Дум", text: "Все герои объединяться чтобы противостоять Доктору Думу. Дата выхода — 18 декабря 2026 года." },
    { video: "duneteas.mp4", poster: "dunetr.png", title: "Дюна: Часть третья", text: "Пол Атрейдес сталкивается с последствиями власти. Дата выхода — 18 декабря 2026 года." },
    { video: "jumanji4teas.mp4", poster: "jumanji4tr.png", title: "Джуманджи: Великий побег", text: "Правила игры полностью сломаны, и теперь «Джуманджи» выходит в реальный мир! Дата выхода — 24 декабря 2026 года." },
    { video: "werwulfteas.mp4", poster: "werwulftr.png", title: "Оборотень", text: "Глухую деревню охватывает ужас: в окрестных лесах объявляется чудовище. Дата выхода — 25 декабря 2026 года." },
    { video: "remainteas.mp4", poster: "remaintr.png", title: "Останься", text: "Чертеж жизни легко разрушить, когда в него вмешивается загадочная незнакомка. Дата выхода — 4 февраля 2027 года." },
];

let current = 0;

const sliderEl = document.getElementById("sliderEl");
const sliderTrack = document.getElementById("sliderTrack");
const btnNext = document.getElementById("sliderNext");
const btnPrev = document.getElementById("sliderPrev");
const sliderDots = document.getElementById("sliderDots");

/* разметка слайдов */
sliderTrack.innerHTML = slides.map((s, i) => `
    <div class="slider__slide ${i === 0 ? "active" : ""}">
        <div class="slider__media">
            <img class="slider__poster" src="${s.poster}" alt="${s.title}">
            <video class="slider__video"
                   src="${s.video}"
                   muted
                   loop
                   playsinline
                   preload="metadata"></video>
            <button class="slider__sound" type="button" aria-label="Включить звук">🔇</button>
        </div>
        <div class="slider__caption">
            <h2>${s.title}</h2>
            <p>${s.text}</p>
        </div>
    </div>
`).join("");

/* точки */
sliderDots.innerHTML = slides.map((_, i) =>
    `<button class="slider__dot ${i === 0 ? "active" : ""}" data-index="${i}"></button>`
).join("");

/* навигация */
function updateSlider() {
    const allSlides = sliderTrack.querySelectorAll(".slider__slide");
    const allDots   = sliderDots.querySelectorAll(".slider__dot");

    allSlides.forEach((slide, i) => {
        const isActive = i === current;
        slide.classList.toggle("active", isActive);
        allDots[i].classList.toggle("active", isActive);

        const video = slide.querySelector(".slider__video");
        const soundBtn = slide.querySelector(".slider__sound");
        if (video && !isActive) {
            video.pause();
            video.currentTime = 0;
            video.muted = true;
            if (soundBtn) soundBtn.textContent = "🔇";
        }
    });
}

function goToSlide(index) {
    current = (index + slides.length) % slides.length;
    updateSlider();
}
function nextSlide() { goToSlide(current + 1); }
function prevSlide() { goToSlide(current - 1); }

btnNext.addEventListener("click", nextSlide);
btnPrev.addEventListener("click", prevSlide);

sliderDots.addEventListener("click", (e) => {
    const dot = e.target.closest(".slider__dot");
    if (dot) goToSlide(Number(dot.dataset.index));
});

/* видео при наведении, звук по кнопке */
sliderTrack.querySelectorAll(".slider__slide").forEach((slideEl) => {
    const video    = slideEl.querySelector(".slider__video");
    const soundBtn = slideEl.querySelector(".slider__sound");
    if (!video) return;

    slideEl.addEventListener("mouseenter", () => {
        video.play().catch(() => {});
    });

    slideEl.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
        video.muted = true;
        if (soundBtn) soundBtn.textContent = "🔇";
    });

    if (soundBtn) {
        soundBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            video.muted = !video.muted;
            soundBtn.textContent = video.muted ? "🔇" : "🔊";
            if (!video.muted) video.play().catch(() => {});
        });
    }
});

const AUTO_DELAY = 3000;
let timer = null;

function startAuto() {
    stopAuto();
    timer = setInterval(nextSlide, AUTO_DELAY);
}
function stopAuto() {
    if (timer) { clearInterval(timer); timer = null; }
}

sliderEl.addEventListener("mouseenter", stopAuto);
sliderEl.addEventListener("mouseleave", startAuto);
startAuto();

/* свайп */
let startX = 0;
sliderEl.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; });
sliderEl.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) dx < 0 ? nextSlide() : prevSlide();
});

/* пагинация */
const data = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    title: "Элемент № " + (i + 1),
    text: "Подробное описание элемента номер " + (i + 1)
}));

const PER_PAGE = 10;
let currentPage = 1;
let filtered = data; // результат поиска

const list = document.getElementById("paginationList");
const box = document.getElementById("pageNumbers");
const prevBtn = document.getElementById("prevPageBtn");
const nextBtn = document.getElementById("nextPageBtn");
const searchInput = document.getElementById("searchInput");

/* отрисовка списка через callback */
function renderPage(items, renderItem) {
    list.innerHTML = "";
    items.forEach(item => list.appendChild(renderItem(item)));
}

/* элементы текущей страницы */
function getPageItems() {
    const start = (currentPage - 1) * PER_PAGE;
    return filtered.slice(start, start + PER_PAGE);
}

/* callback одного элемента */
function renderItem(item) {
    const el = document.createElement("div");
    el.className = "pagination-item";
    el.innerHTML = `<h3>${item.title}</h3><p>${item.text}</p>`;
    return el;
}

/* кнопки-номера страниц */
function renderPagination() {
    const pages = Math.ceil(filtered.length / PER_PAGE);
    box.innerHTML = "";
    for (let i = 1; i <= pages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        btn.className = "page-number-btn";
        if (i === currentPage) btn.classList.add("active");
        btn.addEventListener("click", () => {
            currentPage = i;
            update();
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        box.appendChild(btn);
    }

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === pages;
}

/* фильтр по названию */
searchInput.addEventListener("input", (e) => {
    const q = e.target.value.toLowerCase();
    filtered = data.filter(d => d.title.toLowerCase().includes(q));
    currentPage = 1;
    update();
});

/* обновление всего блока */
function update() {
    renderPage(getPageItems(), renderItem);
    renderPagination();
}

/* кнопки "Пред." и "След." */
prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        update();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

nextBtn.addEventListener("click", () => {
    const pages = Math.ceil(filtered.length / PER_PAGE);
    if (currentPage < pages) {
        currentPage++;
        update();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
});

/* старт */
update();