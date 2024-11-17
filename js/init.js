// Definición de URLs para acceder a la API
const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json"; // URL para obtener las categorías
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json"; // URL para publicar un producto
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/"; // URL para obtener productos por categoría
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/"; // URL para obtener información de un producto
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/"; // URL para obtener comentarios de un producto
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/"; // URL para obtener información del carrito
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json"; // URL para realizar la compra
const EXT_TYPE = ".json"; // Extensión de los archivos JSON

// Función para mostrar el spinner mientras se cargan los datos
let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block"; // Muestra el spinner
}

// Función para ocultar el spinner una vez que se cargan los datos
let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none"; // Oculta el spinner
}

// Función para obtener datos JSON de una URL
let getJSONData = function(url){
    let result = {}; // Inicializa el objeto de resultado
    showSpinner(); // Muestra el spinner mientras se obtiene la información
    return fetch(url) // Realiza la petición fetch
    .then(response => {
      if (response.ok) { // Si la respuesta es correcta
        return response.json(); // Devuelve los datos en formato JSON
      }else{
        throw Error(response.statusText); // Lanza un error si la respuesta no es correcta
      }
    })
    .then(function(response) {
          result.status = 'ok'; // Si la petición es exitosa
          result.data = response; // Asigna los datos de la respuesta al objeto result
          hideSpinner(); // Oculta el spinner
          return result; // Devuelve el resultado
    })
    .catch(function(error) {
        result.status = 'error'; // Si ocurre un error
        result.data = error; // Asigna el error al objeto result
        hideSpinner(); // Oculta el spinner
        return result; // Devuelve el error
    });
};

// Modo día y noche
let modoNoche = localStorage.getItem('modoNoche') === 'true'; // Recupera el valor del modo nocturno desde el almacenamiento local

// Función para aplicar el modo seleccionado (día o noche)
function aplicarModo() {
    document.body.className = modoNoche ? 'modo-noche' : 'modo-dia'; // Cambia la clase del body dependiendo del modo
    document.getElementById('boton').innerHTML = modoNoche ? '<i class="bi bi-moon-fill"></i>' : '<i class="bi bi-sun-fill"></i>'; // Cambia el ícono del botón
}

// Función para cambiar el modo entre día y noche
function cambiarModo() {
    modoNoche = !modoNoche; // Alterna el valor del modo
    localStorage.setItem('modoNoche', modoNoche); // Guarda el estado del modo en el almacenamiento local
    aplicarModo(); // Aplica el modo seleccionado
}

// Agrega el evento al botón para cambiar el modo
document.getElementById('boton').addEventListener('click', cambiarModo);

// Aplica el modo al cargar la página
aplicarModo();

// Mostrar el nombre de usuario
function updateUsername() {
    const userName = localStorage.getItem('currentUsername'); // Recupera el nombre de usuario desde el almacenamiento local

    // Mostrar nombre de usuario al iniciar sesión
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = userName; // Muestra el nombre del usuario en el elemento correspondiente
}

// Función para agregar un producto al carrito
function saveToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Recupera el carrito desde el almacenamiento local, si no existe, inicializa un array vacío

  // Verificar si el producto ya está en el carrito
  const cartItems = cart.some(item => item.id === product.id);

  if (!cartItems) { // Si el producto no está en el carrito
      cart.push(product); // Agrega el producto al carrito
      localStorage.setItem("cart", JSON.stringify(cart)); // Guarda el carrito actualizado en el almacenamiento local
      updateCartBadge(); // Actualiza el contador del carrito
  } else {
      alert('Este producto ya se encuentra en el carrito.'); // Muestra un mensaje si el producto ya está en el carrito
  }

  console.log(`Datos guardados en cart: ${JSON.stringify(cart)}`); // Imprime el carrito actualizado en la consola
}

// Función para eliminar un producto del carrito
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; // Recupera el carrito desde el almacenamiento local

  cart = cart.filter(item => item.id !== productId); // Filtra los productos y elimina el que tiene el id proporcionado

  localStorage.setItem("cart", JSON.stringify(cart)); // Guarda el carrito actualizado en el almacenamiento local
  updateCartBadge(); // Actualiza el contador del carrito
}

// Función para actualizar el contador del carrito (badge)
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || []; // Recupera el carrito desde el almacenamiento local
  const badge = document.getElementById('cart-badge'); // Obtiene el elemento del contador del carrito
  badge.textContent = cart.length; // Actualiza el contador con la cantidad de productos en el carrito
}

// Llama a la función updateCartBadge cuando la página se carga
window.onload = function() {
  updateCartBadge(); // Actualiza el contador del carrito al cargar la página
};
