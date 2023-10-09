const listasDeTareas = {
    trabajo: [],
    personales: [],
    compras: []
};

const registro = document.getElementById("registro-formulario");

registro.addEventListener("submit", function (e) {
    e.preventDefault();

    const nombreUsuario = document.getElementById("nombre_usuario").value;
    const correo = document.getElementById("correo").value;
    const contrasena = document.getElementById("contrasena").value;
    const repetirContrasena = document.getElementById("repetir_contrasena").value;

    if (contrasena !== repetirContrasena) {
        alert("Las contraseñas no coinciden, intente de nuevo.")
    }
});


fetch('https://jsonplaceholder.typicode.com/users')
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al cargar los datos');
        }
        return response.json(); // Convierte la respuesta en un objeto
    })
    .then(data => {
        // Haz algo con los datos obtenidos de la API
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });

document.addEventListener("DOMContentLoaded", function () {
    
    var calendar;

    // Ejemplo de estructura de tarea con fecha de vencimiento
    const tareaEjemplo = {
        text: " ",
        completed: false,
        tags: ["trabajo"],
        priority: 2,
        dueDate: "2023-10-15",
        comments: [] // Agregamos un arreglo para almacenar comentarios
    };


// Agregar la tarea de ejemplo a la lista de trabajo
listasDeTareas.trabajo.push(tareaEjemplo);

// Función para agregar una tarea con fecha de vencimiento
function agregarTarea(lista, texto, etiquetas, prioridad, fechaVencimiento, comentario) {
    const tarea = {
        text: texto,
        completed: false,
        tags: etiquetas,
        priority: prioridad,
        dueDate: fechaVencimiento,
        comments: [comentario] // Agregamos el comentario a la tarea
    };
    listasDeTareas[lista].push(tarea);

    // Actualiza el calendario con la nueva tarea
    actualizarCalendario(tarea);
}

// Función para actualizar el calendario con una nueva tarea
function actualizarCalendario(tarea) {
    // Verifica si la tarea tiene una fecha de vencimiento
    if (tarea.dueDate && calendar) {
        // Convierte la fecha de vencimiento en un objeto Date
        const fechaVencimiento = new Date(tarea.dueDate);

        // Agrega la tarea al calendario
        calendar.addEvent({
            title: tarea.text,
            start: fechaVencimiento, // Usa la fecha de vencimiento como inicio
            allDay: true // Define si el evento dura todo el día
        });
    }
}

// Función para actualizar el calendario con una nueva tarea


let listaTareas;

// Función para mostrar las tareas en una columna específica
function mostrarTareasEnColumna(lista, columnaId) {
    const columna = document.getElementById(columnaId);
    if (columna) {
        const listaTareasColumna = columna.querySelector("ul");
        if (listaTareasColumna) {
            listaTareasColumna.innerHTML = "";

            listasDeTareas[lista].forEach((tarea, index) => {
                const item = document.createElement("li");
                item.innerHTML = `
                    <input type="checkbox" ${tarea.completed ? 'checked' : ''}>
                    <label>${tarea.text} (Prioridad: ${tarea.priority})</label>
                    <ul>
                        ${tarea.comments ? tarea.comments.map(comment => `<li>${comment}</li>`).join('') : ''}
                    </ul>
                `;
                listaTareasColumna.appendChild(item);
            });
        }
    }
}

// Función para mostrar las tareas en el DOM
function mostrarTareas(lista) {
    // En función de la lista seleccionada, selecciona la columna y su lista de tareas correspondiente
    let columnaId;
    if (lista === "trabajo") {
        columnaId = "columna-trabajo";
    } else if (lista === "personales") {
        columnaId = "columna-personales";
    } else if (lista === "compras") {
        columnaId = "columna-compras";
    }

    mostrarTareasEnColumna(lista, columnaId);
}

function agregarTarea(lista, texto, etiquetas, prioridad, fechaVencimiento, comentario) {
    const tarea = {
        text: texto,
        completed: false,
        tags: etiquetas,
        priority: prioridad,
        dueDate: fechaVencimiento,
        comments: [comentario]
    };

    listasDeTareas[lista].push(tarea);
    mostrarTareas(lista);
}



const formulario = document.getElementById("formulario-tarea");
formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    const listaSeleccionada = document.getElementById("lista-seleccionada").value;
    const aportarTarea = document.getElementById("nueva-tarea");
    const nuevaTarea = aportarTarea.value.trim();
    const etiquetas = document.getElementById("etiquetas").value.split(',').map(tag => tag.trim());
    const prioridad = document.getElementById("prioridad").value;
    const comentario = document.getElementById("comentario").value; // Obtener el comentario

    if (nuevaTarea !== "") {
        agregarTarea(listaSeleccionada, nuevaTarea, etiquetas, prioridad, "", comentario); // Pasar el comentario
        aportarTarea.value = "";
        document.getElementById("etiquetas").value = "";
        document.getElementById("comentario").value = ""; // Limpiar el campo de comentario
    }
});

// Evento para cambiar la lista seleccionada
const listaSeleccion = document.getElementById("lista-seleccionada");
listaSeleccion.addEventListener("change", () => {
    const listaSeleccionada = listaSeleccion.value;
    mostrarTareas(listaSeleccionada);
});



// Función para filtrar tareas por etiqueta
function filtrarTareasPorEtiqueta(etiqueta) {
    const tareasFiltradas = [];
    for (const lista in listasDeTareas) {
        tareasFiltradas.push(...listasDeTareas[lista].filter(tarea => tarea.tags.includes(etiqueta)));
    }
    return tareasFiltradas;
}

// Manejador de eventos para el botón de búsqueda
const botonBuscar = document.getElementById("boton-buscar");
botonBuscar.addEventListener("click", () => {
    const etiquetaBuscada = document.getElementById("buscar-etiqueta").value.trim();
    if (etiquetaBuscada !== "") {
        const tareasFiltradas = filtrarTareasPorEtiqueta(etiquetaBuscada);
        // Muestra las tareas filtradas en el DOM
        mostrarTareasFiltradas(tareasFiltradas);
    }
});

// Función para mostrar tareas filtradas en el DOM
function mostrarTareasFiltradas(tareas, columnaId) {
    const columna = document.getElementById(columnaId);
    if (columna) {
        const listaTareasColumna = columna.querySelector("ul");
        if (listaTareasColumna) {
            listaTareasColumna.innerHTML = ""; // Borra el contenido actual de la lista de tareas de la columna

            tareas.forEach((tarea, index) => {
                const item = document.createElement("li");
                item.innerHTML = `
                        <input type="checkbox" ${tarea.completed ? 'checked' : ''}>
                        <label>${tarea.text} (Prioridad: ${tarea.priority})</label>
                    `;
                listaTareasColumna.appendChild(item);
            });
        }
    }
}

// Llama a la función para mostrar las tareas en las columnas correspondientes
mostrarTareasEnColumna("trabajo", "columna-trabajo");
mostrarTareasEnColumna("personales", "columna-personales");
mostrarTareasEnColumna("compras", "columna-compras");


});




// Calendario

var calendarEl = document.getElementById('calendario'); // Elemento HTML donde se mostrará el calendario

calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth', // Establece la vista inicial como "mes"
    events: [
        // Aquí puedes agregar eventos como se mencionó en respuestas anteriores
    ]
});

calendar.render(); // Renderiza el calendario