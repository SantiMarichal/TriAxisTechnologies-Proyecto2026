document.addEventListener('DOMContentLoaded', () => {
    cargarDocumentos();
});

const usuarioCI = localStorage.getItem('usuario_ci');

const formulario = document.getElementById("formNuevoDocumento");
const archivoInput = document.getElementById("archivo");
const mensaje = document.getElementById("mensaje");

const listaDocumentos = document.getElementById("ListaDocumentos");
const visorPDF = document.getElementById("visorPDF");


// Funcionalidad de subir PDF. POST /api/documentos
if (formulario) {
    formulario.addEventListener("submit", async function (event) {

        event.preventDefault();

        const archivo = archivoInput ? archivoInput.files[0] : null;

        if (archivo) {
            if (archivo.type !== "application/pdf") {
                mostrarMensaje("El archivo debe ser un PDF.", false);
                return;
            }

            if (archivo.size > 10 * 1024 * 1024) {
                mostrarMensaje("El archivo no puede superar los 10 MB.", false);
                return;
            }
        }

        // Construimos los datos que recibirá PHP (incluyendo campos de texto de SIGSM y archivo).
        const formData = new FormData(formulario);

        if (usuarioCI && !formData.has("usuarioCI")) {
            formData.append("usuarioCI", usuarioCI);
        }

        try {

            mostrarMensaje("Subiendo archivo...", true);

            const respuesta = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/documentos', {
                method: "POST",
                body: formData
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.error || "No se pudo subir el archivo."
                );
            }

            mostrarMensaje(resultado.mensaje, true);

            formulario.reset();

            await cargarDocumentos();

        } catch (error) {

            console.error(error);

            mostrarMensaje(
                error.message || "Error de conexión con la API.",
                false
            );
        }
    });
}

// Mensaje subida pdf. Correcto o incorrecto
function mostrarMensaje(texto, correcto) {
    if (mensaje) {
        mensaje.textContent = texto;
        mensaje.style.color = correcto ? "#15857A" : "#C0392B";
    }
}

// Listar documentos. GET /api/documentos
async function cargarDocumentos() {
    try {
        const response = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/documentos');
        const listaDocumentos = await response.json();

        if (!response.ok) {
            throw new Error(listaDocumentos.error || "No se pudieron cargar los documentos.");
        }

        renderizarDocumentos(listaDocumentos);
    } catch (error) {
        console.error('Error al cargar la lista de documentos:', error);
        if (listaDocumentos) {
            listaDocumentos.textContent = "No se pudieron cargar los documentos.";
        }
    }
}

const nombresCategorias = {
    "1": "Atencion",
    "2": "Limpieza",
    "3": "Instalaciones",
    "4": "Personal",
    "5": "Servicios"
};

function renderizarDocumentos(listaDocumentos) {
    const contenedor = document.getElementById('ListaDocumentos');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (!listaDocumentos || listaDocumentos.length === 0) {
        const texto = document.createElement("p");
        texto.textContent = "No hay documentos disponibles.";
        contenedor.appendChild(texto);
        return;
    }

    listaDocumentos.forEach(documento => {
        const divDocumento = document.createElement('div');
        divDocumento.classList.add('card');

        divDocumento.dataset.categoria = documento.ID_Categoria || 'General';

        const h4Titulo = document.createElement('h4');
        h4Titulo.textContent = documento.Titulo || 'Documento';

        const pDescripcion = document.createElement('p');
        pDescripcion.textContent = documento.Descripcion || 'Sin descripción';

        const divEtiquetas = document.createElement('div');
        divEtiquetas.classList.add('etiquetas');

        const spanCategoria = document.createElement('span');
        spanCategoria.classList.add('azul');
        spanCategoria.textContent = nombresCategorias[documento.ID_Categoria] || 'Categoría';

        const spanEstado = document.createElement('span');
        spanEstado.classList.add('verde');
        spanEstado.textContent = documento.Estado || 'Aprobado';

        // Botón o enlace para visualizar el PDF asociado si existe ruta en el servidor
        if (documento.Ruta_archivo) {
            const botonVer = document.createElement("button");
            botonVer.type = "button";
            botonVer.textContent = "Ver PDF";
            botonVer.classList.add("btn");
            botonVer.addEventListener("click", () => {
                verPDF(documento.ID_Documento);
            });
            divEtiquetas.appendChild(botonVer);
        }

        const spanEliminar = document.createElement('span');
        spanEliminar.classList.add('rojo');
        spanEliminar.textContent = 'Eliminar';
        spanEliminar.style.cursor = 'pointer';
        spanEliminar.onclick = () => eliminarDocumento(documento.ID_Documento);

        divEtiquetas.appendChild(spanCategoria);
        divEtiquetas.appendChild(spanEstado);
        divEtiquetas.appendChild(spanEliminar);

        divDocumento.appendChild(h4Titulo);
        divDocumento.appendChild(pDescripcion);
        divDocumento.appendChild(divEtiquetas);

        contenedor.appendChild(divDocumento);
    });
}

// Funcionalidad visualizar PDF
function verPDF(id) {
    if (!visorPDF) return;
    // La API devuelve el archivo PDF, no un JSON.
    visorPDF.src = `http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/documentos/${id}`;

    visorPDF.hidden = false;

    visorPDF.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-filtro')) {
        const categoriaSeleccionada = e.target.dataset.categoria;
        const cards = document.querySelectorAll('#ListaDocumentos .card');

        cards.forEach((card) => {
            const categoriaCard = card.dataset.categoria;

            if (categoriaSeleccionada === 'todos' || categoriaSeleccionada === categoriaCard) {
                card.style.display = ''; 
            } else {
                card.style.display = 'none';
            }
        });
    }
});

// Funcionalidad eliminar PDF. DELETE /api/documentos/${id}
async function eliminarDocumento(id) {
    if (!confirm('¿Desea eliminar este documento?')) {
        return;
    }

    try {
        const response = await fetch(
            `http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/documentos/${id}`,
            {
                method: 'DELETE'
            }
        );

        const datos = await response.json();

        if (!response.ok) {
            alert(datos.error || "No se pudo eliminar el documento.");
            return;
        }

        alert(datos.mensaje);

        // Se cierra el visor para no mostrar el PDF eliminado
        if (visorPDF) {
            visorPDF.removeAttribute("src");
            visorPDF.hidden = true;
        }

        // Actualizamos el listado de PDFs, una vez borrado algún PDF
        await cargarDocumentos();

    } catch (error) {
        console.error(error);
        alert(error.message || "Error de conexión con la API.");
    }
}
