document.addEventListener('DOMContentLoaded', () => {

    // Cargar imagen de perfil desde localStorage si existe
    const profileImg = document.getElementById('profile-img');
    const storedImage = localStorage.getItem('profileImage');

    if (storedImage) {
        profileImg.src = storedImage; // Asignar imagen desde localStorage
    }

    // Selección de la imagen de perfil
    const fileInput = document.getElementById('file-input');
    const changePhotoBtn = document.getElementById('changePhoto');

    // Al hacer clic en el botón de cambiar foto, se abre el selector de archivo
    changePhotoBtn.addEventListener('click', () => {
        fileInput.click(); 
    });

    //Selecciona una imagen
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0]; // Obtener el archivo seleccionado
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target.result; // Obtener el URL de la imagen
                profileImg.src = imageDataUrl; // Establecer como imagen de perfil
                localStorage.setItem('profileImage', imageDataUrl); 
                alert("Imagen de perfil actualizada correctamente.");
            };
            reader.readAsDataURL(file); // Leer la imagen como URL de datos
        }
    });

    // Guardar los cambios del perfil cuando se envíe el formulario
    const profileForm = document.getElementById('edit-profile');
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        // Obtener los valores de los campos del formulario
        const name = document.getElementById('name').value;
        const secondName = document.getElementById('secondName').value;
        const lastName1 = document.getElementById('lastName1').value;
        const lastName2 = document.getElementById('lastName2').value;
        const email = document.getElementById('email').value;
        const number = document.getElementById('number').value;

        // Validación de campos obligatorios
        if (!name || !lastName1 || !email || !number) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        // Crear objeto con los datos del formulario
        const formData = {
            nombre: name,
            segundoNombre: secondName,
            apellido: lastName1,
            segundoApellido: lastName2,
            email: email,
            telefono: number
        };

        // Guardar los datos del perfil en localStorage
        localStorage.setItem("UserData:", JSON.stringify(formData));
        console.log('Datos Guardados:', formData);
        alert("Los cambios han sido guardados correctamente.");
    });

    // Redirigir al usuario a la página de direcciones al hacer clic en el botón de editar
    document.getElementById("editButton").addEventListener("click", function() {
        window.location.href = "address.html"; 
    });

    // Función para cargar las direcciones desde localStorage y mostrarlas
    loadProfileAddresses();

    function loadProfileAddresses() {
        const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || []; 
        console.log('Direcciones guardadas:', savedAddresses);

        const directionList = document.getElementById('direction-list');
        directionList.innerHTML = ''; 

        // Verificar que las direcciones estén en el formato correcto
        if (Array.isArray(savedAddresses) && savedAddresses.length > 0) {
            // Verificar si hay una dirección predeterminada
            const defaultAddress = savedAddresses.find(address => address.isDefault === true); 

            // Si se encuentra la dirección predeterminada
            if (defaultAddress) {
                const listItem = document.createElement('li');
                listItem.textContent = `${defaultAddress.addressText} (Predeterminada)`; 
                directionList.appendChild(listItem);
            } else {
                const listItem = document.createElement('li');
                listItem.textContent = "No tienes una dirección predeterminada.";
                directionList.appendChild(listItem); 
            }
        } else {
            // Si no hay direcciones, mostrar un mensaje
            const listItem = document.createElement('li');
            listItem.textContent = "No tienes direcciones guardadas.";
            directionList.appendChild(listItem);
        }
    }
  
    // Función para actualizar el badge del carrito con la cantidad de productos
    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem("cart")) || []; 
        const badge = document.getElementById('cart-badge');
        badge.textContent = cart.length; // Mostrar la cantidad de productos en el badge
    }

    updateCartBadge();
});

// Mostrar el nombre del usuario al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const userName = localStorage.getItem('currentUsername'); 
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = userName;
});

