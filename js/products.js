// Espera a que el contenido del documento esté completamente cargado antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function() { 
    // Recupera el ID de la categoría desde el localStorage
    const categoryId = localStorage.getItem("catID");

    // Si no se encuentra el "catID" en localStorage, se muestra un mensaje de error
    if (!categoryId) {
        console.error('Error: No se encontró el "catID" en localStorage. (╥_╥)');
        return;
    }

    // Construye la URL para obtener los productos de la categoría seleccionada
    const url = `https://japceibal.github.io/emercado-api/cats_products/${categoryId}.json`;

    let products = []; // Array para almacenar los productos cargados
    let filteredProducts = []; // Array para almacenar los productos filtrados

    // Función para cargar productos desde la API
    function loadProducts() {
        fetch(url) // Realiza la petición fetch para obtener los productos
            .then(response => {
                // Si la respuesta no es exitosa, lanza un error
                if (!response.ok) {
                    throw new Error('Error en la red al intentar cargar los productos. (╥_╥)');
                }
                return response.json(); // Convierte la respuesta en formato JSON
            })
            .then(data => {
                products = data.products; // Guarda los productos recibidos en el array 'products'
                filteredProducts = products; // Inicializa los productos filtrados
                displayProducts(products); // Muestra los productos en el DOM
                updateResultsInfo(); // Actualiza la información de los resultados encontrados
            })
            .catch(error => console.error('Error al cargar productos: (╥_╥)', error)); // Maneja los errores
    }

    // Función para mostrar los productos en el contenedor
    function displayProducts(productList) {
        const container = document.getElementById('product-list');
        container.innerHTML = ''; // Limpia cualquier contenido previo del contenedor

        // Si no hay productos disponibles, muestra un mensaje
        if (!productList || productList.length === 0) {
            container.innerHTML = '<h1>No hay productos disponibles. ૮꒰ ˶╥ ༝ ╥˶꒱ა ♡</h1>';
            return;
        }

        // Crea y agrega un contenedor para cada producto
        productList.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item'; // Asigna la clase CSS

            // Inserta el HTML de cada producto en el contenedor
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

            // Agrega el producto al contenedor de la lista de productos
            container.appendChild(productItem);

            // Agrega un evento para redirigir a la página de detalles del producto
            document.getElementById(`ver-btn-${product.id}`).addEventListener('click', function() {
                saveProductId(product.id, categoryId);
            });
        });
    }

    // Función para filtrar y ordenar los productos según los criterios seleccionados
    function filterAndSortProducts() {
        let filtered = products; // Comienza con la lista completa de productos

        // Obtiene los valores de los filtros de precio y de orden
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
        const sortBy = document.getElementById('sort-options').value;

        // Filtra los productos por el rango de precios
        filtered = filtered.filter(product => product.cost >= minPrice && product.cost <= maxPrice);

        // Ordena los productos según la opción seleccionada
        if (sortBy === 'asc-price') {
            filtered.sort((a, b) => a.cost - b.cost); // Orden ascendente por precio
        } else if (sortBy === 'des-price') {
            filtered.sort((a, b) => b.cost - a.cost); // Orden descendente por precio
        } else if (sortBy === 'des-relevance') {
            filtered.sort((a, b) => b.soldCount - a.soldCount); // Orden descendente por cantidad de ventas
        }

        filteredProducts = filtered; // Actualiza los productos filtrados
        displayProducts(filteredProducts); // Muestra los productos filtrados
        updateResultsInfo(); // Actualiza la información de resultados mostrados
    }

    // Función para actualizar la información de los resultados mostrados
    function updateResultsInfo() {
        const resultsInfo = document.querySelector('.col-8.my-0');
        if (resultsInfo) {
            const totalResults = products.length; // Número total de productos
            const displayedResults = filteredProducts.length; // Número de productos mostrados
            const start = displayedResults > 0 ? 1 : 0;
            const end = displayedResults > 0 ? displayedResults : 0;

            // Muestra el rango de resultados mostrados y el total de productos
            resultsInfo.textContent = `Mostrando ${start} - ${end} de ${totalResults} resultados encontrados`;
        }
    }

    // Función para configurar los botones de vista (cuadrícula o lista)
    function setupViewButtons() {
        const productList = document.getElementById('product-list');
        const gridViewButton = document.getElementById('grid-view');
        const listViewButton = document.getElementById('list-view');

        // Cambia a vista en cuadrícula
        function switchToGridView() {
            productList.classList.add('grid-view');
            gridViewButton.classList.add('active');
            listViewButton.classList.remove('active');
        }

        // Cambia a vista en lista
        function switchToListView() {
            productList.classList.remove('grid-view');
            listViewButton.classList.add('active');
            gridViewButton.classList.remove('active');
        }

        // Configura los eventos para cambiar entre las vistas
        if (gridViewButton && listViewButton) {
            gridViewButton.addEventListener('click', switchToGridView);
            listViewButton.addEventListener('click', switchToListView);
        } else {
            console.error('Botones de vista no encontrados (╥_╥)');
        }
    }

    // Función para limpiar los filtros de precio y orden
    function clearFilters(){
        document.getElementById("min-price").value = "";
        document.getElementById("max-price").value = "";
        document.getElementById("sort-options").value = "default";
        location.reload(); // Recarga la página para restaurar los filtros predeterminados
    }

    // Agrega los eventos para filtrar y ordenar productos
    document.getElementById('min-price').addEventListener('input', filterAndSortProducts);
    document.getElementById('max-price').addEventListener('input', filterAndSortProducts);
    document.getElementById('sort-options').addEventListener('change', filterAndSortProducts);
    document.getElementById("clear-filter").addEventListener("click", clearFilters);

    // Función para guardar el ID del producto y redirigir a la página de detalles
    function saveProductId(id, category) {
        const queryString = `?id=${id}&category=${category}`;
        window.location.href = `product-info.html${queryString}`;
    }

    // Función para buscar productos por nombre o descripción
    const buscador = document.getElementById('buscador');
    buscador.addEventListener('input', function (e) {
        const letras = e.target.value.toLowerCase(); // Convierte la búsqueda a minúsculas
        const productos = document.querySelectorAll('.product-item');

        // Filtra los productos que coinciden con el texto de búsqueda
        productos.forEach(producto => {
            const titulo = producto.querySelector('h2').textContent.toLowerCase();
            const descripcion = producto.querySelector('p').textContent.toLowerCase();

            if (titulo.includes(letras) || descripcion.includes(letras)) {
                producto.style.display = ''; // Muestra el producto si coincide
            } else {
                producto.style.display = 'none'; // Oculta el producto si no coincide
            }
        });
    });

    // Carga los productos al inicio
    loadProducts();
    setupViewButtons();
});

// Mostrar el nombre del usuario al iniciar sesión
document.addEventListener('DOMContentLoaded', function () {

    const userName = localStorage.getItem('currentUsername'); // Recupera el nombre de usuario desde el localStorage

    // Muestra el nombre de usuario en el elemento correspondiente
    const usernameDisplay = document.getElementById ('username-display');
    usernameDisplay.textContent = userName; // Asigna el nombre de usuario al elemento
});
