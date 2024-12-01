// Variables para almacenar los costos y comisiones de los productos
let productCost = 0;
let productCount = 0; 
let comissionPercentage = 0.13; // Porcentaje de comisión inicial
let MONEY_SYMBOL = "$"; 
let DOLLAR_CURRENCY = "Dólares (USD)"; 
let PESO_CURRENCY = "Pesos Uruguayos (UYU)"; 
let DOLLAR_SYMBOL = "USD "; 
let PESO_SYMBOL = "UYU "; 
let PERCENTAGE_SYMBOL = '%'; 
let MSG = "FUNCIONALIDAD NO IMPLEMENTADA"; 

// Función que se utiliza para actualizar los costos de publicación
function updateTotalCosts(){
   
    let unitProductCostHTML = document.getElementById("productCostText");
    let comissionCostHTML = document.getElementById("comissionText");
    let totalCostHTML = document.getElementById("totalCostText");

    // Calcula los costos a mostrar
    let unitCostToShow = MONEY_SYMBOL + productCost; 
    let comissionToShow = Math.round((comissionPercentage * 100)) + PERCENTAGE_SYMBOL; 
    let totalCostToShow = MONEY_SYMBOL + ((Math.round(productCost * comissionPercentage * 100) / 100) + parseInt(productCost));

    unitProductCostHTML.innerHTML = unitCostToShow;
    comissionCostHTML.innerHTML = comissionToShow;
    totalCostHTML.innerHTML = totalCostToShow;
}

// Función que se ejecuta cuando el documento se encuentra completamente cargado
document.addEventListener("DOMContentLoaded", function(e){
    
    document.getElementById("productCountInput").addEventListener("change", function(){
        productCount = this.value;
        updateTotalCosts(); 
    });

    document.getElementById("productCostInput").addEventListener("change", function(){
        productCost = this.value;
        updateTotalCosts(); 
    });

    // Establece el porcentaje de comisión según el tipo de publicación seleccionada
    document.getElementById("goldradio").addEventListener("change", function(){
        comissionPercentage = 0.13; 
        updateTotalCosts(); 
    });
    
    document.getElementById("premiumradio").addEventListener("change", function(){
        comissionPercentage = 0.07; 
        updateTotalCosts(); 
    });

    document.getElementById("standardradio").addEventListener("change", function(){
        comissionPercentage = 0.03; 
        updateTotalCosts(); 
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

        updateTotalCosts();
    });

    // Configura las opciones para el elemento de carga de archivos
    let dzoptions = {
        url:"/", 
        autoQueue: false 
    };
    let myDropzone = new Dropzone("div#file-upload", dzoptions);

    // Recupera el formulario de publicación de producto
    let sellForm = document.getElementById("sell-info");

    // Establece un evento para el formulario cuando se envíe
    sellForm.addEventListener("submit", function(e){
        e.preventDefault(); 

        let productNameInput = document.getElementById("productName");
        let productCategory = document.getElementById("productCategory");
        let productCost = document.getElementById("productCostInput");
        let infoMissing = false;

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

                if (resultObj.status === 'ok')
                {
                    msgToShow = MSG; 
                    document.getElementById("alertResult").classList.add('alert-primary');
                }
                else if (resultObj.status === 'error')
                {
                    msgToShow = MSG; 
                    document.getElementById("alertResult").classList.add('alert-primary');
                }
                msgToShowHTML.innerHTML = msgToShow;
                document.getElementById("alertResult").classList.add("show");
            });
        }
    });
});

// Mostrar el nombre del usuario al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const userName = localStorage.getItem('currentUsername'); 
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = userName;
});