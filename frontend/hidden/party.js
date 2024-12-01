// Redirigir a la página principal al presionar el botón

document.getElementById("left-party-button").addEventListener("click", function() {
  alert("Leaving so soon?");
  setTimeout(() => {
      window.location.href = '../index.html';
  }, 2000);
});

  