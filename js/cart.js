document.addEventListener("DOMContentLoaded", function () {

    // Llama a la función para mostrar el carrito en la página
    
    displayCart();
});

//Verificar si se guardo algo en el carrito
function displayCart () {
    const cartItemsContainer = document.getElementById("cart-list");
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    cartItemsContainer.innerHTML = "";

    if(cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <p>Aun no has añadido nungun producto</p>
            <br>
            <a href="index.html">Volver a inicio</a>`;     
    } else {
        cartItems.forEach((product, index) => {

        let newItem = `
            <div class="card mb-3 bg-secondary">
            <div class="row g-0 m-3">
              
                <div class="col-md-4 col-sm-12 d-flex justify-content-center align-items-center ">
                    <div class="card-img-top d-flex justify-content-center ">
                        <img src="${product.image}" alt="${product.name}" class="img-fluid" style="max-width: 100%; height: auto;">
                    </div>
                </div>
                
                <div class="col-md-8 col-sm-12 ps-4">
                    <div class="card-body d-flex flex-column justify-content-between position-relative h-100">
                        <h4 class="card-title f-wbold">${product.name}</h4>

                        <div class="d-flex">
                            <p class="card-text fw-bold currency">${product.currency}</p>
                            <p class="card-text fw-bold">$</p>
                            <p class="card-text fw-bold price">${product.cost}</p>
                        </div>

                        <p class="card-text">Cod-${product.id}</p>

                        <div class="product d-flex align-items-center mb-2 w-sm-auto d-sm-block">
                            <span class="me-2">Cantidad:</span>
                            <div class="input-group flex-nowrap " style="max-width: 120px;">
                                <button id="subtract" class="btn btn-light decrease-btn">-</button>
                                <input type="number" value="1" id="quantity" min="1" class="form-control text-center quantity-input">
                                <button id="add" class="btn btn-light increase-btn">+</button>
                            </div>
                        </div>

                        <button id="ver-btn-${product.id}" class="btn btn-dark position-relative m-2 order-2 order-sm-5" href="">Ver Detalles</button>
                        <button onclick="removeCartItem(${index})" class="btn btn-dark position-relative m-2 order-2 order-sm-5" href="">Eliminar</button>
                        
                    </div>
                </div>
            </div>
          </div>
        `;
        //Añadir tarjeta del producto
        cartItemsContainer.innerHTML += newItem;

        // Agregar evento para guardar ID y redirigir
        document.getElementById(`ver-btn-${product.id}`).addEventListener('click', function() {
            saveProductId(product.id, category);
        });

    });

    // Obtener todos los contenedores de productos
    const products = document.querySelectorAll('.product');

    // Iterar sobre cada contenedor de producto
    products.forEach(product => {
        const decreaseBtn = product.querySelector('.decrease-btn');
        const increaseBtn = product.querySelector('.increase-btn');
        const quantityInput = product.querySelector('.quantity-input');
    
        quantityInput.addEventListener('input', updateSubTotal);
    
        increaseBtn.addEventListener('click', () => {
            quantityInput.value = parseInt(quantityInput.value) + 1;
            updateSubTotal()
        });

        decreaseBtn.addEventListener('click', () => {
            quantityInput.value = parseInt(quantityInput.value) - 1;
            updateSubTotal()
        });
    })

    updateSubTotal(); 
}}


function updateSubTotal(){
    const subtotalElement = document.getElementById("subTotal");
    let subTotalValor = 0;

    let cards = document.querySelectorAll(".card-body")

    cards.forEach(card => {

        const quantityInput = card.querySelector('.quantity-input');
        const currency = card.querySelector('.currency').textContent.trim();
        const priceElement = card.querySelector('.price'); 

        //Por las dudas para asegurarme de que cantidad solo traiga números
        quantityInput.value = parseInt(quantityInput.value.replace(/[^0-9]/g, '')); 

        console.log(currency);
       
        if (currency === "USD") {
            
            subTotalValor += quantityInput.value * parseFloat(priceElement.textContent);
            
            console.log(`Moneda: ${currency}, Precio: ${priceElement.textContent}, Cantidad: ${quantityInput.value}`);

        } else {
            
            subTotalValor += quantityInput.value * parseFloat(priceElement.textContent) / 42;
            
            console.log(`Moneda: ${currency}, Precio: ${priceElement.textContent}, Cantidad: ${quantityInput.value}`);
            
        }

    })

    subtotalElement.textContent = 'USD $' + subTotalValor.toFixed(2);
    updateTotal();
}


document.addEventListener('DOMContentLoaded', function () {
    const currencySelect = document.getElementById('currencySelect');

    // Toma el valor guardado en localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
        currencySelect.value = savedCurrency;
    }

    // Si cambias la seleccion actual
    currencySelect.addEventListener('change', function () {
        localStorage.setItem('selectedCurrency', this.value);
        updateTotal(); // Actualiza el total 
    });

    updateTotal(); 
});

function updateTotal() {
    const subtotalElement = document.getElementById("subTotal");
    const totalElement = document.getElementById("total");
    const shippingCost = 25; 

    let subTotalValue = parseFloat(subtotalElement.textContent.replace('USD $', ''));
    console.log("Subtotal: ", subTotalValue);
    
    let totalValue = subTotalValue + shippingCost; 

    // Convertir el total según la moneda seleccionada
    const currencySelected = document.getElementById('currencySelect').value;
    
    console.log("Moneda seleccionada: " + currencySelected);

    if (!currencySelected) {
        console.error("No se ha seleccionado una moneda.");
        return; 
    }

    if (currencySelected === "US") {
        totalElement.textContent = 'Total: $' + totalValue.toFixed(2); 
    } else if (currencySelected === "UY") {
        totalElement.textContent = 'Total: $' + (totalValue * 42).toFixed(2); 
    } else {
        totalElement.textContent = 'Error: Moneda no reconocida';
    }
}


 // Función para guardar el ID y redirigir a la página de detalles
 function saveProductId(id, category) {
    const queryString = `?id=${id}&category=${category}`;
    window.location.href = `product-info.html${queryString}`;
}

// Función para eliminar un producto del carrito
function removeCartItem(index) {
    
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    cartItems.splice(index, 1); // Eliminar el producto del array

    localStorage.setItem("cart", JSON.stringify(cartItems));

    displayCart(); // Actualizar la lista
}


