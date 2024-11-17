// Definición de las constantes para los criterios de ordenación
const ORDER_ASC_BY_NAME = "AZ"; // Orden ascendente por nombre (de A a Z)
const ORDER_DESC_BY_NAME = "ZA"; // Orden descendente por nombre (de Z a A)
const ORDER_BY_PROD_COUNT = "Cant."; // Orden por cantidad de productos
let currentCategoriesArray = []; // Array que almacenará las categorías actuales
let currentSortCriteria = undefined; // Criterio de ordenación actual
let minCount = undefined; // Filtro mínimo de cantidad de productos
let maxCount = undefined; // Filtro máximo de cantidad de productos

// Función para ordenar las categorías según el criterio seleccionado
function sortCategories(criteria, array){
    let result = []; // Array donde se almacenará el resultado ordenado

    // Ordenar por nombre ascendente (A-Z)
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort(function(a, b) {
            if (a.name < b.name) { return -1; }
            if (a.name > b.name) { return 1; }
            return 0;
        });
    }
    // Ordenar por nombre descendente (Z-A)
    else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort(function(a, b) {
            if (a.name > b.name) { return -1; }
            if (a.name < b.name) { return 1; }
            return 0;
        });
    }
    // Ordenar por cantidad de productos
    else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.productCount);
            let bCount = parseInt(b.productCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
}

// Función para guardar el ID de la categoría seleccionada y redirigir a la página de productos
function setCatID(id) {
    localStorage.setItem("catID", id); // Guarda el ID de la categoría en localStorage
    window.location = "products.html"; // Redirige a la página de productos
}

// Función para mostrar las categorías en la interfaz
function showCategoriesList() {
    let htmlContentToAppend = ""; // Variable que contendrá el HTML para las categorías
    for (let i = 0; i < currentCategoriesArray.length; i++) {
        let category = currentCategoriesArray[i];

        // Verifica si la categoría cumple con el filtro de cantidad (min y max)
        if (((minCount == undefined) || (minCount != undefined && parseInt(category.productCount) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(category.productCount) <= maxCount))) {

            // Añade el HTML de la categoría a la lista
            htmlContentToAppend += `
            <div onclick="setCatID(${category.id})" class="list-group-item list-group-item-action cursor-active">
                <div class="row">
                    <div class="col-3">
                        <img src="${category.imgSrc}" alt="${category.description}" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <h4 class="mb-1">${category.name}</h4>
                            <small class="text-muted">${category.productCount} artículos</small>
                        </div>
                        <p class="mb-1">${category.description}</p>
                    </div>
                </div>
            </div>
            `;
        }

        // Inserta las categorías en el contenedor HTML
        document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
    }
}

// Función para ordenar las categorías y mostrarlas
function sortAndShowCategories(sortCriteria, categoriesArray) {
    currentSortCriteria = sortCriteria; // Establece el criterio de ordenación actual

    if (categoriesArray != undefined) {
        currentCategoriesArray = categoriesArray; // Si se pasan categorías, actualiza el array de categorías
    }

    currentCategoriesArray = sortCategories(currentSortCriteria, currentCategoriesArray); // Ordena las categorías según el criterio

    // Muestra las categorías ordenadas
    showCategoriesList();
}

// Función que se ejecuta una vez que el documento está completamente cargado
document.addEventListener("DOMContentLoaded", function(e) {
    // Obtiene los datos de categorías desde la URL
    getJSONData(CATEGORIES_URL).then(function(resultObj) {
        if (resultObj.status === "ok") {
            currentCategoriesArray = resultObj.data; // Si la respuesta es correcta, almacena las categorías
            showCategoriesList(); // Muestra las categorías
            // sortAndShowCategories(ORDER_ASC_BY_NAME, resultObj.data); // Ordena las categorías por nombre ascendente (comentado)
        }
    });

    // Añade eventos para los botones de ordenación
    document.getElementById("sortAsc").addEventListener("click", function() {
        sortAndShowCategories(ORDER_ASC_BY_NAME); // Ordena por nombre ascendente
    });

    document.getElementById("sortDesc").addEventListener("click", function() {
        sortAndShowCategories(ORDER_DESC_BY_NAME); // Ordena por nombre descendente
    });

    document.getElementById("sortByCount").addEventListener("click", function() {
        sortAndShowCategories(ORDER_BY_PROD_COUNT); // Ordena por cantidad de productos
    });

    // Añade evento para limpiar los filtros de cantidad
    document.getElementById("clearRangeFilter").addEventListener("click", function() {
        document.getElementById("rangeFilterCountMin").value = ""; // Limpia el campo de cantidad mínima
        document.getElementById("rangeFilterCountMax").value = ""; // Limpia el campo de cantidad máxima

        minCount = undefined; // Restablece el filtro de cantidad mínima
        maxCount = undefined; // Restablece el filtro de cantidad máxima

        showCategoriesList(); // Muestra las categorías sin filtro
    });

    // Añade evento para aplicar los filtros de cantidad
    document.getElementById("rangeFilterCount").addEventListener("click", function() {
        // Obtiene los valores de los filtros de cantidad mínima y máxima
        minCount = document.getElementById("rangeFilterCountMin").value;
        maxCount = document.getElementById("rangeFilterCountMax").value;

        // Si se han introducido valores válidos para el filtro mínimo
        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        } else {
            minCount = undefined; // Si no, restablece el filtro mínimo
        }

        // Si se han introducido valores válidos para el filtro máximo
        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        } else {
            maxCount = undefined; // Si no, restablece el filtro máximo
        }

        showCategoriesList(); // Muestra las categorías con los filtros aplicados
    });
});

// Mostrar el nombre del usuario al cargar la página
document.addEventListener('DOMContentLoaded', function () {
    const userName = localStorage.getItem('currentUsername'); // Obtiene el nombre de usuario desde localStorage

    // Muestra el nombre de usuario en el elemento correspondiente
    const usernameDisplay = document.getElementById('username-display');
    usernameDisplay.textContent = userName;
});


