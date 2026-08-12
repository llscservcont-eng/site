document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  const navContainer = document.getElementById('nav-container');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const telefone = document.getElementById('telefone').value;
      const mensagem = document.getElementById('mensagem').value;
      
      const textoWhatsApp = `*Novo Contato do Site*%0A%0A*Nome:* ${encodeURIComponent(nome)}%0A*E-mail:* ${encodeURIComponent(email)}%0A*Telefone:* ${encodeURIComponent(telefone)}%0A*Mensagem:* ${encodeURIComponent(mensagem)}`;
      
      window.open(`https://wa.me/5511982511791?text=${textoWhatsApp}`, '_blank');
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
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Deixa de observar após animar
      }
    });
  }, {
    threshold: 0.1 // Anima quando 10% do elemento estiver visível
  });

  // Aplica animação escalonada (stagger)
  const elementsToAnimate = document.querySelectorAll('.hero__brand-card, .cta-plans, .about, .feature-card, .services, .service-item, .news, .simulators, .faq, .contact');
  elementsToAnimate.forEach((el, index) => {
    el.style.transitionDelay = `${index * 50}ms`;
    observer.observe(el);
  });

  // Lógica do carrossel de Notícias (mostra 1 notícia por vez)
  const newsTrack = document.getElementById('newsTrack');
  const newsPrevBtn = document.getElementById('newsPrev');
  const newsNextBtn = document.getElementById('newsNext');
  const newsDotsContainer = document.getElementById('newsDots');
  const newsCarousel = document.querySelector('.news__carousel');

  if (newsTrack && newsPrevBtn && newsNextBtn && newsDotsContainer) {
    const newsSlides = Array.from(newsTrack.children);
    let newsCurrentIndex = 0;
    let newsAutoplayId = null;
    const NEWS_AUTOPLAY_DELAY = 7000;

    // Cria os indicadores (dots), um para cada notícia
    newsSlides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('news__dot');
      dot.setAttribute('aria-label', `Ir para notícia ${index + 1}`);
      dot.addEventListener('click', () => {
        goToNewsSlide(index);
        restartNewsAutoplay();
      });
      newsDotsContainer.appendChild(dot);
    });
    const newsDots = Array.from(newsDotsContainer.children);

    function getSlideWidth() {
      return newsTrack.parentElement.getBoundingClientRect().width;
    }

    function goToNewsSlide(index) {
      newsCurrentIndex = (index + newsSlides.length) % newsSlides.length;
      const offset = getSlideWidth() * newsCurrentIndex;
      newsTrack.style.transform = `translateX(-${offset}px)`;
      newsDots.forEach((dot, i) => {
        dot.classList.toggle('active', i === newsCurrentIndex);
      });
    }

    // Recalcula a posição ao redimensionar a janela
    window.addEventListener('resize', () => {
      newsTrack.style.transition = 'none';
      goToNewsSlide(newsCurrentIndex);
      requestAnimationFrame(() => {
        newsTrack.style.transition = '';
      });
    });

    function startNewsAutoplay() {
      newsAutoplayId = setInterval(() => {
        goToNewsSlide(newsCurrentIndex + 1);
      }, NEWS_AUTOPLAY_DELAY);
    }

    function stopNewsAutoplay() {
      clearInterval(newsAutoplayId);
    }

    function restartNewsAutoplay() {
      stopNewsAutoplay();
      startNewsAutoplay();
    }

    newsPrevBtn.addEventListener('click', () => {
      goToNewsSlide(newsCurrentIndex - 1);
      restartNewsAutoplay();
    });

    newsNextBtn.addEventListener('click', () => {
      goToNewsSlide(newsCurrentIndex + 1);
      restartNewsAutoplay();
    });

    // Pausa o autoplay quando o usuário interage com o carrossel
    if (newsCarousel) {
      newsCarousel.addEventListener('mouseenter', stopNewsAutoplay);
      newsCarousel.addEventListener('mouseleave', startNewsAutoplay);
    }

    // Suporte a swipe (arrastar) no mobile
    let newsTouchStartX = 0;
    let newsTouchEndX = 0;

    newsTrack.addEventListener('touchstart', (e) => {
      newsTouchStartX = e.changedTouches[0].screenX;
      stopNewsAutoplay();
    }, { passive: true });

    newsTrack.addEventListener('touchend', (e) => {
      newsTouchEndX = e.changedTouches[0].screenX;
      const deltaX = newsTouchEndX - newsTouchStartX;
      const SWIPE_THRESHOLD = 50;
      if (deltaX > SWIPE_THRESHOLD) {
        goToNewsSlide(newsCurrentIndex - 1);
      } else if (deltaX < -SWIPE_THRESHOLD) {
        goToNewsSlide(newsCurrentIndex + 1);
      }
      restartNewsAutoplay();
    }, { passive: true });

    goToNewsSlide(0);
    startNewsAutoplay();
  }

  // Lógica para o FAQ (acordeão - apenas um aberto por vez)
  const faqItems = document.querySelectorAll('.faq__item');

  faqItems.forEach(item => {
    item.addEventListener('toggle', (event) => {
      if (event.target.open) {
        faqItems.forEach(otherItem => {
          if (otherItem !== event.target) {
            otherItem.open = false;
          }
        });
      }
    });
  });

  // Lógica para animação de digitação na seção Hero
  const typewriter = (element, text, i = 0, callback) => {
    if (i < text.length) {
      element.innerHTML = text.substring(0, i + 1) + '<span class="typing-cursor"></span>';
      setTimeout(() => typewriter(element, text, i + 1, callback), 50);
    } else {
      // Remove o cursor piscando da linha atual antes de chamar o callback
      element.innerHTML = text;
      if (callback) {
        callback();
      }
    }
  };

  const heroSubtitle = document.querySelector('.hero__subtitle');
  const heroTitle = document.querySelector('.hero__title');
  const heroText = document.querySelector('.hero__text');

  const subtitleText = heroSubtitle.textContent;
  const titleText = heroTitle.textContent;
  const textText = heroText.textContent;

  // Limpa o conteúdo inicial
  heroSubtitle.textContent = '';
  heroTitle.textContent = '';
  heroText.textContent = '';

  const TYPEWRITER_LOOP_DELAY = 10000; // Tempo parado antes de reiniciar a animação (10s)

  // Executa a sequência de digitação e, ao terminar, agenda a repetição
  const runTypewriterSequence = () => {
    heroSubtitle.style.opacity = 1;
    typewriter(heroSubtitle, subtitleText, 0, () => {
      heroTitle.style.opacity = 1;
      typewriter(heroTitle, titleText, 0, () => {
        heroText.style.opacity = 1;
        typewriter(heroText, textText, 0, () => {
          // Aguarda o tempo definido e reinicia a animação do zero
          setTimeout(() => {
            heroSubtitle.textContent = '';
            heroTitle.textContent = '';
            heroText.textContent = '';
            runTypewriterSequence();
          }, TYPEWRITER_LOOP_DELAY);
        });
      });
    });
  };

  // Inicia a animação em sequência
  setTimeout(runTypewriterSequence, 500); // Delay inicial


  // Lógica para destacar link do menu ao rolar (Scroll Spy)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.querySelector('.header');

  const onScroll = () => {
    const scrollY = window.scrollY;
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    const offset = header.offsetHeight + 50;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - offset;
      const sectionId = current.getAttribute('id');
      const navLink = document.querySelector(`.nav__link[href*=${sectionId}]`);

      if (navLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLink.classList.add('nav__link--active');
        } else {
          navLink.classList.remove('nav__link--active');
        }
      }
    });

    // Corrige a última seção (Fale Conosco): como não há espaço para rolar
    // além dela, o cálculo acima pode nunca ser satisfeito. Forçamos a
    // ativação do último link ao chegar perto do fim da página.
    const isNearBottom = window.innerHeight + scrollY >= document.documentElement.scrollHeight - 2;
    if (isNearBottom && sections.length) {
      const lastSection = sections[sections.length - 1];
      const lastId = lastSection.getAttribute('id');
      const lastNavLink = document.querySelector(`.nav__link[href*=${lastId}]`);
      if (lastNavLink) {
        navLinks.forEach(link => link.classList.remove('nav__link--active'));
        lastNavLink.classList.add('nav__link--active');
      }
    }
  };
  window.addEventListener('scroll', () => {
    onScroll();
  });

  // ==========================================================
  // LÓGICA DOS SIMULADORES
  // ==========================================================
  const tabButtons = document.querySelectorAll('.simulators__tab-btn');
  const tabPanes = document.querySelectorAll('.simulator__pane');

  if (tabButtons.length > 0) {
    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons and panes
        tabButtons.forEach(btn => btn.classList.remove('active'));
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Add active class to the clicked button
        button.classList.add('active');

        // Show the corresponding pane
        const tabId = button.getAttribute('data-tab');
        const paneToShow = document.getElementById(`pane-${tabId}`);
        if (paneToShow) {
          paneToShow.classList.add('active');
        }
      });
    });
  }

  // --- LÓGICA DO SIMULADOR DE SIMPLES NACIONAL ---
  const faturamentoMensalInput = document.getElementById('faturamentoMensal');
  const tipoAtividadeSelect = document.getElementById('tipoAtividade');
  const folhaPagamentoGroup = document.getElementById('folhaPagamentoGroup');
  const calcularSimplesBtn = document.getElementById('calcularSimples');
  const impostoEstimadoSpan = document.getElementById('impostoEstimado');
  const aliquotaEfetivaSpan = document.getElementById('aliquotaEfetiva');

  const formatCurrency = (value) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  let ultimoCalculoSimples = {}; // Armazena o último cálculo do Simples Nacional
  let ultimoCalculoSalario = {}; // Armazena o último cálculo de Salário Líquido
  let ultimoCalculoFerias = {}; // Armazena o último cálculo de Férias

  const parseFormattedCurrency = (value) => {
    if (!value) return 0;
    return parseFloat(value.replace(/\./g, '').replace(',', '.')) || 0;
  };

  // Função para formatar o campo de faturamento mensal
  const formatCurrencyField = (input) => {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value) {
        let numberValue = (parseInt(value, 10) / 100).toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        e.target.value = numberValue;
      } else {
        e.target.value = '';
      }
    });
  };

  // Aplica a formatação de moeda aos campos relevantes
  const currencyFields = [
    document.getElementById('faturamentoMensal'),
    document.getElementById('salarioBruto'),
    document.getElementById('outrosDescontos'),
    document.getElementById('feriasSalarioBruto')
  ];
  currencyFields.forEach(field => field && formatCurrencyField(field));



  const calcularSalarioLiquido = () => {
    const salarioBruto = parseFormattedCurrency(document.getElementById('salarioBruto').value);
    const dependentes = parseInt(document.getElementById('numeroDependentes').value) || 0;
    const outrosDescontos = parseFormattedCurrency(document.getElementById('outrosDescontos').value);



    // Tabela INSS 2026 Oficial (Progressiva com parcela a deduzir)
    let descontoINSS = 0;
    if (salarioBruto <= 1621.00) descontoINSS = salarioBruto * 0.075;
    else if (salarioBruto <= 2902.84) descontoINSS = (salarioBruto * 0.09) - 24.32;
    else if (salarioBruto <= 4354.27) descontoINSS = (salarioBruto * 0.12) - 111.40;
    else if (salarioBruto <= 8475.55) descontoINSS = (salarioBruto * 0.14) - 198.49;
    else descontoINSS = 988.09; // Teto de contribuição

    // Etapa A: Determinar a Base de Cálculo Tradicional
    // Utiliza-se o abatimento que for mais vantajoso ao colaborador.
    const deducaoPorDependente = dependentes * 189.59;
    const descontoSimplificado = 607.20; // Valor do desconto simplificado mensal conforme sua informação

    const baseComDeducoesLegais = salarioBruto - descontoINSS - deducaoPorDependente;
    const baseComDescontoSimplificado = salarioBruto - descontoSimplificado;

    // A base de cálculo do IRPF (para a tabela progressiva) é o menor valor entre as duas bases calculadas,
    // garantindo que não seja negativo.
    let baseCalculoIRPF = Math.max(0, Math.min(baseComDeducoesLegais, baseComDescontoSimplificado));

    let descontoIRPF = 0;

    // Etapa B: Calcular o Imposto Bruto (IRRF Inicial) usando a Tabela Progressiva
    let irrfInicial = 0; // Imposto Bruto antes da redução
    if (baseCalculoIRPF <= 2428.80) { // Até R$ 2.428,80: Isento
        irrfInicial = 0;
    } else if (baseCalculoIRPF <= 2826.65) { // R$ 2.428,81 a R$ 2.826,65: 7,5% (Dedução: R$ 182,16)
        irrfInicial = (baseCalculoIRPF * 0.075) - 182.16;
    } else if (baseCalculoIRPF <= 3751.05) { // R$ 2.826,66 a R$ 3.751,05: 15,0% (Dedução: R$ 394,16)
        irrfInicial = (baseCalculoIRPF * 0.15) - 394.16;
    } else if (baseCalculoIRPF <= 4664.68) { // R$ 3.751,06 a R$ 4.664,68: 22,5% (Dedução: R$ 675,49)
        irrfInicial = (baseCalculoIRPF * 0.225) - 675.49;
    } else { // Acima de R$ 4.664,68: 27,5% (Dedução: R$ 908,73)
        irrfInicial = (baseCalculoIRPF * 0.275) - 908.73;
    }
    irrfInicial = Math.max(0, irrfInicial); // Garante que o IRRF Inicial não seja negativo

    // Variável para armazenar o redutor aplicado
    let redutorAplicado = 0;

    // Etapa C: Aplicar a Redução Adicional (baseada no Rendimento Tributável = salarioBruto)
    let irrfFinal = irrfInicial; // Começa com o imposto bruto

    if (salarioBruto <= 5000.00) {
        // Faixa de Rendimento Tributável Até R$ 5.000,00: Redução total, IRRF Final = R$ 0,00 (Isento)
        irrfFinal = 0;
    } else if (salarioBruto > 5000.00 && salarioBruto <= 7350.00) {
        // Faixa de Rendimento Tributável De R$ 5.001,01 a R$ 7.350,00
        const redutor = 978.62 - (0.133145 * salarioBruto); // Usa salarioBruto como Rendimento Tributável
        redutorAplicado = redutor; // Armazena o redutor
        irrfFinal = irrfInicial - redutor;
        irrfFinal = Math.max(0, irrfFinal); // Garante que o imposto final não seja negativo
    } else if (salarioBruto > 7350.00) { // Acima de R$ 7.350,00
        // Sem redução (Zero), IRRF Final = IRRF Inicial
        redutorAplicado = 0; // Não há redutor
    }
    descontoIRPF = irrfFinal;

    // Garante que o salário líquido não seja negativo
    const salarioLiquido = Math.max(0, salarioBruto - descontoINSS - descontoIRPF - outrosDescontos);

    // Armazena os valores para o PDF
    // Adiciona baseCalculoIRPF, irrfInicial e redutorAplicado
    ultimoCalculoSalario = {
      salarioBruto,
      descontoINSS,
      baseCalculoIRPF,
      irrfInicial,
      redutorAplicado,
      descontoIRPF,
      outrosDescontos,
      salarioLiquido
    };

    document.getElementById('resSalarioBruto').textContent = formatCurrency(salarioBruto);
    document.getElementById('resDescontoINSS').textContent = formatCurrency(descontoINSS);
    document.getElementById('resDescontoIRPF').textContent = formatCurrency(descontoIRPF < 0 ? 0 : descontoIRPF);
    document.getElementById('resOutrosDescontos').textContent = formatCurrency(outrosDescontos);
    document.getElementById('resSalarioLiquido').textContent = formatCurrency(salarioLiquido < 0 ? 0 : salarioLiquido);

    // Mostra o botão de download
    const downloadBtn = document.getElementById('downloadSalarioPDF');
    if (downloadBtn) downloadBtn.style.display = 'block';

  }; // Fim da função calcularSalarioLiquido

  if (calcularSimplesBtn) {
    calcularSimplesBtn.addEventListener('click', () => {
      const faturamentoMensal = parseFormattedCurrency(faturamentoMensalInput.value);
      const tipoAtividade = tipoAtividadeSelect.value;
      
      if (parseFormattedCurrency(faturamentoMensalInput.value) <= 0) {
        alert('Por favor, preencha o Faturamento Mensal.');
        return;
      }

      let aliquotaNominal = 0;
      let parcelaDeduzir = 0;
      let impostoCalculado = 0;
      let aliquotaEfetiva = 0;

      switch (tipoAtividade) {
        case 'anexo1': // Comércio
          aliquotaNominal = 0.04; // Exemplo: 4% para a primeira faixa
          parcelaDeduzir = 0; // Exemplo
          break;
        case 'anexo2': // Indústria
          aliquotaNominal = 0.045; // Exemplo: 4.5% para a primeira faixa
          parcelaDeduzir = 0; // Exemplo
          break;
        case 'anexo3': // Serviços
          aliquotaNominal = 0.06; // Exemplo: 6% para a primeira faixa
          parcelaDeduzir = 0; // Exemplo
          break;
        case 'anexo4': // Serviços (Ex: Academias, Clínicas)
          aliquotaNominal = 0.045; // Exemplo: 4.5% para a primeira faixa
          parcelaDeduzir = 0; // Exemplo
          break;
        case 'anexo5': // Serviços
          aliquotaNominal = 0.155; // Exemplo: 15.5% para a primeira faixa
          parcelaDeduzir = 0; // Exemplo
          break;
        default:
          alert('Selecione um tipo de atividade válido.');
          return;
      }

      // Cálculo simplificado: Imposto = Faturamento Mensal * Alíquota Nominal
      impostoCalculado = faturamentoMensal * aliquotaNominal;
      aliquotaEfetiva = aliquotaNominal * 100; // Converte para percentual

      // Imposto Mensal = Faturamento Mensal * Alíquota Efetiva
      impostoEstimadoSpan.textContent = `R$ ${impostoCalculado.toFixed(2).replace('.', ',')}`;
      aliquotaEfetivaSpan.textContent = `${aliquotaEfetiva.toFixed(2).replace('.', ',')}%`;

      // Armazena os valores para o PDF
      ultimoCalculoSimples = { 
        faturamentoMensal,
        tipoAtividade, // Usa o anexo selecionado diretamente
        aliquotaNominal,
        parcelaDeduzir, 
        impostoCalculado, 
        aliquotaEfetiva // Já está em percentual
      };
      // Mostra o botão de download
      const downloadBtn = document.getElementById('downloadSimplesPDF');
      if (downloadBtn) downloadBtn.style.display = 'block';
    });
  }

  // --- LÓGICA DO SIMULADOR DE SALÁRIO LÍQUIDO ---
  const calcularSalarioBtn = document.getElementById('calcularSalario');
  if (calcularSalarioBtn) {
    calcularSalarioBtn.addEventListener('click', calcularSalarioLiquido);
  }

  // --- LÓGICA DO SIMULADOR DE FÉRIAS ---
  const calcularFeriasBtn = document.getElementById('calcularFerias');
  if (calcularFeriasBtn) {
    calcularFeriasBtn.addEventListener('click', () => {
      const salarioBruto = parseFormattedCurrency(document.getElementById('feriasSalarioBruto').value);
      const diasFerias = parseInt(document.getElementById('feriasDias').value) || 30;
      const dependentes = parseInt(document.getElementById('feriasDependentes').value) || 0;
      const venderFerias = document.getElementById('venderFerias').checked;
      const adiantar13 = document.getElementById('adiantar13').checked;

      if (salarioBruto <= 0) {
        alert('Por favor, insira um valor de salário bruto válido.');
        return;
      }

      // --- Cálculos dos Proventos ---
      const valorFerias = (salarioBruto / 30) * diasFerias;
      const tercoConstitucional = valorFerias / 3;
      
      let abonoPecuniario = 0;
      let tercoAbono = 0;
      if (venderFerias) {
        const diasVendidos = diasFerias / 3;
        abonoPecuniario = (salarioBruto / 30) * diasVendidos;
        tercoAbono = abonoPecuniario / 3;
      }

      let adiantamento13 = 0;
      if (adiantar13) {
        adiantamento13 = salarioBruto / 2;
      }

      const totalBrutoFerias = valorFerias + tercoConstitucional + abonoPecuniario + tercoAbono + adiantamento13;

      // --- Cálculos dos Descontos ---
      // INSS é calculado separadamente para Férias e 13º. Abono é isento.
      const baseINSSFerias = valorFerias + tercoConstitucional;
      let inssFerias = 0;
      if (baseINSSFerias <= 1621.00) inssFerias = baseINSSFerias * 0.075;
      else if (baseINSSFerias <= 2902.84) inssFerias = (baseINSSFerias * 0.09) - 24.32;
      else if (baseINSSFerias <= 4354.27) inssFerias = (baseINSSFerias * 0.12) - 111.40;
      else if (baseINSSFerias <= 8475.55) inssFerias = (baseINSSFerias * 0.14) - 198.49;
      else inssFerias = 988.09;

      let inss13 = 0;
      if (adiantamento13 > 0) {
        // O INSS sobre o 13º só é descontado no pagamento da 2ª parcela, mas para fins de simulação, calculamos aqui.
        if (adiantamento13 <= 1621.00) inss13 = adiantamento13 * 0.075;
        else if (adiantamento13 <= 2902.84) inss13 = (adiantamento13 * 0.09) - 24.32;
        // ... e assim por diante. Simplificando para a simulação.
      }
      const totalINSS = inssFerias + inss13;

      // IRPF também é calculado separadamente. Abono é isento.
      const baseIRPFFerias = baseINSSFerias - inssFerias - (dependentes * 189.59);
      let irpfFerias = 0;
      if (baseIRPFFerias > 2259.20 && baseIRPFFerias <= 2826.65) irpfFerias = (baseIRPFFerias * 0.075) - 169.44;
      else if (baseIRPFFerias <= 3751.05) irpfFerias = (baseIRPFFerias * 0.15) - 381.44;
      else if (baseIRPFFerias <= 4664.68) irpfFerias = (baseIRPFFerias * 0.225) - 662.77;
      else if (baseIRPFFerias > 4664.68) irpfFerias = (baseIRPFFerias * 0.275) - 896.00;
      irpfFerias = Math.max(0, irpfFerias);

      const totalIRPF = irpfFerias; // IRPF sobre 13º também é na 2ª parcela.

      const totalDescontos = totalINSS + totalIRPF;
      const liquidoReceber = totalBrutoFerias - totalDescontos;

      // --- Exibir Resultados ---
      document.getElementById('resFeriasBruto').textContent = formatCurrency(totalBrutoFerias);
      document.getElementById('resFeriasINSS').textContent = formatCurrency(totalINSS);
      document.getElementById('resFeriasIRPF').textContent = formatCurrency(totalIRPF);
      document.getElementById('resFeriasLiquido').textContent = formatCurrency(liquidoReceber);

      // Armazena para o PDF
      ultimoCalculoFerias = {
        salarioBruto, diasFerias, valorFerias, tercoConstitucional,
        abonoPecuniario, tercoAbono, adiantamento13, totalBrutoFerias,
        totalINSS, totalIRPF, liquidoReceber
      };

      const downloadBtn = document.getElementById('downloadFeriasPDF');
      if (downloadBtn) downloadBtn.style.display = 'block';
    });
  }

  // --- LÓGICA PARA DOWNLOAD DO PDF DE FÉRIAS ---
  const downloadFeriasBtn = document.getElementById('downloadFeriasPDF');
  if (downloadFeriasBtn) {
    downloadFeriasBtn.addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const data = new Date().toLocaleDateString('pt-BR');

      // Cores da marca
      const navyColor = '#0C1424';
      const goldColor = '#C9A24A';
      const whiteColor = '#FFFFFF';
      const textColor = '#333333';

      // Cabeçalho
      doc.setFillColor(navyColor);
      doc.rect(0, 0, 210, 40, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(goldColor);
      doc.text('LLSC', 20, 25);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(whiteColor);
      doc.text('Lucas Lima Serviços Contábeis', 20, 32);

      // Título
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(textColor);
      doc.text('Demonstrativo de Cálculo de Férias', 105, 55, { align: 'center' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Data da Simulação: ${data}`, 105, 62, { align: 'center' });

      // Linha
      doc.setLineWidth(0.5);
      doc.setDrawColor(goldColor);
      doc.line(20, 70, 190, 70);

      // Corpo
      doc.setTextColor(textColor);
      doc.setFontSize(12);
      let yPos = 80;

      doc.setFont('helvetica', 'bold');
      doc.text('1. Proventos', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      doc.text(`Férias (${ultimoCalculoFerias.diasFerias} dias):`, 30, yPos);
      doc.text(formatCurrency(ultimoCalculoFerias.valorFerias), 190, yPos, { align: 'right' });
      yPos += 7;
      doc.text('(+) 1/3 Constitucional sobre Férias:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoFerias.tercoConstitucional), 190, yPos, { align: 'right' });
      if (ultimoCalculoFerias.abonoPecuniario > 0) {
        yPos += 7;
        doc.text('(+) Abono Pecuniário (Venda de Férias):', 30, yPos);
        doc.text(formatCurrency(ultimoCalculoFerias.abonoPecuniario), 190, yPos, { align: 'right' });
        yPos += 7;
        doc.text('(+) 1/3 sobre Abono Pecuniário:', 30, yPos);
        doc.text(formatCurrency(ultimoCalculoFerias.tercoAbono), 190, yPos, { align: 'right' });
      }
      if (ultimoCalculoFerias.adiantamento13 > 0) {
        yPos += 7;
        doc.text('(+) Adiantamento 1ª Parcela 13º:', 30, yPos);
        doc.text(formatCurrency(ultimoCalculoFerias.adiantamento13), 190, yPos, { align: 'right' });
      }
      yPos += 15;

      doc.setFont('helvetica', 'bold');
      doc.text('2. Descontos', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      doc.text('(-) Desconto INSS sobre Férias:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoFerias.totalINSS), 190, yPos, { align: 'right' });
      yPos += 7;
      doc.text('(-) Desconto IRPF sobre Férias:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoFerias.totalIRPF), 190, yPos, { align: 'right' });
      yPos += 15;

      doc.setFont('helvetica', 'bold');
      doc.text('3. Resumo', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      doc.text('Total de Proventos:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoFerias.totalBrutoFerias), 190, yPos, { align: 'right' });
      yPos += 7;
      doc.text('Total de Descontos:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoFerias.totalINSS + ultimoCalculoFerias.totalIRPF), 190, yPos, { align: 'right' });
      yPos += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Líquido a Receber de Férias:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoFerias.liquidoReceber), 190, yPos, { align: 'right' });

      // Rodapé
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('*Este é um cálculo de simulação. Os valores podem variar. Consulte um especialista.', 105, yPos + 25, { align: 'center' });

      doc.save('demonstrativo-ferias.pdf');
    });
  }

  // --- LÓGICA PARA DOWNLOAD DO PDF DO SALÁRIO ---
  const downloadSalarioBtn = document.getElementById('downloadSalarioPDF');
  if (downloadSalarioBtn) {
    downloadSalarioBtn.addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const data = new Date().toLocaleDateString('pt-BR');

      // Cores da marca
      const navyColor = '#0C1424';
      const goldColor = '#C9A24A';
      const whiteColor = '#FFFFFF';
      const textColor = '#333333';

      // Cabeçalho
      doc.setFillColor(navyColor);
      doc.rect(0, 0, 210, 40, 'F'); // Desenha o retângulo do cabeçalho

      // Logo e Título no Cabeçalho
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(goldColor);
      doc.text('LLSC', 20, 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(whiteColor);
      doc.text('Lucas Lima Serviços Contábeis', 20, 32);

      // Título do Documento
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(textColor);
      doc.text('Demonstrativo de Salário Líquido', 105, 55, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Data da Simulação: ${data}`, 105, 62, { align: 'center' });

      // Linha separadora
      doc.setLineWidth(0.5);
      doc.setDrawColor(goldColor);
      doc.line(20, 70, 190, 70);

      // Corpo do demonstrativo
      doc.setTextColor(textColor);
      doc.setFontSize(12);
      let yPos = 80;

      // Seção de Proventos
      doc.setFont('helvetica', 'bold');
      doc.text('1. Proventos', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      doc.text('Salário Bruto:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoSalario.salarioBruto), 190, yPos, { align: 'right' });
      yPos += 15;

      // Seção de Descontos
      doc.setFont('helvetica', 'bold');
      doc.text('2. Descontos', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      doc.text('(-) Desconto INSS (Tabela Progressiva):', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoSalario.descontoINSS), 190, yPos, { align: 'right' });
      yPos += 10;

      doc.setFont('helvetica', 'bold');
      doc.text('Memória de Cálculo - IRPF', 30, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      doc.text('Base de Cálculo IRPF:', 40, yPos);
      doc.text(formatCurrency(ultimoCalculoSalario.baseCalculoIRPF), 190, yPos, { align: 'right' });
      yPos += 7;
      doc.text('IRPF Bruto (Tabela Progressiva):', 40, yPos);
      doc.text(formatCurrency(ultimoCalculoSalario.irrfInicial), 190, yPos, { align: 'right' });
      yPos += 7;
      doc.text('(-) Redutor Aplicado:', 40, yPos);
      doc.text(formatCurrency(ultimoCalculoSalario.redutorAplicado), 190, yPos, { align: 'right' });
      yPos += 10;

      doc.text('(-) Desconto IRPF (Final):', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoSalario.descontoIRPF), 190, yPos, { align: 'right' });
      yPos += 10;

      doc.text('(-) Outros Descontos:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoSalario.outrosDescontos), 190, yPos, { align: 'right' });
      yPos += 15;

      // Seção de Resumo
      doc.setFont('helvetica', 'bold');
      doc.text('3. Resumo', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      const totalDescontos = ultimoCalculoSalario.descontoINSS + ultimoCalculoSalario.descontoIRPF + ultimoCalculoSalario.outrosDescontos;
      doc.text('Total de Proventos:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoSalario.salarioBruto), 190, yPos, { align: 'right' });
      yPos += 7;
      doc.text('Total de Descontos:', 30, yPos);
      doc.text(formatCurrency(totalDescontos), 190, yPos, { align: 'right' });
      yPos += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Salário Líquido Estimado:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoSalario.salarioLiquido), 190, yPos, { align: 'right' });

      // Rodapé
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('*Este é um cálculo de simulação. Os valores podem variar. Consulte um especialista.', 105, yPos + 25, { align: 'center' });

      doc.save('demonstrativo-salario-liquido.pdf');
    });
  }

  // --- LÓGICA PARA DOWNLOAD DO PDF DO SIMPLES NACIONAL ---
  const downloadSimplesBtn = document.getElementById('downloadSimplesPDF');
  if (downloadSimplesBtn) {
    downloadSimplesBtn.addEventListener('click', () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      const data = new Date().toLocaleDateString('pt-BR');

      // Cores da marca
      const navyColor = '#0C1424';
      const goldColor = '#C9A24A';
      const whiteColor = '#FFFFFF';
      const textColor = '#333333';

      // Cabeçalho
      doc.setFillColor(navyColor);
      doc.rect(0, 0, 210, 40, 'F'); // Desenha o retângulo do cabeçalho

      // Logo e Título no Cabeçalho
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.setTextColor(goldColor);
      doc.text('LLSC', 20, 25);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(whiteColor);
      doc.text('Lucas Lima Serviços Contábeis', 20, 32);

      // Título do Documento
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(textColor);
      doc.text('Demonstrativo de Simples Nacional', 105, 55, { align: 'center' });

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Data da Simulação: ${data}`, 105, 62, { align: 'center' });

      // Linha separadora
      doc.setLineWidth(0.5);
      doc.setDrawColor(goldColor);
      doc.line(20, 70, 190, 70);

      // Corpo do demonstrativo
      doc.setTextColor(textColor);
      doc.setFontSize(12);
      let yPos = 80;

      // Seção de Dados Iniciais
      doc.setFont('helvetica', 'bold');
      doc.text('1. Dados Iniciais', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      doc.text('Faturamento Mensal:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoSimples.faturamentoMensal), 190, yPos, { align: 'right' });
      yPos += 7;
      doc.text('Tipo de Atividade:', 30, yPos);
      doc.text(ultimoCalculoSimples.tipoAtividade, 190, yPos, { align: 'right' });
      yPos += 15;

      // Seção Memória de Cálculo
      doc.setFont('helvetica', 'bold');
      doc.text('2. Memória de Cálculo (Simulado)', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      doc.text('Alíquota Aplicada:', 30, yPos);
      doc.text(`${(ultimoCalculoSimples.aliquotaNominal * 100).toFixed(2).replace('.', ',')}%`, 190, yPos, { align: 'right' });
      yPos += 7;
      // Removido o cálculo do Fator R
      yPos += 7;
      doc.setFont('helvetica', 'normal');
      doc.text('(-) Parcela a Deduzir da Faixa:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoSimples.parcelaDeduzir), 190, yPos, { align: 'right' });
      yPos += 15;

      // Seção de Resumo
      doc.setFont('helvetica', 'bold');
      doc.text('3. Resumo', 20, yPos);
      doc.setFont('helvetica', 'normal');
      yPos += 7;
      doc.text('Imposto Estimado:', 30, yPos);
      doc.text(formatCurrency(ultimoCalculoSimples.impostoCalculado), 190, yPos, { align: 'right' });
      yPos += 10;
      doc.setFont('helvetica', 'bold');
      doc.text('Alíquota Efetiva Final:', 30, yPos);
      doc.text(`${ultimoCalculoSimples.aliquotaEfetiva.toFixed(2).replace('.', ',')}%`, 190, yPos, { align: 'right' });

      // Rodapé
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.text('*Este é um cálculo de simulação simplificado. Os valores podem variar. Consulte um especialista.', 105, yPos + 25, { align: 'center' });

      doc.save('demonstrativo-simples-nacional.pdf');
    });
  }

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
    const textoWhatsApp = `*Contato via Assistente Virtual*%0A%0A*Nome:* ${encodeURIComponent(userData.name)}%0A*E-mail:* ${encodeURIComponent(userData.email)}%0A*WhatsApp:* ${encodeURIComponent(userData.whatsapp)}%0A*Interesse:* ${encodeURIComponent(userData.service)}%0A*Observação:* ${encodeURIComponent(userData.message || 'Nenhuma')}`;
    const whatsappUrl = `https://wa.me/5511982511791?text=${textoWhatsApp}`;
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