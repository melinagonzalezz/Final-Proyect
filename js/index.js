document.addEventListener("DOMContentLoaded", function(){
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('currentUsername');
    
    // Si no hay usuario autenticado, redirigir a login.html
    if (!username) {
        window.location.href = 'login.html';
        return;
    }
    
    //Mostrar nombre de usuario al inicial sesión
    const usernameDisplay = document.getElementById ('username-display');
    usernameDisplay.textContent = username;

    // Manejo del botón de cerrar sesión
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function () {
      
        localStorage.removeItem('currentUsername');
        window.location.href = 'login.html';
    });
});

 //badge--
 function saveToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // verificar si ya esta
    const cartItems = cart.some(item => item.id === product.id);
  
    if (!cartItems) {
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartBadge(); 
    } else {
        alert('Este producto ya se encuentra en el carrito.');
    }
  
    console.log(`Datos guardados en cart: ${JSON.stringify(cart)}`);
  }
  
  //funcion para eliminar
  function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    cart = cart.filter(item => item.id !== productId);
    
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartBadge(); 
  }
  
  function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const badge = document.getElementById('cart-badge');
    badge.textContent = cart.length; 
  }
  
  window.onload = function() {
    updateCartBadge();
  };
  