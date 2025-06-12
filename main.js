document.addEventListener('DOMContentLoaded', () => {
    let currentSlideIndex = 0;
    const slides = document.querySelectorAll('.timeline-slide');
    const totalSlides = slides.length;

    const timelineQuote = document.getElementById('timelineQuote');
    const timelineDescription = document.getElementById('timelineDescription');
    const progressBar = document.getElementById('progressBar');
    const indicatorsContainer = document.getElementById('indicators');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const musicToggleBtn = document.getElementById('musicToggle');
    const backgroundMusic = document.getElementById('backgroundMusic');

    let autoplayInterval;
    let progressBarInterval;
    const slideDuration = 6000; // 6 segundos por slide

    // Conteúdo (citação e descrição) para cada slide
    const timelineContent = [
        {
            quote: "Cada segundo ao seu lado é poesia.",
            description: "Desde o primeiro encontro, soubemos que nossa história seria única. Um capítulo após o outro, construímos um laço que transcende o tempo, preenchido com risos, aprendizados e um amor que se renova a cada amanhecer."
        },
        {
            quote: "Onde o coração encontra seu lar.",
            description: "Em cada olhar, em cada toque, a certeza de que encontramos nosso lar um no outro. Nossa jornada é um eterno reencontro, onde a alma reconhece seu par e a vida ganha um novo e belo sentido."
        },
        {
            quote: "Nossa melodia em constante harmonia.",
            description: "Como notas de uma canção, nossos dias se entrelaçam em uma melodia suave e envolvente. Cada acorde, cada silêncio, contribui para a sinfonia perfeita do nosso amor, tocando a alma e enchendo o coração."
        },
        {
            quote: "Rindo, amando, crescendo juntos.",
            description: "Atravessamos esta vida de mãos dadas, rindo das pequenas loucuras, aprendendo com cada desafio e celebrando cada vitória. Juntos, a evolução é constante e o amor, o maior combustível para ir além."
        },
        {
            quote: "Infinito é só o começo do que somos.",
            description: "Nosso futuro é uma tela em branco, esperando para ser pintada com as cores vibrantes dos nossos sonhos. Com você, cada passo é um novo horizonte, e o infinito se torna apenas o ponto de partida da nossa história."
        }
    ];

    // --- Funções do Slider ---

    // Cria os pontos indicadores na parte inferior
    function createIndicators() {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('indicator-dot');
            if (i === currentSlideIndex) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => goToSlide(i));
            indicatorsContainer.appendChild(dot);
        }
    }

    // Atualiza o estado dos pontos indicadores
    function updateIndicators() {
        document.querySelectorAll('.indicator-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlideIndex);
        });
    }

    // Exibe o slide e o conteúdo correspondente
    function showSlide(index) {
        // Garante que o índice esteja dentro dos limites
        currentSlideIndex = (index + totalSlides) % totalSlides;

        // Remove a classe 'active' de todos os slides de imagem
        slides.forEach(slide => slide.classList.remove('active'));
        // Adiciona a classe 'active' ao slide de imagem atual
        slides[currentSlideIndex].classList.add('active');

        // Animação e atualização do texto (citação e descrição)
        // Primeiro, remove as classes 'active' para iniciar a animação de fade-out
        timelineQuote.classList.remove('active');
        timelineDescription.classList.remove('active');

        // Em seguida, atualiza o conteúdo e adiciona as classes 'active' após um breve atraso
        // para permitir a transição de fade-out e fade-in
        setTimeout(() => {
            timelineQuote.textContent = timelineContent[currentSlideIndex].quote;
            timelineDescription.textContent = timelineContent[currentSlideIndex].description;
            timelineQuote.classList.add('active');
            timelineDescription.classList.add('active');
        }, 400); // O atraso deve ser menor ou igual ao tempo de transição CSS de fade-out

        updateIndicators(); // Atualiza os pontos
        resetProgressBar(); // Reinicia a barra de progresso
        startProgressBar(); // Inicia a barra de progresso para o novo slide
    }

    // Avança para o próximo slide
    function nextSlide() {
        showSlide(currentSlideIndex + 1);
    }

    // Volta para o slide anterior
    function prevSlide() {
        showSlide(currentSlideIndex - 1);
    }

    // Navega para um slide específico pelo índice
    function goToSlide(index) {
        if (index === currentSlideIndex) return; // Não faz nada se já estiver no slide
        clearInterval(autoplayInterval); // Para o autoplay
        showSlide(index);
        startAutoplay(); // Reinicia o autoplay após navegação manual
    }

    // --- Autoplay e Barra de Progresso ---

    // Inicia o autoplay do slider
    function startAutoplay() {
        clearInterval(autoplayInterval); // Garante que não haja múltiplos intervalos
        autoplayInterval = setInterval(nextSlide, slideDuration);
        startProgressBar();
    }

    // Para o autoplay
    function stopAutoplay() {
        clearInterval(autoplayInterval);
        clearInterval(progressBarInterval);
    }

    // Inicia a animação da barra de progresso
    function startProgressBar() {
        let width = 0;
        const increment = 100 / (slideDuration / 50); // Calcula o incremento a cada 50ms
        progressBar.style.width = '0%'; // Reseta a largura antes de iniciar
        clearInterval(progressBarInterval); // Limpa qualquer intervalo anterior
        
        progressBarInterval = setInterval(() => {
            if (width < 100) {
                width += increment;
                progressBar.style.width = width + '%';
            } else {
                clearInterval(progressBarInterval); // Garante que pare quando o slide mudar
            }
        }, 50); // Atualiza a cada 50 milissegundos para suavidade
    }

    // Reseta a barra de progresso para 0%
    function resetProgressBar() {
        progressBar.style.width = '0%';
        clearInterval(progressBarInterval);
    }

    // --- Controle de Música ---

    let isMusicPlaying = false;

    // Alterna a reprodução da música de fundo
    function toggleMusic() {
        if (isMusicPlaying) {
            backgroundMusic.pause();
            musicToggleBtn.classList.remove('playing');
        } else {
            // Tenta tocar a música. Catch() lida com erros de autoplay do navegador.
            backgroundMusic.play().then(() => {
                musicToggleBtn.classList.add('playing');
            }).catch(e => {
                console.warn("Erro ao tocar música (provavelmente devido a políticas de autoplay do navegador):", e);
                alert("Para ouvir a música, por favor interaja com a página primeiro (clique em algum lugar).");
            });
        }
        isMusicPlaying = !isMusicPlaying;
    }

    // --- Event Listeners ---

    // Botões de navegação
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoplay();
        startAutoplay(); // Reinicia o autoplay após clique
    });

    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoplay();
        startAutoplay(); // Reinicia o autoplay após clique
    });

    // Botão de música
    musicToggleBtn.addEventListener('click', toggleMusic);

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoplay();
            startAutoplay();
        } else if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoplay();
            startAutoplay();
        }
    });

    // --- Inicialização ---
    // Inicia tudo quando a página carrega
    showSlide(currentSlideIndex); // Mostra o primeiro slide e conteúdo
    createIndicators(); // Cria os pontos indicadores
    startAutoplay(); // Inicia o autoplay
});