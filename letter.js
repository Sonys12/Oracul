/**
 * LETTER.JS — Логика «Письма Вселенной»
 * Этот файл управляет динамическим фоном неба и анимацией отправки письма.
 */

// Элементы формы
const nameInput = document.getElementById("nameInput");
const subjectInput = document.getElementById("subjectInput");
const bodyInput = document.getElementById("bodyInput");
const bodyWrapper = document.getElementById("bodyWrapper");
const sendBtn = document.getElementById("sendBtn");
const statusText = document.getElementById("statusText");

/**
 * 1. ЛОГИКА ДИНАМИЧЕСКОГО НЕБА
 * Цвет фона и небесные тела меняются в зависимости от системного времени.
 */
function updateSkyTheme() {
  const hour = new Date().getHours();
  const body = document.body;

  // Сбрасываем старые классы
  body.classList.remove('morning', 'day', 'evening', 'night');

  let theme = 'day';
  if (hour >= 5 && hour < 9) theme = 'morning';
  else if (hour >= 9 && hour < 18) theme = 'day';
  else if (hour >= 18 && hour < 22) theme = 'evening';
  else theme = 'night';

  body.classList.add(theme);

  // Добавляем эффект появления светил через таймаут для плавности
  setTimeout(() => {
    const sun = document.querySelector('.sun');
    const moon = document.querySelector('.moon');
    if (theme === 'morning' || theme === 'day' || theme === 'evening') {
      if (sun) sun.style.opacity = '1';
      if (moon) moon.style.opacity = '0';
    } else {
      if (sun) sun.style.opacity = '0';
      if (moon) moon.style.opacity = '1';
    }
  }, 500);
}

/**
 * 2. ЛОГИКА ОТПРАВКИ ПИСЬМА
 */
let sendingInProgress = false;

async function sendLetter() {
  const text = bodyInput.value.trim();
  if (!text) {
    statusText.textContent = "Напишите хотя бы пару слов, Вселенная ждёт...";
    bodyInput.classList.add('error');
    setTimeout(() => bodyInput.classList.remove('error'), 500);
    return;
  }

  if (sendingInProgress) return;
  sendingInProgress = true;
  sendBtn.disabled = true;

  statusText.textContent = "Письмо подхватывает небесный поток...";

  // Запуск анимации «улёта»
  bodyWrapper.classList.add('sending');

  // Имитируем время полёта письма
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Очистка и сброс
  bodyInput.value = "";
  subjectInput.value = "";
  nameInput.value = "";

  bodyWrapper.classList.remove('sending');
  statusText.textContent = "Ваше послание растворилось в бесконечности. Оно услышано.";

  sendingInProgress = false;
  sendBtn.disabled = false;
}

/**
 * ИНИЦИАЛИЗАЦИЯ
 */
window.addEventListener('DOMContentLoaded', () => {
  updateSkyTheme();

  sendBtn.addEventListener('click', sendLetter);

  // Отправка через Ctrl+Enter
  bodyInput.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      sendLetter();
    }
  });

  // Фокус для удобства
  bodyInput.focus();
});

// Навигация
function goHome() {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  setTimeout(() => window.location.href = 'index.html', 400);
}
