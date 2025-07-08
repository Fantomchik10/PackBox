document.addEventListener('DOMContentLoaded', function() {
  // ===== БЕЗОПАСНАЯ ИНТЕГРАЦИЯ С TELEGRAM =====
  let TELEGRAM_BOT_TOKEN = '';
  let TELEGRAM_CHAT_ID = '';
  let isTelegramReady = false;
  
  // Пытаемся загрузить конфигурацию из внешнего файла
  async function loadTelegramConfig() {
    try {
      const response = await fetch('secret/telegram-config.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Не удалось загрузить конфигурацию Telegram:', error);
      return null;
    }
  }
  
  // Инициализация Telegram бота
  (async function initTelegram() {
    try {
      console.log('Начало инициализации Telegram бота...');
      
      // Всегда пытаемся загрузить конфиг на GitHub Pages
      const config = await loadTelegramConfig();
      
      if (config && config.BOT_TOKEN && config.CHAT_ID) {
        TELEGRAM_BOT_TOKEN = config.BOT_TOKEN;
        TELEGRAM_CHAT_ID = config.CHAT_ID;
        isTelegramReady = true;
        
        console.log('Telegram бот инициализирован!');
        console.log('Токен:', TELEGRAM_BOT_TOKEN.substring(0, 6) + '...');
        console.log('Chat ID:', TELEGRAM_CHAT_ID);
      } else {
        console.warn('Бот Telegram не активирован - неверные данные конфигурации');
      }
    } catch (error) {
      console.error('Критическая ошибка инициализации бота:', error);
    }
  })();
  
  // Генерация уникального ID для пользователя
  let userId = localStorage.getItem('chat_user_id');
  if (!userId) {
    userId = Math.random().toString(36).substring(2, 11);
    localStorage.setItem('chat_user_id', userId);
    console.log('Сгенерирован новый User ID:', userId);
  } else {
    console.log('Найден существующий User ID:', userId);
  }

  // Функция отправки в Telegram с защитой
  async function sendToTelegram(text) {
    // Проверяем наличие учетных данных
    if (!isTelegramReady || !TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.warn('Отправка в Telegram отменена: бот не инициализирован');
      return false;
    }
    
    console.log('Попытка отправки сообщения в Telegram:', text.substring(0, 50) + '...');
    
    try {
      // Список резервных CORS-прокси
      const proxyUrls = [
        'https://corsproxy.io/?', 
        'https://api.codetabs.com/v1/proxy?quest=',
        'https://cors-anywhere.herokuapp.com/'
      ];
      
      const apiUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      
      // Пробуем отправить через разные прокси
      for (const proxyUrl of proxyUrls) {
        try {
          const fullUrl = proxyUrl + encodeURIComponent(apiUrl);
          console.log('Пробуем прокси:', proxyUrl);
          
          const response = await fetch(fullUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: TELEGRAM_CHAT_ID,
              text: text,
              parse_mode: 'HTML'
            })
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Успешно отправлено через', proxyUrl, data);
          return true;
          
        } catch (proxyError) {
          console.warn(`Ошибка с прокси ${proxyUrl}:`, proxyError.message);
        }
      }
      
      // Попробуем прямую отправку (если браузер разрешает)
      try {
        console.log('Пробуем прямую отправку...');
        const directResponse = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHAT_ID,
            text: text,
            parse_mode: 'HTML'
          })
        });
        
        if (directResponse.ok) {
          const data = await directResponse.json();
          console.log('Успешная прямая отправка!', data);
          return true;
        } else {
          throw new Error(`HTTP error! status: ${directResponse.status}`);
        }
      } catch (directError) {
        console.warn('Прямая отправка не удалась:', directError.message);
      }
      
      console.error('Все методы отправки не сработали');
      return false;
      
    } catch (error) {
      console.error('Критическая ошибка отправки в Telegram:', error);
      return false;
    }
  }

  // ===== ОСТАЛЬНОЙ КОД =====
  // Мобильное меню
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
      document.body.classList.toggle('no-scroll');
    });
  }

  // Закрытие меню при клике на ссылку
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileMenuToggle) {
        mobileMenuToggle.classList.remove('active');
      }
      navMenu.classList.remove('active');
      document.body.classList.remove('no-scroll');
    });
  });

  // Плавная прокрутка для навигации
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // Подсветка активного раздела при скролле
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-menu a');
  
  function highlightNav() {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', highlightNav);
  highlightNav(); // Инициализация при загрузке

  // Обработка формы обратной связи
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Сбор данных формы
      const formData = new FormData(this);
      const data = Object.fromEntries(formData);
      
      // Валидация
      const phoneRegex = /^(\+7|8)[\d]{10}$/;
      const name = this.name.value.trim();
      const phone = this.telephone.value.trim();
      
      if (!name || !phone) {
        showAlert('Пожалуйста, заполните обязательные поля', 'error');
        return;
      }
      
      if (!phoneRegex.test(phone)) {
        showAlert('Пожалуйста, введите корректный номер телефона (+7XXXXXXXXXX)', 'error');
        return;
      }
      
      // Формирование сообщения для Telegram
      const telegramMessage = `
📥 <b>НОВАЯ ЗАЯВКА С САЙТА!</b>
┌────────────────────
├ <b>Имя:</b> ${data.name}
├ <b>Телефон:</b> ${data.telephone}
├ <b>Email:</b> ${data.email || 'не указан'}
└ <b>Сообщение:</b>
${data.message || 'без сообщения'}
      `;
      
      // Отправка в Telegram
      const isSent = await sendToTelegram(telegramMessage);
      
      if (isSent) {
        showAlert('Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
        this.reset();
      } else {
        showAlert('Ошибка отправки сообщения. Пожалуйста, попробуйте позже.', 'error');
      }
    });
  }

  // Раскрывающиеся FAQ
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    
    question.addEventListener('click', () => {
      // Закрываем все открытые ответы
      document.querySelectorAll('.faq-answer').forEach(ans => {
        if (ans !== answer && ans.style.maxHeight) {
          ans.style.maxHeight = null;
          ans.previousElementSibling.classList.remove('active');
        }
      });
      
      // Переключаем текущий ответ
      question.classList.toggle('active');
      answer.style.maxHeight = answer.style.maxHeight ? null : answer.scrollHeight + 'px';
    });
  });

  // Липкая навигация при скролле
  window.addEventListener('scroll', function() {
    const nav = document.querySelector('.floating-nav');
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Анимация карточек при появлении
  const animateOnScroll = () => {
    const cards = document.querySelectorAll('.service-card, .pricing-card, .advantage-card');
    cards.forEach((card, index) => {
      const cardPosition = card.getBoundingClientRect().top;
      const screenPosition = window.innerHeight / 1.3;
      
      if (cardPosition < screenPosition) {
        setTimeout(() => {
          card.classList.add('show');
        }, index * 100);
      }
    });
  };

  // Инициализация анимации карточек
  window.addEventListener('load', animateOnScroll);
  window.addEventListener('scroll', animateOnScroll);

  // Всплывающие уведомления
  function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type}`;
    alertDiv.textContent = message;
    
    document.body.appendChild(alertDiv);
    
    // Стили для уведомлений
    alertDiv.style.position = 'fixed';
    alertDiv.style.top = '20px';
    alertDiv.style.right = '20px';
    alertDiv.style.padding = '15px 20px';
    alertDiv.style.borderRadius = '5px';
    alertDiv.style.color = 'white';
    alertDiv.style.zIndex = '1000';
    alertDiv.style.animation = 'fadeIn 0.3s ease-out';
    alertDiv.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    
    if (type === 'error') {
      alertDiv.style.background = '#e74c3c';
    } else {
      alertDiv.style.background = '#2ecc71';
    }
    
    // Автоматическое исчезновение
    setTimeout(() => {
      alertDiv.style.animation = 'fadeOut 0.3s ease-out';
      setTimeout(() => alertDiv.remove(), 300);
    }, 3000);
  }

  // Калькулятор стоимости
  const orderCountInput = document.getElementById('order-count');
  if (orderCountInput) {
    orderCountInput.addEventListener('input', function() {
      const count = parseInt(this.value) || 0;
      let price = 40;
      
      if (count > 500) price = 30;
      else if (count > 100) price = 36;
      
      const result = count * price;
      document.getElementById('calculation-result').textContent = 
        result.toLocaleString('ru-RU');
    });
  }

  // Кнопка "Наверх"
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // ЧАТ ПОДДЕРЖКИ С ЗАЩИТОЙ
  const chatWidget = document.querySelector('.chat-widget');
  if (chatWidget) {
    const chatHeader = chatWidget.querySelector('.chat-header');
    const chatBody = chatWidget.querySelector('.chat-body');
    const chatMessages = chatWidget.querySelector('.chat-messages');
    const chatTextarea = chatWidget.querySelector('textarea');
    const sendBtn = chatWidget.querySelector('.send-btn');
    
    // Для отслеживания обработанных сообщений
    let processedMessages = new Set();
    let lastUpdateId = 0;
    
    chatHeader.addEventListener('click', () => {
      chatBody.style.display = chatBody.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // Автоматическое увеличение высоты textarea
    chatTextarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Отправка сообщения
    async function sendMessage() {
      const message = chatTextarea.value.trim();
      if (message) {
        // Добавление сообщения пользователя
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.innerHTML = `<div class="message-content">${message}</div>`;
        chatMessages.appendChild(messageDiv);
        
        chatTextarea.value = '';
        chatTextarea.style.height = 'auto';
        
        // Прокрутка к последнему сообщению
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Отправка в Telegram (с проверкой доступности бота)
        if (isTelegramReady) {
          const telegramMessage = `👤 <b>Сообщение от пользователя</b>\nID: ${userId}\n\n${message}`;
          const isSent = await sendToTelegram(telegramMessage);
          
          if (!isSent) {
            showAlert('Не удалось отправить сообщение. Попробуйте позже.', 'error');
          }
        } else {
          console.warn('Чат поддержки не может отправить сообщение: бот не настроен');
          showAlert('Чат временно недоступен. Пожалуйста, напишите нам в Telegram.', 'error');
        }
      }
    }
    
    // Отправка по кнопке
    sendBtn.addEventListener('click', sendMessage);
    
    // Отправка по Enter (без Shift)
    chatTextarea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
      }
    });
    
    // Проверка ответов каждые 15 секунд (только если бот настроен)
    if (isTelegramReady) {
      setInterval(async () => {
        try {
          // Параметр offset для получения только новых сообщений
          const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`;
          
          // Используем прокси для запроса
          const proxyUrls = [
            'https://corsproxy.io/?', 
            'https://api.codetabs.com/v1/proxy?quest=',
            'https://cors-anywhere.herokuapp.com/'
          ];
          
          let updates = null;
          
          for (const proxyUrl of proxyUrls) {
            try {
              const response = await fetch(proxyUrl + encodeURIComponent(url));
              const data = await response.json();
              
              if (data.ok) {
                updates = data;
                break;
              }
            } catch (error) {
              console.warn(`Ошибка получения сообщений через прокси ${proxyUrl}:`, error);
            }
          }
          
          if (!updates) {
            console.log('Пробуем прямую проверку сообщений...');
            try {
              const directResponse = await fetch(url);
              updates = await directResponse.json();
            } catch (directError) {
              console.warn('Прямая проверка сообщений не удалась:', directError);
              return;
            }
          }
          
          if (updates.ok && updates.result.length > 0) {
            // Обновляем lastUpdateId
            lastUpdateId = updates.result[updates.result.length - 1].update_id;
            
            // Обработка сообщений
            for (const update of updates.result) {
              if (update.message?.text?.includes(`/answer ${userId}`)) {
                const answer = update.message.text.replace(`/answer ${userId}`, '').trim();
                
                // Добавление ответа в чат
                const replyDiv = document.createElement('div');
                replyDiv.className = 'chat-message bot';
                replyDiv.innerHTML = `<div class="message-content">${answer}</div>`;
                chatMessages.appendChild(replyDiv);
                
                // Прокрутка к новому сообщению
                chatMessages.scrollTop = chatMessages.scrollHeight;
              }
            }
          }
        } catch (error) {
          console.error('Ошибка получения сообщений:', error);
        }
      }, 15000); // Проверка каждые 15 секунд
    } else {
      console.warn('Получение ответов в чате отключено: бот не настроен');
    }
  }

  // Обработчик кнопки "Получить расчет"
  const calculateBtn = document.getElementById('calculate-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function() {
      document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth'
      });
    });
  }

  // Анимация при наведении на кнопки
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // Анимация галереи
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.03)';
      this.style.zIndex = '10';
    });
    
    item.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
      this.style.zIndex = '1';
    });
  });
});
