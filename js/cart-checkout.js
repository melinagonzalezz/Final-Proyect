document.addEventListener('DOMContentLoaded', () => {
    // Recuperar botones y agregar evento de selección
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Elimina la clase 'selected' de todos los botones cuando uno es clickeado
            buttons.forEach(btn => btn.classList.remove('selected'));
            // Agrega la clase 'selected' al botón clickeado para resaltar el botón seleccionado
            button.classList.add('selected');
        });
    });

    // Obtener los botones para navegar entre secciones del checkout
    const backToCheckout1 = document.getElementById('backToCheckout1');
    const goToCheckout2 = document.getElementById('goToCheckout2');
    const backToCheckout2 = document.getElementById('backToCheckout2');
    const goToCheckout3 = document.getElementById('goToCheckout3');

    // Cambiar de la sección 'checkout-1' a 'checkout-2' cuando se hace clic en 'goToCheckout2'
    goToCheckout2.addEventListener('click', () => {
        validateContinue1();
        changeSection('checkout-1', 'checkout-2');
        
    });

    // Volver a la sección 'checkout-1' desde 'checkout-2'
    backToCheckout1.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar la acción predeterminada
        changeSection('checkout-2', 'checkout-1');
    });

    // Cambiar a la sección 'checkout-3' desde 'checkout-2'
    goToCheckout3.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar la acción predeterminada
        validateContinue2();
        changeSection('checkout-2', 'checkout-3');
        


        // Obtener el select de tipo de envío
        const shippingSelect = document.getElementById('types-of-shipments');
        // Verificar si ya hay un tipo de envío guardado en LocalStorage
        const savedShippingType = localStorage.getItem('shippingType');
        if (savedShippingType) {
            shippingSelect.value = savedShippingType; // Asignar el valor guardado al select
        }

        // Evento de cambio en el select para guardar el tipo de envío seleccionado
        shippingSelect.addEventListener('change', function () {
            const selectedShippingType = shippingSelect.value;
            localStorage.setItem('shippingType', selectedShippingType); // Guardar tipo de envío en localStorage
        });

        // Verificar si el tipo de envío seleccionado es "Paciencia Plus"
        let shipping = localStorage.getItem("shippingType");
        if (shipping === "plus") {
            // Obtener los descuentos del localStorage o inicializar un array vacío si no existen
            let userDiscounts = JSON.parse(localStorage.getItem("userDiscounts")) || [];
            // Añadir el descuento "plus" al array de descuentos
            userDiscounts.push("plus");
            // Actualizar el LocalStorage con los nuevos descuentos
            localStorage.setItem("userDiscounts", JSON.stringify(userDiscounts));
            
            // Avisa al usuario sobre el descuento desbloqueado
            alert("¡Felicidades! Has desbloqueado un increíble 10% de descuento... solo por elegir nuestra opción de envío Paciencia Plus. Tu paquete llegará entre 20 - 30 días. ¡Relájate, respira y disfruta de tu descuento mientras esperas!");
            
            console.log(userDiscounts); // Imprimir los descuentos actualizados en la consola
        }
    });

    // Volver a la sección 'checkout-2' desde 'checkout-3'
    backToCheckout2.addEventListener('click', (event) => {
        event.preventDefault(); // Evitar la acción predeterminada
        changeSection('checkout-3', 'checkout-2');
    });

    // Recuperar datos del usuario almacenados en localStorage
    const formData = JSON.parse(localStorage.getItem("UserData:"));

    if (formData) {
        // Mostrar los datos recuperados en los campos correspondientes del DOM
        const displayEmail = document.getElementById("display-email");
        const displayName = document.getElementById("display-name");
        const displayNumber = document.getElementById("display-number");

        if (displayEmail) {
            displayEmail.textContent = `Correo: ${formData.email || 'No disponible'}`;
        }
        if (displayName) {
            displayName.textContent = `Nombre: ${formData.nombre || 'No disponible'} ${formData.apellido || ''} ${formData.segundoApellido || ''}`;
        }
        if (displayNumber) {
            displayNumber.textContent = `Telefono/Movil: ${formData.telefono || 'No disponible'}`;
        }
    } else {
        console.log("No se encontraron datos del usuario en localStorage.");
    }
});

// Función para cambiar entre secciones del checkout
function changeSection(sectionToHide, sectionToShow) {
    // Ocultar la sección que se va a ocultar
    document.getElementById(sectionToHide).classList.add('d-none');
    // Mostrar la sección que se va a mostrar
    document.getElementById(sectionToShow).classList.remove('d-none');
}

document.addEventListener('DOMContentLoaded', () => {
    // Recuperar botones y agregar evento de selección
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            // Eliminar la clase 'selected' de todos los botones
            buttons.forEach(btn => btn.classList.remove('selected'));
            // Añadir la clase 'selected' al botón clickeado
            button.classList.add('selected');
            
            // Cambiar la visibilidad de las direcciones según la opción seleccionada
            if (button.textContent === "Retiro en tienda") {
                showPickupLocations();
            } else {
                showAddressFromStorage();
            }
        });
    });

    // Mostrar las opciones de retiro en tienda al cargar la página

    showPickupLocations(); // Llamar a esta función para mostrar las opciones de "Retiro en tienda" por defecto

    // Mostrar direcciones falsas para la opción de "Retiro en tienda"

    function showPickupLocations() {
        const addressList = document.getElementById('address-list');
        addressList.innerHTML = `
            <p><i class="bi bi-house-fill"></i> Falsa Tienda 1, Calle 123</p>
            <p><i class="bi bi-house-fill"></i> Falsa Tienda 2, Calle 456</p>
            <p><i class="bi bi-house-fill"></i> Falsa Tienda 3, Calle 789</p>
        `;
        // Ocultar boton
        document.getElementById('edit-address-btn').style.display = 'none';
    }

    // Mostrar dirección predeterminada desde localStorage
    function showAddressFromStorage() {
        const addressList = document.getElementById('address-list');
        const savedAddress = localStorage.getItem('addresses');
        
        if (savedAddress) {
            // Parsear la dirección desde JSON
            const addressData = JSON.parse(savedAddress);
            
            // Buscar la dirección predeterminada
            const defaultAddress = addressData.find(address => address.isDefault);
            
            if (defaultAddress) {
                addressList.innerHTML = `<p><i class="bi bi-house-fill"></i> ${defaultAddress.addressText}</p>`;
            } else {
                addressList.innerHTML = `<p><i class="bi bi-house-fill"></i> Dirección predeterminada no encontrada.</p>`;
            }
        } else {
            addressList.innerHTML = `<p><i class="bi bi-house-fill"></i> Dirección predeterminada no encontrada.</p>`;
        }

        // Mostrar boton
        document.getElementById('edit-address-btn').style.display = 'inline-block';
    }

    document.getElementById('edit-address-btn').addEventListener('click', () => {
        window.location.href = 'address.html'; // Redirigir a otra página para editar la dirección
    });
});

document.addEventListener("DOMContentLoaded", function () {
    // Recuperamos el subtotal guardado en localStorage
    let subTotalValue = parseFloat(localStorage.getItem('savedTotal')) || 0; // Si no hay subtotal, ponemos 0

    // Llamamos a la función para actualizar el total en el checkout
    updateTotal(subTotalValue);  
    
    // Event listener para el cambio de tipo de envío
    const shippingSelect = document.getElementById('types-of-shipments');
    shippingSelect.addEventListener('change', function () {
        updateTotal(subTotalValue);  // Actualizamos el total cuando cambie el tipo de envío
    });
});

// Función para actualizar el total en el checkout
function updateTotal(subTotalValue) {
    const totalElement = document.getElementById("total-cost");
    
    // Llamar a la función que devuelve el costo de envío
    const shippingCost = getShippingCost(subTotalValue); 
    let totalValue = subTotalValue + shippingCost;
    
    // Mostrar el total con el envío
    totalElement.innerHTML = `<i class="bi bi-arrow-right-square-fill"></i> Costo + envío: U$S ${totalValue.toFixed(2)}`; 
}

// Función para obtener el costo de envío según el tipo seleccionado
function getShippingCost(subTotalValue) {

    if(subTotalValue <= 0) {
        return 0;
    }

    const shippingSelect = document.getElementById('types-of-shipments');
    const selectedShipping = shippingSelect.value;
    
    // Calculamos el costo final subtotal + envío seleccionado
    switch (selectedShipping) {
        case 'premium':
            return subTotalValue * 0.15;  // 15% del subtotal
        case 'express':
            return subTotalValue * 0.07;  // 7% del subtotal
        case 'standard':
            return subTotalValue * 0.05;  // 5% del subtotal
        case 'base':
            return 10;    // Costo fijo de U$S 10
        case 'plus':
            return 0;     // Gratis
        default:
            return 0;
    }

}


function validateContinue1() {
    // Validar si el usuario tiene datos de identificación guardados
    const userData = localStorage.getItem('UserData:');
    if (!userData || userData.trim() === "") {
        alert("No has proporcionado tus datos. Por favor, completa tu información en el perfil.");
        window.location.href = "my-profile.html";
        return false;
    }

    // Verificar si se ha seleccionado una dirección de envío
    const selectedOption = document.querySelector('.option-btn.selected');
    if (!selectedOption) {
        alert("Por favor, selecciona una opción de dirección o retiro.");
        return false;
    }

    if (selectedOption.textContent === "Retiro en tienda") {
        console.log("Retira en tienda");
    
    } else {
       
        // Si seleccionó "Envío a domicilio", asegurarse de que la dirección esté guardada
        const savedAddresses = localStorage.getItem('addresses');
        if (!savedAddresses || savedAddresses.trim() === "[]") {
            alert("Por favor, selecciona una dirección de envío antes de continuar.");
            window.location.href = "address.html";
            return false;
        }

        // Convertir la cadena JSON guardada en un objeto
        let addressesArray;
        try {
            addressesArray = JSON.parse(savedAddresses);
        } catch (e) {
            alert("Error en los datos de dirección. Por favor, revisa tu perfil.");
            return false;
        }

        // Verificar si hay una dirección predeterminada marcada (isDefault)
        const defaultAddress = addressesArray.find(address => address.isDefault);
        if (!defaultAddress) {
            alert("Por favor, selecciona una dirección de envío válida antes de continuar.");
            window.location.href = "address.html";
            return false;
        }
    }

    // Si todo está bien, se puede continuar
    return true;
}

function validateContinue2(event) {
    if (event) event.preventDefault(); // Evitar la acción predeterminada si es un evento de formulario
    console.log("Validando formulario...");

    // Verificar que se haya guardado el tipo de envío
    const shippingType = localStorage.getItem("shippingType");
    console.log("Tipo de envío seleccionado:", shippingType);
    if (!shippingType) {
        alert("Por favor, selecciona un tipo de envío.");
        console.error("Error: No se seleccionó un tipo de envío.");
        return false;
    }

    // Si se selecciona el envío Paciencia Plus, se le agrega un cupón en localStorage
    if (shippingType === "plus") {
        localStorage.setItem('userDiscounts', JSON.stringify('ZEN10'));
        alert("Ganaste un cupón de descuento del 10% en tu próxima compra.");
        console.log("Cupón ZEN10 agregado al localStorage.");
    }

    // Validar método de pago
    const selectedPaymentMethod = document.querySelector('.nav-link.active')?.getAttribute('id');
    console.log("Método de pago seleccionado:", selectedPaymentMethod);
    if (!selectedPaymentMethod) {
        alert("Por favor, selecciona un método de pago.");
        console.error("Error: No se seleccionó un método de pago.");
        return false;
    }

    if (selectedPaymentMethod === 'debit-tab') {
        console.log("Validando campos de débito...");
        // Validar campos de débito
        const fields = [
            'number-debit',
            'quotas-debit',
            'expirationM-debit',
            'expirationA-debit',
            'security-debit',
            'card-name-debit',
        ];
        for (const field of fields) {
            const value = document.getElementById(field)?.value;
            console.log(`Campo ${field}:`, value);
            if (!value) {
                alert('Por favor, completa todos los campos de débito.');
                console.error(`Error: Campo ${field} está vacío.`);
                return false;
            }
        }
    } else if (selectedPaymentMethod === 'credit-tab') {
        console.log("Validando campos de crédito...");
        // Validar campos de crédito
        const fields = [
            'number-credit',
            'quotas-credit',
            'expirationM-credit',
            'expirationA-credit',
            'security-credit',
            'card-name-credit',
        ];
        for (const field of fields) {
            const value = document.getElementById(field)?.value;
            console.log(`Campo ${field}:`, value);
            if (!value) {
                alert('Por favor, completa todos los campos de crédito.');
                console.error(`Error: Campo ${field} está vacío.`);
                return false;
            }
        }
    } else if (selectedPaymentMethod === 'pickup-tab') {
        console.log('Pago en sucursal seleccionado.');
    }

    // Si todo está correcto, se puede continuar
    console.log("Formulario validado correctamente.");
    return true;
}

//Sabado Costos de Envio y Metodos de pa




    
    
