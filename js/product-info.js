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


//Toma los comentarios del producto principal.
function fetchProductComments(id) {
    const commentsUrl = `https://japceibal.github.io/emercado-api/products_comments/${id}.json`;
    fetch(commentsUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error en la red: ${response.status}`);
            }
            return response.json();  
        })
        .then(comments => {
            console.log(`Comentarios cargados para el producto ID ${id}:`, comments);
            if (comments.length === 0) return;
            
            const averageScore = calculateAverageScore(comments);
            const ratingDiv = document.querySelector('.product-rating');
            ratingDiv.innerHTML = createStars(averageScore);
            showComments(comments);
        })
        .catch(error => console.error('Error al cargar los comentarios:', error)); 
}
//Muestra los comentarios del producto principal.
function showComments(comments) {
    const reviews = document.getElementById('reseñas');
    reviews.classList.add('m-3');

    const commentsContainer = document.getElementById('commentsContainer') || document.createElement('div');
    commentsContainer.classList.add('row');
    commentsContainer.id ='commentsContainer';

    const finalScore = calculateAverageScore(comments);

    // Añadir tarjeta con el promedio de opiniones
    const averageScoreContainer = document.getElementById('averageScoreContainer');
    averageScoreContainer.innerHTML = `
        <div class="card-body">
            <div class="fw-bold fs-3">
                <p>Opiniones del producto</p>
            </div>
            <div>
                <span class="fs-1">${finalScore}</span>
                <span>${createStars(finalScore)}</span>
            </div>
            <div class="card-text">
                <p class="text-muted">${comments.length} calificaciones</p>
            </div>
        </div>
    `;

    comments.forEach(comment => {
        let commentCard = document.createElement('div');
        commentCard.classList.add('comentario', 'card', 'mb-4', 'col-12', 'col-sm-6', 'col-md-4');

        commentCard.innerHTML = `
            <div class="card-body ">
                <div class="fila_nombre mb-2">
                    <div>
                        <span class="fw-bold">${formatUsername(comment.user)}</span>
                        <span class="text-muted small">(${comment.user})</span>
                    </div>
                    <div class="text-muted small">${comment.dateTime}</div>
                    <div>
                        <span class="text-warning">${createStars(comment.score)}</span>
                        <span class="text-muted">(${comment.score})</span>
                    </div>
                </div>
                <div class="card-text">
                    <p class="">${comment.description}</p>
                </div>
            </div>
        `;

        commentsContainer.appendChild(commentCard);
    });

    reviews.appendChild(commentsContainer); 
    console.log("Comentarios mostrados en la interfaz.");
}
// Le da un formato al nombre de usuario 
function formatUsername(username) {
    if (!username) {
        console.error("El nombre de usuario es indefinido o nulo.");
        return "Usuario desconocido";
    }
    const words = username.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(' ');
}
//Calcula la puntuación promedio de los comentarios.
function calculateAverageScore(comments) {
    const totalScore = comments.reduce((sum, comment) => sum + comment.score, 0);
    const average = (totalScore / comments.length).toFixed(1);
    console.log(`Promedio de puntuación calculado: ${average}`);
    return average;  
}
//Genera representación de estrellas según la puntuación.
function createStars(votes) {
    const fullStars = Math.floor(votes);
    const hasHalfStar = (votes - fullStars) >= 0.5;
    
    let stars = '<i class="fas fa-star text-warning"></i>'.repeat(fullStars);
    if (hasHalfStar) { 
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    stars += '<i class="far fa-star text-warning"></i>'.repeat(5 - fullStars - (hasHalfStar ? 1 : 0));

    return stars;
}