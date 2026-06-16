/* ==========================================
   IMPRIMIR.JS
   Gestión de impresión del Atlas
========================================== */

/* ==========================================
   IMPRIMIR CONTENIDO ACTUAL
========================================== */

function imprimirOrganigrama() {

    if (!hayContenidoParaImprimir()) {

        alert(
            "No hay información disponible para imprimir."
        );

        return;
    }

    prepararImpresion();

    setTimeout(() => {

        window.print();

    }, 300);

}

/* ==========================================
   IMPRIMIR SOLO FICHA
========================================== */

function imprimirFicha() {

    if (!dependenciaSeleccionada) {

        alert(
            "Seleccione una dependencia para imprimir su ficha."
        );

        return;
    }

    activarModoImpresion("ficha");

    setTimeout(() => {

        window.print();

    }, 300);

}

/* ==========================================
   IMPRIMIR SOLO ORGANIGRAMA
========================================== */

function imprimirSoloOrganigrama() {

    if (!hayContenidoParaImprimir()) {

        alert(
            "No hay organigrama para imprimir."
        );

        return;
    }

    activarModoImpresion("organigrama");

    setTimeout(() => {

        window.print();

    }, 300);

}

/* ==========================================
   VALIDAR CONTENIDO
========================================== */

function hayContenidoParaImprimir() {

    const arbolVisible =
        organigramaArbol &&
        !organigramaArbol.classList.contains(
            "oculto"
        ) &&
        organigramaArbol.innerHTML.trim() !== "";

    const graficoVisible =
        organigramaGrafico &&
        !organigramaGrafico.classList.contains(
            "oculto"
        ) &&
        organigramaGrafico.innerHTML.trim() !== "";

    return (
        arbolVisible ||
        graficoVisible
    );

}

/* ==========================================
   PREPARAR IMPRESIÓN
========================================== */

function prepararImpresion() {

    document.body.classList.remove(
        "imprimir-ficha"
    );

    document.body.classList.remove(
        "imprimir-organigrama"
    );

    document.body.classList.add(
        "imprimir-completo"
    );

}

/* ==========================================
   MODOS DE IMPRESIÓN
========================================== */

function activarModoImpresion(
    modo
) {

    document.body.classList.remove(
        "imprimir-completo"
    );

    document.body.classList.remove(
        "imprimir-ficha"
    );

    document.body.classList.remove(
        "imprimir-organigrama"
    );

    switch (modo) {

        case "ficha":

            document.body.classList.add(
                "imprimir-ficha"
            );

            break;

        case "organigrama":

            document.body.classList.add(
                "imprimir-organigrama"
            );

            break;

        default:

            document.body.classList.add(
                "imprimir-completo"
            );

    }

}

/* ==========================================
   RESTABLECER VISTA
========================================== */

function restaurarVista() {

    document.body.classList.remove(
        "imprimir-completo"
    );

    document.body.classList.remove(
        "imprimir-ficha"
    );

    document.body.classList.remove(
        "imprimir-organigrama"
    );

}

/* ==========================================
   IMPRIMIR DEPENDENCIA ACTUAL
========================================== */

function imprimirDependenciaActual() {

    if (!dependenciaSeleccionada) {

        alert(
            "Seleccione una dependencia."
        );

        return;
    }

    imprimirFicha();

}

/* ==========================================
   ATAJOS DE TECLADO
========================================== */

document.addEventListener(
    "keydown",
    function (e) {

        /*
           Ctrl + P
           Imprimir completo
        */

        if (
            e.ctrlKey &&
            e.key.toLowerCase() === "p"
        ) {

            e.preventDefault();

            imprimirOrganigrama();

        }

        /*
           Ctrl + Shift + P
           Imprimir ficha
        */

        if (
            e.ctrlKey &&
            e.shiftKey &&
            e.key.toLowerCase() === "p"
        ) {

            e.preventDefault();

            imprimirFicha();

        }

    }
);

/* ==========================================
   EVENTOS DEL NAVEGADOR
========================================== */

window.addEventListener(
    "beforeprint",
    prepararImpresion
);

window.addEventListener(
    "afterprint",
    restaurarVista
);

/* ==========================================
   IMPRESIÓN SILENCIOSA (FUTURO)
========================================== */

function impresionSilenciosa() {

    console.warn(
        "La impresión silenciosa requiere configuración específica del navegador."
    );

}

/* ==========================================
   OBTENER TÍTULO DE IMPRESIÓN
========================================== */

function obtenerTituloImpresion() {

    if (
        dependenciaSeleccionada
    ) {

        const dependencia =
            obtenerDetalleActual();

        return dependencia
            ? dependencia.nombre
            : "Atlas Organizacional";
    }

    return "Atlas Organizacional";

}

/* ==========================================
   ACTUALIZAR TÍTULO TEMPORAL
========================================== */

let tituloOriginal =
    document.title;

window.addEventListener(
    "beforeprint",
    function () {

        tituloOriginal =
            document.title;

        document.title =
            obtenerTituloImpresion();

    }
);

window.addEventListener(
    "afterprint",
    function () {

        document.title =
            tituloOriginal;

    }
);