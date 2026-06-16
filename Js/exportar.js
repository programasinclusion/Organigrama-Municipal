/* ==========================================
   EXPORTAR.JS
   Exportación del Atlas Organizacional
========================================== */

/* ==========================================
   EXPORTAR PDF
========================================== */

async function exportarPDF() {

    const contenedor = obtenerElementoExportar();

    if (!contenedor) {

        alert(
            "No hay información disponible para exportar."
        );

        return;
    }

    try {

        mostrarCargando();

        const opciones = {

            margin: 10,

            filename: generarNombreArchivo(),

            image: {

                type: "jpeg",

                quality: 0.98

            },

            html2canvas: {

                scale: 2,

                useCORS: true,

                logging: false

            },

            jsPDF: {

                unit: "mm",

                format: "a4",

                orientation: "portrait"

            },

            pagebreak: {

                mode: [
                    "avoid-all",
                    "css",
                    "legacy"
                ]
            }

        };

        await html2pdf()
            .set(opciones)
            .from(contenedor)
            .save();

    } catch (error) {

        console.error(error);

        alert(
            "Ocurrió un error al exportar el PDF."
        );

    } finally {

        ocultarCargando();

    }

}

/* ==========================================
   OBTENER ELEMENTO A EXPORTAR
========================================== */

function obtenerElementoExportar() {

    if (
        dependenciaSeleccionada
    ) {

        return document.querySelector(
            ".contenedor"
        );
    }

    return document.querySelector(
        ".organigrama-container"
    );

}

/* ==========================================
   EXPORTAR PANEL
========================================== */

async function exportarFicha() {

    const panel = document.querySelector(
        "#detalleDependencia"
    );

    if (
        !dependenciaSeleccionada
    ) {

        alert(
            "Seleccione una dependencia."
        );

        return;
    }

    try {

        mostrarCargando();

        const detalle =
            obtenerDetalleActual();

        const nombre =
            limpiarTextoArchivo(
                detalle.nombre
            );

        await html2pdf()
            .set({

                margin: 10,

                filename:
                    `Ficha_${nombre}.pdf`,

                image: {

                    type: "jpeg",

                    quality: 0.98

                },

                html2canvas: {

                    scale: 2,

                    useCORS: true

                },

                jsPDF: {

                    unit: "mm",

                    format: "a4",

                    orientation:
                        "portrait"

                }

            })
            .from(panel)
            .save();

    } finally {

        ocultarCargando();

    }

}

/* ==========================================
   EXPORTAR SOLO ORGANIGRAMA
========================================== */

async function exportarOrganigrama() {

    const elemento =
        vistaActual === "grafica"

            ? organigramaGrafico

            : organigramaArbol;

    try {

        mostrarCargando();

        await html2pdf()
            .set({

                margin: 10,

                filename:
                    generarNombreArchivo(),

                image: {

                    type: "jpeg",

                    quality: 0.98

                },

                html2canvas: {

                    scale: 2,

                    useCORS: true

                },

                jsPDF: {

                    unit: "mm",

                    format: "a4",

                    orientation:
                        "landscape"

                }

            })
            .from(elemento)
            .save();

    } finally {

        ocultarCargando();

    }

}

/* ==========================================
   NOMBRE DEL ARCHIVO
========================================== */

function generarNombreArchivo() {

    const fecha = new Date();

    const dia =
        String(
            fecha.getDate()
        ).padStart(2, "0");

    const mes =
        String(
            fecha.getMonth() + 1
        ).padStart(2, "0");

    const anio =
        fecha.getFullYear();

    if (
        dependenciaSeleccionada
    ) {

        const detalle =
            obtenerDetalleActual();

        return `Atlas_${limpiarTextoArchivo(
            detalle.nombre
        )}_${dia}-${mes}-${anio}.pdf`;
    }

    return `Atlas_Organizacional_${dia}-${mes}-${anio}.pdf`;

}

/* ==========================================
   LIMPIAR TEXTO
========================================== */

function limpiarTextoArchivo(
    texto
) {

    return texto
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .replace(
            /[^a-zA-Z0-9]/g,
            "_"
        );

}

/* ==========================================
   LOADING
========================================== */

function mostrarCargando() {

    let overlay =
        document.getElementById(
            "exportandoOverlay"
        );

    if (!overlay) {

        overlay =
            document.createElement(
                "div"
            );

        overlay.id =
            "exportandoOverlay";

        overlay.innerHTML = `
            <div class="exportando-box">

                <i class="fa-solid fa-file-pdf"></i>

                <p>
                    Generando PDF...
                </p>

            </div>
        `;

        document.body.appendChild(
            overlay
        );

    }

    overlay.style.display = "flex";

}

/* ==========================================
   OCULTAR LOADING
========================================== */

function ocultarCargando() {

    const overlay =
        document.getElementById(
            "exportandoOverlay"
        );

    if (overlay) {

        overlay.style.display =
            "none";

    }

}

/* ==========================================
   EXPORTAR DESDE EL TECLADO
========================================== */

document.addEventListener(
    "keydown",
    function (e) {

        if (
            e.ctrlKey &&
            e.key.toLowerCase() === "e"
        ) {

            e.preventDefault();

            exportarPDF();

        }

    }
);

/* ==========================================
   DESCARGAR IMAGEN PNG
========================================== */

async function exportarPNG() {

    const elemento =
        obtenerElementoExportar();

    if (!elemento) {

        return;

    }

    try {

        mostrarCargando();

        const canvas =
            await html2canvas(
                elemento,
                {

                    scale: 2,

                    useCORS: true

                }
            );

        const enlace =
            document.createElement(
                "a"
            );

        enlace.download =
            generarNombreArchivo()
                .replace(
                    ".pdf",
                    ".png"
                );

        enlace.href =
            canvas.toDataURL(
                "image/png"
            );

        enlace.click();

    } finally {

        ocultarCargando();

    }

}