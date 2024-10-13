// Variables Globales

// Referencias a elementos del DOM
const arrayContainer = document.getElementById('array-container');
const startButton = document.getElementById('start-button');
const stepButton = document.getElementById('step-button');
const autoButton = document.getElementById('auto-button');
const generateArrayButton = document.getElementById('generate-array');
const algorithmSelect = document.getElementById('algorithm-select');

// Variables para el manejo del array y el algoritmo
let array = [];                // Array que contiene los números a ordenar
let currentAlgorithm = 'bubble'; // Algoritmo seleccionado actualmente
let isSorting = false;         // Indicador de si el algoritmo está en ejecución
let intervalId = null;         // Identificador del intervalo para ejecución automática

// Variables para los algoritmos
let i = 0;       // Índice principal
let j = 0;       // Índice secundario
let minIdx = 0;  // Índice del mínimo en Selection Sort
let key;         // Clave en Insertion Sort

// Función para generar un array aleatorio
function generateArray(size = 10) {
    array = []; // Reinicia el array
    for (let i = 0; i < size; i++) {
        // Agrega números aleatorios entre 1 y 100
        array.push(Math.floor(Math.random() * 100) + 1);
    }
    resetVariables();    // Reinicia las variables del algoritmo
    renderArray(array);  // Renderiza el array en el DOM
}

// Función para renderizar el array en el DOM
function renderArray(arr, activeIndices = [], sortedIndices = []) {
    arrayContainer.innerHTML = ''; // Limpia el contenido previo
    arr.forEach((value, idx) => {
        // Crea un elemento div para representar cada valor del array
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height = `${value * 3}px`; // Altura proporcional al valor

        // Resaltar barras activas
        if (activeIndices.includes(idx)) {
            bar.classList.add('active');
        }
        // Resaltar barras ya ordenadas
        if (sortedIndices.includes(idx)) {
            bar.classList.add('sorted');
        }

        // Agrega una etiqueta con el valor numérico
        const barLabel = document.createElement('div');
        barLabel.classList.add('bar-label');
        barLabel.textContent = value;
        bar.appendChild(barLabel);

        arrayContainer.appendChild(bar); // Agrega la barra al contenedor
    });
}

// Función para reiniciar las variables de los algoritmos
function resetVariables() {
    i = 0;              // Reinicia el índice principal
    j = 0;              // Reinicia el índice secundario
    minIdx = 0;         // Reinicia el índice mínimo
    key = undefined;    // Reinicia la clave para Insertion Sort
    isSorting = false;  // Indica que no se está ejecutando ningún algoritmo
    if (intervalId) {
        clearInterval(intervalId); // Detiene la ejecución automática si está activa
        intervalId = null;
    }
}

// Controladores de eventos

// Cambiar el algoritmo seleccionado
algorithmSelect.addEventListener('change', () => {
    currentAlgorithm = algorithmSelect.value; // Actualiza el algoritmo actual
    resetVariables();    // Reinicia las variables
    renderArray(array);  // Renderiza el array
});

// Generar un nuevo array al hacer clic en el botón
generateArrayButton.addEventListener('click', () => {
    generateArray(); // Genera un nuevo array
});

// Iniciar o reiniciar el ordenamiento
startButton.addEventListener('click', () => {
    resetVariables();    // Reinicia las variables
    renderArray(array);  // Renderiza el array
});

// Avanzar un paso en el algoritmo
stepButton.addEventListener('click', () => {
    if (!isSorting) {    // Evita conflictos si ya se está ejecutando un paso
        isSorting = true;
        switch (currentAlgorithm) {
            case 'bubble':
                bubbleSortStep();     // Ejecuta un paso de Bubble Sort
                break;
            case 'insertion':
                insertionSortStep();  // Ejecuta un paso de Insertion Sort
                break;
            case 'selection':
                selectionSortStep();  // Ejecuta un paso de Selection Sort
                break;
        }
        isSorting = false;
    }
});

// Ejecutar el algoritmo automáticamente
autoButton.addEventListener('click', () => {
    if (!intervalId) {   // Verifica que no haya ya una ejecución en curso
        intervalId = setInterval(() => {
            stepButton.click();   // Simula un clic en el botón de siguiente paso
            // Verifica si el algoritmo ha terminado para detener la ejecución automática
            if (currentAlgorithm === 'bubble' && i >= array.length) {
                clearInterval(intervalId);
                intervalId = null;
            }
            if (currentAlgorithm === 'insertion' && i >= array.length && typeof key === 'undefined') {
                clearInterval(intervalId);
                intervalId = null;
            }
            if (currentAlgorithm === 'selection' && i >= array.length) {
                clearInterval(intervalId);
                intervalId = null;
            }
        }, 200); // Intervalo de tiempo entre pasos automáticos (200 ms)
    }
});

// Implementación de Bubble Sort
function bubbleSortStep() {
    // Verifica si aún no se ha completado el recorrido del array
    if (i < array.length) {
        // Verifica si no ha llegado al final de la pasada actual
        if (j < array.length - i - 1) {
            // Compara elementos adyacentes
            if (array[j] > array[j + 1]) {
                // Intercambia si están en el orden incorrecto
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
            // Renderiza el array resaltando los elementos comparados
            renderArray(array, [j, j + 1], Array.from({ length: i }, (_, idx) => array.length - idx - 1));
            j++; // Avanza al siguiente par de elementos
        } else {
            j = 0; // Reinicia j para la siguiente pasada
            i++;   // Incrementa i para indicar que un elemento más está en su posición final
        }
    } else {
        // Algoritmo completado, resalta todo el array como ordenado
        renderArray(array, [], Array.from({ length: array.length }, (_, idx) => idx));
    }
}

// Implementación de Insertion Sort
function insertionSortStep() {
    if (i < array.length) {
        if (typeof key === 'undefined') {
            // Inicia un nuevo ciclo de inserción
            key = array[i];  // Clave a insertar
            j = i - 1;       // Índice del elemento anterior
        }

        if (j >= 0 && array[j] > key) {
            // Desplaza los elementos mayores que la clave hacia la derecha
            array[j + 1] = array[j];
            // Renderiza el array resaltando los elementos comparados
            renderArray(array, [j, j + 1], Array.from({ length: i }, (_, idx) => idx));
            j--; // Decrementa j para continuar comparando hacia atrás
        } else {
            // Inserta la clave en su posición correcta
            array[j + 1] = key;
            i++;           // Avanza al siguiente elemento
            key = undefined; // Reinicia la clave para el próximo ciclo
            // Renderiza el array mostrando la inserción
            renderArray(array, [i - 1], Array.from({ length: i }, (_, idx) => idx));
        }
    } else {
        // Algoritmo completado, resalta todo el array como ordenado
        renderArray(array, [], Array.from({ length: array.length }, (_, idx) => idx));
    }
}

// Implementación de Selection Sort
function selectionSortStep() {
    // Verifica si aún no se ha completado el recorrido del array
    if (i < array.length) {
        if (j === 0 || j < i) {
            // Inicializa minIdx al comienzo de la porción no ordenada
            minIdx = i;
            j = i + 1;
        }

        if (j < array.length) {
            // Busca el elemento mínimo en la porción no ordenada
            if (array[j] < array[minIdx]) {
                minIdx = j; // Actualiza minIdx si encuentra un valor menor
            }
            // Renderiza el array resaltando el elemento actual y el mínimo encontrado
            renderArray(array, [j, minIdx], Array.from({ length: i }, (_, idx) => idx));
            j++; // Avanza al siguiente elemento
        } else {
            // Intercambia el mínimo encontrado con el primer elemento no ordenado
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            // Renderiza el array mostrando el intercambio y marcando el elemento como ordenado
            renderArray(array, [i, minIdx], Array.from({ length: i + 1 }, (_, idx) => idx));
            i++; // Incrementa i para reducir la porción no ordenada
            j = 0; // Reinicia j para la siguiente iteración
        }
    } else {
        // Algoritmo completado, resalta todo el array como ordenado
        renderArray(array, [], Array.from({ length: array.length }, (_, idx) => idx));
    }
}

// Inicializa el array al cargar la página
generateArray();