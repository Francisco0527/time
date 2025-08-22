// =============================
// Fix do 100vh em mobile (para CSS usar --vh)
// =============================
function setVh() {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
}
window.addEventListener('resize', setVh);
window.addEventListener('load', setVh);
setVh();

// =============================
// Elementos principais
// =============================
const slider = document.getElementById('slider');
const music  = document.getElementById('bg-music');
const secondStory = document.querySelector('.second-story');

let startY = 0;
let endY = 0;
let startIndex = 0;
let musicStarted = false;

function getPageIndex() {
  // cada "página" ocupa a altura visível do slider
  return Math.round(slider.scrollTop / slider.clientHeight);
}

// =============================
// Swipe no celular (navegação entre seções)
// =============================
slider.addEventListener('touchstart', (e) => {
  startY = e.touches[0].clientY;
  startIndex = getPageIndex();
});

slider.addEventListener('touchend', (e) => {
  endY = e.changedTouches[0].clientY;
  const diff = startY - endY;

  if (Math.abs(diff) > 50) {
    // rola uma página por vez (mantendo seu comportamento atual)
    if (diff > 0) {
      slider.scrollBy({ top: window.innerHeight, behavior: 'smooth' });

      // IMPORTANTE: se estava na primeira (0) e foi para baixo (→ segunda),
      // tentamos iniciar a música DENTRO do gesto do usuário (touchend)
      if (startIndex === 0 && !musicStarted) {
        tryStartMusic(true);
      }
    } else {
      slider.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
    }
  }
});

// =============================
// Texto rotativo na primeira tela
// =============================
const frases = [
  `<small>10 de setembro de 2016</small><br>Alguns momentos mudam nossa vida para sempre, onde já diante de um altar prometemos ser um pelo outro.`,
  `Cada momento ao seu lado é uma eterna memória`,
  `Nossa história é feita de grandes momentos juntos`,
  `Toque na tela para iniciar a nossa trilha sonora `,
  `Deslize para ver nossa jornada juntos`
];

let indice = 0;
const storyText = document.getElementById("story-text");

setInterval(() => {
  storyText.style.opacity = 0;
  setTimeout(() => {
    indice = (indice + 1) % frases.length;
    storyText.innerHTML = frases[indice];
    storyText.style.opacity = 1;
  }, 1000);
}, 5000);

// =============================
// Música: inicia ao chegar na 2ª tela e segue tocando
// - 1) Via scroll (desktop / quando permitido)
// - 2) Via toque (mobile) dentro do gesto (touchend) — confiável
// - 3) Fallback: primeiro clique/tap em qualquer lugar
// =============================
function isSecondVisible() {
  const rect = secondStory.getBoundingClientRect();
  return rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.4;
}

function tryStartMusic(fromUserGesture = false) {
  if (musicStarted) return;
  // alguns navegadores só permitem play() dentro de gesto do usuário
  try {
    const maybePromise = music.play();
    // se play() retorna Promise, tratamos resultado
    if (maybePromise && typeof maybePromise.then === 'function') {
      maybePromise.then(() => {
        musicStarted = true;
      }).catch((err) => {
        // se não foi gesto do usuário, vai falhar; deixamos fallback assumir
        if (fromUserGesture) {
          // em alguns casos raros ainda pode falhar; não marcamos como started
          console.log('Não foi possível iniciar a música agora:', err);
        }
      });
    } else {
      // alguns browsers antigos não retornam Promise
      musicStarted = true;
    }
  } catch (e) {
    if (fromUserGesture) {
      console.log('Falha ao iniciar a música dentro do gesto:', e);
    }
  }
}

// 1) Tenta iniciar quando a 2ª história fica visível (desktop ou quando permitido)
slider.addEventListener('scroll', () => {
  if (!musicStarted && isSecondVisible()) {
    tryStartMusic(false);
  }
});

// 3) Fallback geral: primeiro clique/toque em qualquer lugar
document.addEventListener('click', () => {
  if (!musicStarted) tryStartMusic(true);
}, { once: true });

document.addEventListener('touchstart', () => {
  if (!musicStarted) tryStartMusic(true);
}, { once: true });

// =============================
// Contador desde 10/09/2016
// =============================
function atualizarContador() {
  const inicio = new Date("2016-09-10T00:00:00");
  const agora = new Date();
  const diff = agora - inicio;

  const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diff / (1000 * 60)) % 60);
  const segundos = Math.floor((diff / 1000) % 60);

  document.getElementById("dias").textContent = dias;
  document.getElementById("horas").textContent = horas;
  document.getElementById("minutos").textContent = minutos;
  document.getElementById("segundos").textContent = segundos;
}
setInterval(atualizarContador, 1000);
atualizarContador();

// =============================
// Fade-in dos capítulos
// =============================
function verificarCapitulos() {
  const capitulos = document.querySelectorAll('.chapter-story');

  capitulos.forEach(c => {
    const rect = c.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8 && rect.bottom > 0) {
      const title = c.querySelector('.chapter-title');
      const text = c.querySelector('.chapter-text');
      if (title) title.classList.add('fade-in');
      if (text) text.classList.add('fade-in');
    }
  });
}
window.addEventListener('scroll', verificarCapitulos);
window.addEventListener('load', verificarCapitulos);

// =============================
// Carrossel: arrastar com mouse/touch (como estava)
// =============================
const carousels = document.querySelectorAll('.carousel');

carousels.forEach(carousel => {
  let isDown = false;
  let startX;
  let scrollLeft;

  carousel.addEventListener('mousedown', (e) => {
    isDown = true;
    carousel.classList.add('active');
    startX = e.pageX - carousel.offsetLeft;
    scrollLeft = carousel.scrollLeft;
  });
  carousel.addEventListener('mouseleave', () => {
    isDown = false;
    carousel.classList.remove('active');
  });
  carousel.addEventListener('mouseup', () => {
    isDown = false;
    carousel.classList.remove('active');
  });
  carousel.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - carousel.offsetLeft;
    const walk = (x - startX) * 1.5; // velocidade do arrasto
    carousel.scrollLeft = scrollLeft - walk;
  });

  // Touch
  let touchStartX = 0;
  let touchScrollLeft = 0;

  carousel.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].pageX;
    touchScrollLeft = carousel.scrollLeft;
  });

  carousel.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - touchStartX) * 1.5;
    carousel.scrollLeft = touchScrollLeft - walk;
  });
});
