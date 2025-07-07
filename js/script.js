document.addEventListener('DOMContentLoaded', function() {
  // ===== Мобильное меню =====
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

  // ===== Плавная прокрутка для навигации =====
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

  // ===== Подсветка активного раздела при скролле =====
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

  // ===== Обработка формы обратной связи =====
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
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
      
      // Здесь должна быть отправка на сервер
      showAlert('Ваше сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
      this.reset();
    });
  }

  // ===== Раскрывающиеся FAQ =====
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

  // ===== Липкая навигация при скролле =====
  window.addEventListener('scroll', function() {
    const nav = document.querySelector('.floating-nav');
    if (window.scrollY > 100) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // ===== Анимация карточек при появлении =====
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

  // ===== Всплывающие уведомления =====
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

  // ===== Калькулятор стоимости =====
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

  // ===== Кнопка "Наверх" =====
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

  // ===== ОБНОВЛЕННЫЙ ЧАТ ПОДДЕРЖКИ =====
  const chatWidget = document.querySelector('.chat-widget');
  if (chatWidget) {
    const chatHeader = chatWidget.querySelector('.chat-header');
    const chatBody = chatWidget.querySelector('.chat-body');
    const chatMessages = chatWidget.querySelector('.chat-messages');
    const chatTextarea = chatWidget.querySelector('textarea');
    const sendBtn = chatWidget.querySelector('.send-btn');
    
    chatHeader.addEventListener('click', () => {
      chatBody.style.display = chatBody.style.display === 'flex' ? 'none' : 'flex';
    });
    
    // Автоматическое увеличение высоты textarea
    chatTextarea.addEventListener('input', function() {
      this.style.height = 'auto';
      this.style.height = (this.scrollHeight) + 'px';
    });
    
    // Отправка сообщения
    function sendMessage() {
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
        
        // Имитация ответа бота
        setTimeout(() => {
          const replyDiv = document.createElement('div');
          replyDiv.className = 'chat-message bot';
          replyDiv.innerHTML = '<div class="message-content">Спасибо за сообщение! Мы ответим в ближайшее время.</div>';
          chatMessages.appendChild(replyDiv);
          
          // Прокрутка к новому сообщению
          chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
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
  }

  // ===== Обработчик кнопки "Получить расчет" =====
  const calculateBtn = document.getElementById('calculate-btn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', function() {
      document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth'
      });
    });
  }

  // ===== Анимация при наведении на кнопки =====
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-3px)';
    });
    btn.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });

  // ===== Анимация галереи =====
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