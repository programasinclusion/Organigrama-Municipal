/* ==========================================
   PANEL.JS
   Gestión del Panel Institucional
========================================== */

/* ==========================================
   MOSTRAR DETALLE
========================================== */

function mostrarDetalle(id) {

    const dependencia = organigrama.find(
        item => item.id === id
    );

    if (!dependencia) {
        return;
    }

    dependenciaSeleccionada = id;

    const responsable =
        responsables[id] || {};

    const contacto =
        contactos[id] || {};

    const superior =
        obtenerDependenciaSuperior(
            dependencia
        );

    detalleDependencia.innerHTML = `
        <div class="detalle-card">

            ${crearCabecera(
                dependencia,
                responsable
            )}

            ${crearMision(
                dependencia
            )}

            ${crearFunciones(
                dependencia
            )}

            ${crearDependenciaSuperior(
                superior
            )}

            ${crearContacto(
                contacto
            )}

        </div>
    `;
}

/* ==========================================
   CABECERA
========================================== */

function crearCabecera(
    dependencia,
    responsable
) {

    const foto =
        responsable.foto ||
        "";

    const nombre =
        responsable.nombre ||
        "Sin responsable asignado";

    const cargo =
        responsable.cargo ||
        "Cargo no informado";

    return `
        <div class="detalle-top">

            ${
                foto
                ? `
                    <img
                        src="${foto}"
                        alt="${nombre}">
                  `
                : `
                    <div class="sin-foto">
                        <i class="fa-solid fa-user"></i>
                    </div>
                  `
            }

            <h2>
                ${dependencia.nombre}
            </h2>

            <h4>
                ${nombre}
            </h4>

            <p>
                ${cargo}
            </p>

            <span class="
                badge
                badge-${dependencia.tipo}
            ">
                ${formatearTipo(
                    dependencia.tipo
                )}
            </span>

        </div>
    `;
}

/* ==========================================
   MISIÓN
========================================== */

function crearMision(
    dependencia
) {

    const mision =
        dependencia.mision ||
        "Información pendiente de carga.";

    return `
        <div class="detalle-seccion">

            <h3>
                <i class="fa-solid fa-bullseye"></i>
                Misión
            </h3>

            <p>
                ${mision}
            </p>

        </div>
    `;
}

/* ==========================================
   FUNCIONES
========================================== */

function crearFunciones(
    dependencia
) {

    const funciones =
        dependencia.funciones || [];

    if (
        funciones.length === 0
    ) {

        return `
            <div class="detalle-seccion">

                <h3>
                    <i class="fa-solid fa-list-check"></i>
                    Funciones
                </h3>

                <p>
                    Información pendiente de carga.
                </p>

            </div>
        `;
    }

    let html = `
        <div class="detalle-seccion">

            <h3>
                <i class="fa-solid fa-list-check"></i>
                Funciones
            </h3>

            <ul class="lista-funciones">
    `;

    funciones.forEach(
        funcion => {

            html += `
                <li>
                    ${funcion}
                </li>
            `;

        }
    );

    html += `
            </ul>

        </div>
    `;

    return html;
}

/* ==========================================
   DEPENDENCIA SUPERIOR
========================================== */

function crearDependenciaSuperior(
    superior
) {

    if (!superior) {
        return "";
    }

    return `
        <div class="detalle-seccion">

            <h3>
                <i class="fa-solid fa-sitemap"></i>
                Dependencia Superior
            </h3>

            <div class="superior-card">

                ${obtenerIcono(
                    superior.tipo
                )}

                <span>
                    ${superior.nombre}
                </span>

            </div>

        </div>
    `;
}

/* ==========================================
   CONTACTO
========================================== */

function crearContacto(
    contacto
) {

    return `
        <div class="detalle-seccion">

            <h3>
                <i class="fa-solid fa-address-book"></i>
                Información de Contacto
            </h3>

            ${crearTelefono(
                contacto.telefono
            )}

            ${crearCorreo(
                contacto.email
            )}

            ${crearUbicacion(
                contacto.ubicacion
            )}

            ${crearInterno(
                contacto.interno
            )}

        </div>
    `;
}

/* ==========================================
   TELÉFONO
========================================== */

function crearTelefono(
    telefono
) {

    if (!telefono) {
        return "";
    }

    return `
        <div class="contacto-item">

            <i class="fa-solid fa-phone"></i>

            <span>
                ${telefono}
            </span>

        </div>
    `;
}

/* ==========================================
   EMAIL
========================================== */

function crearCorreo(
    email
) {

    if (!email) {
        return "";
    }

    return `
        <div class="contacto-item">

            <i class="fa-solid fa-envelope"></i>

            <a href="mailto:${email}">
                ${email}
            </a>

        </div>
    `;
}

/* ==========================================
   UBICACIÓN
========================================== */

function crearUbicacion(
    ubicacion
) {

    if (!ubicacion) {
        return "";
    }

    return `
        <div class="contacto-item">

            <i class="fa-solid fa-location-dot"></i>

            <span>
                ${ubicacion}
            </span>

        </div>
    `;
}

/* ==========================================
   INTERNO
========================================== */

function crearInterno(
    interno
) {

    if (!interno) {
        return "";
    }

    return `
        <div class="contacto-item">

            <i class="fa-solid fa-building"></i>

            <span>
                Interno: ${interno}
            </span>

        </div>
    `;
}

/* ==========================================
   OBTENER DEPENDENCIA SUPERIOR
========================================== */

function obtenerDependenciaSuperior(
    dependencia
) {

    if (
        !dependencia.padre
    ) {

        return null;
    }

    return organigrama.find(
        item =>
            item.id === dependencia.padre
    );
}

/* ==========================================
   LIMPIAR PANEL
========================================== */

function limpiarPanel() {

    dependenciaSeleccionada = null;

    detalleDependencia.innerHTML = `
        <div class="detalle-vacio">

            <i class="fa-solid fa-circle-info"></i>

            <p>
                Seleccione una dependencia
                para visualizar su información.
            </p>

            <ul>
                <li>
                    Responsable
                </li>

                <li>
                    Misión
                </li>

                <li>
                    Funciones
                </li>

                <li>
                    Datos de contacto
                </li>
            </ul>

        </div>
    `;
}

/* ==========================================
   ACTUALIZAR PANEL
========================================== */

function actualizarPanel() {

    if (
        dependenciaSeleccionada
    ) {

        mostrarDetalle(
            dependenciaSeleccionada
        );

    }

}

/* ==========================================
   EXPORTAR DETALLE
========================================== */

function obtenerDetalleActual() {

    if (
        !dependenciaSeleccionada
    ) {

        return null;
    }

    return organigrama.find(
        item =>
            item.id ===
            dependenciaSeleccionada
    );
}

/* ==========================================
   INICIALIZACIÓN
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    limpiarPanel
);