//Recuperar datos para apartado de Identificacion

document.addEventListener("DOMContentLoaded", function(){
   
    //Recuperar datos
 
    const formData = JSON.parse(localStorage.getItem("DatosdelUsuario"));

    if (formData) {

        //Mostrar datos de contacto
        
        document.getElementById("info-email").textContent = `Correo: ${formData.email}`;
        document.getElementById("info-name").textContent = `Nombre: ${formData.nombre} ${formData.apellido} ${formData.segundoApellido}`;
        document.getElementById("info-number").textContent = `Telefono/Movil: ${formData.telefono}`;

    }

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
});