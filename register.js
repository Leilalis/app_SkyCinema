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

const form = document.querySelector("#registerForm");

const username = document.querySelector("#username");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const confirm = document.querySelector("#confirm");

const usernameError = document.querySelector("#usernameError");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");
const confirmError = document.querySelector("#confirmError");

const submitBtn = document.querySelector("#submitBtn");
const terms = document.querySelector("#terms");
const termsError = document.querySelector("#termsError");

const successModal = document.querySelector("#successModal");
const modalClose = document.querySelector("#modalClose");

/* показать ошибку */
const showError = (input, errorElement, message) => {
    input.classList.add("error");          // Красная рамка
    input.classList.remove("success");      // Убрать зелёную
    errorElement.textContent = message;     // Показать текст ошибки
};

/* показать успех */
const showSuccess = (input, errorElement) => {
    input.classList.remove("error");        // Убрать красную
    input.classList.add("success");         // Зелёная рамка
    errorElement.textContent = "";          // Очистить текст
};

const validateUsername = (value) => {
    /* убираем поля*/
    const trimmed = value.trim();
    
    /* не пусто */
    if (trimmed === "") {
        return { valid: false, message: "Введите имя" };
    }
    
    /* мин 3 */
    if (trimmed.length < 3) {
        return { valid: false, message: "Минимум 3 символа" };
    }
    
    /* макс 20 */
    if (trimmed.length > 20) {
        return { valid: false, message: "Максимум 20 символов" };
    }
    
    /* только опр символы */
    if (!/^[a-zA-Z0-9_]+$/.test(trimmed)) {
        return { valid: false, message: "Только буквы, цифры и _" };
    }
    
    /* всё прошло */
    return { valid: true, message: "" };
};

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
    
    if (value.length < 8) {
        return { valid: false, message: "Минимум 8 символов" };
    }
    
    /* есть ли буква */
    if (!/[a-zA-Z]/.test(value)) {
        return { valid: false, message: "Добавьте букву" };
    }
    
    /* есть ли цифра */
    if (!/\d/.test(value)) {
        return { valid: false, message: "Добавьте цифру" };
    }
    
    return { valid: true, message: "" };
};

const validateConfirm = (value) => {
    if (value === "") {
        return { valid: false, message: "Повторите пароль" };
    }
    
    /* сравнение */
    if (value !== password.value) {
        return { valid: false, message: "Пароли не совпадают" };
    }
    
    return { valid: true, message: "" };
};

/* мягкая валидация */

let touched = {
    username: false,
    email: false,
    password: false,
    confirm: false
};

const togglePassword = document.querySelector("#togglePassword");

togglePassword.addEventListener("click", () => {
    if (password.type === "password") {
        password.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        password.type = "password";
        togglePassword.textContent = "👁️";
    }
});

/* показать окно */
const showModal = () => {
    successModal.classList.add("active");
};

const hideModal = () => {
    successModal.classList.remove("active");
};

modalClose.addEventListener("click", hideModal);

successModal.addEventListener("click", (event) => {
    // Если кликнули по затемнению (не по окну)
    if (event.target === successModal) {
        hideModal();
    }
});

/* загрузка */
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

const validateForm = () => {
    /* проверка полей */
    const r1 = validateUsername(username.value);
    const r2 = validateEmail(email.value);
    const r3 = validatePassword(password.value);
    const r4 = validateConfirm(confirm.value);
    const r5 = validateTerms();
    
    /* показывает результаты каждого поля */
    if (r1.valid) showSuccess(username, usernameError);
    else showError(username, usernameError, r1.message);
    
    if (r2.valid) showSuccess(email, emailError);
    else showError(email, emailError, r2.message);
    
    if (r3.valid) showSuccess(password, passwordError);
    else showError(password, passwordError, r3.message);
    
    if (r4.valid) showSuccess(confirm, confirmError);
    else showError(confirm, confirmError, r4.message);

    if (r5.valid) {
    termsError.textContent = "";
    } else {
    termsError.textContent = r5.message;
    }

    /* все ли поля валидны */
    const allValid = r1.valid && r2.valid && r3.valid && r4.valid && r5.valid;
    
    /* вкл кнопки */
    submitBtn.disabled = !allValid;
    
    return allValid;
};

const updateSubmitState = () => {
    const r1 = validateUsername(username.value);
    const r2 = validateEmail(email.value);
    const r3 = validatePassword(password.value);
    const r4 = validateConfirm(confirm.value);
    const r5 = validateTerms();

    const allValid = r1.valid && r2.valid && r3.valid && r4.valid && r5.valid;
    submitBtn.disabled = !allValid;
};

/* сила пароля */
const checkStrength = (value) => {
    let strength = 0;

    if (value.length >= 8) strength++;                       // +1 за длину
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) strength++;  // +1 за регистр
    if (/\d/.test(value)) strength++;                        // +1 за цифру
    if (/[^a-zA-Z0-9]/.test(value)) strength++;              // +1 за спецсимвол

    return strength;  // от 0 до 4
};
const levels = [
    { width: "0%",   color: "#eee",    text: "Введите пароль" },
    { width: "25%",  color: "#e74c3c", text: "Очень слабый" },
    { width: "50%",  color: "#f39c12", text: "Слабый" },
    { width: "75%",  color: "#3498db", text: "Средний" },
    { width: "100%", color: "#27ae60", text: "Сильный" }
];

const updateStrength = (value) => {
    const strength = checkStrength(value);
    const level = levels[strength];

    strengthFill.style.width = level.width;
    strengthFill.style.background = level.color;
    strengthText.textContent = level.text;
    strengthText.style.color = level.color;
};

password.addEventListener("input", (event) => {
    updateStrength(event.target.value);
});

/* согласие */
const validateTerms = () => {
    if (!terms.checked) {
        return { valid: false, message: "Отметьте согласие" };
    }
    return { valid: true, message: "" };
};

/* проверка при вводе */
username.addEventListener("input", () => {
    if (touched.username) {
        validateSingleField(username, usernameError, validateUsername);
    }
    updateSubmitState();
});
username.addEventListener("blur", () => {
    touched.username = true;
    validateSingleField(username, usernameError, validateUsername);
    updateSubmitState();
});

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

confirm.addEventListener("input", () => {
    if (touched.confirm) {
        validateSingleField(confirm, confirmError, validateConfirm);
    }
    updateSubmitState();
});
confirm.addEventListener("blur", () => {
    touched.confirm = true;
    validateSingleField(confirm, confirmError, validateConfirm);
    updateSubmitState();
});


/* отправка формы */
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // иитация запроса на сервер (2 секунды)
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setLoading(false);

    showModal();          // показываем модалку
    form.reset();         // сбрасываем форму
    submitBtn.disabled = true;

    // Очищаем классы успеха
    [username, email, password, confirm].forEach((input) => {
        input.classList.remove("success");
    });

    localStorage.removeItem("registerDraft");
});

/* сохранение */
const saveDraft = () => {
    const draft = {
        username: username.value,
        email: email.value
    };

    try {
        localStorage.setItem("registerDraft", JSON.stringify(draft));
    } catch (e) {
        // localStorage может быть недоступен в приватном режиме
    }
};

const loadDraft = () => {
    try {
        const saved = localStorage.getItem("registerDraft");
        if (!saved) return;

        const draft = JSON.parse(saved);
        username.value = draft.username || "";
        email.value = draft.email || "";
    } catch (e) {
        // если что-то не так — просто ничего не делаем
    }
};

[username, email].forEach((input) => {
    input.addEventListener("input", () => {
        saveDraft();
        updateSubmitState();
    });
});

terms.addEventListener("change", () => {
    const r5 = validateTerms();
    if (r5.valid) termsError.textContent = "";
    else termsError.textContent = r5.message;
    
    updateSubmitState();
});

loadDraft();
updateSubmitState();