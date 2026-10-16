document.addEventListener('DOMContentLoaded', () => {
    cargarTraslados();
});

async function cargarTraslados() {
    try {
        const response = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados');
        const listaTraslados = await response.json();

        renderizarTraslados(listaTraslados);
    } catch (error) {
        console.error('Error al cargar la lista de traslados:', error);
    }
}

function renderizarTraslados(listaTraslados) {
    const tbody = document.getElementById('tablaTraslados');
    tbody.innerHTML = '';

    listaTraslados.forEach(traslado => {
        const idFila = traslado.ID_Traslado;

        const tr = document.createElement('tr');

        // Celdas de información
        const tdId = document.createElement('td');
        tdId.textContent = idFila;
        tr.appendChild(tdId);

        const tdFecha = document.createElement('td');
        tdFecha.textContent = traslado.Fecha;
        tr.appendChild(tdFecha);

        const tdHoraSalida = document.createElement('td');
        tdHoraSalida.textContent = traslado.Hora_Salida;
        tr.appendChild(tdHoraSalida);

        const tdHoraLlegada = document.createElement('td');
        tdHoraLlegada.textContent = traslado.Hora_Llegada;
        tr.appendChild(tdHoraLlegada);

        const tdEstado = document.createElement('td');
        tdEstado.textContent = traslado.Estado;
        tr.appendChild(tdEstado);

        const tdOrigen = document.createElement('td');
        tdOrigen.textContent = traslado.Lugar_Origen;
        tr.appendChild(tdOrigen);

        const tdCedulaChofer = document.createElement('td');
        tdCedulaChofer.textContent = traslado.Cedula_Chofer;
        tr.appendChild(tdCedulaChofer);

        const tdCedulaEnfermero = document.createElement('td');
        tdCedulaEnfermero.textContent = traslado.Cedula_Enfermero;
        tr.appendChild(tdCedulaEnfermero);

        const tdMatricula = document.createElement('td');
        tdMatricula.textContent = traslado.Matricula;
        tr.appendChild(tdMatricula);

        const tdIdDestino = document.createElement('td');
        tdIdDestino.textContent = traslado.ID_Destino;
        tr.appendChild(tdIdDestino);

        const tdAcciones = document.createElement('td');

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => abrirModalEditar(traslado);
        tdAcciones.appendChild(btnEditar);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarTraslado(idFila);
        tdAcciones.appendChild(btnEliminar);

        tr.appendChild(tdAcciones);
        tbody.appendChild(tr);
    });
}

async function eliminarTraslado(id) {
    if (!confirm('¿Desea eliminar este traslado?')) {
        return;
    }

    try {
        const response =
            await fetch(`/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados/${id}`, {
                method: 'DELETE'
            });

        const datos = await response.json();

        if (!response.ok) {
            alert(datos.error);
            return;
        }

        alert(datos.mensaje);

        cargarTraslados();

    } catch (error) {
        console.error(error);
    }
}

const modalNuevo = document.getElementById('modalNuevo');

const modalEditar = document.getElementById('modalEditar');

const btnNuevo = document.getElementById('btnNuevo');

const btnCerrarModal = document.getElementById('btnCerrarModal');

const btnCancelar = document.getElementById('btnCancelar');

const formNuevoTraslado = document.getElementById('formNuevoTraslado');

btnNuevo.addEventListener('click', abrirModal);

btnCerrarModal.addEventListener('click', cerrarModal);

btnCancelar.addEventListener('click', cerrarModal);

function abrirModal() {
    formNuevoTraslado.reset();
    modalNuevo.classList.add('mostrar');
}

function cerrarModal() {
    modalNuevo.classList.remove('mostrar');
}

formNuevoTraslado.addEventListener('submit', crearTraslado);

async function crearTraslado(event) {
    event.preventDefault();
    const datos = {
        fecha: document.getElementById('fecha').value,
        ci: document.getElementById('ci').value,
        nombreChofer: document.getElementById('nombreChofer').value,
        nombreEnfermero: document.getElementById('nombreEnfermero').value,
        horaSalida: document.getElementById('horaSalida').value,
        horaLlegada: document.getElementById('horaLlegada').value,
        telefono: document.getElementById('Telefono').value,
        oxigeno: document.getElementById('oxigeno').value,
        camilla: document.getElementById('camilla').value
    };

    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados/', {
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

        alert('Traslado creado correctamente');

        cerrarModal();
        cargarTraslados();
    } catch (error) {
        console.error(error);
    }
}