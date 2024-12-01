
document.addEventListener("DOMContentLoaded", function () {
    displayFavorites(); // Muestra los productos favoritos al cargar la página
});

// Función para mostrar productos favoritos
function displayFavorites() {
    const favoritesContainer = document.getElementById("favorites-container"); 
    const favorites = JSON.parse(localStorage.getItem("favorites")) || []; 

    favoritesContainer.innerHTML = ""; 

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No tienes productos favoritos.</p>"; // Muestra un mensaje si no hay favoritos
    } else {
        // Si hay productos favoritos, crea una tarjeta para cada uno
        favorites.forEach((product, index) => {
            const productCard = document.createElement("div"); 
            productCard.classList.add("product-card"); 
            productCard.innerHTML = `
                <h2 class="noseve">${product.name}</h2> <!-- Nombre del producto -->
                <img src="http://localhost:3000/${product.images[0]}" alt="${product.name}" class="product-image"> <!-- Imagen del producto -->
                <p class="noseve"> ${product.description} </p> <!-- Descripción del producto -->
                <p> Precio: $${product.cost}</p> <!-- Precio del producto -->
                <button onclick="removeFavorite(${index})"> Eliminar de favoritos</button> <!-- Botón para eliminar el producto de favoritos -->
            `;
            favoritesContainer.appendChild(productCard); 
        });
    }
}

// Función para eliminar un producto de favoritos
function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || []; 
    favorites.splice(index, 1); // Elimina el producto favorito en la posición indicada por el índice
    localStorage.setItem("favorites", JSON.stringify(favorites)); 
    displayFavorites(); // Vuelve a mostrar los productos actualizados
}

// Mostrar el nombre del usuario
document.addEventListener('DOMContentLoaded', function () {

    const userName = localStorage.getItem('currentUsername');

    //Mostrar nombre de usuario al iniciar sesión
    const usernameDisplay = document.getElementById ('username-display');
    usernameDisplay.textContent = userName;
});
