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

        divDocumento.dataset.categoria = documento.ID_Categoria || 'General';

        const h4Titulo = document.createElement('h4');
        h4Titulo.textContent = documento.Titulo || 'Documento';

        const pDescripcion = document.createElement('p');
        pDescripcion.textContent = documento.Descripcion || 'Sin descripción';

        const divEtiquetas = document.createElement('div');
        divEtiquetas.classList.add('etiquetas');

        const spanCategoria = document.createElement('span');
        spanCategoria.classList.add('azul');
        spanCategoria.textContent = documento.ID_Categoria || 'Categoría';

        const spanEstado = document.createElement('span');
        spanEstado.classList.add('verde');
        spanEstado.textContent = documento.Estado || 'Aprobado';

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

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-filtro')) {
        const categoriaSeleccionada = e.target.dataset.categoria;
        
        const cards = document.querySelectorAll('#ListaDocumentos .card');

        cards.forEach((card) => {
            const categoriaCard = card.dataset.categoria;

            if (categoriaSeleccionada === 'todos' || categoriaSeleccionada === categoriaCard) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
});

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
