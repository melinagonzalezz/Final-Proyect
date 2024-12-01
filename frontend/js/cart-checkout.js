document.addEventListener('DOMContentLoaded', () => {

    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            
            buttons.forEach(btn => btn.classList.remove('selected'));
            
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
        if (savedShippingType  === "plus") {
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

        // Verificar si la validación pasa
        const isValid = validateContinue2(event); // La función devuelve `true` o `false`
        if (!isValid) {
            console.error("No se puede avanzar porque la validación falló.");
            return; // Detener la ejecución si la validación no pasa
        }

        // Si la validación pasa, cambiar a la siguiente sección
        changeSection('checkout-2', 'checkout-3');

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
   //Ocultar
    document.getElementById(sectionToHide).classList.add('d-none');
  //Mostrar
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

    showPickupLocations(); // Mostrar las opciones de "Retiro en tienda" por defecto

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
          
            const addressData = JSON.parse(savedAddress);
            
            const defaultAddress = addressData.find(address => address.isDefault);
            
            if (defaultAddress) {
                addressList.innerHTML = `<p><i class="bi bi-house-fill"></i> ${defaultAddress.addressText}</p>`;
            } else {
                addressList.innerHTML = `<p><i class="bi bi-house-fill"></i> Dirección predeterminada no encontrada.</p>`;
            }
        } else {
            addressList.innerHTML = `<p><i class="bi bi-house-fill"></i> Dirección predeterminada no encontrada.</p>`;
        }

        document.getElementById('edit-address-btn').style.display = 'inline-block';
    }

    document.getElementById('edit-address-btn').addEventListener('click', () => {
        window.location.href = 'address.html'; 
    });
});

document.addEventListener("DOMContentLoaded", function () {

    // Recuperamos el subtotal guardado en localStorage como texto
    let savedTotal = localStorage.getItem("savedTotal") || "0"; // Si no existe, usamos "0"

    // Eliminamos el texto adicional "Total: $" y convertimos a número
    savedTotal = parseFloat(savedTotal.replace(/[^0-9.-]/g, "")) || 0;

    console.log("El precio guardado es:", savedTotal);

    const shippingSelect = document.getElementById('types-of-shipments');
    if (!shippingSelect) {
        console.error("El elemento 'types-of-shipments' no existe en el DOM.");
        return;
    }

    shippingSelect.addEventListener("change", function () {
        const shippingCost = getShippingCost(savedTotal); 
        console.log("Costo de envío calculado:", shippingCost);

        const finalTotal = savedTotal + shippingCost;
        console.log("Total final calculado:", finalTotal);

        const totalCostElement = document.getElementById("total-cost");
        if (totalCostElement) {
            totalCostElement.innerHTML = `<i class="bi bi-arrow-right-square-fill"></i> Costo + envío: $${finalTotal.toFixed(2)}`;
        } else {
            console.error("El elemento 'total-cost' no existe en el DOM.");
        }

        localStorage.setItem("finalTotal", finalTotal);
    });
    addressForShipment();
});

// Función para obtener el costo de envío según el tipo seleccionado
function getShippingCost(value) {
    const shippingSelect = document.getElementById('types-of-shipments');
    if (!shippingSelect) {
        console.error("El elemento 'types-of-shipments' no existe en el DOM.");
        return 0;
    }

    const selectedShipping = shippingSelect.value;

    // Validamos que se haya seleccionado una opción válida
    if (!selectedShipping) {
        console.warn("Por favor, selecciona un tipo de envío.");
        return 0;
    }

    console.log("Tipo de envío seleccionado:", selectedShipping);

    // Calculamos el costo final subtotal + envío seleccionado
    const currencySelected = localStorage.getItem("currencySelected");
    switch (selectedShipping) {
        case 'premium':
            return value * 0.15; // 15% del subtotal
        case 'express':
            return value * 0.07; // 7% del subtotal
        case 'standard':
            return value * 0.05; // 5% del subtotal
        case 'base':
            if (currencySelected === "UY") {
                return 10 * 42; // Costo fijo en pesos uruguayos
            } else {
                return 10; // Costo fijo en dólares
            }
        case 'plus':
            return 0; // Gratis
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
    if (event) event.preventDefault(); 
    console.log("Validando formulario...");

    // Verificar el tipo de envío
    const shippingType = localStorage.getItem("shippingType");
    console.log("Tipo de envío seleccionado:", shippingType);
    
    if (shippingType) {
       localStorage.setItem("shippingType", shippingType);
       console.log("Tipo de envio guardado");
    }

    if (!shippingType) {
        alert("Por favor, selecciona un tipo de envío.");
        return false;
    }

    if (shippingType === "plus") {
        localStorage.setItem('userDiscounts', JSON.stringify('ZEN10'));
    }

    // Validar método de pago seleccionado
    const selectedPaymentMethod = document.querySelector('.nav-link.active')?.getAttribute('id');
    console.log("Método de pago seleccionado:", selectedPaymentMethod);
    if (!selectedPaymentMethod) {
        alert("Por favor, selecciona un método de pago.");
        return false;
    }

    // Validar campos según el método de pago
    const validateFields = (fields) => {
        let isValid = true;
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field || !field.value.trim()) {
                field?.classList.add('is-invalid');
                console.log(`Campo ${fieldId} está vacío.`);
                isValid = false;
            } else {
                field?.classList.remove('is-invalid');
            }
        });
        return isValid;
    };

    if (selectedPaymentMethod === 'debit-tab') {
        console.log("Validando campos de débito...");
        const debitFields = [
            'number-debit',
            'quotas-debit',
            'expirationM-debit',
            'expirationA-debit',
            'security-debit',
            'card-name-debit',
        ];
        if (!validateFields(debitFields)) {
            alert("Por favor, completa todos los campos de débito.");
            return false;
        }
    } else if (selectedPaymentMethod === 'credit-tab') {
        console.log("Validando campos de crédito...");
        const creditFields = [
            'number-credit',
            'quotas-credit',
            'expirationM-credit',
            'expirationA-credit',
            'security-credit',
            'card-name-credit',
        ];
        if (!validateFields(creditFields)) {
            alert("Por favor, completa todos los campos de crédito.");
            return false;
        }
    } else if (selectedPaymentMethod === 'pickup-tab') {
        console.log("Pago en sucursal seleccionado.");
    }

    console.log("Formulario validado correctamente.");

    const keysToRemove = ['cart', 'selectedDiscount', 'shippingType', 'selectedCurrency', 'finalTotal', 'savedTotal'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    return true;
}

// Función para verificar y mostrar la dirección de envío
function addressForShipment() {
    const addressFS = localStorage.getItem('addresses');
    if (addressFS) {
        const addresses = JSON.parse(addressFS);
        const defaultAddress = addresses.find(address => address.isDefault);
        if (defaultAddress) {
            document.getElementById('address-shipment').textContent = defaultAddress.addressText;
        }
    }
}




    
    
