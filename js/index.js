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
    const username = localStorage.getItem('username');
    
    // Si no hay usuario autenticado, redirigir a login.html
    if (!username) {
        window.location.href = 'login.html';
        return;
    }

    // Manejo del botón de cerrar sesión
    const logoutButton = document.getElementById('logoutButton');
    logoutButton.addEventListener('click', function () {
        localStorage.removeItem('username');
        window.location.href = 'login.html';
    });
});