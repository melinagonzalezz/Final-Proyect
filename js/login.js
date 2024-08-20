document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    // Manejo del formulario de inicio de sesión
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const usernameInput = document.getElementById('username').value;
        localStorage.setItem('username', usernameInput);
        window.location.href = 'index.html';
    });

    // Redirigir al usuario si ya está autenticado
    const username = localStorage.getItem('username');
    if (username) {
        window.location.href = 'index.html';
    }
});
