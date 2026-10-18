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
    { img: "doom.png",    title: "Мстители: Доктор Дум",    text: "Дата выхода — 18 декабря 2026 года." },
    { img: "dune.png",    title: "Дюна: Часть третья",       text: "Пол Атрейдес сталкивается с последствиями власти." },
    { img: "encore.png",  title: "Мстители: Финал — Повтор", text: "Расширенная версия с новыми сценами." },
    { img: "fall2.png",   title: "Вышка 2",                  text: "Сестра Джакс не смирилась с утратой." },
    { img: "odyssey.png", title: "Одиссея",                  text: "Одиссей возвращается домой после войны." }
];

let current = 0;

const sliderEl = document.getElementById("sliderEl");
const sliderTrack = document.getElementById("sliderTrack");
const btnNext = document.getElementById("sliderNext");
const btnPrev = document.getElementById("sliderPrev");
const sliderDots = document.getElementById("sliderDots");

/* разметка слайдов и точек */
sliderTrack.innerHTML = slides.map((s, i) => // превращает каждый объект в строку HTML
    `<div class="slider__slide ${i === 0 ? "active" : ""}"> 
        <img src="${s.img}" alt="${s.title}" class="slider__img">
        <div class="slider__caption">
            <h2>${s.title}</h2>
            <p>${s.text}</p>
        </div>
    </div>
`).join(""); // склеивает массив строк в одну строку без разделителей

sliderDots.innerHTML = slides.map((_, i) => // записывает HTML внутрь контейнера, те браузер создаёт DOM (древовидной структуры объектов)
    `<button class="slider__dot ${i === 0 ? "active" : ""}" data-index="${i}"></button>`
).join("");

/* обновление активного слайда */
function updateSlider() {
    const allSlides = sliderTrack.querySelectorAll(".slider__slide");
    const allDots   = sliderDots.querySelectorAll(".slider__dot");
    for (let i = 0; i < allSlides.length; i++) {
        allSlides[i].classList.toggle("active", i === current);
        allDots[i].classList.toggle("active", i === current);
    }
}

function goToSlide(index) {
    current = (index + slides.length) % slides.length; // зацикливание
    updateSlider();
}
function nextSlide() { goToSlide(current + 1); }
function prevSlide() { goToSlide(current - 1); }

/* кнопки */
btnNext.addEventListener("click", nextSlide);
btnPrev.addEventListener("click", prevSlide);

/* точки */
sliderDots.addEventListener("click", (e) => {
    const dot = e.target.closest(".slider__dot");
    if (dot) goToSlide(Number(dot.dataset.index));
});

/* автопрокрутка с остановкой при наведении */
let timer = setInterval(nextSlide, 3000);
sliderEl.addEventListener("mouseenter", () => clearInterval(timer));
sliderEl.addEventListener("mouseleave", () => {
    clearInterval(timer);
    timer = setInterval(nextSlide, 3000);
});

/* свайп */
let startX = 0;
sliderEl.addEventListener("touchstart", (e) => startX = e.touches[0].clientX);
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