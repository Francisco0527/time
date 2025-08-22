const slider = document.getElementById('slider');
let startY = 0;
let endY = 0;

// =============================
// Swipe no celular (navegação entre seções)
// =============================
slider.addEventListener('touchstart', (e) => {
  startY = e.touches[0].clientY;
});

slider.addEventListener('touchend', (e) => {
  endY = e.changedTouches[0].clientY;
  handleSwipe();
});

function handleSwipe() {
  let diff = startY - endY;
  if (Math.abs(diff) > 50) {
    if (diff > 0) {
      slider.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    } else {
      slider.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
    }
  }
}

// =============================
// Texto rotativo na primeira tela
// =============================
const frases = [
  `<small>10 de setembro de 2016</small><br>Alguns momentos mudam nossa vida para sempre, onde já diante de um altar prometemos ser um pelo outro.`,
  `Cada momento ao seu lado é uma eterna memória`,
  `Nossa história é feita de grandes momentos juntos`,
  `✨ Deslize para ver nossa jornada juntos ✨`
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
// =============================
const music = document.getElementById("bg-music");
let musicStarted = false;

slider.addEventListener("scroll", () => {
  if (!musicStarted) {
    const secondStory = document.querySelector(".second-story");
    const rect = secondStory.getBoundingClientRect();

    if (rect.top >= 0 && rect.top < window.innerHeight / 2) {
      music.play().then(() => {
        musicStarted = true; // marca que já iniciou
      }).catch(() => {
        console.log("Autoplay bloqueado, aguardando interação...");
      });
    }
  }
});

// Fallback: se autoplay for bloqueado, libera ao primeiro clique/toque
document.addEventListener("click", () => {
  if (!musicStarted) {
    music.play().then(() => {
      musicStarted = true;
    });
  }
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

// Atualiza a cada segundo
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
// Carrossel: arrastar com mouse/touch
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

  // Para touch devices
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
