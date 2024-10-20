// Function para añadir una direccion
function addAddress() {
    const list = document.getElementById('address-list');
    const newAddress = document.createElement('li');
    newAddress.innerHTML = 'Nueva Dirección <span class="edit" onclick="editAddress(this)">Editar</span> <span class="delete" onclick="deleteAddress(this)">Eliminar</span>';
    list.appendChild(newAddress);
}

// Function para editar una direccion ya añadida
function editAddress(element) {
    const address = prompt('Edita la dirección:', element.parentNode.firstChild.textContent.trim());
    if (address) {
        element.parentNode.firstChild.textContent = address;
    }
}

// Function para borrar una direccion
function deleteAddress(element) {
    if (confirm('¿Estás seguro de que quieres eliminar esta dirección?')) {
        const li = element.parentNode;
        li.parentNode.removeChild(li);
    }
}

// Function para guardar una direccion desde el formulario
function saveAddress() {
    const department = document.getElementById('department').value;
    const locality = document.getElementById('locality').value;
    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;
    const floor = document.getElementById('floor').value;
    const phone = document.getElementById('phone').value;

    if (!department || !locality || !street || !number || !phone) {
        alert('Por favor, completa todos los campos obligatorios.');
        return;
    }

    const newAddress = `${department}, ${locality}, ${street} ${number}, ${floor ? `Piso ${floor}` : ''}`;
    
    const list = document.getElementById('address-list');
    const li = document.createElement('li');
    li.innerHTML = `${newAddress} <span class="edit" onclick="editAddress(this)">Editar</span> <span class="delete" onclick="deleteAddress(this)">Eliminar</span>`;
    
    list.appendChild(li);

    updateLocalStorage();

    document.getElementById('address-form').reset(); 
}

//Function para guaardar en LocalStorage

function updateLocalStorage() {
    const listItems = document.querySelectorAll('#address-list li');
    const addresses = [];

    listItems.forEach((item) => {
        const addressText = item.firstChild.textContent.trim();
        addresses.push(addressText);
    });

    localStorage.setItem('addresses', JSON.stringify(addresses));
}

//Function para cargar las direcciones desde localStorage

function loadAddresses() {
    const savedAddresses = JSON.parse(localStorage.getItem('addresses')) || [];
    const list = document.getElementById('address-list');

    savedAddresses.forEach((address) => {
        const li = document.createElement('li');
        li.innerHTML = `${address} <span class="edit" onclick="editAddress(this)"> Editar </span>
        <span class="delete" onclick="deleteAddress(this)"> Eliminar </span>`;

        list.appendChild(li);
    });
}

window.onload = loadAddresses;