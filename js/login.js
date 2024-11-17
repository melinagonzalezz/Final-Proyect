// Evento que se ejecuta cuando el contenido del documento se ha cargado
document.addEventListener('DOMContentLoaded', function () {

    // Obtiene el formulario de inicio de sesión
    const loginForm = document.getElementById('loginForm');

    // Manejo del formulario de inicio de sesión
    loginForm.addEventListener('submit', function (event) {
        
        event.preventDefault(); // Previene el comportamiento por defecto del formulario (que recarga la página)

        // Obtiene el nombre de usuario del campo de entrada
        const usernameInput = document.getElementById('currentUsername').value;

        // Guarda el nombre de usuario en localStorage para que persista entre sesiones
        localStorage.setItem('currentUsername', usernameInput);

        // Redirige al usuario a la página principal (index.html) después de iniciar sesión
        window.location.href = 'index.html';
    });

    // Redirige al usuario si ya está autenticado

    const username = localStorage.getItem('currentUsername'); // Verifica si el nombre de usuario existe en localStorage

    // Si ya existe un nombre de usuario guardado, redirige al usuario directamente a la página principal
    if (username) {
        window.location.href = 'index.html';
    }
});

