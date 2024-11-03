
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
    });

    //Volverr al checkout-2
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

















