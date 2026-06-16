/* ==========================================
   APP.JS
   Control principal del Atlas
========================================== */

/* ==========================================
   VARIABLES GLOBALES
========================================== */

let organigrama = [];
let responsables = {};
let contactos = {};

let dependenciaSeleccionada = null;
let vistaActual = "arbol";

/* ==========================================
   ELEMENTOS DEL DOM
========================================== */

const listaSecretarias = document.getElementById("listaSecretarias");
const buscador = document.getElementById("buscador");
const btnBuscar = document.getElementById("btnBuscar");

const organigramaArbol = document.getElementById("organigramaArbol");
const organigramaGrafico = document.getElementById("organigramaGrafico");

const mensajeInicial = document.getElementById("mensajeInicial");
const detalleDependencia = document.getElementById("detalleDependencia");

const sidebar = document.getElementById("sidebar");
const modalOverlay = document.getElementById("modalOverlay");

const btnMenu = document.getElementById("btnMenu");

const btnExpandirTodo = document.getElementById("btnExpandirTodo");
const btnContraerTodo = document.getElementById("btnContraerTodo");

const btnVistaArbol = document.getElementById("btnVistaArbol");
const btnVistaGrafica = document.getElementById("btnVistaGrafica");

const btnExportarPDF = document.getElementById("btnExportarPDF");
const btnImprimir = document.getElementById("btnImprimir");

const btnTop = document.getElementById("btnTop");

/* ==========================================
   INICIALIZACIÓN
========================================== */

document.addEventListener("DOMContentLoaded", iniciarAplicacion);

async function iniciarAplicacion() {

    try {

        await cargarDatos();

        cargarSecretarias();

        registrarEventos();

    } catch (error) {

        console.error(error);

        mostrarMensajeError(
            "No fue posible cargar el Atlas Organizacional."
        );

    }

}

/* ==========================================
   CARGA DE DATOS
========================================== */

async function cargarDatos() {

    /* Organigrama */

    const respuestaOrganigrama = await fetch(
        "./data/organigrama.json"
    );

    organigrama = await respuestaOrganigrama.json();


    /* Responsables */

    try {

        const respuestaResponsables = await fetch(
            "./data/responsables.json"
        );

        responsables =
            await respuestaResponsables.json();

    } catch {

        responsables = {};

    }


    /* Contactos */

    try {

        const respuestaContactos = await fetch(
            "./data/contactos.json"
        );

        contactos =
            await respuestaContactos.json();

    } catch {

        contactos = {};

    }

}

/* ==========================================
   CARGAR SECRETARÍAS
========================================== */

function cargarSecretarias() {

    listaSecretarias.innerHTML = "";

    const secretarias = organigrama
        .filter(item => item.tipo === "secretaria")
        .sort((a, b) =>
            a.nombre.localeCompare(b.nombre)
        );

    secretarias.forEach(secretaria => {

        const li = document.createElement("li");

        li.dataset.id = secretaria.id;

        li.innerHTML = `
            <i class="fa-solid fa-building-columns"></i>
            ${secretaria.nombre}
        `;

        li.addEventListener("click", () => {

            seleccionarSecretaria(secretaria.id);

        });

        listaSecretarias.appendChild(li);

    });

}

/* ==========================================
   SELECCIONAR SECRETARÍA
========================================== */

function seleccionarSecretaria(id) {

    document.querySelectorAll(
        ".lista-secretarias li"
    ).forEach(li => {

        li.classList.remove("activo");

        if (li.dataset.id === id) {

            li.classList.add("activo");

        }

    });

    mensajeInicial.classList.add("oculto");

    renderizarArbol(id);

    if (window.innerWidth <= 1024) {

        cerrarSidebar();

    }

}

/* ==========================================
   BUSCADOR
========================================== */

function ejecutarBusqueda() {

    const texto = buscador.value
        .trim()
        .toLowerCase();

    if (!texto) {

        return;

    }

    const resultado = organigrama.find(item =>

        item.nombre
            .toLowerCase()
            .includes(texto)

    );

    if (!resultado) {

        alert("No se encontraron resultados.");

        return;

    }

    const secretaria =
        obtenerSecretariaPadre(resultado);

    if (secretaria) {

        seleccionarSecretaria(secretaria.id);

    }

    setTimeout(() => {

        abrirRuta(resultado.id);

        resaltarNodo(resultado.id);

        mostrarDetalle(resultado.id);

    }, 200);

}

/* ==========================================
   OBTENER SECRETARÍA PADRE
========================================== */

function obtenerSecretariaPadre(item) {

    if (item.tipo === "secretaria") {

        return item;

    }

    let actual = item;

    while (actual && actual.padre) {

        actual = organigrama.find(
            nodo => nodo.id === actual.padre
        );

        if (
            actual &&
            actual.tipo === "secretaria"
        ) {

            return actual;

        }

    }

    return null;

}

/* ==========================================
   EVENTOS
========================================== */

function registrarEventos() {

    /* Buscador */

    buscador.addEventListener("keyup", e => {

        if (e.key === "Enter") {

            ejecutarBusqueda();

        }

    });

    btnBuscar.addEventListener(
        "click",
        ejecutarBusqueda
    );


    /* Sidebar */

    btnMenu.addEventListener(
        "click",
        abrirSidebar
    );

    modalOverlay.addEventListener(
        "click",
        cerrarSidebar
    );


    /* Vista */

    btnVistaArbol.addEventListener(
        "click",
        () => cambiarVista("arbol")
    );

    btnVistaGrafica.addEventListener(
        "click",
        () => cambiarVista("grafica")
    );


    /* Expandir */

    btnExpandirTodo.addEventListener(
        "click",
        expandirTodo
    );

    btnContraerTodo.addEventListener(
        "click",
        contraerTodo
    );


    /* Exportar */

    btnExportarPDF.addEventListener(
        "click",
        exportarPDF
    );

    btnImprimir.addEventListener(
        "click",
        imprimirOrganigrama
    );


    /* Botón Top */

    window.addEventListener(
        "scroll",
        controlarBotonTop
    );

    btnTop.addEventListener(
        "click",
        volverArriba
    );

}

/* ==========================================
   SIDEBAR
========================================== */

function abrirSidebar() {

    sidebar.classList.add("abierto");

    modalOverlay.classList.add("activo");

}

function cerrarSidebar() {

    sidebar.classList.remove("abierto");

    modalOverlay.classList.remove("activo");

}

/* ==========================================
   CAMBIAR VISTA
========================================== */

function cambiarVista(vista) {

    vistaActual = vista;

    btnVistaArbol.classList.remove(
        "vista-activa"
    );

    btnVistaGrafica.classList.remove(
        "vista-activa"
    );

    if (vista === "arbol") {

        organigramaArbol.classList.remove(
            "oculto"
        );

        organigramaGrafico.classList.add(
            "oculto"
        );

        btnVistaArbol.classList.add(
            "vista-activa"
        );

    } else {

        organigramaGrafico.classList.remove(
            "oculto"
        );

        organigramaArbol.classList.add(
            "oculto"
        );

        btnVistaGrafica.classList.add(
            "vista-activa"
        );

    }

}

/* ==========================================
   BOTÓN VOLVER ARRIBA
========================================== */

function controlarBotonTop() {

    btnTop.style.display =
        window.scrollY > 300
            ? "block"
            : "none";

}

function volverArriba() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}

/* ==========================================
   MENSAJE DE ERROR
========================================== */

function mostrarMensajeError(mensaje) {

    organigramaArbol.innerHTML = `

        <div class="mensaje-error">

            <h3>Error</h3>

            <p>${mensaje}</p>

        </div>

    `;

}