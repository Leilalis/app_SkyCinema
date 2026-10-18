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

/* элементы формы */

const form = document.querySelector("#loginForm");
const email = document.querySelector("#email");
const password = document.querySelector("#password");

const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");

const submitBtn = document.querySelector("#submitBtn");

const togglePassword = document.querySelector("#togglePassword");

const successModal = document.querySelector("#successModal");
const modalClose = document.querySelector("#modalClose");

const validateEmail = (value) => {
    const trimmed = value.trim();

    if (trimmed === "") {
        return { valid: false, message: "Введите email" };
    }

    /* шаблон почты */
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return { valid: false, message: "Неверный email" };
    }

    return { valid: true, message: "" };
};

const validatePassword = (value) => {
    if (value === "") {
        return { valid: false, message: "Введите пароль" };
    }
    return { valid: true, message: "" };
};

const showError = (input, errorElement, message) => {
    input.classList.add("error");
    input.classList.remove("success");
    errorElement.textContent = message;
};

const showSuccess = (input, errorElement) => {
    input.classList.remove("error");
    input.classList.add("success");
    errorElement.textContent = "";
};

/* показать окно */
const showModal = () => {
    successModal.classList.add("active");
};

const hideModal = () => {
    successModal.classList.remove("active");
};

modalClose.addEventListener("click", hideModal);

successModal.addEventListener("click", (event) => {
    // Если кликнули по затемнению (не по окну) — закрываем
    if (event.target === successModal) {
        hideModal();
    }
});

togglePassword.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        password.type = "password";
        togglePassword.textContent = "👁️";
    }
});

const setLoading = (isLoading) => {
    if (isLoading) {
        submitBtn.classList.add("loading");
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove("loading");
        submitBtn.disabled = false;
    }
};

const validateSingleField = (input, errorElement, validator) => {
    const result = validator(input.value);
    if (result.valid) {
        showSuccess(input, errorElement);
    } else {
        showError(input, errorElement, result.message);
    }
};

let touched = {
    email: false,
    password: false
};

const updateSubmitState = () => {
    const r1 = validateEmail(email.value);
    const r2 = validatePassword(password.value);
    const allValid = r1.valid && r2.valid;
    submitBtn.disabled = !allValid;
};

const validateForm = () => {
    const r1 = validateEmail(email.value);
    const r2 = validatePassword(password.value);

    if (r1.valid) showSuccess(email, emailError);
    else showError(email, emailError, r1.message);

    if (r2.valid) showSuccess(password, passwordError);
    else showError(password, passwordError, r2.message);

    const allValid = r1.valid && r2.valid;
    submitBtn.disabled = !allValid;

    return allValid;
};

email.addEventListener("input", () => {
    if (touched.email) {
        validateSingleField(email, emailError, validateEmail);
    }
    updateSubmitState();
});
email.addEventListener("blur", () => {
    touched.email = true;
    validateSingleField(email, emailError, validateEmail);
    updateSubmitState();
});

password.addEventListener("input", () => {
    if (touched.password) {
        validateSingleField(password, passwordError, validatePassword);
    }
    updateSubmitState();
});
password.addEventListener("blur", () => {
    touched.password = true;
    validateSingleField(password, passwordError, validatePassword);
    updateSubmitState();
});

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    /* имитация запроса на сервер (2 секунды) */
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);

    showModal();

    form.reset();
    submitBtn.disabled = true;

    [email, password].forEach((input) => {
        input.classList.remove("success");
    });
});

updateSubmitState();