document.addEventListener('DOMContentLoaded', () => {

    const profileImg = document.getElementById('profile-img');
    const storedImage = localStorage.getItem('profileImage');

    // Cargar imagen de perfil
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

        const name = document.getElementById('name').value;
        const secondName = document.getElementById('secondName').value;
        const lastName1 = document.getElementById('lastName1').value;
        const lastName2 = document.getElementById('lastName2').value;
        const email = document.getElementById('email').value;
        const number = document.getElementById('number').value;

        // Validación de campos
        if (!name || !lastName1 || !email || !number) {
            alert('Por favor, completa todos los campos obligatorios.');
            return;
        }

        const formData = {
            nombre: name,
            segundoNombre: secondName,
            apellido: lastName1,
            segundoApellido: lastName2,
            email: email,
            telefono: number
        };
        
        localStorage.setItem("DatosdelUsuario", JSON.stringify(formData));
        console.log('Datos guardados:', formData);
        alert("Los cambios han sido guardados correctamente.");
    });

    // Editar la dirección
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
    
        if (Array.isArray(savedAddresses)) {
            const defaultAddress = savedAddresses.find(address => address.includes('(Predeterminada)'));
    
            if (defaultAddress) {
                const listItem = document.createElement('li');
                listItem.textContent = defaultAddress;
                directionList.appendChild(listItem);
            } else {
                const listItem = document.createElement('li');
                listItem.textContent = "No tienes una dirección predeterminada.";
                directionList.appendChild(listItem);
            }
        } else {
            console.error("Tus direcciones no están en el formato correcto.");
        }
    
        console.log('Lista de direcciones actualizada:', directionList.innerHTML);
    }

    
    
    
    // Función para guardar el carrito y actualizar el badge


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
      
        console.log( `Datos guardados en cart: ${JSON.stringify(cart)}`);
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
    });