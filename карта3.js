/**
 * КАРТА3.JS — Логика нумерологического калькулятора
 * В этом файле реализованы математические алгоритмы сложения цифр (метод теософского сокращения)
 * и подбор интерпретаций на основе полученных вибраций.
 */

/**
 * ФУНКЦИИ НАВИГАЦИИ
 */

// Плавный переход между страницами с визуальным эффектом
function goHome() {
    document.body.style.transform = 'scale(0.97)';
    document.body.style.opacity = '0';
    document.body.style.transition = 'transform 0.3s, opacity 0.3s';
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 250);
}

/**
 * ГЛАВНЫЙ МЕТОД НУМЕРОЛОГИИ: Сокращение числа до одной цифры (1-9).
 * Исключение: Мастер-числа (11, 22, 33), которые обладают особой силой и не сокращаются.
 * @param {number} num - Число для расчета
 */
function reduceToSingleDigit(num) {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        // Суммируем все цифры числа
        num = num.toString().split('').reduce((a, b) => a + parseInt(b, 10), 0);
    }
    return num;
}

// Валидация даты (проверка на существование дня в конкретном месяце/году)
function validateDate(dateStr) {
    const parts = dateStr.split('.');
    if (parts.length !== 3) return false;
    const [day, month, year] = parts.map(Number);
    if (!day || !month || !year || year < 1900 || year > 2100) return false;
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day;
}

/**
 * СЛОВАРИ ИНТЕРПРЕТАЦИЙ
 */

const numberMeanings = {
    1: "Лидерство, независимость, оригинальность. Вы пришли, чтобы прокладывать новые пути.",
    2: "Партнёрство, дипломатия, интуиция. Ваша сила в умении соединять людей и находить баланс.",
    3: "Самовыражение, творчество, оптимизм. Мир ждет ваших идей и вдохновения.",
    4: "Стабильность, порядок, упорный труд. Вы — фундамент, на котором строятся великие дела.",
    5: "Свобода, адаптивность, приключения. Ваша жизнь — это постоянное движение и развитие.",
    6: "Ответственность, любовь, служение близким. Вы несете гармонию и уют в этот мир.",
    7: "Аналитизм, поиск истины, духовность. Ваша задача — познать глубокие законы Вселенной.",
    8: "Авторитет, финансы, карма. Вы наделены силой управлять материальным миром.",
    9: "Гуманизм, завершение циклов, мудрость. Вы здесь, чтобы отдавать и помогать другим.",
    11: "Просветление, интуитивный канал, миссия. Вы — духовный мост между мирами.",
    22: "Мастер-строитель, реализация масштабных систем. Вы способны воплотить любую мечту в реальность.",
    33: "Мастер-наставник, безусловная любовь. Ваша жизнь — пример высшего служения людям."
};

const karmaDescriptions = {
    1: "В прошлом вы подавляли волю других. Сейчас задача — стать лидером, который вдохновляет, а не заставляет.",
    2: "Прошлая жизнь была полна зависимости. Сейчас учитесь доверять себе и не растворяться в партнере.",
    3: "Вы растратили талант впустую. Сейчас важно направить творчество на созидание, а не только на развлечения.",
    4: "Вы избегали ответственности. В этой жизни стабильность и труд — ваши главные учителя.",
    5: "Слишком много хаоса в прошлом. Сейчас ищите свободу внутри дисциплины и обязательств.",
    6: "Вы пренебрегали семейными узами. Задача — научиться заботиться без контроля и ожиданий.",
    7: "Вы скрывали знания от других. Делитесь мудростью, не уходя в холодное одиночество.",
    8: "Злоупотребление властью или деньгами. Сейчас учитесь управлять ресурсами экологично.",
    9: "Вы были слишком привязаны к земному. Сейчас учитесь отпускать и служить высшим идеалам.",
    11: "Духовный дар был отвергнут или использован во вред. Время принять свою интуицию.",
    22: "Огромный потенциал был не реализован из-за страха. Стройте великое, не боясь масштаба.",
    33: "Вы не справились с грузом ответственности за других. Сейчас учитесь любить, не сгорая дотла."
};

/**
 * ОСНОВНЫЕ РАСЧЕТЫ
 */

function calculateAll() {
    const birth = document.getElementById('userBirth').value.trim();
    const name = document.getElementById('userName').value.trim().toUpperCase();

    if (!validateDate(birth)) {
        alert('Пожалуйста, введите корректную дату (например, 12.05.1988).');
        return;
    }
    if (!name) {
        alert('Введите полное имя для анализа числовых вибраций.');
        return;
    }

    document.getElementById('compUserDate').value = birth;
    const [day, month, year] = birth.split('.').map(Number);

    // 1. Число Судьбы (Сумма всей даты)
    const destiny = reduceToSingleDigit(day + month + year);
    setResult('destinyResult', 'Тропа Судьбы', destiny, numberMeanings[destiny]);

    // 2. Число Души (Сумма дня и месяца)
    const soul = reduceToSingleDigit(day + month);
    setResult('soulResult', 'Голос Сердца', soul, numberMeanings[soul]);

    // 3. Число Личности (Сумма цифр дня рождения)
    const personality = reduceToSingleDigit(day);
    setResult('personalityResult', 'Маска в мире', personality, numberMeanings[personality]);

    // 4. Кармическая Задача (Расчет по всем цифрам даты без сокращения промежуточных сумм)
    const karmaRaw = birth.replace(/\./g, '').split('').map(Number).reduce((a, b) => a + b, 0);
    const karma = reduceToSingleDigit(karmaRaw);
    setResult('karmaResult', 'Наследие Души', karma, karmaDescriptions[karma]);

    // 5. Число Имени (Перевод букв кириллицы в цифры по классической системе)
    const nameMap = {
        'А': 1, 'Б': 2, 'В': 3, 'Г': 4, 'Д': 5, 'Е': 6, 'Ё': 7, 'Ж': 8, 'З': 9,
        'И': 1, 'Й': 2, 'К': 3, 'Л': 4, 'М': 5, 'Н': 6, 'О': 7, 'П': 8, 'Р': 9,
        'С': 1, 'Т': 2, 'У': 3, 'Ф': 4, 'Х': 5, 'Ц': 6, 'Ч': 7, 'Ш': 8, 'Щ': 9,
        'Ъ': 1, 'Ы': 2, 'Ь': 3, 'Э': 4, 'Ю': 5, 'Я': 6
    };
    let nameSum = 0;
    for (const char of name) {
        if (nameMap[char]) nameSum += nameMap[char];
    }
    const nameValue = reduceToSingleDigit(nameSum);
    setResult('nameResult', 'Энергия Имени', nameValue, `Имя резонирует с частотой числа ${nameValue}. ${numberMeanings[nameValue]}`);
}

function setResult(id, title, number, text) {
    const el = document.getElementById(id);
    if (!el) return;
    el.innerHTML = `
        <div class="result-title">${title}</div>
        <div class="result-number">${number}</div>
        <div class="result-meaning">${text}</div>
    `;
    el.classList.add('show');
}

/**
 * РАСЧЕТ СОВМЕСТИМОСТИ
 */
function calculateCompatibility() {
    const d1 = document.getElementById('compUserDate').value;
    const d2 = document.getElementById('compOtherDate').value;

    if (!validateDate(d2)) {
        alert('Введите корректную дату партнёра.');
        return;
    }

    const calcPoints = (str) => {
        const [d, m, y] = str.split('.').map(Number);
        return reduceToSingleDigit(d + m + y);
    }

    const n1 = calcPoints(d1);
    const n2 = calcPoints(d2);
    const diff = Math.abs(n1 - n2);

    let summary = diff <= 1 ? "Гармоничный союз" : diff <= 3 ? "Стабильный союз" : "Кармический урок";

    // Проценты для визуализации
    const base = 100 - (diff * 12);
    const friendship = Math.max(10, base - 5);
    const work = Math.max(10, base + 5);
    const love = Math.max(10, base);

    const el = document.getElementById('compResult');
    el.innerHTML = `
        <div class="result-title">${summary}</div>
        <div class="result-number">${n1} + ${n2}</div>
        <div class="compat-bars">
            ${createBar('Дружба', friendship, 'friendFill')}
            ${createBar('Дела', work, 'workFill')}
            ${createBar('Любовь', love, 'loveFill')}
        </div>
    `;
    el.classList.add('show');

    // Запускаем анимацию заполнения
    requestAnimationFrame(() => {
        document.getElementById('friendFill').style.width = friendship + '%';
        document.getElementById('workFill').style.width = work + '%';
        document.getElementById('loveFill').style.width = love + '%';
    });
}

function createBar(label, value, fillId) {
    return `
        <div class="compat-row">
            <div class="compat-label">${label}</div>
            <div class="compat-bar"><div class="compat-fill" id="${fillId}"></div></div>
            <div style="font-size:0.8rem; font-weight:700;">${value}%</div>
        </div>
    `;
}

/**
 * ИНИЦИАЛИЗАЦИЯ
 */

// Авто-маска для ввода даты (ДД.ММ.ГГГГ)
// Авто-маска для ввода даты (ДД.ММ.ГГГГ) — теперь для всех полей дат
function initMasks() {
    const dateInputs = document.querySelectorAll('input[placeholder*="01.01.1990"], #compUserDate, #compOtherDate');
    dateInputs.forEach(input => {
        input.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, '').slice(0, 8);  // ← ИСПРАВЛЕНО: \D без \\
            if (v.length >= 5) {
                v = v.slice(0, 2) + '.' + v.slice(2, 4) + '.' + v.slice(4);
            } else if (v.length >= 3) {
                v = v.slice(0, 2) + '.' + v.slice(2);
            }
            e.target.value = v;
        });
    });
}


// Эффект звездного неба
function createStars() {
    const container = document.getElementById('stars');
    if (!container) return;
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.width = star.style.height = (Math.random() * 2 + 1) + 'px';
        star.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(star);
    }
}

// Эффект золотых частиц
function createParticles() {
    setInterval(() => {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.width = p.style.height = (Math.random() * 4 + 2) + 'px';
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 8000);
    }, 400);
}

window.addEventListener('DOMContentLoaded', () => {
    createStars();
    createParticles();
    initMasks();
    document.getElementById('userBirth').focus();
});

