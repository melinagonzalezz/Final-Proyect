// Variables para almacenar los costos y comisiones de los productos
let productCost = 0; // Costo unitario del producto
let productCount = 0; // Cantidad de productos
let comissionPercentage = 0.13; // Porcentaje de comisión inicial
let MONEY_SYMBOL = "$"; // Símbolo de moneda predeterminado
let DOLLAR_CURRENCY = "Dólares (USD)"; // Moneda en dólares
let PESO_CURRENCY = "Pesos Uruguayos (UYU)"; // Moneda en pesos uruguayos
let DOLLAR_SYMBOL = "USD "; // Símbolo de moneda para dólares
let PESO_SYMBOL = "UYU "; // Símbolo de moneda para pesos uruguayos
let PERCENTAGE_SYMBOL = '%'; // Símbolo de porcentaje
let MSG = "FUNCIONALIDAD NO IMPLEMENTADA"; // Mensaje por defecto para notificar que una funcionalidad no está implementada

// Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts(){
    // Recupera los elementos del DOM donde se mostrarán los costos
    let unitProductCostHTML = document.getElementById("productCostText");
    let comissionCostHTML = document.getElementById("comissionText");
    let totalCostHTML = document.getElementById("totalCostText");

    // Calcula los costos a mostrar
    let unitCostToShow = MONEY_SYMBOL + productCost; // Costo unitario del producto
    let comissionToShow = Math.round((comissionPercentage * 100)) + PERCENTAGE_SYMBOL; // Costo de la comisión
    let totalCostToShow = MONEY_SYMBOL + ((Math.round(productCost * comissionPercentage * 100) / 100) + parseInt(productCost)); // Costo total con comisión

    // Actualiza el contenido HTML con los valores calculados
    unitProductCostHTML.innerHTML = unitCostToShow;
    comissionCostHTML.innerHTML = comissionToShow;
    totalCostHTML.innerHTML = totalCostToShow;
}

// Función que se ejecuta cuando el documento se encuentra completamente cargado
document.addEventListener("DOMContentLoaded", function(e){
    // Establece los eventos de cambio para los campos de entrada
    document.getElementById("productCountInput").addEventListener("change", function(){
        productCount = this.value; // Actualiza la cantidad de productos
        updateTotalCosts(); // Actualiza los costos
    });

    document.getElementById("productCostInput").addEventListener("change", function(){
        productCost = this.value; // Actualiza el costo unitario
        updateTotalCosts(); // Actualiza los costos
    });

    // Establece el porcentaje de comisión según el tipo de publicación seleccionada
    document.getElementById("goldradio").addEventListener("change", function(){
        comissionPercentage = 0.13; // Establece la comisión para publicaciones "gold"
        updateTotalCosts(); // Actualiza los costos
    });
    
    document.getElementById("premiumradio").addEventListener("change", function(){
        comissionPercentage = 0.07; // Establece la comisión para publicaciones "premium"
        updateTotalCosts(); // Actualiza los costos
    });

    document.getElementById("standardradio").addEventListener("change", function(){
        comissionPercentage = 0.03; // Establece la comisión para publicaciones "standard"
        updateTotalCosts(); // Actualiza los costos
    });

    // Cambia el símbolo de moneda según la opción seleccionada
    document.getElementById("productCurrency").addEventListener("change", function(){
        // Si se selecciona Dólares, se actualiza el símbolo de la moneda
        if (this.value == DOLLAR_CURRENCY)
        {
            MONEY_SYMBOL = DOLLAR_SYMBOL;
        } 
        // Si se selecciona Pesos Uruguayos, se actualiza el símbolo de la moneda
        else if (this.value == PESO_CURRENCY)
        {
            MONEY_SYMBOL = PESO_SYMBOL;
        }

        updateTotalCosts(); // Actualiza los costos con el nuevo símbolo de moneda
    });

    // Configura las opciones para el elemento de carga de archivos
    let dzoptions = {
        url:"/", // Establece la URL para la carga de archivos (vacía por ahora)
        autoQueue: false // Desactiva la cola automática de carga
    };
    let myDropzone = new Dropzone("div#file-upload", dzoptions); // Crea una instancia de Dropzone para manejar la carga de archivos

    // Recupera el formulario de publicación de producto
    let sellForm = document.getElementById("sell-info");

    // Establece un evento para el formulario cuando se envíe
    sellForm.addEventListener("submit", function(e){
        e.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

        let productNameInput = document.getElementById("productName");
        let productCategory = document.getElementById("productCategory");
        let productCost = document.getElementById("productCostInput");
        let infoMissing = false; // Variable para verificar si falta información

        // Elimina las clases de error de los campos de entrada
        productNameInput.classList.remove('is-invalid');
        productCategory.classList.remove('is-invalid');
        productCost.classList.remove('is-invalid');

        // Verifica si los campos obligatorios están completos
        // Si el nombre del producto está vacío, agrega la clase de error
        if (productNameInput.value === "")
        {
            productNameInput.classList.add('is-invalid');
            infoMissing = true;
        }
        
        // Si la categoría del producto está vacía, agrega la clase de error
        if (productCategory.value === "")
        {
            productCategory.classList.add('is-invalid');
            infoMissing = true;
        }

        // Si el costo del producto es inválido (menor o igual a 0), agrega la clase de error
        if (productCost.value <=0)
        {
            productCost.classList.add('is-invalid');
            infoMissing = true;
        }
        
        // Si no falta información, se procede con la solicitud
        if(!infoMissing)
        {
            // Aquí es donde se enviaría la solicitud para crear la publicación
            getJSONData(PUBLISH_PRODUCT_URL).then(function(resultObj){
                let msgToShowHTML = document.getElementById("resultSpan");
                let msgToShow = "";

                // Si la publicación fue exitosa, muestra un mensaje de éxito
                // Si hubo un error, muestra un mensaje de error
                // FUNCIONALIDAD NO IMPLEMENTADA
                if (resultObj.status === 'ok')
                {
                    msgToShow = MSG; // Muestra el mensaje de éxito (aunque la funcionalidad no está implementada)
                    document.getElementById("alertResult").classList.add('alert-primary');
                }
                else if (resultObj.status === 'error')
                {
                    msgToShow = MSG; // Muestra el mensaje de error (aunque la funcionalidad no está implementada)
                    document.getElementById("alertResult").classList.add('alert-primary');
                }

                // Muestra el mensaje de resultado
                msgToShowHTML.innerHTML = msgToShow;
                document.getElementById("alertResult").classList.add("show");
            });
        }
    });
});

// Mostrar el nombre del usuario al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const userName = localStorage.getItem('currentUsername'); // Obtiene el nombre de usuario desde localStorage

    // Muestra el nombre de usuario en el elemento correspondiente
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = userName;
});