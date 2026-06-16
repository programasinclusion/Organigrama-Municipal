/* ==========================================
   CONFIG.JS
   Configuración global del Atlas
========================================== */

const CONFIG = {

    /* ==========================================
       INFORMACIÓN INSTITUCIONAL
    ========================================== */

    institucion: {

        nombre:
            "Municipalidad de San Fernando del Valle de Catamarca",

        sistema:
            "Atlas Organizacional Interactivo",

        version:
            "1.0.0",

        organismo:
            "Departamento Ejecutivo Municipal",

        piePagina:
            "Municipalidad de San Fernando del Valle de Catamarca",

        anio:
            new Date().getFullYear()

    },

    /* ==========================================
       IDENTIDAD VISUAL
    ========================================== */

    imagenes: {

        logoMunicipal:
            "img/logo-municipalidad.png",

        escudo:
            "img/escudo-catamarca.png",

        fotoDefecto:
            "img/funcionarios/sin-foto.png"

    },

    /* ==========================================
       COLORES INSTITUCIONALES
    ========================================== */

    colores: {

        principal:
            "#0B4F8A",

        secundario:
            "#2F7CC0",

        fondo:
            "#F5F7FA",

        texto:
            "#1F2937",

        borde:
            "#D9DEE5",

        exito:
            "#2E7D32",

        advertencia:
            "#ED6C02",

        error:
            "#D32F2F",

        informacion:
            "#0288D1"

    },

    /* ==========================================
       CONFIGURACIÓN DEL ORGANIGRAMA
    ========================================== */

    organigrama: {

        vistaInicial:
            "arbol",

        expandirSecretaria:
            true,

        expandirAutomaticamente:
            true,

        animaciones:
            true,

        scrollSuave:
            true,

        profundidadMaxima:
            10

    },

    /* ==========================================
       BUSCADOR
    ========================================== */

    buscador: {

        minimoCaracteres:
            2,

        maximoResultados:
            10,

        debounce:
            250,

        resaltarCoincidencias:
            true

    },

    /* ==========================================
       EXPORTACIÓN
    ========================================== */

    exportacion: {

        formatoPDF:
            "a4",

        orientacionPDF:
            "portrait",

        calidadImagen:
            0.98,

        escalaCanvas:
            2,

        exportarPanel:
            true,

        exportarOrganigrama:
            true

    },

    /* ==========================================
       IMPRESIÓN
    ========================================== */

    impresion: {

        titulo:
            "Atlas Organizacional",

        mostrarFecha:
            true,

        mostrarLogo:
            true,

        formato:
            "A4",

        orientacion:
            "portrait"

    },

    /* ==========================================
       PANEL INSTITUCIONAL
    ========================================== */

    panel: {

        mostrarFoto:
            true,

        mostrarMision:
            true,

        mostrarFunciones:
            true,

        mostrarContacto:
            true,

        mostrarSuperior:
            true

    },

    /* ==========================================
       MENSAJES
    ========================================== */

    mensajes: {

        cargando:
            "Cargando información institucional...",

        sinResultados:
            "No se encontraron coincidencias.",

        sinInformacion:
            "Información pendiente de carga.",

        exportando:
            "Generando PDF...",

        imprimiendo:
            "Preparando impresión...",

        copiado:
            "Copiado al portapapeles.",

        error:
            "Ha ocurrido un error inesperado."

    },

    /* ==========================================
       CONTACTO INSTITUCIONAL
    ========================================== */

    contacto: {

        direccion:
            "Palacio Municipal",

        ciudad:
            "San Fernando del Valle de Catamarca",

        provincia:
            "Catamarca",

        pais:
            "Argentina",

        telefono:
            "",

        email:
            "",

        sitioWeb:
            ""

    }

};

/* ==========================================
   FUNCIONES AUXILIARES
========================================== */

function obtenerConfiguracion(ruta) {

    return ruta
        .split(".")
        .reduce(

            (objeto, clave) =>

                objeto &&
                objeto[clave],

            CONFIG

        );

}

function actualizarConfiguracion(
    ruta,
    valor
) {

    const claves =
        ruta.split(".");

    let objeto =
        CONFIG;

    while (claves.length > 1) {

        objeto =
            objeto[
                claves.shift()
            ];

    }

    objeto[
        claves[0]
    ] = valor;
}

function obtenerColor(nombre) {

    return CONFIG.colores[
        nombre
    ] || "#000000";
}

/* ==========================================
   APLICAR CONFIGURACIÓN
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document.title =
            `${CONFIG.institucion.sistema} - ${CONFIG.institucion.nombre}`;

        const titulo =
            document.getElementById(
                "tituloSistema"
            );

        if (titulo) {

            titulo.textContent =
                CONFIG.institucion.sistema;

        }

        const organismo =
            document.getElementById(
                "nombreInstitucion"
            );

        if (organismo) {

            organismo.textContent =
                CONFIG.institucion.nombre;

        }

        const logo =
            document.getElementById(
                "logoMunicipal"
            );

        if (logo) {

            logo.src =
                CONFIG.imagenes.logoMunicipal;

            logo.alt =
                CONFIG.institucion.nombre;

        }

    }
);