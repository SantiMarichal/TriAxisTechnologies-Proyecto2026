document.addEventListener('DOMContentLoaded', () => {
    cargarTraslados();
    cargarOpcionesSelects();
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

async function cargarOpcionesSelects() {
    try {
        const response = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados?recursos=true');
        const datos = await response.json();

        const selectChofer = document.getElementById('cedulaChofer');
        datos.choferes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.Cedula_Chofer;
            opt.textContent = `${c.Nombre_Chofer} (${c.Cedula_Chofer})`;
            selectChofer.appendChild(opt);
        });

        const selectEnfermero = document.getElementById('cedulaEnfermero');
        datos.enfermeros.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.Cedula_Enfermero;
            opt.textContent = `${e.Nombre_Enfermero} (${e.Cedula_Enfermero})`;
            selectEnfermero.appendChild(opt);
        });

        const selectVehiculo = document.getElementById('matricula');
        datos.vehiculos.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.Matricula;
            opt.textContent = `${v.Matricula} - ${v.Tipo_Vehiculo}`;
            selectVehiculo.appendChild(opt);
        });

        const selectDestino = document.getElementById('idDestino');
        datos.destinos.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.ID_Destino;
            opt.textContent = d.Nombre;
            selectDestino.appendChild(opt);
        });

        const selectPaciente = document.getElementById('cedulaPaciente');
        datos.pacientes.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.CI;
            opt.textContent = `${p.Nombre} (${p.CI})`;
            selectPaciente.appendChild(opt);
        });

        const selectTipoElemento = document.getElementById('tipoElemento');
        datos.tipo_elementos.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.Tipo_Elemento;
            opt.textContent = t.Tipo_Elemento;
            selectTipoElemento.appendChild(opt);
        });


    } catch (error) {
        console.error('Error al cargar las opciones:', error);
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

        const tdCarga = document.createElement('td');
        if (traslado.CI_Paciente) {
            tdCarga.textContent = `Paciente (CI: ${traslado.CI_Paciente})`;
        } else if (traslado.Nombre_Elemento) {
            tdCarga.textContent = `Elemento: ${traslado.Nombre_Elemento}`;
        } else {
            tdCarga.textContent = 'Elemento / Órgano';
        }
        tr.appendChild(tdCarga);

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

        // Celdas de acciones
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
        const response = await fetch(`/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados/${id}`, {
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

const btnCerrarModalEditar = document.getElementById('btnCerrarModalEditar');
const btnCancelarEditar = document.getElementById('btnCancelarEditar');

const formNuevoTraslado = document.getElementById('formNuevoTraslado');
const formEditarTraslado = document.getElementById('formEditarTraslado');

if (btnNuevo) btnNuevo.addEventListener('click', abrirModalNuevo);
if (btnCerrarModal) btnCerrarModal.addEventListener('click', cerrarModalNuevo);
if (btnCancelar) btnCancelar.addEventListener('click', cerrarModalNuevo);

function abrirModalNuevo() {
    formNuevoTraslado.reset();
    modalNuevo.classList.add('mostrar');
}

function cerrarModalNuevo() {
    modalNuevo.classList.remove('mostrar');
}

if (btnCerrarModalEditar) btnCerrarModalEditar.addEventListener('click', cerrarModalEditar);
if (btnCancelarEditar) btnCancelarEditar.addEventListener('click', cerrarModalEditar);

function abrirModalEditar(traslado) {
    document.getElementById('editarCiPaciente').value = traslado.Cedula_Chofer || '';
    document.getElementById('editarNombreChofer').value = traslado.Cedula_Chofer || '';
    document.getElementById('editarNombreEnfermero').value = traslado.Cedula_Enfermero || '';
    document.getElementById('editarHoraSalida').value = traslado.Hora_Salida || '';
    document.getElementById('editarHoraLlegada').value = traslado.Hora_Llegada || '';
    document.getElementById('editarTelefono').value = '';

    modalEditar.classList.add('mostrar');
}

function cerrarModalEditar() {
    modalEditar.classList.remove('mostrar');
}

formNuevoTraslado.addEventListener('submit', crearTraslado);

async function crearTraslado(event) {
    event.preventDefault();

    const tipoCarga = document.getElementById('tipoCarga').value;

    const datos = {
        tipo_carga: tipoCarga,
        fecha: document.getElementById('fecha').value,
        hora_salida: document.getElementById('horaSalida').value,
        hora_llegada: document.getElementById('horaLlegada').value,
        estado: 'En proceso',
        lugar_origen: document.getElementById('lugarOrigen').value,
        cedula_chofer: document.getElementById('cedulaChofer').value,
        cedula_enfermero: document.getElementById('cedulaEnfermero').value,
        matricula: document.getElementById('matricula').value,
        id_destino: document.getElementById('idDestino').value
    };

    if (tipoCarga === 'elemento') {
        datos.nombre = document.getElementById('nombreElemento').value;
        datos.descripcion = document.getElementById('descripcionElemento').value;
        datos.tipo_elemento = document.getElementById('tipoElemento').value;
    } else {
        datos.CI_Paciente = document.getElementById('cedulaPaciente').value;
        datos.camilla = document.getElementById('camilla').value;
        datos.oxigeno = parseInt(document.getElementById('oxigeno').value);
    }

    try {
        const response = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();

        if (!response.ok) {
            document.getElementById('mensajeNuevo').textContent = resultado.error || 'Error al crear';
            return;
        }

        alert('Traslado creado correctamente');
        cerrarModalNuevo();
        cargarTraslados();
    } catch (error) {
        console.error('Error en la petición:', error);
    }
}