document.addEventListener('DOMContentLoaded', () => {
    cargarDocumentos();
    cargarResultadosEncuesta();
    actualizarListasCategorias();
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

            const respuesta = await fetch('/API/documentos', {
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
        const response = await fetch('/API/documentos');
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

        const spanModificar = document.createElement('span');
        spanModificar.classList.add('modificar');
        spanModificar.textContent = 'Modificar';
        spanModificar.style.cursor = 'pointer';
        spanModificar.onclick = () => abrirModal(documento);

        divEtiquetas.appendChild(spanCategoria);
        divEtiquetas.appendChild(spanEstado);
        divEtiquetas.appendChild(spanModificar);
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
    visorPDF.src = `/API/documentos/${id}`;

    visorPDF.hidden = false;

    visorPDF.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}


// Funcionalidad eliminar PDF. DELETE /api/documentos/${id}
async function eliminarDocumento(id) {
    if (!confirm('¿Desea eliminar este documento?')) {
        return;
    }

    try {
        const response = await fetch(
            `/API/documentos/${id}`,
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

        if (visorPDF) {
            visorPDF.removeAttribute("src");
            visorPDF.hidden = true;
        }

        await cargarDocumentos();

    } catch (error) {
        console.error(error);
        alert(error.message || "Error de conexión con la API.");
    }
}

const modalEditar = document.getElementById('modalEditar');
const formEditarDocumento = document.getElementById('formEditarDocumento');
const btnCerrarModal = document.getElementById('btnCerrarModal');

const editIDDocumento = document.getElementById('editIDDocumento');
const editTitulo = document.getElementById('editTitulo');
const editDescripcion = document.getElementById('editDescripcion');
const editCategoria = document.getElementById('editCategoria');
const editEstado = document.getElementById('editEstado');

function abrirModal(documento) {
    editIDDocumento.value = documento.ID_Documento;
    editTitulo.value = documento.Titulo || '';
    editDescripcion.value = documento.Descripcion || '';
    editCategoria.value = documento.ID_Categoria || '1';
    editEstado.value = documento.Estado || 'Aprobado';

    document.getElementById('editArchivo').value = '';

    modalEditar.style.display = 'flex';
}

// Función para cerrar el modal
function cerrarModal() {
    modalEditar.style.display = 'none';
    formEditarDocumento.reset();
}

if (btnCerrarModal) {
    btnCerrarModal.addEventListener('click', cerrarModal);
}

if (formEditarDocumento) {
    formEditarDocumento.addEventListener('submit', async function (e) {
        e.preventDefault();

        const id = editIDDocumento.value;
        const formData = new FormData(formEditarDocumento);

        if (usuarioCI && !formData.has("usuarioCI")) {
            formData.append("usuarioCI", usuarioCI);
        }

        formData.append("_method", "PUT");

        try {
            const respuesta = await fetch(`/API/documentos/${id}`, {
                method: "POST",
                body: formData
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(resultado.error || "No se pudo actualizar el documento.");
            }

            alert(resultado.mensaje);
            cerrarModal();
            await cargarDocumentos();

        } catch (error) {
            console.error(error);
            alert(error.message || "Error al actualizar el documento.");
        }
    });
}

async function cargarResultadosEncuesta() {
    try {
        const response = await fetch('/API/encuestas/encuestas.php?todas=1');
        const encuestas = await response.json();

        if (!response.ok) {
            throw new Error(encuestas.error || "No se pudieron cargar las encuestas.");
        }

        renderizarTodasLasEncuestas(encuestas);
    } catch (error) {
        console.error("Error al cargar encuestas:", error);
    }
}

function renderizarTodasLasEncuestas(encuestas) {
    const contenedor = document.getElementById('contenedorResultados');
    if (!contenedor) return;

    contenedor.innerHTML = '';

    if (!encuestas || encuestas.length === 0) {
        const p = document.createElement('p');
        p.textContent = "No hay encuestas registradas.";
        contenedor.appendChild(p);
        return;
    }

    encuestas.forEach(encuesta => {
        const cardEncuesta = document.createElement('div');
        cardEncuesta.classList.add('card');
        cardEncuesta.dataset.categoria = encuesta.ID_Categoria;

        const h4Titulo = document.createElement('h4');
        h4Titulo.textContent = encuesta.Titulo_Encuesta || 'Encuesta';
        cardEncuesta.appendChild(h4Titulo);

        const spanCat = document.createElement('span');
        spanCat.classList.add('azul');
        spanCat.textContent = encuesta.Categoria_Nombre || 'Categoría';
        cardEncuesta.appendChild(spanCat);

        if (encuesta.preguntas && encuesta.preguntas.length > 0) {
            encuesta.preguntas.forEach(pregunta => {
                const pPregunta = document.createElement('p');
                pPregunta.classList.add('encuesta-pregunta');
                pPregunta.textContent = pregunta.Texto;
                cardEncuesta.appendChild(pPregunta);

                if (pregunta.respuestas && pregunta.respuestas.length > 0) {
                    pregunta.respuestas.forEach(respuesta => {
                        const pOpcion = document.createElement('p');
                        pOpcion.classList.add('encuesta-opcion');

                        const strong = document.createElement('strong');
                        strong.textContent = `${respuesta.Texto}: `;

                        pOpcion.appendChild(strong);
                        pOpcion.append(`${respuesta.Cantidad_Votos} votos`);
                        cardEncuesta.appendChild(pOpcion);
                    });
                }
            });
        }

        contenedor.appendChild(cardEncuesta);
    });
}

const modal = document.getElementById('modalCategoria');
const btnAbrir = document.getElementById('btnAbrirModal');
const btnCerrar = document.getElementById('btnCerrarModal');
const btnCancelar = document.getElementById('btnCancelar');
const form = document.getElementById('formModalCategoria');

btnAbrir.addEventListener('click', () => {
    modal.style.display = 'flex';
});

function cerrarModal() {
    modal.style.display = 'none';
    form.reset();
}

btnCerrar.addEventListener('click', cerrarModal);
btnCancelar.addEventListener('click', cerrarModal);

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const nombreInput = document.getElementById('nombreCategoriaModal');
    const nombre = nombreInput.value.trim();

    if (!nombre) return;

    try {
        const response = await fetch('/API/categorias/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre: nombre })
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(resultado.mensaje || '¡Categoría creada exitosamente!');
            cerrarModal();
            cargarDocumentos();
            actualizarListasCategorias();

        } else {
            alert('Error: ' + (resultado.mensaje || 'No se pudo crear la categoría.'));
        }
    } catch (error) {
        console.error('Error de red:', error);
        alert('Hubo un error al conectar con el servidor.');
    }
});

async function actualizarListasCategorias() {
    try {
        const response = await fetch('/API/categorias');
        const categorias = await response.json();

        if (!response.ok) {
            throw new Error(categorias.error || "No se pudieron cargar las categorías.");
        }

        // Actualizar el <select> de documentos
        const selectDocumentos = document.getElementById('categoria');
        if (selectDocumentos) {
            selectDocumentos.innerHTML = '<option value="">Seleccione una categoría...</option>';
            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.ID_Categoria;
                option.textContent = cat.Nombre;
                selectDocumentos.appendChild(option);
            });
        }

        // Actualizar los filtros de Documentos
        const contenedorFiltros = document.getElementById('filtros');
        if (contenedorFiltros) {
            contenedorFiltros.innerHTML = `<button class="btn-filtro" data-categoria="todos">Todos</button>`;

            categorias.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'btn-filtro';
                btn.setAttribute('data-categoria', cat.ID_Categoria);
                btn.textContent = cat.Nombre;
                contenedorFiltros.appendChild(btn);
            });
        }

        // Actualizar los filtros de Encuestas
        const contenedorFiltros2 = document.getElementById('filtrosEncuestas');
        if (contenedorFiltros2) {
            contenedorFiltros2.innerHTML = `<button class="btn-filtro-encuesta" data-categoria="todos">Todos</button>`;

            categorias.forEach(cat => {
                const btn = document.createElement('button');
                btn.className = 'btn-filtro-encuesta';
                btn.setAttribute('data-categoria', cat.ID_Categoria);
                btn.textContent = cat.Nombre;
                contenedorFiltros2.appendChild(btn);
            });
        }
    } catch (error) {
        console.error('Error al actualizar las listas de categorías:', error);
    }
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-filtro-encuesta')) {
        const categoriaSeleccionada = e.target.dataset.categoria;
        const cards = document.querySelectorAll('#contenedorResultados .card');

        cards.forEach((card) => {
            const categoriaCard = card.dataset.categoria;
            if (categoriaSeleccionada === 'todos' || categoriaSeleccionada === categoriaCard) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    }

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

const modalEliminar = document.getElementById('modalCategoriaEliminar');
const btnAbrirModalEliminar = document.getElementById('btnAbrirModalEliminar'); 
const btnCerrarModalEliminar = document.getElementById('btnCerrarModalEliminar');
const btnCancelarEliminar = document.getElementById('btnCancelarEliminar');
const formEliminarCategoria = document.getElementById('formModalCategoriaEliminar');
const selectCategoriaAEliminar = document.getElementById('selectCategoria');

async function abrirModalEliminar() {
    try {
        const response = await fetch('/API/categorias');
        const categorias = await response.json();

        if (!response.ok) {
            throw new Error(categorias.error || "No se pudieron cargar las categorías.");
        }

        selectCategoriaAEliminar.innerHTML = '<option value="">--Seleccione una categoria--</option>';
        categorias.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.ID_Categoria;
            option.textContent = cat.Nombre;
            selectCategoriaAEliminar.appendChild(option);
        });

        modalEliminar.style.display = 'flex';
    } catch (error) {
        console.error('Error al cargar categorías para eliminar:', error);
    }
}

function cerrarModalEliminar() {
    modalEliminar.style.display = 'none';
    formEliminarCategoria.reset();
    cargarDocumentos();
}

if (btnAbrirModalEliminar) {
    btnAbrirModalEliminar.addEventListener('click', abrirModalEliminar);
}

if (btnCerrarModalEliminar) {
    btnCerrarModalEliminar.addEventListener('click', cerrarModalEliminar);
}

if (btnCancelarEliminar) {
    btnCancelarEliminar.addEventListener('click', cerrarModalEliminar);
}

formEliminarCategoria.addEventListener('submit', async (e) => {
    e.preventDefault();

    const idCategoria = selectCategoriaAEliminar.value;

    if (!idCategoria) {
        alert('Por favor, seleccione una categoría para eliminar.');
        return;
    }
    if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
        return;
    }

    try {
        const response = await fetch(`/API/categorias/${idCategoria}`, {
            method: 'DELETE'
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(resultado.mensaje || 'Categoría eliminada con éxito');

            cerrarModalEliminar();
            actualizarListasCategorias();
            cargarDocumentos();
        } else {
            alert(resultado.mensaje || 'Hubo un error al eliminar la categoría.');
        }
    } catch (error) {
        console.error('Error en la petición DELETE:', error);
        alert('Error de conexión o de respuesta del servidor: ' + error.message);
    }
});
