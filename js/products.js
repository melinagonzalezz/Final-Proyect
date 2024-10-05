document.addEventListener("DOMContentLoaded", function() { 
    const categoryId = localStorage.getItem("catID");

    if (!categoryId) {
        console.error('Error: No se encontró el "catID" en localStorage. (╥_╥)');
        return;
    }

    const url = `https://japceibal.github.io/emercado-api/cats_products/${categoryId}.json`;

    let products = [];
    let filteredProducts = [];

    // Función para cargar productos
    function loadProducts() {
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la red al intentar cargar los productos. (╥_╥)');
                }
                return response.json();
            })
            .then(data => {
                products = data.products;
                filteredProducts = products;
                displayProducts(products);
                updateResultsInfo();
            })
            .catch(error => console.error('Error al cargar productos: (╥_╥)', error));
    }

    function displayProducts(productList) {
        const container = document.getElementById('product-list');
        container.innerHTML = '';

        if (!productList || productList.length === 0) {
            container.innerHTML = '<h1>No hay productos disponibles. ૮꒰ ˶╥ ༝ ╥˶꒱ა ♡</h1>';
            return;
        }

        productList.forEach(product => {
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
                <button id="ver-btn-${product.id}" class="btn btn-outline-secondary">Ver detalles</button>
                </div>
            `;

            container.appendChild(productItem);

            // Agregar evento para guardar ID y redirigir
            document.getElementById(`ver-btn-${product.id}`).addEventListener('click', function() {
                saveProductId(product.id, categoryId);
            });
        });
    }

    function filterAndSortProducts() {
        let filtered = products;
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
        const sortBy = document.getElementById('sort-options').value;

        // Filtro por el rango de precios
        filtered = filtered.filter(product => product.cost >= minPrice && product.cost <= maxPrice);

        // Ordenar productos
        if (sortBy === 'asc-price') {
            filtered.sort((a, b) => a.cost - b.cost);
        } else if (sortBy === 'des-price') {
            filtered.sort((a, b) => b.cost - a.cost);
        } else if (sortBy === 'des-relevance') {
            filtered.sort((a, b) => b.soldCount - a.soldCount);
        }

        filteredProducts = filtered;
        displayProducts(filteredProducts);
        updateResultsInfo();
    }

    function updateResultsInfo() {
        const resultsInfo = document.querySelector('.col-8.my-0');
        if (resultsInfo) {
            const totalResults = products.length;
            const displayedResults = filteredProducts.length;
            const start = displayedResults > 0 ? 1 : 0;
            const end = displayedResults > 0 ? displayedResults : 0;

            resultsInfo.textContent = `Mostrando ${start} - ${end} de ${totalResults} resultados encontrados`;
        }
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

        if (gridViewButton && listViewButton) {
            gridViewButton.addEventListener('click', switchToGridView);
            listViewButton.addEventListener('click', switchToListView);
        } else {
            console.error('Botones de vista no encontrados (╥_╥)');
        }
    }

    function clearFilters(){
        document.getElementById("min-price").value = "";
        document.getElementById("max-price").value = "";
        document.getElementById("sort-options").value = "default";
        location.reload();
    }

    document.getElementById('min-price').addEventListener('input', filterAndSortProducts);
    document.getElementById('max-price').addEventListener('input', filterAndSortProducts);
    document.getElementById('sort-options').addEventListener('change', filterAndSortProducts);
    document.getElementById("clear-filter").addEventListener("click", clearFilters);

    // Función para guardar el ID y redirigir a la página de detalles
    function saveProductId(id, category) {
        const queryString = `?id=${id}&category=${category}`;
        window.location.href = `product-info.html${queryString}`;
    }

    // Función para buscar en productos
    const buscador = document.getElementById('buscador');
    buscador.addEventListener('input', function (e) {
        const letras = e.target.value.toLowerCase();
        const productos = document.querySelectorAll('.product-item');

        productos.forEach(producto => {
            const titulo = producto.querySelector('h2').textContent.toLowerCase();
            const descripcion = producto.querySelector('p').textContent.toLowerCase();

            if (titulo.includes(letras) || descripcion.includes(letras)) {
                producto.style.display = '';
            } else {
                producto.style.display = 'none';
            }
        });
    });

    loadProducts();
    setupViewButtons();
});

