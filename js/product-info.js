document.addEventListener("DOMContentLoaded", function() {

    // Obtener el catID desde localStorage o desde los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    const productId = urlParams.get('id');

    // Construir la URL a;adiendo la categoria a la url
    const url = `https://japceibal.github.io/emercado-api/cats_products/${category}.json`;

    fetchProductData(url, productId);

    setupFavoriteButton();
});

function fetchProductData(url, productId) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const product = data.products.find(p => p.id == productId);

            if (!product) {
                console.error("Producto no encontrado");
                return;
            }

            displayProductInfo(product);
            setupThumbnails(product.images);
            setupRelatedProducts(data.products, productId);
        })
        .catch(error => console.error('Error al cargar los datos del producto:', error));
}

function displayProductInfo(product) {
    document.getElementById('main-image').src = product.image;
    document.querySelector('.product-name').textContent = product.name;
    document.querySelector('.product-price p').textContent = `$${product.cost}`;
    document.querySelector('.product-sold').textContent = `+ ${product.soldCount} vendidos`;
    document.querySelector('.product-code').textContent = `Cod-${product.id}`;
    document.querySelector('.product-rating p').textContent = `⭐⭐⭐⭐⭐`;

    const descriptionTab = document.getElementById('descripcion');
    descriptionTab.innerHTML = `<p class="mt-4">${product.description}</p>`;
}

function setupThumbnails(images) {
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    
    if (images && images.length > 1) {
        thumbnailContainer.innerHTML = ''; 
        images.forEach((imgSrc) => {
            const imgElement = document.createElement('img');
            imgElement.src = imgSrc;
            imgElement.alt = "Miniatura";
            imgElement.classList.add('thumbnail');
            imgElement.style.width = '75px';
            imgElement.style.height = '75px';
            imgElement.style.objectFit = 'cover';
            thumbnailContainer.appendChild(imgElement);

            imgElement.addEventListener('click', function() {
                document.getElementById('main-image').src = imgSrc;
            });
        });
    } else {
        thumbnailContainer.style.display = 'none';
    }
}

function setupRelatedProducts(products, productId) {
    const relatedProductsContainer = document.getElementById('related-products');
    const relatedProducts = products.filter(p => p.id != productId).slice(0, 10);

    relatedProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'col-4 card me-3';

        productCard.innerHTML = `
            <img src="${product.image}" class="card-img-top" alt="${product.name}">
            <div class="card-body">
                <h5 class="card-title">${product.name}</h5>
                <div class="product-rating">
                    <p>⭐⭐⭐⭐⭐</p>
                    <p>5.0</p>
                </div>
                <p class="card-text">${product.currency} ${product.cost}</p>
            </div>
        `;

        relatedProductsContainer.appendChild(productCard);
    });

    setupScrollButtons();
}

function setupScrollButtons() {
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const relatedProductsContainer = document.getElementById('related-products');

    nextBtn.addEventListener('click', function() {
        const cardWidth = relatedProductsContainer.querySelector('.card').offsetWidth;
        relatedProductsContainer.scrollBy({
            left: cardWidth, 
            behavior: 'smooth'
        });
    });
    
    prevBtn.addEventListener('click', function() {
        const cardWidth = relatedProductsContainer.querySelector('.card').offsetWidth;
        relatedProductsContainer.scrollBy({
            left: -cardWidth, 
            behavior: 'smooth'
        });
    });
}

function setupFavoriteButton() {
    const favoriteButton = document.getElementById("favBtn");

    favoriteButton.addEventListener("click", function() {
        const icon = document.getElementById("favoriteIcon");
        icon.classList.toggle("bi-heart");
        icon.classList.toggle("bi-heart-fill");
    });
}
