document.addEventListener("DOMContentLoaded", () => {
    displayCart();
    updateCartBadge();
    saveCurrency();
    updateSubTotal();
    loadDiscountCards();

    const userName = localStorage.getItem("currentUsername");
    const usernameDisplay = document.getElementById("username-display");
    if (userName && usernameDisplay) {
        usernameDisplay.textContent = userName;
    }

    const addDiscountBtn = document.getElementById("addDiscount");
    if (addDiscountBtn) {
        addDiscountBtn.addEventListener("click", discounts);
    }

    const checkoutBtn = document.getElementById("cart-to-checkout-1");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", handleCheckout);
    }
    
});

function handleCheckout(e) {
    e.preventDefault();

    // Validar que el carrito no esté vacío
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItems.length === 0) {
        alert("¡Por favor selecciona al menos un producto para continuar!");
        return;
    }

    // Verificar aceptación de términos y condiciones
    const termsCheckbox = document.getElementById("termsCheckbox");
    if (!termsCheckbox || !termsCheckbox.checked) {
        alert("Debes aceptar los términos y condiciones para continuar.");
        return;
    }

    // Verificar que la moneda esté seleccionada
    const currency = localStorage.getItem("selectedCurrency");
    if (!currency) {
        alert("La moneda no está seleccionada.");
        return;
    }

    // Verificar que el total esté guardado
    const totalSaved = localStorage.getItem("savedTotal");
    if (!totalSaved || totalSaved === "0") {
        console.log("No se ha guardado el total.");
        return;
    }

    // Verificar si se han seleccionado descuentos
    const discounts = JSON.parse(localStorage.getItem("selectedDiscount")) || [];
    if (discounts.length > 0) {
        console.log("Descuentos aplicados:", discounts);
    }

    // Redirigir al checkout si todo es válido
    window.location.href = "cart-checkout.html";
}

// Verificar si se guardó algo en el carrito y mostrarlo
function displayCart() {
    const cartItemsContainer = document.getElementById("cart-list");
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItemsContainer.innerHTML = "";

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <p>Aún no has añadido ningún producto</p>
            <br>
            <a href="index.html">Volver a inicio</a>`;
    } else {
        cartItems.forEach((product, index) => {
            let newItem = `
                <div class="card mb-3 bg-secondary">
                    <div class="row g-0 m-3">
                        <div class="col-md-4 col-sm-12 d-flex justify-content-center align-items-center">
                            <div class="card-img-top d-flex justify-content-center">
                                <img src="http://localhost:3000/${product.images[0]}" alt="${product.name}" class="img-fluid" style="max-width: 100%; height: auto;">
                            </div>
                        </div>
                        <div class="col-md-8 col-sm-12 ps-4">
                            <div class="card-body d-flex flex-column justify-content-between position-relative h-100">
                                <h4 class="card-title fw-bold">${product.name}</h4>
                                <div class="d-flex">
                                    <p class="card-text fw-bold currency">${product.currency}</p>
                                    <p class="card-text fw-bold">$</p>
                                    <p class="card-text fw-bold price">${product.cost}</p>
                                </div>
                                <p class="card-text">Cod-${product.id}</p>
                                <div class="product d-flex align-items-center mb-2">
                                    <span class="me-2">Cantidad:</span>
                                    <div class="input-group flex-nowrap" style="max-width: 120px;">
                                        <button class="btn btn-light decrease-btn">-</button>
                                        <input type="number" value="1" min="1" class="form-control text-center quantity-input">
                                        <button class="btn btn-light increase-btn">+</button>
                                    </div>
                                </div>
                                <button id="ver-btn-${product.id}" class="btn btn-dark m-2">Ver Detalles</button>
                                <button onclick="removeCartItem(${index})" class="btn btn-dark m-2">Eliminar</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            cartItemsContainer.innerHTML += newItem;

            document.getElementById(`ver-btn-${product.id}`).addEventListener('click', function () {
                saveProductId(product.id, product.category);
            });
        });

        const products = document.querySelectorAll('.product');
        products.forEach(product => {
            const decreaseBtn = product.querySelector('.decrease-btn');
            const increaseBtn = product.querySelector('.increase-btn');
            const quantityInput = product.querySelector('.quantity-input');

            quantityInput.addEventListener('input', updateSubTotal);
            increaseBtn.addEventListener('click', () => {
                quantityInput.value = parseInt(quantityInput.value) + 1;
                updateSubTotal();
            });
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

        updateSubTotal();
    }
}

// Función para cargar tarjetas de descuentos al cargar la página
function loadDiscountCards() { 
    const selectedDiscounts = JSON.parse(localStorage.getItem("selectedDiscount")) || [];
    const discountCardsContainer = document.getElementById("discountCards");
    const userDiscounts = JSON.parse(localStorage.getItem("userDiscounts")) || []; 
    discountCardsContainer.innerHTML = "";

    selectedDiscounts.forEach(discount => {
        let discountAmount = calculateDiscountAmount(discount);
        showDiscountCard(discount, discountAmount);
    });

    if (userDiscounts.includes("ZEN10") && !selectedDiscounts.includes("ZEN10")) {
        let discountAmount = calculateDiscountAmount("ZEN10");
        showDiscountCard("ZEN10", discountAmount); 
        alert("Descuento Patience Plus aplicado por compra previa.");
    }
}


// Función para calcular el monto del descuento basado en el código
function calculateDiscountAmount(discount) {
    const subTotalValue = parseFloat(document.getElementById("subTotal").textContent.replace('USD $', ''));
    switch (discount) {
        case "ZEN10":
            return -(subTotalValue * 0.10);
        case "JAP285S3":
            return -(subTotalValue * 0.20);
        default:
            if (discount.startsWith("JAP285S") && discount.length === 8 && discount[7] !== "3") {
                return subTotalValue * 0.15;
            }
            return 0;
    }
}

// Función para actualizar el subtotal
function updateSubTotal() {
    const subtotalElement = document.getElementById("subTotal");
    let subTotalValor = 0;

    document.querySelectorAll(".card-body").forEach(card => {
        const quantityInput = card.querySelector('.quantity-input');
        const currency = card.querySelector('.currency').textContent.trim();
        const priceElement = card.querySelector('.price');

        quantityInput.value = Math.max(1, parseInt(quantityInput.value) || 1);
        let price = parseFloat(priceElement.textContent);
        let quantity = parseInt(quantityInput.value);

        subTotalValor += (currency === "USD" ? price : price / 42) * quantity;
    });

    subtotalElement.textContent = 'USD $' + subTotalValor.toFixed(2);
    updateTotal();
}

// Función para actualizar el total
function updateTotal() {
    const subtotalElement = document.getElementById("subTotal");
    const totalElement = document.getElementById("total");

    let subTotalValue = parseFloat(subtotalElement.textContent.replace('USD $', '')) || 0;
    let selectedDiscounts = JSON.parse(localStorage.getItem("selectedDiscount")) || [];

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

    const currencySelected = document.getElementById('currencySelect').value;
    const exchangeRate = 42;

    totalElement.textContent = currencySelected === "US"
        ? 'Total: $' + subTotalValue.toFixed(2)
        : 'Total: $' + (subTotalValue * exchangeRate).toFixed(2);

    localStorage.setItem("savedTotal", totalElement.textContent);
}

// Función para mostrar la tarjeta con el descuento aplicado
function showDiscountCard(discountInput, discountAmount) {
    const discountCard = document.getElementById("discountCards");
    const discountSign = discountAmount < 0 ? "-" : "+";
    const formattedAmount = Math.abs(discountAmount).toFixed(2);

    const card = document.createElement('div');
    card.className = "d-flex justify-content-between bg-dark text-light p-2 align-items-center";
    
    card.innerHTML = `
        <p class="flex-fill mb-0">DESCUENTO</p>
        <p class="flex-fill mb-0">Código: ${discountInput}</p>
        <p class="flex-fill mb-0">${discountSign} $${formattedAmount}</p>
        <i class="bi bi-x-circle remove-discount-btn"></i>
    `;

    discountCard.appendChild(card);

    // Botón para eliminar el código de descuento
    card.querySelector(".remove-discount-btn").addEventListener("click", function () {
        removeDiscount(discountInput);
        discountCard.removeChild(card);  // Elimina la tarjeta del DOM
    });
}

// Función para eliminar el descuento del localStorage y actualizar los descuentos
function removeDiscount(discountCode) {
    const selectedDiscounts = JSON.parse(localStorage.getItem("selectedDiscount")) || [];

    // Filtra el descuento que se debe eliminar
    const updatedDiscounts = selectedDiscounts.filter(discount => discount !== discountCode);

    // Actualiza el localStorage con los descuentos restantes
    localStorage.setItem("selectedDiscount", JSON.stringify(updatedDiscounts));

    // Actualiza el total después de eliminar el descuento
    updateTotal();
}


// Función de descuentos
function discounts() {
    const discountInput = document.getElementById("discountInput").value.trim();
    const discountMessage = document.getElementById("discountMessage");

    const userDiscounts = JSON.parse(localStorage.getItem("userDiscounts")) || [];
    const selectedDiscount = JSON.parse(localStorage.getItem("selectedDiscount")) || [];
    const subTotalValue = parseFloat(document.getElementById("subTotal").textContent.replace('USD $', ''));

    let discountAmount = 0;

    if (discountInput === "ZEN10" && !selectedDiscount.includes("ZEN10")) {
        selectedDiscount.push("ZEN10");
        localStorage.setItem("selectedDiscount", JSON.stringify(selectedDiscount));
        discountAmount = -(subTotalValue * 0.10);
        showDiscountCard(discountInput, discountAmount);
        discountMessage.innerHTML = `<p>¡Descuento ZEN10 aplicado!</p>`;
    } else if (discountInput === "JAP285S3" && !selectedDiscount.includes("JAP285S3")) {
        selectedDiscount.push("JAP285S3");
        localStorage.setItem("selectedDiscount", JSON.stringify(selectedDiscount));
        discountAmount = -(subTotalValue * 0.20);
        showDiscountCard(discountInput, discountAmount);
        discountMessage.innerHTML = `<p>¡Descuento JAP285S3 aplicado!</p>`;
    } else if (discountInput.startsWith("JAP285S") && discountInput.length === 8 && discountInput[7] !== "3") {
        selectedDiscount.push(discountInput);
        localStorage.setItem("selectedDiscount", JSON.stringify(selectedDiscount));
        discountAmount = subTotalValue * 0.15;
        showDiscountCard(discountInput, discountAmount);
        discountMessage.innerHTML = `<p>¡Se te añadió un interés de 15% por equivocarte de grupo!</p>`;
    } else {
        discountMessage.innerHTML = `<p>¡Código de descuento no válido!</p>`;
    };

    localStorage.setItem("selectedDiscount", JSON.stringify(selectedDiscount));
    updateTotal();
};

function saveCurrency() {
    const currencySelect = document.getElementById('currencySelect');
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency) {
        currencySelect.value = savedCurrency;
    }

    currencySelect.addEventListener('change', function () {
        localStorage.setItem('selectedCurrency', this.value);
        updateTotal();
    });

    updateTotal();
}

function saveProductId(id, category) {
    const queryString = `?id=${id}&category=${category}`;
    window.location.href = `product-info.html${queryString}`;
}

function removeCartItem(index) {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    updateCartBadge();
    displayCart();
}

