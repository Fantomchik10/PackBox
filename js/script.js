document.addEventListener('DOMContentLoaded', function() {
  // ===== Мобильное меню =====
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.querySelector('.nav-menu');
  
  mobileMenuToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('no-scroll');
  });

  // Закрытие меню при клике на ссылку
  document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenuToggle.classList.remove('active');
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
      if (!data.name || !data.telephone) {
        showAlert('Пожалуйста, заполните обязательные поля', 'error');
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

  // ===== Прогресс-бар прокрутки =====
  window.addEventListener('scroll', () => {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    document.querySelector('.scroll-progress').style.width = `${scrolled}%`;
  });

  // ===== Чат поддержки =====
  const chatWidget = document.querySelector('.chat-widget');
  if (chatWidget) {
    const chatHeader = chatWidget.querySelector('.chat-header');
    const chatBody = chatWidget.querySelector('.chat-body');
    
    chatHeader.addEventListener('click', () => {
      chatBody.style.display = chatBody.style.display === 'block' ? 'none' : 'block';
    });
    
    // Отправка сообщения (заглушка)
    chatWidget.querySelector('button').addEventListener('click', function() {
      const message = chatWidget.querySelector('textarea').value;
      if (message.trim()) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'chat-message user';
        messageDiv.textContent = message;
        chatBody.insertBefore(messageDiv, chatBody.lastElementChild);
        chatWidget.querySelector('textarea').value = '';
        
        // Имитация ответа
        setTimeout(() => {
          const replyDiv = document.createElement('div');
          replyDiv.className = 'chat-message bot';
          replyDiv.textContent = 'Спасибо за сообщение! Мы ответим в ближайшее время.';
          chatBody.insertBefore(replyDiv, chatBody.lastElementChild);
          chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);
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
});

// ===== Анимация чисел (если нужно) =====
function animateValue(id, start, end, duration) {
  const obj = document.getElementById(id);
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerHTML = Math.floor(progress * (end - start) + start);
    if (progress < 1) window.requestAnimationFrame(step);
  };
  window.requestAnimationFrame(step);
}