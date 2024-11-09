 // Estilos de Botones
const buttons = document.querySelectorAll('.option-btn');

buttons.forEach(button => {
    button.addEventListener('click', () => {
         // Elimina la clase 'selected' de todos los botones
        buttons.forEach(btn => btn.classList.remove('selected'));
        
         // Agrega la clase 'selected' al botón clickeado
        button.classList.add('selected');
    });
});

document.addEventListener('DOMContentLoaded', () => {

    const backToCheckout1 = document.getElementById('backToCheckout1');
    const goToCheckout2 = document.getElementById('goToCheckout2'); 
    const backToCheckout2 = document.getElementById('backToCheckout2'); 
    const goToCheckout3 = document.getElementById('goToCheckout3');

     // Cambiar a checkout-2
    goToCheckout2.addEventListener('click', () => {
        changeSection('checkout-1', 'checkout-2');
    });

     // Volver a checkout-1
    backToCheckout1.addEventListener('click', (event) => {
        event.preventDefault(); 
        changeSection('checkout-2', 'checkout-1');
    }); 
    
     //Cambiar al checkout final
    goToCheckout3.addEventListener('click', (event)=> {
        event.preventDefault();
        changeSection('checkout-2', 'checkout-3');

        document.addEventListener('DOMContentLoaded', () => {

            const shippingSelect = document.getElementById('types-of-shipments');

             //Verificar si ya hay valor guardado en LocalStorage
            const savedShippingType = localStorage.getItem('shippingType');
            if (savedShippingType) {
                 shippingSelect.value = savedShippingType; // Asigna el valor guardado en el select
            }

             //Evento de cambio para guardar el tipo de envío seleccionado
            shippingSelect.addEventListener('change', function () {
                const selectedShippingType = shippingSelect.value;
                 localStorage.setItem('shippingType', selectedShippingType); //guarda en LocalStorage
            });
        });

        //Verificar si el envio seleccionado es "Paciencia Plus"
        let shipping = localStorage.getItem("shippingType");
        if (shipping === "plus") {
             // Obtén los descuentos del localStorage o inicializa un array vacío si no existen
            let userDiscounts = JSON.parse(localStorage.getItem("userDiscounts")) || [];
            
             //Añade el nuevo descuento obtenido
            userDiscounts.push("plus");

             //Actualiza el LG
            localStorage.setItem("userDiscounts", JSON.stringify(userDiscounts));
            
             //Avisa al usuario
            alert("¡Felicidades! Has desbloqueado un increíble 10% de descuento... solo por elegir nuestra opción de envío Paciencia Plus. Tu paquete llegará entre 20 - 30 dias. ¡Relájate, respira y disfruta de tu descuento mientras esperas!")
        
            console.log(userDiscounts)
        }; 

    }); 
     //Volver al checkout-2
    backToCheckout2.addEventListener('click', (event)=> {
        event.preventDefault();
        changeSection('checkout-3', 'checkout-2');
    });

});

     // Función para cambiar secciones
    function changeSection(sectionToHide, sectionToShow) {
        document.getElementById(sectionToHide).classList.add('d-none');
        document.getElementById(sectionToShow).classList.remove('d-none');
    }

 //Recuperar datos para apartado de Identificacion

document.addEventListener("DOMContentLoaded", function(){
    
     //Recuperar datos

    const formData = JSON.parse(localStorage.getItem("DatosdelUsuario"));

    if (formData) {

         //Mostrar datos
        
        document.getElementById("display-email").textContent = `Correo: ${formData.email}`;
        document.getElementById("display-name").textContent = `Nombre: ${formData.nombre} ${formData.apellido} ${formData.segundoApellido}`;
        document.getElementById("display-number").textContent = `Telefono/Movil: ${formData.telefono}`;
    
    }

});

    document.addEventListener("DOMContentLoaded", function () {
        // Recuperamos el subtotal guardado en localStorage
        let subTotalValue = parseFloat(localStorage.getItem('cartSubtotal')) || 0; // Si no hay subtotal, ponemos 0

        // Llamamos a la función para actualizar el total en el checkout
        updateTotal(subTotalValue);  
        
        // Event listener para el cambio de tipo de envío
        const shippingSelect = document.getElementById('types-of-shipments');
        shippingSelect.addEventListener('change', function () {
            updateTotal(subTotalValue);  
        });
    });
    
    // Función para actualizar el total en el checkout
    function updateTotal(subTotalValue) {
        const totalElement = document.getElementById("total-cost");
        
        const shippingCost = getShippingCost(subTotalValue); 
        let totalValue = subTotalValue + shippingCost;
        
        // Mostrar el total con el envío
        totalElement.textContent = `U$S ${totalValue.toFixed(2)}`; 
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
    
