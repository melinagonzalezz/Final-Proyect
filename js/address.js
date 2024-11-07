// Function para añadir una dirección
function addAddress() {
    const list = document.getElementById('address-list');
    const newAddress = document.createElement('li');
    newAddress.innerHTML = 'Nueva Dirección <span class="edit" onclick="editAddress(this)">Editar</span> <span class="delete" onclick="deleteAddress(this)">Eliminar</span>';
    list.appendChild(newAddress);
}

// Function para editar una dirección ya añadida
function editAddress(element) {
    const addressItem = element.parentNode;
    const addressText = addressItem.firstChild.textContent.trim();
    const address = prompt('Edita la dirección:', addressText);
    
    if (address) {
        addressItem.firstChild.textContent = address;
        updateLocalStorage();
    }
}

// Function para borrar una dirección
function deleteAddress(element) {
    if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
        const li = element.parentNode;
        li.parentNode.removeChild(li);
        updateLocalStorage();
    }
}

// Function para guardar una dirección desde el formulario
function saveAddress() {
    const department = document.getElementById('department').value;
    const locality = document.getElementById('locality').value;
    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;
    const floor = document.getElementById('floor').value;
    const isDefault = document.getElementById('default-address').checked; 
    
    // Validación
    if (!department || !locality || !street || !number) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    // Formato de la nueva dirección
    const newAddress = `${department}, ${locality}, ${street} ${number}, ${floor ? `Piso ${floor}` : ''}`;
    
    const list = document.getElementById('address-list');
    const li = document.createElement('li');
    
    li.innerHTML = `${newAddress} ${isDefault ? '<strong>(Predeterminada)</strong>' : ''} <span class="edit" onclick="editAddress(this)">Editar</span> <span class="delete" onclick="deleteAddress(this)">Eliminar</span>`;
    
    list.appendChild(li);

    if (isDefault) {
        const addresses = document.querySelectorAll('#address-list li');
        addresses.forEach((item) => {
            if (item.innerHTML.includes('(Predeterminada)') && item !== li) {
                item.innerHTML = item.innerHTML.replace('<strong>(Predeterminada)</strong>', '');
            }
        });
    }

    updateLocalStorage();
    document.getElementById('address-form').reset(); 
}

// Function para guardar en LocalStorage
function updateLocalStorage() {
    const listItems = document.querySelectorAll('#address-list li');
    const addresses = [];

    listItems.forEach((item) => {
        const addressText = item.firstChild.textContent.trim();
        addresses.push(addressText);
    });

    localStorage.setItem('addresses', JSON.stringify(addresses));
}

// Function para cargar las direcciones desde localStorage
function loadAddresses() {
    const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
    
    console.log('Direcciones recuperadas del localStorage:', savedAddresses); 

    const list = document.getElementById('address-list');
    list.innerHTML = '';

    savedAddresses.forEach((addressText) => {
        const li = document.createElement('li');
        
        const isDefault = addressText.includes('(Predeterminada)');
        li.innerHTML = `${addressText} ${isDefault ? '<strong>(Predeterminada)</strong>' : ''} <span class="edit" onclick="editAddress(this)">Editar</span> <span class="delete" onclick="deleteAddress(this)">Eliminar</span>`;
        
        list.appendChild(li);
    });
}

// Cargar direcciones cuando la página se haya cargado
document.addEventListener('DOMContentLoaded', loadAddresses);
