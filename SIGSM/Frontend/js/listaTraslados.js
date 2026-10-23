document.addEventListener('DOMContentLoaded', () => {
    cargarTraslados();
    cargarOpcionesSelects();
    cargarOpcionesSelectsEdicion();
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

        const selectCamilla = document.getElementById('camilla');
        datos.camillas.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.Camilla;
            opt.textContent = `${c.Camilla}`;
            selectCamilla.appendChild(opt);
        });

        const selectAccesorio = document.getElementById('accesorio');
        datos.accesorios.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.Accesorio;
            opt.textContent = `${a.Accesorio}`;
            selectAccesorio.appendChild(opt);
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

async function cargarOpcionesSelectsEdicion() {
    try {
        const response = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados?recursos=true');
        const datos = await response.json();

        const selectChofer = document.getElementById('editarCedulaChofer');
        datos.choferes.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.Cedula_Chofer;
            opt.textContent = `${c.Nombre_Chofer} (${c.Cedula_Chofer})`;
            selectChofer.appendChild(opt);
        });

        const selectEnfermero = document.getElementById('editarCedulaEnfermero');
        datos.enfermeros.forEach(e => {
            const opt = document.createElement('option');
            opt.value = e.Cedula_Enfermero;
            opt.textContent = `${e.Nombre_Enfermero} (${e.Cedula_Enfermero})`;
            selectEnfermero.appendChild(opt);
        });

        const selectVehiculo = document.getElementById('editarMatricula');
        datos.vehiculos.forEach(v => {
            const opt = document.createElement('option');
            opt.value = v.Matricula;
            opt.textContent = `${v.Matricula} - ${v.Tipo_Vehiculo}`;
            selectVehiculo.appendChild(opt);
        });

        const selectDestino = document.getElementById('editarIdDestino');
        datos.destinos.forEach(d => {
            const opt = document.createElement('option');
            opt.value = d.ID_Destino;
            opt.textContent = d.Nombre;
            selectDestino.appendChild(opt);
        });

        const selectPaciente = document.getElementById('editarcedulaPaciente');
        datos.pacientes.forEach(p => {
            const opt = document.createElement('option');
            opt.value = p.CI;
            opt.textContent = `${p.Nombre} (${p.CI})`;
            selectPaciente.appendChild(opt);
        });

        const selectCamilla = document.getElementById('editarCamilla');
        datos.camillas.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.Camilla;
            opt.textContent = `${c.Camilla}`;
            selectCamilla.appendChild(opt);
        });

        const selectAccesorio = document.getElementById('editarAccesorio');
        datos.accesorios.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.Accesorio;
            opt.textContent = `${a.Accesorio}`;
            selectAccesorio.appendChild(opt);
        });

        const selectTipoElemento = document.getElementById('editarTipoElemento');
        datos.tipo_elementos.forEach(t => {
            const opt = document.createElement('option');
            opt.value = t.Tipo_Elemento;
            opt.textContent = t.Tipo_Elemento;
            selectTipoElemento.appendChild(opt);
        });

    } catch (error) {
        console.error('Error al cargar las opciones de edición:', error);
    }
}

const selectTipoCargaNuevo = document.getElementById('tipoCarga');
if (selectTipoCargaNuevo) {
    selectTipoCargaNuevo.addEventListener('change', (e) => {
        CamposCarga(e.target.value, 'camposPaciente', 'camposElemento');
    });
}

const selectTipoCargaEditar = document.getElementById('editarTipoCarga');
if (selectTipoCargaEditar) {
    selectTipoCargaEditar.addEventListener('change', (e) => {
        CamposCarga(e.target.value, 'editarCamposPaciente', 'editarCamposElemento');
    });
}

function CamposCarga(valorSeleccionado, idContenedorPaciente, idContenedorElemento) {
    const contenedorPaciente = document.getElementById(idContenedorPaciente);
    const contenedorElemento = document.getElementById(idContenedorElemento);

    if (valorSeleccionado === 'paciente') {
        if (contenedorPaciente) contenedorPaciente.style.display = 'block';
        if (contenedorElemento) contenedorElemento.style.display = 'none';
    } else {
        if (contenedorPaciente) contenedorPaciente.style.display = 'none';
        if (contenedorElemento) contenedorElemento.style.display = 'block';
    }
}

function renderizarTraslados(listaTraslados) {
    const tbody = document.getElementById('tablaTraslados');
    tbody.innerHTML = '';

    listaTraslados.forEach(traslado => {
        const idFila = traslado.ID_Traslado;
        const tr = document.createElement('tr');

        // Celdas de informacion
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

        const tdNombreDestino = document.createElement('td');
        tdNombreDestino.textContent = traslado.Nombre_Destino;
        tr.appendChild(tdNombreDestino);

        const esPaciente = Boolean(traslado.CI_Paciente);

        const tdCamilla = document.createElement('td');
        tdCamilla.textContent = esPaciente ? (traslado.Camilla || '-') : '-';
        tr.appendChild(tdCamilla);

        const tdAislamiento = document.createElement('td');
        if (esPaciente) {
            tdAislamiento.textContent = traslado.Aislamiento == 1 ? 'Sí' : (traslado.Aislamiento == 0 ? 'No' : '-');
        } else {
            tdAislamiento.textContent = '-';
        }
        tr.appendChild(tdAislamiento);

        const tdAccesorio = document.createElement('td');
        tdAccesorio.textContent = esPaciente ? (traslado.Accesorio || '-') : '-';
        tr.appendChild(tdAccesorio);

        const tdOxigeno = document.createElement('td');
        if (esPaciente) {
            tdOxigeno.textContent = traslado.Oxigeno == 1 ? 'Sí' : (traslado.Oxigeno == 0 ? 'No' : '-');
        } else {
            tdOxigeno.textContent = '-';
        }
        tr.appendChild(tdOxigeno);

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

let idTrasladoActualEnEdicion = null;

function abrirModalEditar(traslado) {
    idTrasladoActualEnEdicion = traslado.ID_Traslado;

    document.getElementById('editarFecha').value = traslado.Fecha || '';
    document.getElementById('editarHoraSalida').value = traslado.Hora_Salida || '';
    document.getElementById('editarHoraLlegada').value = traslado.Hora_Llegada || '';
    document.getElementById('editarEstado').value = traslado.Estado || 'En proceso';
    document.getElementById('editarLugarOrigen').value = traslado.Lugar_Origen || '';
    document.getElementById('editarCedulaChofer').value = traslado.Cedula_Chofer || '';
    document.getElementById('editarCedulaEnfermero').value = traslado.Cedula_Enfermero || '';
    document.getElementById('editarMatricula').value = traslado.Matricula || '';
    document.getElementById('editarIdDestino').value = traslado.ID_Destino || '';

    if (traslado.CI_Paciente) {
        document.getElementById('editarTipoCarga').value = 'paciente';
        document.getElementById('editarcedulaPaciente').value = traslado.CI_Paciente || '';
        document.getElementById('editarCamilla').value = traslado.Camilla || '';
        document.getElementById('editarOxigeno').value = traslado.Oxigeno || 0;
        document.getElementById('editarAislamiento').value = traslado.Aislamiento || 0;
        document.getElementById('editarAccesorio').value = traslado.Accesorio || '';
        CamposCarga('paciente', 'editarcamposPaciente', 'editarcamposElemento');
    } else {
        document.getElementById('editarTipoCarga').value = 'elemento';
        document.getElementById('editarnombreElemento').value = traslado.Nombre_Elemento || '';
        document.getElementById('editardescripcionElemento').value = traslado.Descripcion || '';
        document.getElementById('editarTipoElemento').value = traslado.Tipo_Elemento || '';
        CamposCarga('elemento', 'editarcamposPaciente', 'editarcamposElemento');
    }

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
        datos.oxigeno = parseInt(document.getElementById('oxigeno').value) || 0;
        datos.aislamiento = parseInt(document.getElementById('aislamiento').value) || 0;
        datos.accesorio = document.getElementById('accesorio').value; 
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
if (formEditarTraslado) {
    formEditarTraslado.addEventListener('submit', async function (event) {
        event.preventDefault();

        if (!idTrasladoActualEnEdicion) {
            alert('No se ha seleccionado ningún traslado para editar.');
            return;
        }

        const tipoCarga = document.getElementById('editarTipoCarga').value;

        const datosActualizados = {
            tipo_carga: tipoCarga,
            estado: document.getElementById('editarEstado').value,
            fecha: document.getElementById('editarFecha').value,
            hora_salida: document.getElementById('editarHoraSalida').value,
            hora_llegada: document.getElementById('editarHoraLlegada').value,
            lugar_origen: document.getElementById('editarLugarOrigen').value,
            cedula_chofer: document.getElementById('editarCedulaChofer').value,
            cedula_enfermero: document.getElementById('editarCedulaEnfermero').value,
            matricula: document.getElementById('editarMatricula').value,
            id_destino: document.getElementById('editarIdDestino').value
        };

        if (tipoCarga === 'elemento') {
            datosActualizados.nombre = document.getElementById('editarnombreElemento').value;
            datosActualizados.descripcion = document.getElementById('editardescripcionElemento').value;
            datosActualizados.tipo_elemento = document.getElementById('editarTipoElemento').value;
        } else {
            datosActualizados.CI_Paciente = document.getElementById('editarcedulaPaciente').value;
            datosActualizados.camilla = document.getElementById('editarCamilla').value;
            datosActualizados.oxigeno = parseInt(document.getElementById('editarOxigeno').value) || 0;
            datosActualizados.aislamiento = parseInt(document.getElementById('editarAislamiento').value) || 0;
            datosActualizados.accesorio = document.getElementById('editarAccesorio').value;
        }

        await actualizarTraslado(idTrasladoActualEnEdicion, datosActualizados);
    });
}

async function actualizarTraslado(idTraslado, datosActualizados) {
    try {
        const respuesta = await fetch(`http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados/${idTraslado}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosActualizados)
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert('¡Traslado actualizado correctamente!');
            cerrarModalEditar();
            cargarTraslados();
        } else {
            alert('Error al actualizar: ' + (resultado.error || 'Desconocido'));
            console.error('Detalle del error:', resultado);
        }
    } catch (error) {
        console.error('Error en la petición PUT:', error);
    }
}