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
            nombre: document.getElementById('name').value,
            segundoNombre: document.getElementById('secondNamee').value,
            apellido: document.getElementById('lastname-1').value,
            segundoApellido: document.getElementById('lastname-2').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('number').value
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
  
    console.log(`Datos guardados en cart: ${JSON.stringify(cart)}`);
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
  