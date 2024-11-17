// Espera a que el contenido de la página esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    displayFavorites(); // Muestra los productos favoritos al cargar la página
});

// Función para mostrar productos favoritos
function displayFavorites() {
    const favoritesContainer = document.getElementById("favorites-container"); // Contenedor donde se mostrarán los favoritos
    const favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Recupera los productos favoritos desde localStorage, o un array vacío si no hay favoritos

    favoritesContainer.innerHTML = ""; // Limpia el contenedor de favoritos antes de mostrar los nuevos productos

    if (favorites.length === 0) {
        favoritesContainer.innerHTML = "<p>No tienes productos favoritos.</p>"; // Muestra un mensaje si no hay favoritos
    } else {
        // Si hay productos favoritos, crea una tarjeta para cada uno
        favorites.forEach((product, index) => {
            const productCard = document.createElement("div"); // Crea un div para la tarjeta del producto
            productCard.classList.add("product-card"); // Añade una clase para aplicar estilo
            productCard.innerHTML = `
                <h2 class="noseve">${product.name}</h2> <!-- Nombre del producto -->
                <img src="${product.image}" alt="${product.name}" class="product-image"> <!-- Imagen del producto -->
                <p class="noseve"> ${product.description} </p> <!-- Descripción del producto -->
                <p> Precio: $${product.cost}</p> <!-- Precio del producto -->
                <button onclick="removeFavorite(${index})"> Eliminar de favoritos</button> <!-- Botón para eliminar el producto de favoritos -->
            `;
            favoritesContainer.appendChild(productCard); // Añade la tarjeta del producto al contenedor
        });
    }
}

// Función para eliminar un producto de favoritos
function removeFavorite(index) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || []; // Recupera los productos favoritos desde localStorage
    favorites.splice(index, 1); // Elimina el producto favorito en la posición indicada por el índice
    localStorage.setItem("favorites", JSON.stringify(favorites)); // Guarda los favoritos actualizados en localStorage
    displayFavorites(); // Vuelve a mostrar los productos favoritos actualizados
}
