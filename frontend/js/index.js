document.addEventListener("DOMContentLoaded", function(){
    // Guarda la categoría "Autos" en localStorage y redirige a la página de productos
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101); 
        window.location = "products.html"; 
    });
    
    // Guarda la categoría "Juguetes" en localStorage y redirige a la página de productos
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102); 
        window.location = "products.html"; 
    });
    
    // Evento para el botón "Muebles" que guarda la categoría "Muebles" en localStorage y redirige a la página de productos
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103); 
        window.location = "products.html";
    });
});

// Evento que se ejecuta cuando el contenido del documento se ha cargado
document.addEventListener('DOMContentLoaded', function () {
    const username = localStorage.getItem('currentUsername'); 
    
    // Si no hay usuario autenticado, redirige a la página de login
    if (!username) {
        window.location.href = 'login.html'; 
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



  