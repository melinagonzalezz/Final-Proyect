// Definición de URLs para acceder a la API
const BASE_URL = "http://localhost:3000"
const CATEGORIES_URL = "/cats"; // URL para obtener las categorías
const PUBLISH_PRODUCT_URL = "/sell/publish.json"; // publicar un producto
const PRODUCTS_URL = "cats_products/"; // productos por categoría
const PRODUCT_INFO_URL = "/products/"; // URL para obtener información de un producto
const PRODUCT_INFO_COMMENTS_URL = "/products_comments/"; // URL para obtener comentarios de un producto
const CART_INFO_URL = "/user_cart/25801.json"; // URL para obtener información del carrito
const CART_BUY_URL = "/cart/buy.json"; // URL para realizar la compra
const EXT_TYPE = ".json"; // Extensión de los archivos JSON

// Función para mostrar el spinner
let showSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "block"; // Muestra
}
// Función para ocultar el spinner
let hideSpinner = function(){
  document.getElementById("spinner-wrapper").style.display = "none"; // Oculta
}

// Función para obtener datos JSON de una URL
let getJSONData = function(filename){
    let result = {}; 
    showSpinner(); 
    return fetch(`${BASE_URL}${filename}` , {
      headers: {
          'authorization': 'Bearer ' + localStorage.getItem('authToken')
      }
  }) // Construye la URL completa
    .then(response => {
      if (response.ok) { 
        return response.json(); 
      }else{
        throw Error(response.statusText);
      }
    })
    .then(function(response) {
          result.status = 'ok'; 
          result.data = response; 
          hideSpinner(); 
          return result; 
    })
    .catch(function(error) {
        result.status = 'error';
        result.data = error; 
        hideSpinner(); 
        return result; 
    });
};

// Función para agregar un producto al carrito
function saveToCart(product) {
  let cart = JSON.parse(localStorage.getItem("cart")) || []; 

  // Verificar si el producto ya está en el carrito
  const cartItems = cart.some(item => item.id === product.id);

  // Si el producto no está en el carrito
  if (!cartItems) { 
      cart.push(product); 
      localStorage.setItem("cart", JSON.stringify(cart)); 
      updateCartBadge(); 
  } else {
      alert('Este producto ya se encuentra en el carrito.'); 

  console.log(`Datos guardados en cart: ${JSON.stringify(cart)}`); 
  }
};

// Función para actualizar el contador del carrito (badge)
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const badge = document.getElementById('cart-badge');
  badge.textContent = cart.length; // Actualiza el contador con la cantidad de productos en el carrito
  if (cart.length === 0) {
    badge.style.display = 'none'; 
  } else {
    badge.style.display = 'inline-block'; 
  }
};

// Llama a la función updateCartBadge cuando la página se carga
window.onload = function() {
  updateCartBadge(); 
};


// Mostrar el nombre de usuario al iniciar sesion
function updateUsername() {
  const userName = localStorage.getItem('currentUsername'); 
  const usernameDisplay = document.getElementById('username-display');
  usernameDisplay.textContent = userName; 
};


// Modo día y noche
let modoNoche = localStorage.getItem('modoNoche') === 'true'; 

// Función para aplicar el modo seleccionado (día o noche)
function aplicarModo() {
    document.body.className = modoNoche ? 'modo-noche' : 'modo-dia'; // Cambia la clase del body dependiendo del modo
    document.getElementById('boton').innerHTML = modoNoche ? '<i class="bi bi-moon-fill"></i>' : '<i class="bi bi-sun-fill"></i>'; 
}

// Función para cambiar el modo entre día y noche
function cambiarModo() {
    modoNoche = !modoNoche; 
    localStorage.setItem('modoNoche', modoNoche); 
    aplicarModo(); 
};

// Agrega el evento al botón para cambiar el modo
document.getElementById('boton').addEventListener('click', cambiarModo);
aplicarModo();






