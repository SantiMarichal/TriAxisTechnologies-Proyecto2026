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
        const divCard = document.createElement('div');
        divCard.classList.add('pes1'); 

        divCard.dataset.categoria = documento.ID_Categoria || 'General';

        const divText = document.createElement('div');
        divText.classList.add('pes1-text');

        const h2Titulo = document.createElement('h2');
        h2Titulo.textContent = documento.Titulo || 'Documento';

        const pDesc = document.createElement('p');
        pDesc.textContent = documento.Descripcion || 'Sin descripción';

        const pCat = document.createElement('p');
        pCat.textContent = documento.ID_Categoria || 'General';

        divText.appendChild(h2Titulo);
        divText.appendChild(pDesc);
        divText.appendChild(pCat);

        const divBtns = document.createElement('div');
        divBtns.classList.add('btn-vdc');

        const btnVer = document.createElement('button');
        btnVer.classList.add('btn');
        btnVer.innerHTML = '<img src="../assets/img/eye.svg" alt="Ver">';
        
        const btnDescargar = document.createElement('button');
        btnDescargar.classList.add('btn');
        btnDescargar.innerHTML = '<img src="../assets/img/file-down.svg" alt="Descargar">';

        const btnCompartir = document.createElement('button');
        btnCompartir.classList.add('btn');
        btnCompartir.innerHTML = '<img src="../assets/img/square-arrow-out-up-right.svg" alt="Compartir">';

        divBtns.appendChild(btnVer);
        divBtns.appendChild(btnDescargar);
        divBtns.appendChild(btnCompartir);

        divCard.appendChild(divText);
        divCard.appendChild(divBtns);

        contenedor.appendChild(divCard);
    });
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-filtro')) {
        const categoriaSeleccionada = e.target.dataset.categoria;
        
        const cards = document.querySelectorAll('#ListaDocumentos .pes1');

        cards.forEach((card) => {
            const categoriaCard = card.dataset.categoria;

            if (categoriaSeleccionada.toLowerCase() === 'todos' || categoriaSeleccionada === categoriaCard) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    }
});