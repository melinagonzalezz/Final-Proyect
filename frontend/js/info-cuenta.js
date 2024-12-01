document.addEventListener("DOMContentLoaded", function() {
    // Recuperar datos del usuario almacenados en localStorage
    const formData = JSON.parse(localStorage.getItem("DatosdelUsuario"));

    // Verificar si los datos existen y mostrarlos en la página
    if (formData) {
        document.getElementById("info-email").textContent = `Correo: ${formData.email || 'No disponible'}`;
        document.getElementById("info-name").textContent = `Nombre: ${formData.nombre || 'No disponible'} ${formData.apellido || ''} ${formData.segundoApellido || ''}`;
        document.getElementById("info-number").textContent = `Telefono/Movil: ${formData.telefono || 'No disponible'}`;
    } else {
        console.warn("No se encontraron datos del usuario en localStorage.");
    }

    // Función para cargar las direcciones desde localStorage y mostrarlas
    function loadProfileAddresses() {
        // Obtener las direcciones guardadas desde localStorage o un array vacío si no existen
        const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
        console.log('Direcciones guardadas:', savedAddresses);

        const directionList = document.getElementById('direction-list');
        directionList.innerHTML = ''; 

        // Verificar si las direcciones están en el formato correcto
        if (Array.isArray(savedAddresses) && savedAddresses.length > 0) {
            // Buscar una dirección predeterminada
            const defaultAddress = savedAddresses.find(address => address.isDefault === true);

            // Si se encuentra una dirección predeterminada, mostrarla
            if (defaultAddress) {
                const listItem = document.createElement('li');
                listItem.textContent = `${defaultAddress.addressText} (Predeterminada)`;
                directionList.appendChild(listItem);
            } else {
                // Si no hay dirección predeterminada, mostrar un mensaje
                const listItem = document.createElement('li');
                listItem.textContent = "No tienes una dirección predeterminada.";
                directionList.appendChild(listItem);
            }
        } else {
            // Si no hay direcciones guardadas, mostrar un mensaje
            const listItem = document.createElement('li');
            listItem.textContent = "No tienes direcciones guardadas.";
            directionList.appendChild(listItem);
        }
    }

    // Llamar a la función para cargar las direcciones del perfil
    loadProfileAddresses();
});
