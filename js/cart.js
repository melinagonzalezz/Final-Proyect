document.addEventListener("DOMContentLoaded", function () {
    displayCart();
    saveCurrency();
    updateSubTotal();
    loadDiscountCards();
});

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
                                <img src="${product.image}" alt="${product.name}" class="img-fluid" style="max-width: 100%; height: auto;">
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
    discountCardsContainer.innerHTML = "";

    selectedDiscounts.forEach(discount => {
        let discountAmount = calculateDiscountAmount(discount);
        showDiscountCard(discount, discountAmount);
    });
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

// Función para mostrar una tarjeta de descuento
function showDiscountCard(discountInput, discountAmount) {
    const discountCard = document.getElementById("discountCards");
    const discountSign = discountAmount < 0 ? "-" : "+";
    const formattedAmount = Math.abs(discountAmount).toFixed(2);

    const card = document.createElement('div');
    card.className = "d-flex justify-content-between bg-dark text-light p-2";
    card.innerHTML = `
        <p class="flex-fill mb-0">DESCUENTOS</p>
        <p class="flex-fill mb-0">Código: ${discountInput}</p>
        <p class="flex-fill mb-0">${discountSign} $${formattedAmount}</p>
    `;
    discountCard.appendChild(card);
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

// Eventos
document.getElementById("addDiscount").addEventListener("click", discounts);
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
    displayCart();
}
document.addEventListener('DOMContentLoaded', function () {
    const userName = localStorage.getItem('currentUsername');
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = userName;
});

document.getElementById("cart-to-checkout-1").addEventListener("click", function (e) {
    // Prevenir la redirección por defecto
    e.preventDefault();

    // Validar que el carrito no esté vacío
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    if (cartItems.length === 0) {
        alert("¡Por favor selecciona al menos un producto para continuar!");
        return false;
    }

    // Verificar si se aceptaron los términos y condiciones
    const termsCheckbox = document.getElementById("termsCheckbox");
    if (!termsCheckbox.checked) {
        alert("Debes aceptar los términos y condiciones para continuar.");
        return false;
    }

    // Verificar que la moneda esté guardada en localStorage
    const currency = localStorage.getItem('selectedCurrency');
    if (!currency) {
        alert('La moneda no está seleccionada.');
        return false;
    }
    
    // Verificar que el total esté guardado en localStorage
    const totalSaved = localStorage.getItem('savedTotal');    
    if (!totalSaved || totalSaved === 0) {
        console.log ("No se ha gruardado el total.");
        return false
    }
    
    // Verificar si se han seleccionado descuentos
    const discounts = JSON.parse(localStorage.getItem('selectedDiscount')) || [];

    if (discounts.length > 0) {
        console.log('Descuentos aplicados:', discounts);
    }

    // Si todo es válido, proceder con la redirección al checkout
    window.location.href = "cart-checkout.html";

});

// Función para actualizar el contador del carrito (badge)
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []; // Recupera el carrito desde el almacenamiento local
  const badge = document.getElementById('cart-badge'); // Obtiene el elemento del contador del carrito
  badge.textContent = cart.length; // Actualiza el contador con la cantidad de productos en el carrito

  // Muestra/oculta el badge según la cantidad de productos
  if (cart.length === 0) {
    badge.style.display = 'none'; // Oculta el badge si el carrito está vacío
  } else {
    badge.style.display = 'inline-block'; // Muestra el badge si hay productos en el carrito
  }
}

// Función para agregar un producto al carrito
function saveToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Recupera el carrito desde el almacenamiento local

  // Verificar si el producto ya está en el carrito
  const cartItems = cart.some(item => item.id === product.id);

  if (!cartItems) { // Si el producto no está en el carrito
    cart.push(product); // Agrega el producto al carrito
    localStorage.setItem("cart", JSON.stringify(cart)); // Guarda el carrito actualizado en el almacenamiento local
    updateCartBadge(); // Actualiza el contador del carrito
  } else {
    alert('Este producto ya se encuentra en el carrito.'); // Muestra un mensaje si el producto ya está en el carrito
  }

  console.log(`Datos guardados en cart: ${JSON.stringify(cart)}`); // Imprime el carrito actualizado en la consola
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Recupera el carrito desde el almacenamiento local

  // Filtra los productos y elimina el que tiene el id proporcionado
  cart = cart.filter(item => item.id !== productId);

  // Guarda el carrito actualizado en el almacenamiento local
  localStorage.setItem("cart", JSON.stringify(cart));

  // Actualiza el contador del carrito
  updateCartBadge();
  
  // Aquí podrías llamar a una función adicional para mostrar el carrito actualizado, si es necesario
  // displayCart(); 
}

// Llamar a updateCartBadge() al cargar la página para inicializar el contador del carrito
document.addEventListener("DOMContentLoaded", function() {
  updateCartBadge(); // Asegura que el badge se actualice al cargar la página
});

// Al llamar a saveToCart o removeFromCart, se actualizará el badge automáticamente



