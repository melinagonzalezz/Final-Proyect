// CAMBIOS PARA ENTREGA 7
// Modificar cantidades 0 o eliminar. (vero)
// Badge. (Marci<3)
// Guardar total y currency en local storage con el boton Ir a checkout. (azul)
// Hacer funcionar el descuento con aplicar. Patience Pass -10%. JapS3 -20%. JapS$ +10%. (pao) 
//
// En caso de tener el descuento de Patience traerlo de local Storage. (pao)
// Agregarle funcionalidad al info-cuenta (mel)


document.addEventListener("DOMContentLoaded", function () {
    
    // Llama a la función para mostrar el carrito en la página cuando el DOM se ha cargado completamente
    
    displayCart();
    saveCurrency();
    updateSubTotal();
    
});

// Verificar si se guardó algo en el carrito y mostrarlo
function displayCart() {
    const cartItemsContainer = document.getElementById("cart-list"); // Contenedor para los productos del carrito
    const cartItems = JSON.parse(localStorage.getItem("cart")) || []; // Recupera los productos guardados en el carrito desde localStorage

    cartItemsContainer.innerHTML = ""; // Limpiar el contenido previo del carrito

    // Si el carrito está vacío
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <p>Aún no has añadido ningún producto</p>
            <br>
            <a href="index.html">Volver a inicio</a>`;
    } else {
        // Itera sobre los productos del carrito
        cartItems.forEach((product, index) => {
            let newItem = `
                <div class="card mb-3 bg-secondary">
                    <div class="row g-0 m-3">
                        <div class="col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
                            <div class="card-img-top d-flex justify-content-center">
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
                                    <div class="input-group flex-nowrap" style="max-width: 120px;">
                                        <button id="subtract" class="btn btn-light decrease-btn">-</button>
                                        <input type="number" value="1" id="quantity" min="1" class="form-control text-center quantity-input">
                                        <button id="add" class="btn btn-light increase-btn">+</button>
                                    </div>
                                </div>

                                <button id="ver-btn-${product.id}" class="btn btn-dark position-relative m-2 order-2 order-sm-5">Ver Detalles</button>
                                <button onclick="removeCartItem(${index})" class="btn btn-dark position-relative m-2 order-2 order-sm-5">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Añadir tarjeta del producto al carrito
            cartItemsContainer.innerHTML += newItem;

            // Agregar evento para ver detalles del producto
            document.getElementById(`ver-btn-${product.id}`).addEventListener('click', function () {
                saveProductId(product.id, category); // Guardar ID del producto y redirigir
            });
        });

        // Obtener todos los contenedores de productos
        const products = document.querySelectorAll('.product');

        // Iterar sobre cada contenedor de producto y añadir eventos para actualizar cantidades
        products.forEach(product => {
            const decreaseBtn = product.querySelector('.decrease-btn');
            const increaseBtn = product.querySelector('.increase-btn');
            const quantityInput = product.querySelector('.quantity-input');

            // Evento para actualizar subtotales al cambiar la cantidad
            quantityInput.addEventListener('input', updateSubTotal);

            // Evento para aumentar la cantidad
            increaseBtn.addEventListener('click', () => {
                quantityInput.value = parseInt(quantityInput.value) + 1;
                updateSubTotal();
            });

            // Evento para disminuir la cantidad, con validación
            decreaseBtn.addEventListener('click', () => {
                let currentQuantity = parseInt(quantityInput.value);
                if (currentQuantity <= 1) {
                    alert("La cantidad no puede ser menor a 1");
                    quantityInput.value = 1;
                } else {
                    quantityInput.value = currentQuantity - 1;
                }
                updateSubTotal();
            });
        });

        updateSubTotal(); // Llamar para actualizar el subtotal inicial
    }
} 

// Función para actualizar el subtotal basado en las cantidades de productos
function updateSubTotal() {
    const subtotalElement = document.getElementById("subTotal");
    let subTotalValor = 0;

    document.querySelectorAll(".card-body").forEach(card => {
        const quantityInput = card.querySelector('.quantity-input');
        const currency = card.querySelector('.currency').textContent.trim();
        const priceElement = card.querySelector('.price');

        // Validar y corregir el valor de la cantidad
        quantityInput.value = Math.max(1, parseInt(quantityInput.value) || 1);

        let price = parseFloat(priceElement.textContent);
        let quantity = parseInt(quantityInput.value);

        // Calcular el subtotal en USD (si es UYU, convertir)
        subTotalValor += (currency === "USD" ? price : price / 42) * quantity;
    });

    console.log("Subtotal actualizado:", subTotalValor); // Verificar el subtotal calculado
    subtotalElement.textContent = 'USD $' + subTotalValor.toFixed(2);
    updateTotal(); // Actualizar el total después de recalcular el subtotal
}


//Funcion para actualizar el Total
function updateTotal() {
    const subtotalElement = document.getElementById("subTotal");
    const totalElement = document.getElementById("total");

    let subTotalValue = parseFloat(subtotalElement.textContent.replace('USD $', '')) || 0;

    // Obtener los descuentos seleccionados
    let selectedDiscounts = JSON.parse(localStorage.getItem("selectedDiscount")) || [];
    console.log("Descuentos seleccionados al inicio de updateTotal:", selectedDiscounts);

    selectedDiscounts.forEach(discount => {
        switch (discount) {
            case "ZEN10":
                subTotalValue -= subTotalValue * 0.10;
                break;
            case "JAP285S3":
                subTotalValue -= subTotalValue * 0.20;
                break;
            default:
                if (discount.startsWith("JAP285S") && discount.length === 8 && discount[7] !== "3") {
                    subTotalValue += subTotalValue * 0.15;
                }
                break;
        }
    });

    console.log("Subtotal después de aplicar descuentos:", subTotalValue);

    const currencySelected = document.getElementById('currencySelect').value;

    if (currencySelected === "US") {
        totalElement.textContent = 'Total: $' + subTotalValue.toFixed(2);
        localStorage.setItem("savedTotal", subTotalValue.toFixed(2));
    } else if (currencySelected === "UY") {
        const exchangeRate = 42;
        totalElement.textContent = 'Total: $' + (subTotalValue * exchangeRate).toFixed(2);
        localStorage.setItem("savedTotal", (subTotalValue * exchangeRate).toFixed(2));
    } else {
        totalElement.textContent = 'Error: Moneda no reconocida';
    }

    console.log("Total actualizado:", totalElement.textContent);
}


// Función para mostrar la tarjeta con el descuento aplicado
function showDiscountCard(discountInput, discountAmount) {
    const discountCard = document.getElementById("discountCards");
    const discountSign = discountAmount < 0 ? "-" : "+";
    const formattedAmount = Math.abs(discountAmount).toFixed(2);

    // Crear el elemento de la tarjeta
    const card = document.createElement('div');
    card.className = "d-flex justify-content-between bg-dark text-light p-2 currency";
    card.innerHTML = `
        <p class="flex-fill mb-0">DESCUENTOS</p>
        <p class="flex-fill mb-0">Código: ${discountInput}</p>
        <p class="flex-fill mb-0">${discountSign} $${formattedAmount}</p>
    `;

    // Añadir la tarjeta al contenedor
    discountCard.appendChild(card);

    console.log("Tarjeta añadida correctamente");
}


function discounts() {
    let discountInput = document.getElementById("discountInput").value.trim();
    let discountMessage = document.getElementById("discountMessage");

    let userDiscounts = JSON.parse(localStorage.getItem("userDiscounts")) || [];
    let selectedDiscount = JSON.parse(localStorage.getItem("selectedDiscount")) || [];
    let subTotalValue = parseFloat(document.getElementById("subTotal").textContent.replace('USD $', ''));

    console.log("Descuentos seleccionados antes:", selectedDiscount);
    console.log("Subtotal antes de aplicar descuento:", subTotalValue);

    let discountAmount = 0;

    if (userDiscounts.includes("plus")) {

        discountMessage.innerHTML = `<p>Recordatorio: Tienes un descuento de 10% disponible usando el código ZEN10</p>`;

    } if (discountInput === "ZEN10" && !selectedDiscount.includes("ZEN10")) {

        selectedDiscount.push("ZEN10");
        localStorage.setItem("selectedDiscount", JSON.stringify(selectedDiscount));
        console.log("Descuento ZEN10 añadido al localStorage");
        
        discountAmount = -(subTotalValue * 0.10);
        showDiscountCard(discountInput, discountAmount);
        discountMessage.innerHTML = `<p>¡Descuento ZEN10 aplicado!</p>`;

    } else if (discountInput === "ZEN10" && selectedDiscount.includes("ZEN10")) {

        discountMessage.innerHTML = `<p>¡Ya has aplicado este descuento</p>`; 
        
        
    } else if (discountInput === "JAP285S3" && !selectedDiscount.includes("JAP285S3")) {

        selectedDiscount.push("JAP285S3");
        localStorage.setItem("selectedDiscount", JSON.stringify(selectedDiscount));
        console.log("Descuento JAP285S3 añadido al localStorage");

        discountAmount = -(subTotalValue * 0.20);
        showDiscountCard(discountInput, discountAmount);
        discountMessage.innerHTML = `<p>¡Descuento JAP285S3 aplicado!</p>`;
        
    } else if (discountInput === "JAP285S3" && selectedDiscount.includes("JAP285S3")) {  

        discountMessage.innerHTML = `<p>¡Ya has aplicado este descuento!</p>`; 

    } else if (discountInput.startsWith("JAP285S") && discountInput.length === 8 && discountInput[7] !== "3") {

        selectedDiscount.push(discountInput);
        localStorage.setItem("selectedDiscount", JSON.stringify(selectedDiscount));
        console.log("Aumento añadido al localStorage");
        
        discountAmount = subTotalValue * 0.15;
        showDiscountCard(discountInput, discountAmount);
        discountMessage.innerHTML = `<p>¡Se te añadió un interés de 15% por equivocarte de grupo!</p>`;

    } else {

        discountMessage.innerHTML = `<p>¡Código de descuento no válido!</p>`;
        console.log("No funcionan los descuentos, ayuda");

    }

    console.log("Descuentos seleccionados después:", selectedDiscount);

    // Actualizar el total
    updateTotal();
}




// Evento para aplicar el descuento
document.getElementById("addDiscount").addEventListener("click", discounts);

// Evento para guardar la moneda seleccionada y actualizar el total
function saveCurrency() {
    const currencySelect = document.getElementById('currencySelect');

    // Cargar la moneda seleccionada desde localStorage
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
        currencySelect.value = savedCurrency;
    }

    // Cambiar la moneda seleccionada y actualizar el total
    currencySelect.addEventListener('change', function () {
        localStorage.setItem('selectedCurrency', this.value);
        updateTotal();
    });

    updateTotal();
}

// Función para guardar el ID y redirigir a la página de detalles del producto
function saveProductId(id, category) {
    const queryString = `?id=${id}&category=${category}`;
    window.location.href = `product-info.html${queryString}`;
}

// Función para eliminar un producto del carrito
function removeCartItem(index) {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

    // Eliminar el producto del array de carrito
    cartItems.splice(index, 1);

    localStorage.setItem("cart", JSON.stringify(cartItems)); // Guardar el carrito actualizado
    displayCart(); // Actualizar la vista del carrito
}

// Mostrar el nombre del usuario al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const userName = localStorage.getItem('currentUsername'); // Obtiene el nombre de usuario desde localStorage

    // Muestra el nombre de usuario en el elemento correspondiente
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = userName;
});