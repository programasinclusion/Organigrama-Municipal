/* ==========================================
   BUSCADOR.JS
   Buscador inteligente del Atlas
========================================== */

/* ==========================================
   VARIABLES
========================================== */

let sugerenciasVisibles = [];
let indiceSeleccionado = -1;

/* ==========================================
   INICIALIZAR BUSCADOR
========================================== */

function inicializarBuscador() {

    crearContenedorSugerencias();

    buscador.addEventListener(
        "input",
        mostrarSugerencias
    );

    buscador.addEventListener(
        "keydown",
        controlarTeclado
    );

    document.addEventListener(
        "click",
        cerrarSugerencias
    );
}

/* ==========================================
   CONTENEDOR SUGERENCIAS
========================================== */

function crearContenedorSugerencias() {

    if (
        document.getElementById(
            "listaSugerencias"
        )
    ) {
        return;
    }

    const lista =
        document.createElement("div");

    lista.id = "listaSugerencias";

    lista.className =
        "lista-sugerencias oculto";

    buscador
        .parentElement
        .appendChild(lista);
}

/* ==========================================
   MOSTRAR SUGERENCIAS
========================================== */

function mostrarSugerencias() {

    const texto =
        buscador.value
            .trim()
            .toLowerCase();

    const lista =
        document.getElementById(
            "listaSugerencias"
        );

    lista.innerHTML = "";

    indiceSeleccionado = -1;

    if (texto.length < 2) {

        lista.classList.add(
            "oculto"
        );

        return;
    }

    sugerenciasVisibles =
        organigrama
            .filter(item =>

                item.nombre
                    .toLowerCase()
                    .includes(texto)

            )
            .sort((a, b) =>

                a.nombre.localeCompare(
                    b.nombre
                )

            )
            .slice(0, 10);

    if (
        sugerenciasVisibles.length === 0
    ) {

        lista.classList.add(
            "oculto"
        );

        return;
    }

    sugerenciasVisibles.forEach(
        (item, index) => {

            const opcion =
                document.createElement(
                    "div"
                );

            opcion.className =
                "sugerencia-item";

            opcion.dataset.index =
                index;

            opcion.innerHTML = `
                ${obtenerIcono(item.tipo)}
                <div>
                    <strong>
                        ${resaltarTexto(
                            item.nombre,
                            texto
                        )}
                    </strong>
                    <small>
                        ${formatearTipo(
                            item.tipo
                        )}
                    </small>
                </div>
            `;

            opcion.addEventListener(
                "click",
                function () {

                    seleccionarResultado(
                        item
                    );

                }
            );

            lista.appendChild(opcion);

        }
    );

    lista.classList.remove(
        "oculto"
    );
}

/* ==========================================
   CONTROL TECLADO
========================================== */

function controlarTeclado(e) {

    const lista =
        document.getElementById(
            "listaSugerencias"
        );

    const items =
        lista.querySelectorAll(
            ".sugerencia-item"
        );

    if (
        lista.classList.contains(
            "oculto"
        )
    ) {
        return;
    }

    switch (e.key) {

        case "ArrowDown":

            e.preventDefault();

            indiceSeleccionado++;

            if (
                indiceSeleccionado >=
                items.length
            ) {

                indiceSeleccionado = 0;

            }

            actualizarSeleccion(
                items
            );

            break;

        case "ArrowUp":

            e.preventDefault();

            indiceSeleccionado--;

            if (
                indiceSeleccionado < 0
            ) {

                indiceSeleccionado =
                    items.length - 1;

            }

            actualizarSeleccion(
                items
            );

            break;

        case "Enter":

            e.preventDefault();

            if (
                indiceSeleccionado >= 0
            ) {

                seleccionarResultado(
                    sugerenciasVisibles[
                        indiceSeleccionado
                    ]
                );

            }

            break;

        case "Escape":

            lista.classList.add(
                "oculto"
            );

            break;
    }

}

/* ==========================================
   ACTUALIZAR SELECCIÓN
========================================== */

function actualizarSeleccion(
    items
) {

    items.forEach(item => {

        item.classList.remove(
            "activo"
        );

    });

    if (
        indiceSeleccionado >= 0
    ) {

        items[
            indiceSeleccionado
        ].classList.add(
            "activo"
        );

        items[
            indiceSeleccionado
        ].scrollIntoView({

            block: "nearest"

        });

    }

}

/* ==========================================
   SELECCIONAR RESULTADO
========================================== */

function seleccionarResultado(
    item
) {

    buscador.value =
        item.nombre;

    cerrarSugerencias();

    const secretaria =
        obtenerSecretariaPadre(
            item
        );

    if (secretaria) {

        seleccionarSecretaria(
            secretaria.id
        );

    }

    setTimeout(() => {

        abrirRuta(item.id);

        resaltarNodo(item.id);

        mostrarDetalle(item.id);

    }, 150);

}

/* ==========================================
   RESALTAR COINCIDENCIAS
========================================== */

function resaltarTexto(
    texto,
    termino
) {

    const expresion =
        new RegExp(
            `(${termino})`,
            "gi"
        );

    return texto.replace(
        expresion,
        "<mark>$1</mark>"
    );

}

/* ==========================================
   FORMATEAR TIPO
========================================== */

function formatearTipo(
    tipo
) {

    const tipos = {

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

    return (
        tipos[tipo] ||
        "Dependencia"
    );

}

/* ==========================================
   CERRAR SUGERENCIAS
========================================== */

function cerrarSugerencias(
    e
) {

    if (
        e &&
        e.target.closest(
            ".buscador-container"
        )
    ) {

        return;

    }

    const lista =
        document.getElementById(
            "listaSugerencias"
        );

    if (lista) {

        lista.classList.add(
            "oculto"
        );

    }

}

/* ==========================================
   BUSCAR POR ID
========================================== */

function buscarPorId(id) {

    return organigrama.find(
        item => item.id === id
    );

}

/* ==========================================
   BUSCAR POR TIPO
========================================== */

function buscarPorTipo(
    tipo
) {

    return organigrama.filter(
        item =>
            item.tipo === tipo
    );

}

/* ==========================================
   LIMPIAR BUSCADOR
========================================== */

function limpiarBuscador() {

    buscador.value = "";

    sugerenciasVisibles = [];

    indiceSeleccionado = -1;

    cerrarSugerencias();

}

/* ==========================================
   AUTOINICIO
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    inicializarBuscador
);