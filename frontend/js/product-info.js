const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
const productId = urlParams.get('id');

document.addEventListener("DOMContentLoaded", function() {

    console.log(`Cargando productos de la categoría: ${category}, ID del producto: ${productId}`);
    
    const url = `http://localhost:3000/products/${productId}`;
    
    fetchProductData(url, productId);
    setupScrollButtons();
});

//Toma los datos del producto desde la URL proporcionada.
function fetchProductData(url) {
    fetch(url, {
        headers: {
            'authorization': 'Bearer ' + localStorage.getItem('authToken')
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar los datos: ${response.status}`);
            }
            return response.json();
        })
        .then(product => {
            console.log(`Datos de productos cargados:`, product);

            displayProductInfo(product);
            setupThumbnails(product.images);

            document.getElementById("favBtn").addEventListener("click", () =>  saveToFavorites(product));
            document.getElementById("btn-add-to-cart").addEventListener("click", () =>  saveToCart(product));
            document.getElementById("btn-buy").addEventListener("click", () =>  saveToCart(product));

            
        })
        .catch(error => console.error('Error al cargar los datos del producto:', error));
}
//Configura las miniaturas del producto.
function setupThumbnails(images) {
    const thumbnailContainer = document.querySelector('.thumbnail-images');
    
    if (images && images.length > 1) {
        thumbnailContainer.innerHTML = '';
        images.forEach((imgSrc, index) => {
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
                console.log(`Imagen principal cambiada a: ${imgSrc}`);
            });

            if (index === 0) {
                document.getElementById('main-image').src = imgSrc;
                console.log(`Imagen principal inicial: ${imgSrc}`);
            }
        });
    } else {
        console.log("No hay miniaturas disponibles.");
        thumbnailContainer.style.display = 'none';
    }
}
// Muestra la información del producto principal.
function displayProductInfo(product) {
    const mainImageElement = document.getElementById('main-image');

    if (product.images && product.images.length > 0) {
        mainImageElement.src = product.images[0];
        setupThumbnails(product.images);
    } else {
        mainImageElement.src = product.image;
    }

    // Muestra el nombre del producto.
    const productNameElement = document.querySelector('.product-name');
    if (productNameElement) {
        productNameElement.textContent = product.name;
    } else {
        console.error("Elemento .product-name no encontrado");
    }

    // Muestra el precio del producto.
    const productPriceElement = document.querySelector('.product-price p');
    if (productPriceElement) {
        productPriceElement.textContent = `$${product.cost}`;
    } else {
        console.error("Elemento .product-price p no encontrado");
    }

    // Muestra la cantidad de productos vendidos.
    const productSoldElement = document.querySelector('.product-sold');
    if (productSoldElement) {
        productSoldElement.textContent = `${product.soldCount} vendidos`;
    } else {
        console.error("Elemento .product-sold no encontrado");
    }

    // Muestra el código del producto.
    const productCodeElement = document.querySelector('.product-code');
    if (productCodeElement) {
        productCodeElement.textContent = `Cod-${product.id}`;
    } else {
        console.error("Elemento .product-code no encontrado");
    }

    
    fetchProductComments(product.id);

    // Muestra la descripción del producto en la pestaña de descripción.
    const descriptionTab = document.getElementById('descripcion');
    if (descriptionTab) {
        descriptionTab.innerHTML = `<p class="mt-4">${product.description}</p>`;
    } else {
        console.error("Elemento descripcion no encontrado");
    }
    
    const relatedProductsContainer = document.getElementById('related-products');
    relatedProductsContainer.innerHTML = ''; 
    setupRelatedProducts(product.id);

}
//Toma los comentarios del producto principal.
function fetchProductComments(id) {
    const commentsUrl = `http://localhost:3000/products_comments/${id}`;
    fetch(commentsUrl, {
        headers: {
            'authorization': 'Bearer ' + localStorage.getItem('authToken')
        }
    })
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
//Configura el botón para agregar o quitar de favoritos.
function setupFavoriteButton() {
    const favoriteButton = document.getElementById("favBtn");

    favoriteButton.addEventListener("click", function() {
        const icon = document.getElementById("favoriteIcon");
        icon.classList.toggle("bi-heart");
        icon.classList.toggle("bi-heart-fill");
        console.log("Estado del botón de favorito cambiado.");
    });
}
//Toma los comentarios de un producto relacionado desde una URL y actualiza la UI con la puntuación promedio.
function fetchProductCommentsForRelated(productId) {
    
    const commentsUrl = `http://localhost:3000/products_comments/${productId}`;

    fetch(commentsUrl, {
        headers: {
            'authorization': 'Bearer ' + localStorage.getItem('authToken')
        }
    })
        .then(response => response.json())
        .then(comments => {
            const starsElement = document.getElementById(`rating-${productId}`);
            if (comments.length > 0) {
                const totalScore = comments.reduce((sum, comment) => sum + comment.score, 0);
                const averageScore = (totalScore / comments.length).toFixed(1);
                const stars = createStars(averageScore);
                starsElement.innerHTML = `${stars} (${averageScore})`; 
            } else {
                starsElement.innerHTML = `${createStars(0)} (0.0)`;
            }
        })
        .catch(error => console.error(`Error al cargar los comentarios del producto ${productId}:`, error));
}

// Muestra productos relacionados.
function setupRelatedProducts(productId) {
    const relatedProductsContainer = document.getElementById('related-products');
    relatedProductsContainer.innerHTML = ''; // Limpiar el contenedor de productos relacionados

    const productUrl = `http://localhost:3000/products/${productId}`;

    fetch(productUrl, {
        headers: {
            'authorization': 'Bearer ' + localStorage.getItem('authToken')
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar los datos del producto: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            const relatedProducts = data.relatedProducts;

            if (!relatedProducts || relatedProducts.length === 0) {
                console.log("No hay productos relacionados disponibles.");
                return;
            }

            relatedProducts.forEach(relatedProduct => {
                const productCard = document.createElement('div');
                productCard.classList.add('col', 'product-card', 'mr-3');

                productCard.innerHTML = `
                    <div class="card" style="width: 18rem;">
                        <img src="${relatedProduct.image}" class="card-img-top" alt="${relatedProduct.name}">
                        <div class="card-body">
                            <h5 class="card-title">${relatedProduct.name}</h5>
                            <p id="rating-${relatedProduct.id}" class="card-text">Cargando calificación...</p>
                        </div>
                    </div>
                `;

                relatedProductsContainer.appendChild(productCard);


                productCard.addEventListener('click', function () {
                    const urlRelatedProduct = `product-info.html?id=${relatedProduct.id}&category=${category}`;
                    window.location.href = urlRelatedProduct; // Redirige al URL del producto relacionado
                });

                fetchProductCommentsForRelated(relatedProduct.id);
            });
        })
        .catch(error => console.error('Error al cargar los productos relacionados:', error));
}
//Configura botones para desplazarse en los productos relacionados.
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
        console.log("Desplazamiento a la derecha.");
    });
    
    prevBtn.addEventListener('click', function() {
        const cardWidth = relatedProductsContainer.querySelector('.card').offsetWidth;
        relatedProductsContainer.scrollBy({
            left: -cardWidth, 
            behavior: 'smooth'
        });
        console.log("Desplazamiento a la izquierda.");
    });
}
// Obtener la calificación seleccionada
function selectedRating() {
    const starInputs = document.querySelectorAll('.star-input');
    let selectedValue = 0;

    starInputs.forEach(star => {
        if (star.checked) {
            selectedValue = star.value;
        }
    });

    starInputs.forEach((star, index) => {
        if (index < selectedValue) {
            star.classList.add('selectedStar-input'); 
        } else {
            star.classList.remove('selectedStar-input');  
        }
    });

    return selectedValue;
}
//Add Review
document.addEventListener('DOMContentLoaded', function () {
    
    document.getElementById('review-form').addEventListener('submit', function(event) {
        event.preventDefault(); 
        
         // Obtener el valor seleccionado del input de estrella
        const starRating = document.querySelector('input[name="star"]:checked');
        if (!starRating) {
            alert("Por favor selecciona una calificación de estrellas.");
            return;
        }
        const ratingValue = starRating.value; 
        console.log("Estrella seleccionada: ", ratingValue);

        // Obtener el comentario
        const commentText = document.getElementById('cmt');
        const trimmedComment = commentText.value.trim();
        if (!trimmedComment) {
            alert("Por favor, escribe un comentario."); 
            return; 
        }

        console.log("Calificación enviada:", ratingValue);
        console.log("Comentario enviado:", trimmedComment);

        // Obtener el nombre de usuario
        const usernameInput = localStorage.getItem('currentUsername');

        const newComment = {
            user: usernameInput || "Usuario desconocido", 
            description: trimmedComment,
            score: ratingValue,
            dateTime: new Date().toLocaleString(),
        };

        // Añadir el nuevo comentario a la interfaz
        addCommentToDOM(newComment);
        document.getElementById('review-form').reset(); 

    });
});
// Añadir el comentario al DOM (la sección de comentarios)
function addCommentToDOM(newComment) {
    
    const commentsSection = document.getElementById('comments-section'); 
    const commentElement = document.createElement('div');
    commentElement.classList.add('comentario', 'card', 'mb-4', 'col-12', 'col-sm-6', 'col-md-4');

    commentElement.innerHTML = `

        <div class="card-body ">
                <div class="fila_nombre mb-2">
                    <div>
                        <span class="fw-bold">${newComment.user}</span>
                        <span class="text-muted small">(${newComment.user})</span>
                    </div>
                    <div class="text-muted small">${newComment.dateTime}</div>
                    <div>
                        <span class="text-warning">${createStars(newComment.score)}</span>
                        <span class="text-muted">(${newComment.score})</span>
                    </div>
                </div>
                <div class="card-text">
                    <p class="">${newComment.description}</p>
                </div>
            </div>
    `;
    commentsSection.appendChild(commentElement); 
}
// Mostrar el nombre del usuario
document.addEventListener('DOMContentLoaded', function () {

    const userName = localStorage.getItem('currentUsername');

    const usernameDisplay = document.getElementById ('username-display');
    usernameDisplay.textContent = userName;
});

document.getElementById("btn-buy").addEventListener("click", function () {
    window.location.href = "cart.html";
});

// Guarda el producto en favoritos y redirige a favorites.html
function saveToFavorites(product) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    // Verifica si el producto ya está en favoritos
    const isFavorite = favorites.some(fav => fav.id === product.id);

    if (!isFavorite) {
        favorites.push(product);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        alert("Producto añadido a favoritos");
    } else {
        alert("Este producto ya esta en favoritos.");
    }

    console.log(`Datos guardados en fav: ${JSON.stringify(favorites)}`);
    
    window.location.href = "favorites.html";
}

function saveToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Verificar si el producto ya está en el carrito
    const cartItems = cart.some(item => item.id === product.id);

    if (!cartItems) {
    cart.push(product); 
    localStorage.setItem("cart", JSON.stringify(cart)); 
    alert("Producto añadido al carrito.");
    updateCartBadge(); 
    } else {
    alert('Este producto ya se encuentra en el carrito.');
    }

    console.log(`Datos guardados en cart: ${JSON.stringify(cart)}`);
}


