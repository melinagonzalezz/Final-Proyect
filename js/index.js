// Evento que se ejecuta cuando el contenido del documento se ha cargado
document.addEventListener("DOMContentLoaded", function(){
    // Evento para el botón "Autos" que guarda la categoría "Autos" en localStorage y redirige a la página de productos
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101); // Guarda el ID de la categoría de Autos
        window.location = "products.html"; // Redirige a la página de productos
    });
    
    // Evento para el botón "Juguetes" que guarda la categoría "Juguetes" en localStorage y redirige a la página de productos
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102); // Guarda el ID de la categoría de Juguetes
        window.location = "products.html"; // Redirige a la página de productos
    });
    
    // Evento para el botón "Muebles" que guarda la categoría "Muebles" en localStorage y redirige a la página de productos
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103); // Guarda el ID de la categoría de Muebles
        window.location = "products.html"; // Redirige a la página de productos
    });
});

// Evento que se ejecuta cuando el contenido del documento se ha cargado
document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('currentUsername'); // Obtiene el nombre de usuario desde localStorage
    
    // Si no hay usuario autenticado, redirige a la página de login
    if (!username) {
        window.location.href = 'login.html'; // Redirige al login si no hay un nombre de usuario
        return;
    }
    
    // Muestra el nombre de usuario en el elemento correspondiente al iniciar sesión
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = username;

    // Manejo del botón de "Cerrar sesión"
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function () {
        // Elimina el nombre de usuario de localStorage y redirige a la página de login
        localStorage.removeItem('currentUsername');
        window.location.href = 'login.html'; // Redirige a login
    });
});

// Función para agregar un producto al carrito
function saveToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Obtiene el carrito de localStorage o crea uno vacío si no existe

    // Verifica si el producto ya está en el carrito
    const cartItems = cart.some(item => item.id === product.id);

    if (!cartItems) {
        // Si el producto no está en el carrito, lo agrega
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart)); // Guarda el carrito actualizado en localStorage
        updateCartBadge(); // Actualiza el contador del carrito
    } else {
        alert('Este producto ya se encuentra en el carrito.'); // Muestra un mensaje si el producto ya está en el carrito
    }

    console.log(`Datos guardados en cart: ${JSON.stringify(cart)}`); // Muestra los datos del carrito en la consola para depuración
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Obtiene el carrito de localStorage

    // Filtra el carrito para eliminar el producto con el ID correspondiente
    cart = cart.filter(item => item.id !== productId);

    localStorage.setItem("cart", JSON.stringify(cart)); // Guarda el carrito actualizado en localStorage
    updateCartBadge(); // Actualiza el contador del carrito
}

// Función para actualizar el contador del carrito en la interfaz
function updateCartBadge() {
    const cart = JSON.parse(localStorage.getItem("cart")) || []; // Obtiene el carrito de localStorage
    const badge = document.getElementById('cart-badge'); // Obtiene el elemento del contador del carrito
    badge.textContent = cart.length; // Actualiza el texto del badge con la cantidad de productos en el carrito
}

// Ejecuta la función de actualización del badge cuando se carga la página
window.onload = function() {
    updateCartBadge(); // Actualiza el contador del carrito al cargar la página
};

  