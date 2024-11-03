document.addEventListener("DOMContentLoaded", function () {
    displayFavorites();
});

// Función para mostrar productos favoritos

function displayFavorites() {
    const favoritesContainer = document.getElementById("favorites-container");
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    favoritesContainer.innerHTML = "";

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No tienes productos favoritos.</p>";
    } else {
        // Crear una tarjeta para cada producto favorito
        favorites.forEach((product, index) => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <h2 class="noseve">${product.name}</h2>
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <p class="noseve"> ${product.description} </p>
                <p > Precio: $${product.cost}</p>
                <button onclick="removeFavorite(${index})"> Eliminar de favoritos</button>
            `;
            favoritesContainer.appendChild(productCard);
        });
    }
}

// Función para eliminar un producto de favoritos

function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites.splice(index, 1); 
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites(); 
}
