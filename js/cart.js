// // Muestra productos relacionados.
// function setupRelatedProducts(productId) {
//     const relatedProductsContainer = document.getElementById('related-products');
//     relatedProductsContainer.innerHTML = ''; // Limpiar el contenedor de productos relacionados

//     const productUrl = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

//     fetch(productUrl)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`Error al cargar los datos del producto: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             const relatedProducts = data.relatedProducts;

//             if (!relatedProducts || relatedProducts.length === 0) {
//                 console.log("No hay productos relacionados disponibles.");
//                 return;
//             }

//             relatedProducts.forEach(relatedProduct => {
//                 const productCard = document.createElement('div');
//                 productCard.classList.add('col', 'product-card', 'mr-3');

//                 productCard.innerHTML = `
//                     <div class="card" style="width: 18rem;">
//                         <img src="${relatedProduct.image}" class="card-img-top" alt="${relatedProduct.name}">
//                         <div class="card-body">
//                             <h5 class="card-title">${relatedProduct.name}</h5>
//                             <p id="rating-${relatedProduct.id}" class="card-text">Cargando calificación...</p>
//                         </div>
//                     </div>
//                 `;

//                 relatedProductsContainer.appendChild(productCard);

//                 productCard.addEventListener('click', function () {
//                     fetch(`https://japceibal.github.io/emercado-api/products/${relatedProduct.id}.json`)
//                         .then(response => {
//                             if (!response.ok) {
//                                 throw new Error(`Error al cargar los detalles del producto: ${response.status}`);
//                             }
//                             return response.json();
//                         })
//                         .then(fullProduct => {
//                             displayProductInfo(fullProduct, []); // Mostrar el producto completo
//                         })
//                         .catch(error => console.error('Error al cargar el producto relacionado:', error));
//                 });

//                 fetchProductCommentsForRelated(relatedProduct.id);
//             });
//         })
//         .catch(error => console.error('Error al cargar los productos relacionados:', error));
// }





//QUE ES ESTO DE ARRIBA, ALGUEN SABE?




// Obtener todos los contenedores de productos
const products = document.querySelectorAll('.product');

// Iterar sobre cada contenedor de producto
products.forEach(product => {
    const decreaseBtn = product.querySelector('.decrease-btn');
    const increaseBtn = product.querySelector('.increase-btn');
    const quantityInput = product.querySelector('.quantity-input');

    // Función para disminuir la cantidad
    decreaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) { // Evitar que el valor sea menor que 1
            quantityInput.value = currentValue - 1;
        }
    });

    // Función para aumentar la cantidad
    increaseBtn.addEventListener('click', () => {
        let currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    });
});

