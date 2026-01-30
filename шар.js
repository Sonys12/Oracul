/**
 * ШАР.JS — Логика «Магического Оракула»
 * В этом файле реализована механика случайных ответов, визуальные эффекты
 * шёпота (фоновые мысли) и интерактивность шара.
 */

// Ссылки на ключевые элементы интерфейса
const ball = document.getElementById("magicBall");              // Главная сфера
const ballText = document.getElementById("ballText");           // Приглашение к действию
const ballAnswer = document.getElementById("ballAnswer");       // Поле для вывода ответа
const ballMist = document.getElementById("ballMist");           // Слой тумана внутри шара
const questionInput = document.getElementById("questionInput"); // Поле для ввода вопроса
const askBtn = document.getElementById("askBtn");               // Кнопка запуска
const whispersLayer = document.getElementById("whispersLayer"); // Слой для летающих фраз

/**
 * БАЗА ДАННЫХ ОТВЕТОВ
 * Классические 20 ответов магического шара, разделенные на категории.
 */
const answers = [
  // Положительные
  "Бесспорно", "Предрешено", "Никаких сомнений", "Определённо да", "Можешь быть уверен",
  // Нейтральные
  "Пока не ясно", "Спроси позже", "Лучше не рассказывать", "Сейчас нельзя предсказать", "Сконцентрируйся и спроси опять",
  // Отрицательные
  "Даже не думай", "Мой ответ — нет", "По моим данным — нет", "Перспективы не очень", "Весьма сомнительно"
];

// Фоновые «шёпоты» — создают эффект присутствия других сознаний
const sideQuestions = [
  "А что, если я ошибаюсь?", "Стоит ли мне доверять?", "Где найти истину?",
  "Время уходит...", "Слушай своё сердце", "Звёзды знают путь",
  "Не бойся перемен", "Тишина полна ответов", "Всё уже решено?"
];

/**
 * ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
 */

// Получение случайного элемента из массива
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * ВИЗУАЛЬНЫЕ ЭФФЕКТЫ: Звезды и Шёпоты
 */

function initAtmosphere() {
  // Создание мерцающих звезд на фоне
  const stars = document.getElementById('stars');
  if (stars) {
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      star.className = 'star';
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      const size = Math.random() * 2 + 1 + 'px';
      star.style.width = size;
      star.style.height = size;
      star.style.animationDelay = Math.random() * 5 + 's';
      stars.appendChild(star);
    }
  }

  // Цикл создания шёпотов
  setInterval(createWhisper, 345);
}

function createWhisper() {
  if (!whispersLayer) return;

  const whisper = document.createElement('div');
  whisper.className = 'whisper-item';
  whisper.textContent = getRandom(sideQuestions);

  // Случайная позиция, но подальше от центра (где шар)
  const side = Math.random() > 0.5 ? 'left' : 'right';
  whisper.style[side] = Math.random() * 30 + '%';
  whisper.style.top = Math.random() * 80 + 10 + '%';

  whispersLayer.appendChild(whisper);

  // Плавное появление и удаление
  setTimeout(() => whisper.classList.add('visible'), 50);
  setTimeout(() => {
    whisper.classList.remove('visible');
    setTimeout(() => whisper.remove(), 300);
  }, 2500);
}

/**
 * ГЛАВНАЯ ЛОГИКА ШАРА
 */

let isBusy = false;

async function askBall() {
  const question = questionInput.value.trim();

  if (!question) {
    shakeInput();
    return;
  }

  if (isBusy) return;
  isBusy = true;

  // Подготовка визуального состояния
  ballText.classList.add('hidden');
  ballAnswer.classList.remove('visible');
  ballMist.classList.add('visible');
  ball.classList.add('ball-rotating');
  askBtn.disabled = true;

  // Имитация "раздумий" оракула
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Вывод ответа
  const reply = getRandom(answers);
  ballAnswer.textContent = reply;
  ballAnswer.classList.add('visible');

  // Завершение анимации
  ballMist.classList.remove('visible');
  ball.classList.remove('ball-rotating');
  isBusy = false;
  askBtn.disabled = false;
}

// Визуальный отклик при пустом поле
function shakeInput() {
  questionInput.style.borderColor = "#ff4c4c";
  questionInput.style.transform = "translateX(5px)";
  setTimeout(() => questionInput.style.transform = "translateX(-5px)", 100);
  setTimeout(() => {
    questionInput.style.transform = "translateX(0)";
    questionInput.style.borderColor = "";
  }, 200);
}

/**
 * ИНИЦИАЛИЗАЦИЯ
 */

window.addEventListener('DOMContentLoaded', () => {
  initAtmosphere();

  askBtn.addEventListener('click', askBall);

  questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') askBall();
  });

  // Фокус на поле ввода для удобства
  questionInput.focus();
});

// Плавный возврат домой
function goHome() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.3s';
  setTimeout(() => window.location.href = 'index.html', 300);
}
