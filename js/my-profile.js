document.addEventListener('DOMContentLoaded', () => {

    const profileImg = document.getElementById('profile-img');
    const storedImage = localStorage.getItem('profileImage');

    if (storedImage) {
        profileImg.src = storedImage;
    }

    // Selección de la imagen de perfil
    const fileInput = document.getElementById('file-input');
    const changePhotoBtn = document.getElementById('changePhoto');

    // Al hacer clic en el botón de cambiar foto
    changePhotoBtn.addEventListener('click', () => {
        fileInput.click(); 
    });

    // Selección archivo de imagen
    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataUrl = e.target.result;
                profileImg.src = imageDataUrl; 
                localStorage.setItem('profileImage', imageDataUrl); 
                alert("Imagen de perfil actualizada correctamente.");
            };
            reader.readAsDataURL(file); 
        }
    });

    // Guardar los cambios del perfil
    const profileForm = document.getElementById('edit-profile');
    profileForm.addEventListener('submit', (event) => {
        event.preventDefault(); 

        const formData = {
            nombre: document.getElementById('nombre').value,
            segundoNombre: document.getElementById('segundoNombre').value,
            apellido: document.getElementById('apellido').value,
            segundoApellido: document.getElementById('segundoApellido').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value
        };

        console.log('Datos guardados:', formData);
        alert("Los cambios han sido guardados correctamente.");
    });

    });

    
    // Verificar si hay una imagen de perfil
    const profileImg = document.getElementById("profile-img");
    const profileImgPlaceholder = document.getElementById("profile-img-container");
    profileImgPlaceholder.style.display = profileImg.src ? "none" : "flex"; 
    
    // Editar la dirección
    document.getElementById("editButton").addEventListener("click", function() {
        window.location.href = "address.html";
      });

    
   // Function para cargar las direcciones desde localStorage y mostrarlas

   function loadProfileAddresses() {
    const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
    const directionList = document.getElementById('direction-list');

    directionList.innerHTML = '';

    savedAddresses.forEach(function(address) {
        const listItem = document.createElement('li');
        listItem.textContent = address;
        directionList.appendChild(listItem);
    });
   }

   // Cargar las direcciones al cargar la página

   window.onload = loadProfileAddresses; 