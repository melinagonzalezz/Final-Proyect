//CAMBIOS PARA ENTREGA 7
//Tomar datos de local Storage para identificacion (mel)
//DESPLEGAR CAMPOS PARA DIRECCIONES Y UN MAPITA + direcciones ficticias WII (mel) 
//En caso de seleccionar Patience Pass Guardar cupon en Local Storage (pao)
//
//Costo + envio de local storage (DANA)
//Validaciones. Finalizar compra. (WE ALL DO THIS.)


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
    const formData = JSON.parse(localStorage.getItem("DatosdelUsuario"));

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
        console.warn("No se encontraron datos del usuario en localStorage.");
    }
});

// Función para cambiar entre secciones del checkout
function changeSection(sectionToHide, sectionToShow) {
    // Ocultar la sección que se va a ocultar
    document.getElementById(sectionToHide).classList.add('d-none');
    // Mostrar la sección que se va a mostrar
    document.getElementById(sectionToShow).classList.remove('d-none');
}















