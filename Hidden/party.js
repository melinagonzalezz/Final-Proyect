// Cargar un efecto de sonido al abrir la página
window.onload = function() {
  const audio = new Audio('/Hidden/partyplz.mp3'); 
  audio.play();
};

// Redirigir a la página principal al presionar el botón

document.getElementById("left-party-button").addEventListener("click", function() {
  alert("¿Nos abandonas tan pronto?");
  setTimeout(() => {
      window.location.href = '/index.html';
  }, 2000);
});

  