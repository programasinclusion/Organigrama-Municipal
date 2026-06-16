/* ==========================================
   ORGANIGRAMA.JS
   Generación dinámica del árbol
========================================== */

/* ==========================================
   RENDERIZAR ÁRBOL
========================================== */

function renderizarArbol(secretariaId) {

    organigramaArbol.innerHTML = "";
    organigramaGrafico.innerHTML = "";

    const raiz = organigrama.find(
        item => item.id === secretariaId
    );

    if (!raiz) {
        return;
    }

    const ul = document.createElement("ul");
    ul.className = "arbol-principal";

    ul.appendChild(
        crearNodoArbol(raiz)
    );

    organigramaArbol.appendChild(ul);

    generarVistaGrafica(raiz);
}

/* ==========================================
   CREAR NODO DEL ÁRBOL
========================================== */

function crearNodoArbol(item) {

    const li = document.createElement("li");

    const hijos = obtenerHijos(item.id);

    /* CONTENEDOR */

    const nodo = document.createElement("div");

    nodo.className = "nodo";

    nodo.dataset.id = item.id;

    /* TOGGLE */

    const toggle = document.createElement("span");

    toggle.className = "toggle";

    if (hijos.length > 0) {

        toggle.textContent = "▶";

    } else {

        toggle.textContent = "•";

    }

    nodo.appendChild(toggle);

    /* ICONO */

    nodo.insertAdjacentHTML(
        "beforeend",
        obtenerIcono(item.tipo)
    );

    /* TEXTO */

    const texto = document.createElement("span");

    texto.className = "texto-nodo";

    texto.textContent = item.nombre;

    nodo.appendChild(texto);

    /* CLICK */

    nodo.addEventListener("click", function (e) {

        e.stopPropagation();

        mostrarDetalle(item.id);

        resaltarNodo(item.id);
    });

    li.appendChild(nodo);

    /* HIJOS */

    if (hijos.length > 0) {

        const ulHijos =
            document.createElement("ul");

        ulHijos.style.display = "none";

        hijos
            .sort((a, b) =>
                a.nombre.localeCompare(
                    b.nombre
                )
            )
            .forEach(hijo => {

                ulHijos.appendChild(
                    crearNodoArbol(hijo)
                );

            });

        toggle.addEventListener(
            "click",
            function (e) {

                e.stopPropagation();

                if (
                    ulHijos.style.display ===
                    "none"
                ) {

                    ulHijos.style.display =
                        "block";

                    toggle.textContent = "▼";

                } else {

                    ulHijos.style.display =
                        "none";

                    toggle.textContent = "▶";

                }

            }
        );

        li.appendChild(ulHijos);
    }

    return li;
}

/* ==========================================
   OBTENER HIJOS
========================================== */

function obtenerHijos(idPadre) {

    return organigrama.filter(item =>

        item.padre === idPadre

    );

}

/* ==========================================
   EXPANDIR TODO
========================================== */

function expandirTodo() {

    document
        .querySelectorAll(
            "#organigramaArbol ul"
        )
        .forEach(ul => {

            ul.style.display = "block";

        });

    document
        .querySelectorAll(".toggle")
        .forEach(toggle => {

            if (
                toggle.textContent !== "•"
            ) {

                toggle.textContent = "▼";

            }

        });

}

/* ==========================================
   CONTRAER TODO
========================================== */

function contraerTodo() {

    document
        .querySelectorAll(
            "#organigramaArbol ul ul"
        )
        .forEach(ul => {

            ul.style.display = "none";

        });

    document
        .querySelectorAll(".toggle")
        .forEach(toggle => {

            if (
                toggle.textContent !== "•"
            ) {

                toggle.textContent = "▶";

            }

        });

}

/* ==========================================
   ABRIR RUTA
========================================== */

function abrirRuta(id) {

    let actual = organigrama.find(
        item => item.id === id
    );

    while (
        actual &&
        actual.padre
    ) {

        const nodoPadre =
            document.querySelector(
                `[data-id="${actual.padre}"]`
            );

        if (nodoPadre) {

            const li =
                nodoPadre.closest("li");

            const ul =
                li.querySelector(
                    ":scope > ul"
                );

            const toggle =
                nodoPadre.querySelector(
                    ".toggle"
                );

            if (ul) {

                ul.style.display =
                    "block";

            }

            if (
                toggle &&
                toggle.textContent === "▶"
            ) {

                toggle.textContent = "▼";

            }

        }

        actual = organigrama.find(
            item =>
                item.id === actual.padre
        );

    }

}

/* ==========================================
   RESALTAR NODO
========================================== */

function resaltarNodo(id) {

    document
        .querySelectorAll(".nodo")
        .forEach(nodo => {

            nodo.classList.remove(
                "seleccionado"
            );

        });

    abrirRuta(id);

    const nodo =
        document.querySelector(
            `[data-id="${id}"]`
        );

    if (nodo) {

        nodo.classList.add(
            "seleccionado"
        );

        nodo.scrollIntoView({

            behavior: "smooth",

            block: "center"

        });

    }

}

/* ==========================================
   ICONOS SEGÚN TIPO
========================================== */

function obtenerIcono(tipo) {

    switch (tipo) {

        case "intendencia":
            return '<i class="fa-solid fa-user-tie"></i>';

        case "secretaria":
            return '<i class="fa-solid fa-building-columns"></i>';

        case "subsecretaria":
            return '<i class="fa-solid fa-building"></i>';

        case "direccion_general":
            return '<i class="fa-solid fa-folder"></i>';

        case "direccion":
            return '<i class="fa-solid fa-folder-open"></i>';

        case "administracion":
            return '<i class="fa-solid fa-box-archive"></i>';

        case "departamento":
            return '<i class="fa-solid fa-diagram-project"></i>';

        case "division":
            return '<i class="fa-solid fa-diagram-next"></i>';

        default:
            return '<i class="fa-solid fa-circle"></i>';

    }

}

/* ==========================================
   VISTA GRÁFICA
========================================== */

function generarVistaGrafica(raiz) {

    organigramaGrafico.innerHTML =
        generarTarjeta(raiz);

}

/* ==========================================
   TARJETAS DEL ORGANIGRAMA
========================================== */

function generarTarjeta(item) {

    const hijos =
        obtenerHijos(item.id);

    let html = `
        <div class="grafico-nodo">

            <div class="grafico-card"
                 data-id="${item.id}">

                ${obtenerIcono(item.tipo)}

                <span>${item.nombre}</span>

            </div>
    `;

    if (hijos.length > 0) {

        html += `
            <div class="grafico-hijos">
        `;

        hijos
            .sort((a, b) =>
                a.nombre.localeCompare(
                    b.nombre
                )
            )
            .forEach(hijo => {

                html += generarTarjeta(
                    hijo
                );

            });

        html += `
            </div>
        `;
    }

    html += `
        </div>
    `;

    return html;
}

/* ==========================================
   EVENTOS VISTA GRÁFICA
========================================== */

document.addEventListener(
    "click",
    function (e) {

        const card =
            e.target.closest(
                ".grafico-card"
            );

        if (!card) {
            return;
        }

        const id =
            card.dataset.id;

        mostrarDetalle(id);

        document
            .querySelectorAll(
                ".grafico-card"
            )
            .forEach(c => {

                c.classList.remove(
                    "seleccionado"
                );

            });

        card.classList.add(
            "seleccionado"
        );

    }
);