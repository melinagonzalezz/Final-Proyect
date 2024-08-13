document.addEventListener("DOMContentLoaded", function() {
    const url = 'https://japceibal.github.io/emercado-api/cats_products/101.json';

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
                            <br>
                            <p>${product.description}</p>
                            <br>
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

    loadProducts();
});

