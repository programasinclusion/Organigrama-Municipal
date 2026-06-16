/* ==========================================
   UTILIDADES.JS
   Funciones auxiliares reutilizables
========================================== */

/* ==========================================
   OBTENER ICONO SEGÚN TIPO
========================================== */

function obtenerIcono(tipo) {

    const iconos = {

        intendencia:
            '<i class="fa-solid fa-landmark"></i>',

        secretaria:
            '<i class="fa-solid fa-building-columns"></i>',

        subsecretaria:
            '<i class="fa-solid fa-sitemap"></i>',

        direccion_general:
            '<i class="fa-solid fa-diagram-project"></i>',

        direccion:
            '<i class="fa-solid fa-folder-tree"></i>',

        administracion:
            '<i class="fa-solid fa-briefcase"></i>',

        departamento:
            '<i class="fa-solid fa-users"></i>',

        division:
            '<i class="fa-solid fa-user-group"></i>'
    };

    return iconos[tipo] ||
        '<i class="fa-solid fa-circle"></i>';
}

/* ==========================================
   FORMATEAR TIPO
========================================== */

function formatearTipo(tipo) {

    const nombres = {

        intendencia:
            "Intendencia",

        secretaria:
            "Secretaría",

        subsecretaria:
            "Subsecretaría",

        direccion_general:
            "Dirección General",

        direccion:
            "Dirección",

        administracion:
            "Administración",

        departamento:
            "Departamento",

        division:
            "División"

    };

    return nombres[tipo] ||
        "Dependencia";
}

/* ==========================================
   BUSCAR DEPENDENCIA POR ID
========================================== */

function obtenerDependencia(id) {

    return organigrama.find(
        item => item.id === id
    ) || null;
}

/* ==========================================
   OBTENER HIJOS
========================================== */

function obtenerHijos(id) {

    return organigrama.filter(
        item => item.padre === id
    );
}

/* ==========================================
   OBTENER PADRE
========================================== */

function obtenerPadre(id) {

    const dependencia =
        obtenerDependencia(id);

    if (
        !dependencia ||
        !dependencia.padre
    ) {

        return null;
    }

    return obtenerDependencia(
        dependencia.padre
    );
}

/* ==========================================
   OBTENER SECRETARÍA PADRE
========================================== */

function obtenerSecretariaPadre(item) {

    let actual = item;

    while (
        actual &&
        actual.tipo !== "secretaria"
    ) {

        actual =
            obtenerDependencia(
                actual.padre
            );

    }

    return actual;
}

/* ==========================================
   OBTENER RUTA COMPLETA
========================================== */

function obtenerRuta(id) {

    const ruta = [];

    let actual =
        obtenerDependencia(id);

    while (actual) {

        ruta.unshift(actual);

        actual =
            obtenerDependencia(
                actual.padre
            );
    }

    return ruta;
}

/* ==========================================
   ABRIR RUTA
========================================== */

function abrirRuta(id) {

    const ruta =
        obtenerRuta(id);

    ruta.forEach(item => {

        const nodo =
            document.querySelector(
                `[data-id="${item.id}"]`
            );

        if (nodo) {

            nodo.classList.remove(
                "contraido"
            );

        }

    });
}

/* ==========================================
   RESALTAR NODO
========================================== */

function resaltarNodo(id) {

    document
        .querySelectorAll(
            ".nodo, .grafico-card"
        )
        .forEach(nodo => {

            nodo.classList.remove(
                "seleccionado"
            );

        });

    const seleccionado =
        document.querySelector(
            `[data-id="${id}"]`
        );

    if (seleccionado) {

        seleccionado.classList.add(
            "seleccionado"
        );

        seleccionado.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }
}

/* ==========================================
   NORMALIZAR TEXTO
========================================== */

function normalizarTexto(texto) {

    return texto
        .normalize("NFD")
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .toLowerCase()
        .trim();
}

/* ==========================================
   ESCAPAR HTML
========================================== */

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent = texto;

    return div.innerHTML;
}

/* ==========================================
   DEBOUNCE
========================================== */

function debounce(
    funcion,
    demora = 300
) {

    let temporizador;

    return function (...args) {

        clearTimeout(
            temporizador
        );

        temporizador =
            setTimeout(
                () => funcion.apply(
                    this,
                    args
                ),
                demora
            );

    };
}

/* ==========================================
   GENERAR ID
========================================== */

function generarId() {

    return (
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 9)
    );
}

/* ==========================================
   FORMATEAR FECHA
========================================== */

function formatearFecha(
    fecha = new Date()
) {

    return fecha.toLocaleDateString(
        "es-AR",
        {

            day: "2-digit",

            month: "2-digit",

            year: "numeric"

        }
    );
}

/* ==========================================
   MOSTRAR MENSAJE
========================================== */

function mostrarMensaje(
    mensaje,
    tipo = "info",
    duracion = 3000
) {

    const toast =
        document.createElement("div");

    toast.className =
        `toast toast-${tipo}`;

    toast.innerHTML = `
        ${mensaje}
    `;

    document.body.appendChild(
        toast
    );

    setTimeout(() => {

        toast.classList.add(
            "visible"
        );

    }, 50);

    setTimeout(() => {

        toast.classList.remove(
            "visible"
        );

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, duracion);
}

/* ==========================================
   COPIAR AL PORTAPAPELES
========================================== */

async function copiarTexto(texto) {

    try {

        await navigator.clipboard.writeText(
            texto
        );

        mostrarMensaje(
            "Copiado al portapapeles.",
            "success"
        );

        return true;

    } catch (error) {

        console.error(error);

        mostrarMensaje(
            "No fue posible copiar.",
            "error"
        );

        return false;
    }
}

/* ==========================================
   MOSTRAR / OCULTAR ELEMENTOS
========================================== */

function mostrarElemento(
    elemento
) {

    elemento.classList.remove(
        "oculto"
    );
}

function ocultarElemento(
    elemento
) {

    elemento.classList.add(
        "oculto"
    );
}

/* ==========================================
   EXPANDIR TODO
========================================== */

function expandirTodo() {

    document
        .querySelectorAll(
            ".contraido"
        )
        .forEach(nodo => {

            nodo.classList.remove(
                "contraido"
            );

        });

    mostrarMensaje(
        "Organigrama expandido.",
        "success"
    );
}

/* ==========================================
   CONTRAER TODO
========================================== */

function contraerTodo() {

    document
        .querySelectorAll(
            ".nodo-hijos"
        )
        .forEach(contenedor => {

            contenedor.classList.add(
                "contraido"
            );

        });

    mostrarMensaje(
        "Organigrama contraído.",
        "info"
    );
}

/* ==========================================
   VERIFICAR DISPOSITIVO TÁCTIL
========================================== */

function esDispositivoTactil() {

    return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0
    );
}

/* ==========================================
   DESCARGAR ARCHIVO JSON
========================================== */

function descargarJSON(
    datos,
    nombreArchivo
) {

    const blob =
        new Blob(

            [
                JSON.stringify(
                    datos,
                    null,
                    2
                )
            ],

            {
                type:
                    "application/json"
            }

        );

    const url =
        URL.createObjectURL(
            blob
        );

    const enlace =
        document.createElement("a");

    enlace.href = url;

    enlace.download =
        nombreArchivo;

    enlace.click();

    URL.revokeObjectURL(
        url
    );
}