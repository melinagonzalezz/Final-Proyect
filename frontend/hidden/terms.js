

// Redirigir al carrito al presionar el botón
document.getElementById("back-button").addEventListener("click", function() {
  alert("Nunca podrás escapar...");
  setTimeout(() => {
    window.location.href = '../cart.html'; 
  }, 2000);
});

// Efecto de texto que sigue el cursor
document.addEventListener('mousemove', function(e) {
  const ghostText = document.querySelector('.ghost-text');
  ghostText.style.top = `${e.clientY + 20}px`;
  ghostText.style.left = `${e.clientX + 20}px`;
});