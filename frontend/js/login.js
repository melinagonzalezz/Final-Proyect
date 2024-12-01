// Asegúrate de que el script sea cargado después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function () {
    // Obtiene el formulario de inicio de sesión
    const loginForm = document.getElementById('loginForm');

    // Manejo del formulario de inicio de sesión
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)

        // Obtiene el nombre de usuario y la contraseña del campo de entrada
        const username = document.getElementById('currentUsername').value;
        const password = document.getElementById('currentPassword').value;

        // Guarda el nombre de usuario en localStorage para que persista entre sesiones
        localStorage.setItem('currentUsername', username);

        try {
            // Enviar solicitud al backend
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            // Verifica si la respuesta no fue exitosa
            if (!response.ok) {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
                return;
            }

            const data = await response.json();

            // Guardar el token en localStorage
            localStorage.setItem('authToken', data.token);

            // Redirige al usuario a la página principal (index.html) después de iniciar sesión
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error al intentar iniciar sesión:', error);
            alert('Ocurrió un error al iniciar sesión. Por favor, inténtalo de nuevo.');
        }
    });

});



