// Definición de las constantes para los criterios de orden
const ORDER_ASC_BY_NAME = "AZ"; // Orden por nombre (de A a Z)
const ORDER_DESC_BY_NAME = "ZA"; // Orden por nombre (de Z a A)
const ORDER_BY_PROD_COUNT = "Cant."; // Orden por cantidad de productos

// Estado de la aplicación para centralizar las variables globales
const globalVar = {
    currentCategoriesArray: [],
    currentSortCriteria: undefined,
    minCount: undefined,
    maxCount: undefined,
};

// Función para ordenar las categorías según el criterio seleccionado
function sortCategories(criteria, array) {
    let result = [];

    // Ordenar por nombre ascendente
    if (criteria === ORDER_ASC_BY_NAME) {
        result = array.sort((a, b) => a.name.localeCompare(b.name));
    }
    // Ordenar por nombre descendente
    else if (criteria === ORDER_DESC_BY_NAME) {
        result = array.sort((a, b) => b.name.localeCompare(a.name));
    }
    // Ordenar por cantidad de productos
    else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort((a, b) => parseInt(b.productCount) - parseInt(a.productCount));
    }

    return result;
}

// Función para guardar el ID de la categoría seleccionada y redirigir a la página de productos
function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html";
}

// Función para mostrar las categorías en la interfaz
function showCategoriesList() {
    let htmlContentToAppend = "";

    for (let category of globalVar.currentCategoriesArray) {
        if (
            ((globalVar.minCount === undefined) || parseInt(category.productCount) >= globalVar.minCount) &&
            ((globalVar.maxCount === undefined) || parseInt(category.productCount) <= globalVar.maxCount)
        ) {
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
    }

    document.getElementById("cat-list-container").innerHTML = htmlContentToAppend;
}

// Función para ordenar las categorías y mostrarlas
function sortAndShowCategories(sortCriteria, categoriesArray) {
    globalVar.currentSortCriteria = sortCriteria;

    if (categoriesArray) {
        globalVar.currentCategoriesArray = categoriesArray;
    }

    globalVar.currentCategoriesArray = sortCategories(globalVar.currentSortCriteria, globalVar.currentCategoriesArray);

    showCategoriesList();
}

// Función que se ejecuta una vez que el documento está completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    // Mostrar el nombre del usuario
    const userName = localStorage.getItem("currentUsername");
    const usernameDisplay = document.getElementById("username-display");
    if (usernameDisplay) usernameDisplay.textContent = userName;

    // Cargar categorías desde la API
    getJSONData(CATEGORIES_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            globalVar.currentCategoriesArray = resultObj.data;
            showCategoriesList();
        }
    });

    // Añade eventos para los botones de ordenación
    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_ASC_BY_NAME);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowCategories(ORDER_DESC_BY_NAME);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowCategories(ORDER_BY_PROD_COUNT);
    });

    // Añade evento para limpiar los filtros de cantidad
    document.getElementById("clearRangeFilter").addEventListener("click", function () {
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        globalVar.minCount = undefined;
        globalVar.maxCount = undefined;

        showCategoriesList();
    });

    // Añade evento para aplicar los filtros de cantidad
    document.getElementById("rangeFilterCount").addEventListener("click", function () {
        const minInput = document.getElementById("rangeFilterCountMin").value;
        const maxInput = document.getElementById("rangeFilterCountMax").value;

        globalVar.minCount = minInput && parseInt(minInput) >= 0 ? parseInt(minInput) : undefined;
        globalVar.maxCount = maxInput && parseInt(maxInput) >= 0 ? parseInt(maxInput) : undefined;

        showCategoriesList();
    });
});
