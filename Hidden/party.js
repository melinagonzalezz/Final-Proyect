// Cargar un efecto de sonido de fiesta al abrir la página
window.onload = function() {
    const audio = new Audio('.mp3');
    audio.loop = true;
    audio.play();
  };
  
  // Redirigir a la pagina principal al presionar el botón
  document.getElementById("left-party-button").addEventListener("click", function() {
    alert("¿Nos abandonas tan pronto?");
    setTimeout(() => {
      window.location.href = '/index.html';
    }, 2000);
  });
  