document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const navContainer = document.getElementById('nav-container');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const mensagem = document.getElementById('mensagem').value;
      
      const textoWhatsApp = `*Novo Contato do Site*%0A%0A*Nome:* ${encodeURIComponent(nome)}%0A*E-mail:* ${encodeURIComponent(email)}%0A*Mensagem:* ${encodeURIComponent(mensagem)}`;
      
      window.open(`https://wa.me/5511964269198?text=${textoWhatsApp}`, '_blank');
    });
  }

  // Lógica para o menu hamburger
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (navToggle && navContainer) {
    navToggle.addEventListener('click', () => {
      navContainer.classList.toggle('show-menu');
    });
  }

  // Fecha o menu ao clicar em um link
  if (navMenu && navContainer) {
    navMenu.addEventListener('click', (e) => {
      if (e.target.classList.contains('nav__link')) {
        navContainer.classList.remove('show-menu');
      }
    });
  }

  // Lógica para animação ao rolar (Intersection Observer)
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1 // Anima quando 10% do elemento estiver visível
  });

  // Observa todas as seções e cards
  const elementsToAnimate = document.querySelectorAll('.hero, .about, .feature-card, .services, .contact');
  elementsToAnimate.forEach(el => observer.observe(el));


  // Lógica para destacar link do menu ao rolar (Scroll Spy)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.querySelector('.header');

  const handleHeaderScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  const onScroll = () => {
    const scrollY = window.scrollY;
    const headerHeight = document.querySelector('.header').offsetHeight; // Obtém a altura dinâmica do cabeçalho
    const offset = headerHeight + 20; // Offset: altura do cabeçalho + 20px para melhor visualização

    let activeSectionId = 'home';

    // Itera pelas seções de trás para frente para priorizar as que estão mais acima na tela
    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      const sectionBottom = section.offsetTop + section.offsetHeight;

      // Verifica se o topo da seção está dentro da área visível, considerando o offset
      if (scrollY + offset >= sectionTop && scrollY + offset < sectionBottom) {
        activeSectionId = section.id;
        break; // Encontrou a seção ativa, pode parar de verificar
      }
    }

    navLinks.forEach(link => {
      const sectionId = link.getAttribute('href').substring(1);
      link.classList.toggle('nav__link--active', sectionId === activeSectionId);
    });
  };
  window.addEventListener('scroll', () => {
    onScroll();
    handleHeaderScroll();
  });

  // ==========================================================
  // LÓGICA DO CHATBOT
  // ==========================================================
  const chatBubble = document.getElementById('chat-bubble');
  const chatWindow = document.getElementById('chat-window');
  const chatClose = document.getElementById('chat-close');
  const chatBody = document.getElementById('chat-body');
  const chatInput = document.getElementById('chat-input');
  const chatSend = document.getElementById('chat-send');

  if (chatBubble && chatWindow && chatClose) {
    chatBubble.addEventListener('click', () => {
      chatWindow.classList.toggle('open');
      if (chatWindow.classList.contains('open') && chatBody.children.length === 0) {
        startChat();
      }
    });
    chatClose.addEventListener('click', () => chatWindow.classList.remove('open'));
  }

  const conversation = [
    { question: "Olá! Sou o assistente virtual da LLSC. Para começar, qual o seu nome?", key: "name", type: "text" },
    { question: "Prazer, {name}! Agora, qual o seu melhor e-mail para contato?", key: "email", type: "text" },
    { question: "Ótimo. E qual o seu número de WhatsApp (com DDD)?", key: "whatsapp", type: "text" },
    { 
      question: "Obrigado! Em qual de nossos serviços você tem mais interesse?", 
      key: "service", 
      type: "options",
      options: ["Abertura de Empresas", "Planejamento Tributário", "Gestão de Pessoal", "Consultoria", "Outro"]
    },
    { 
      question: "Entendido. Você gostaria de adicionar alguma observação?", 
      key: "wantsObservation", 
      type: "options",
      options: ["Sim", "Não"]
    },
    { question: "Por favor, digite sua observação.", key: "message", type: "text", isConditional: true },
    { question: "Perfeito! Reuni todas as suas informações. Vou gerar um link para você enviar tudo diretamente para nosso WhatsApp. Basta clicar no link que aparecerá." }
  ];

  let currentStep = 0;
  const userData = {};

  const addMessage = (text, sender) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', sender);
    // Usa innerHTML para permitir que o link do WhatsApp seja renderizado
    // Isso é seguro aqui porque o conteúdo com HTML é controlado por nós
    messageElement.innerHTML = text;
    chatBody.appendChild(messageElement);
    chatBody.scrollTop = chatBody.scrollHeight; // Rola para a última mensagem
  };

  const startChat = () => {
    addMessage(conversation[currentStep].question, 'bot');
  };

  const showOptions = (options) => {
    const optionsContainer = document.createElement('div');
    optionsContainer.classList.add('chat-options');

    options.forEach(optionText => {
      const button = document.createElement('button');
      button.classList.add('chat-option-btn');
      button.textContent = optionText;
      button.addEventListener('click', () => handleOptionClick(optionText));
      optionsContainer.appendChild(button);
    });

    chatBody.appendChild(optionsContainer);
    chatBody.scrollTop = chatBody.scrollHeight;
    chatInput.disabled = true;
    chatSend.disabled = true;
  };

  const handleOptionClick = (optionText) => {
    addMessage(optionText, 'user');

    const currentQuestion = conversation[currentStep];
    if (currentQuestion && currentQuestion.key) {
      userData[currentQuestion.key] = optionText;
    }

    // Remove as opções após a escolha
    const optionsContainer = document.querySelector('.chat-options');
    if (optionsContainer) optionsContainer.remove();

    // Se a resposta for "Não" para a observação, pula para a finalização
    if (currentQuestion.key === 'wantsObservation' && optionText === 'Não') {
      userData.message = 'Nenhuma'; // Define uma mensagem padrão
      
      // Exibe a mensagem final do bot imediatamente
      addMessage(conversation[conversation.length - 1].question, 'bot');
      chatInput.disabled = true; // Desabilita o input
      chatSend.disabled = true; // Desabilita o botão de enviar

      // Gera e exibe o link do WhatsApp após 3 segundos
      generateAndShowWhatsappLink(3000);
      
      currentStep = conversation.length; // Marca a conversa como finalizada
    } else {
      proceedToNextStep();
    }
  };

  const handleUserInput = () => {
    const userInput = chatInput.value.trim();
    if (!userInput) return;

    addMessage(userInput, 'user');

    // Salva a resposta do usuário de forma dinâmica
    const currentQuestion = conversation[currentStep];
    if (currentQuestion && currentQuestion.key) userData[currentQuestion.key] = userInput;
    
    proceedToNextStep();
  };

  const proceedToNextStep = () => {
    chatInput.value = '';
    currentStep++;

    const nextStep = conversation[currentStep];

    if (nextStep) {
      let nextQuestionText = nextStep.question;
      if (nextQuestionText.includes('{name}')) {
        nextQuestionText = nextQuestionText.replace('{name}', userData.name.split(' ')[0]);
      }      
      setTimeout(() => {
        addMessage(nextQuestionText, 'bot');
        if (nextStep.type === 'options') {
          showOptions(nextStep.options);
        } else {
          chatInput.disabled = false;
          chatSend.disabled = false;
        }
      }, 500);
    } else if (currentStep === conversation.length) { // A conversa terminou, agora exibe o link
      chatInput.disabled = true; // Desabilita o input
      chatSend.disabled = true; // Desabilita o botão de enviar
      generateAndShowWhatsappLink(3000); // Gera e exibe o link do WhatsApp após 3 segundos
    } else {
      // Este else deve ser atingido apenas se houver um erro lógico ou se a conversa for muito curta.
      // Para garantir que o link sempre apareça, podemos chamar aqui também, mas o ideal é que o fluxo
      // sempre caia no `if (nextStep)` ou no `else if (currentStep === conversation.length)`.
      generateAndShowWhatsappLink(0); // Exibe imediatamente em caso de fluxo inesperado
    }
  };

  const generateAndShowWhatsappLink = (delay) => {
    const textoWhatsApp = `*Contato via Assistente Virtual*%0A%0A*Nome:* ${encodeURIComponent(userData.name)}%0A*E-mail:* ${encodeURIComponent(userData.email)}%0A*WhatsApp:* ${encodeURIComponent(userData.whatsapp)}%0A*Interesse:* ${encodeURIComponent(userData.service)}%0A*Observação:* ${encodeURIComponent(userData.message)}`;
    const whatsappUrl = `https://wa.me/5511964269198?text=${textoWhatsApp}`;
    setTimeout(() => {
      const linkMessage = `Clique aqui para enviar: <a href="${whatsappUrl}" target="_blank"><strong>Abrir WhatsApp</strong></a>`;
      const messageElement = document.createElement('div');
      messageElement.classList.add('chat-message', 'bot');
      messageElement.innerHTML = linkMessage;
      chatBody.appendChild(messageElement);
      chatBody.scrollTop = chatBody.scrollHeight;
    }, delay);
  }

  chatSend.addEventListener('click', handleUserInput);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleUserInput();
  });
});