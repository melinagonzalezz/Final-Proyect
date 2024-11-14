// Function para añadir una dirección nueva
function addAddress() {
    const list = document.getElementById('address-list');
    const newAddress = document.createElement('li');
    // Crear un elemento de lista con opciones de edición y eliminación
    newAddress.innerHTML = 'Nueva Dirección <span class="edit" onclick="editAddress(this)">Editar</span> <span class="delete" onclick="deleteAddress(this)">Eliminar</span>';
    list.appendChild(newAddress);
    updateLocalStorage();
}

// Function para editar una dirección ya añadida
function editAddress(element) {
    const addressItem = element.parentNode; // Obtener el elemento de la dirección
    const addressText = addressItem.firstChild.textContent.trim(); // Obtener el texto actual de la dirección
    const address = prompt('Edita la dirección:', addressText); // Pedir al usuario que edite la dirección
    
    if (address) {
        addressItem.firstChild.textContent = address; // Actualizar el texto de la dirección
        updateLocalStorage(); // Guardar los cambios en localStorage
    }
}

// Function para borrar una dirección
function deleteAddress(element) {
    if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
        const li = element.parentNode; // Obtener el elemento de la dirección
        li.parentNode.removeChild(li); // Eliminar la dirección de la lista

        // Actualizar el almacenamiento en localStorage
        updateLocalStorage();
    }
}

// Function para guardar una dirección desde el formulario
function saveAddress() {
    // Obtener los valores de los campos del formulario
    const department = document.getElementById('department').value;
    const locality = document.getElementById('locality').value;
    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;
    const floor = document.getElementById('floor').value;
    const isDefault = document.getElementById('default-address').checked;

    // Validación de campos obligatorios
    if (!department || !locality || !street || !number) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    // Formato de la nueva dirección
    const newAddress = {
        department,
        locality,
        street,
        number,
        floor,
        isDefault
    };

    // Crear elemento de lista para la nueva dirección
    const list = document.getElementById('address-list');
    const li = document.createElement('li');
    const addressText = `${newAddress.department}, ${newAddress.locality}, ${newAddress.street} ${newAddress.number}, ${newAddress.floor ? `Piso ${newAddress.floor}` : ''}`;

    li.innerHTML = `${addressText} ${newAddress.isDefault ? '<strong>(Predeterminada)</strong>' : ''} 
                    <span class="edit" onclick="editAddress(this)">Editar</span> 
                    <span class="delete" onclick="deleteAddress(this)">Eliminar</span>`;
    list.appendChild(li);

    // Si se seleccionó como predeterminada, actualizar las demás direcciones
    if (newAddress.isDefault) {
        const addresses = document.querySelectorAll('#address-list li');
        addresses.forEach((item) => {
            if (item.innerHTML.includes('(Predeterminada)') && item !== li) {
                item.innerHTML = item.innerHTML.replace('<strong>(Predeterminada)</strong>', '');
            }
        });
    }

    updateLocalStorage(); // Guardar en localStorage
    document.getElementById('address-form').reset(); // Limpiar el formulario
}

// Function para guardar la lista de direcciones en localStorage
function updateLocalStorage() {
    const listItems = document.querySelectorAll('#address-list li'); // Obtener todas las direcciones
    const addresses = [];

    // Agregar cada dirección a la lista para almacenamiento
    listItems.forEach((item) => {
        // Extraer la dirección del texto, eliminando el texto "(Predeterminada)"
        const addressText = item.firstChild.textContent.trim().replace('(Predeterminada)', '').trim();
        
        // Verificar si la dirección es predeterminada
        const isDefault = item.innerHTML.includes('(Predeterminada)');
        
        addresses.push({ addressText, isDefault });
    });

    localStorage.setItem('addresses', JSON.stringify(addresses)); // Guardar en localStorage
}

// Function para cargar las direcciones desde localStorage
function loadAddresses() {
    
    const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
    
    console.log('Direcciones recuperadas del localStorage:', savedAddresses); 

    const list = document.getElementById('address-list');

    list.innerHTML = '';

    // Crear un elemento de lista para cada dirección almacenada
    savedAddresses.forEach((address) => {
        const li = document.createElement('li');
        li.innerHTML = `${address.addressText} ${address.isDefault ? '<strong>(Predeterminada)</strong>' : ''} 
                        <span class="edit" onclick="editAddress(this)">Editar</span> 
                        <span class="delete" onclick="deleteAddress(this)">Eliminar</span>`;
        list.appendChild(li);
    });
}

// Cargar direcciones cuando la página se haya cargado
document.addEventListener('DOMContentLoaded', loadAddresses);
