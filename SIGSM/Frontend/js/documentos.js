document.addEventListener('DOMContentLoaded', () => {
    cargarDocumentos();
});

async function cargarDocumentos() {
    try {
        const response = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/documentos');
        const listaDocumentos = await response.json();

        renderizarDocumentos(listaDocumentos);
    } catch (error) {
        console.error('Error al cargar la lista de documentos:', error);
    }
}

function renderizarDocumentos(listaDocumentos) {
    const contenedor = document.getElementById('ListaDocumentos');
    contenedor.innerHTML = '';

    listaDocumentos.forEach(documento => {
        const divDocumento = document.createElement('div');
        divDocumento.classList.add('card');

        const h4Titulo = document.createElement('h4');
        h4Titulo.textContent = documento.titulo || 'Documento';

        const pDescripcion = document.createElement('p');
        pDescripcion.textContent = documento.descripcion || 'Sin descripción';

        const divEtiquetas = document.createElement('div');
        divEtiquetas.classList.add('etiquetas');

        const spanCategoria = document.createElement('span');
        spanCategoria.classList.add('azul');
        spanCategoria.textContent = documento.id_categoria || 'Categoría';

        const spanEstado = document.createElement('span');
        spanEstado.classList.add('verde');
        spanEstado.textContent = documento.estado || 'Aprobado';

        const spanEliminar = document.createElement('span');
        spanEliminar.classList.add('rojo');
        spanEliminar.textContent = 'Eliminar';
        spanEliminar.style.cursor = 'pointer'; // Para indicar que es interactivo
        spanEliminar.onclick = () => eliminarDocumento(documento.id_documento);

        divEtiquetas.appendChild(spanCategoria);
        divEtiquetas.appendChild(spanEstado);
        divEtiquetas.appendChild(spanEliminar);

        divDocumento.appendChild(h4Titulo);
        divDocumento.appendChild(pDescripcion);
        divDocumento.appendChild(divEtiquetas);

        // Agregamos la tarjeta al contenedor del DOM
        contenedor.appendChild(divDocumento);
    });
}

async function eliminarDocumento(id) {
    if (!confirm('¿Desea eliminar este documento?')) {
        return;
    }

    try {
        const response =
            await fetch(`/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/documentos/${id}`, {
                method: 'DELETE'
            });

        const datos = await response.json();

        if (!response.ok) {
            alert(datos.error);
            return;
        }

        alert(datos.mensaje);

        cargarDocumentos();

    } catch (error) {
        console.error(error);
    }
}

const modalNuevo = document.getElementById('modalNuevo');

const modalEditar = document.getElementById('modalEditar');

const btnNuevo = document.getElementById('btnNuevo');

const btnCerrarModal = document.getElementById('btnCerrarModal');

const btnCancelar = document.getElementById('btnCancelar');

const formNuevoDocumento = document.getElementById('formNuevoDocumento');

btnNuevo.addEventListener('click', abrirModal);

btnCerrarModal.addEventListener('click', cerrarModal);

btnCancelar.addEventListener('click', cerrarModal);

function abrirModal() {
    formNuevoDocumento.reset();
    modalNuevo.classList.add('mostrar');
}

function cerrarModal() {
    modalNuevo.classList.remove('mostrar');
}

formNuevoDocumento.addEventListener('submit', crearDocumento);

async function crearDocumento(event) {
    event.preventDefault();
    const datos = {
        id_documento: document.getElementById('id_documento').value,
        titulo: document.getElementById('titulo').value,
        descripcion: document.getElementById('descripcion').value,
        id_categoria: document.getElementById('id_categoria').value,
        estado: document.getElementById('estado').value
    };

    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/documentos/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();

        if (!response.ok) {
            document.getElementById('mensajeNuevo').textContent = resultado.error;
            return;
        }

        alert('Documento creado correctamente');

        cerrarModal();
        cargarDocumentos();
    } catch (error) {
        console.error(error);
    }
}