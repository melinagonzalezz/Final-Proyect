document.addEventListener("DOMContentLoaded", function() {
    const url = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

    // Función para cargar productos
    function loadProducts() {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                const products = data.products;
                const container = document.getElementById('product-list');

                products.forEach(product => {
                    const productItem = document.createElement('div');
                    productItem.className = 'product-item';

                    productItem.innerHTML = `
                        <div class="product-image" style="background-image: url('${product.image}')"></div>
                        <div class="product-content">
                            <h2>${product.name}</h2>
                            <p>${product.description}</p>
                            <p class="product-sold">Vendidos: ${product.soldCount}</p>
                        </div>
                        <div class="product-price">
                            ${product.currency} ${product.cost}
                        </div>
                    `;

                    container.appendChild(productItem);
                });
            })
            .catch(error => console.error('Error al cargar los productos', error));
    }

    // Función para configurar los botones de vista
    function setupViewButtons() {
        const productList = document.getElementById('product-list');
        const gridViewButton = document.getElementById('grid-view');
        const listViewButton = document.getElementById('list-view');

        function switchToGridView() {
            productList.classList.add('grid-view');
        }

        function switchToListView() {
            productList.classList.remove('grid-view');
        }

        gridViewButton.addEventListener('click', switchToGridView);
        listViewButton.addEventListener('click', switchToListView);
    }

    // Llamar a las funciones
    loadProducts();
    setupViewButtons();
});

