document.addEventListener('DOMContentLoaded', () => {
    cargarTraslados();
    cargarOpcionesSelects();
    cargarOpcionesSelectsEdicion();
    cargarDatosTablas();
});

let todosLosTraslados = [];

async function cargarTraslados() {
    try {
        const response = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados');
        todosLosTraslados = await response.json();

        renderizarTraslados(todosLosTraslados);
    } catch (error) {
        console.error('Error al cargar la lista de traslados:', error);
    }
}

async function cargarOpcionesSelects() {
    try {
        const response = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados?recursos=true');
        const datos = await response.json();

        // 1. Cargar Choferes (Formulario)
        const selectChofer = document.getElementById('cedulaChofer');
        if (selectChofer && datos.choferes) {
            selectChofer.innerHTML = '<option value="">-- Seleccione un chofer --</option>';
            datos.choferes.forEach(c => {
                const opt = document.createElement('option');
                opt.value = c.Cedula_Chofer;
                opt.textContent = `${c.Nombre_Chofer} (${c.Cedula_Chofer})`;
                selectChofer.appendChild(opt);
            });
        }

        // 2. Cargar Enfermeros (Formulario)
        const selectEnfermero = document.getElementById('cedulaEnfermero');
        if (selectEnfermero && datos.enfermeros) {
            selectEnfermero.innerHTML = '<option value="">-- Seleccione un enfermero --</option>';
            datos.enfermeros.forEach(e => {
                const opt = document.createElement('option');
                opt.value = e.Cedula_Enfermero;
                opt.textContent = `${e.Nombre_Enfermero} (${e.Cedula_Enfermero})`;
                selectEnfermero.appendChild(opt);
            });
        }

        // 3. Cargar Vehículos (Formulario)
        const selectVehiculo = document.getElementById('matricula');
        if (selectVehiculo && datos.vehiculos) {
            selectVehiculo.innerHTML = '<option value="">-- Seleccione un vehículo --</option>';
            datos.vehiculos.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.Matricula;
                opt.textContent = `${v.Matricula} - ${v.Tipo_Vehiculo}`;
                selectVehiculo.appendChild(opt);
            });
        }

        // 4. Cargar Destinos (Formulario)
        const selectDestino = document.getElementById('idDestino');
        if (selectDestino && datos.destinos) {
            selectDestino.innerHTML = '<option value="">-- Seleccione un destino --</option>';
            datos.destinos.forEach(d => {
                const opt = document.createElement('option');
                opt.value = d.ID_Destino;
                opt.textContent = d.Nombre;
                selectDestino.appendChild(opt);
            });
        }

        // 5. Cargar Pacientes (Formulario de nuevo traslado)
        const selectPaciente = document.getElementById('cedulaPaciente');
        if (selectPaciente && datos.pacientes) {
            selectPaciente.innerHTML = '<option value="">-- Seleccione un paciente --</option>';
            datos.pacientes.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.CI;
                opt.textContent = `${p.Nombre} (${p.CI})`;
                selectPaciente.appendChild(opt);
            });
        }

        // 6. Cargar Camillas
        const selectCamilla = document.getElementById('camilla');
        if (selectCamilla && datos.camillas) {
            selectCamilla.innerHTML = '<option value="">-- Seleccione camilla --</option>';
            datos.camillas.forEach(c => {
                if (c.Camilla !== "") {
                    const opt = document.createElement('option');
                    opt.value = c.Camilla;
                    opt.textContent = c.Camilla;
                    selectCamilla.appendChild(opt);
                }
            });
        }

        // 7. Cargar Accesorios
        const selectAccesorio = document.getElementById('accesorio');
        if (selectAccesorio && datos.accesorios) {
            selectAccesorio.innerHTML = '<option value="">-- Seleccione accesorio --</option>';
            datos.accesorios.forEach(a => {
                if (a.Accesorio !== "") {
                    const opt = document.createElement('option');
                    opt.value = a.Accesorio;
                    opt.textContent = a.Accesorio;
                    selectAccesorio.appendChild(opt);
                }
            });
        }

        // 8. Cargar Tipo de Elemento
        const selectTipoElemento = document.getElementById('tipoElemento');
        if (selectTipoElemento && datos.tipo_elementos) {
            selectTipoElemento.innerHTML = '<option value="">-- Seleccione tipo --</option>';
            datos.tipo_elementos.forEach(t => {
                const opt = document.createElement('option');
                opt.value = t.Tipo_Elemento;
                opt.textContent = t.Tipo_Elemento;
                selectTipoElemento.appendChild(opt);
            });
        }

        // --- FILTROS DE LA TABLA ---
        
        // A. Poblar Select de Filtro por Paciente
        const filtroPaciente = document.getElementById('filtroPaciente');
        if (filtroPaciente && datos.pacientes) {
            filtroPaciente.innerHTML = '<option value="">-- Todos los pacientes --</option>';
            datos.pacientes.forEach(p => {
                const opt = document.createElement('option');
                opt.value = p.CI; // Coincide con 'CI' del JSON
                opt.textContent = `${p.Nombre} (${p.CI})`;
                filtroPaciente.appendChild(opt);
            });
            // Evitar duplicación de eventos al recargar opciones
            filtroPaciente.removeEventListener('change', aplicarFiltros);
            filtroPaciente.addEventListener('change', aplicarFiltros);
        }

        // B. Poblar Select de Filtro por Vehículo
        const filtroVehiculo = document.getElementById('filtroVehiculo');
        if (filtroVehiculo && datos.vehiculos) {
            filtroVehiculo.innerHTML = '<option value="">-- Todos los vehículos --</option>';
            datos.vehiculos.forEach(v => {
                const opt = document.createElement('option');
                opt.value = v.Matricula; // Coincide con 'Matricula' del JSON
                opt.textContent = `${v.Matricula} - ${v.Tipo_Vehiculo}`;
                filtroVehiculo.appendChild(opt);
            });
            filtroVehiculo.removeEventListener('change', aplicarFiltros);
            filtroVehiculo.addEventListener('change', aplicarFiltros);
        }

    } catch (error) {
        console.error('Error al cargar las opciones de los selects:', error);
    }
}

// Función de filtrado interactivo
function aplicarFiltros() {
    const ciPacienteSeleccionado = document.getElementById('filtroPaciente').value;
    const matriculaSeleccionada = document.getElementById('filtroVehiculo').value;

    let trasladosFiltrados = todosLosTraslados;

    // Filtrar por Paciente (asumiendo que en tu tabla de traslados la columna de paciente guarda la cédula como CI_Paciente)
    if (ciPacienteSeleccionado !== "") {
        trasladosFiltrados = trasladosFiltrados.filter(t => t.CI_Paciente === ciPacienteSeleccionado);
    }

    // Filtrar por Vehículo
    if (matriculaSeleccionada !== "") {
        trasladosFiltrados = trasladosFiltrados.filter(t => t.Matricula === matriculaSeleccionada);
    }

    // Renderizar la tabla con los resultados filtrados
    renderizarTraslados(trasladosFiltrados);
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

        const tdPisoRetiro = document.createElement('td');
        tdPisoRetiro.textContent = traslado.Piso_Retiro || '-';
        tr.appendChild(tdPisoRetiro);

        const tdHabitacionRetiro = document.createElement('td');
        tdHabitacionRetiro.textContent = traslado.Habitacion_Retiro || '-';
        tr.appendChild(tdHabitacionRetiro);

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

function renderizarChoferes(listaChoferes) {
    const tbody = document.getElementById('tablaChoferes');
    tbody.innerHTML = '';

    listaChoferes.forEach(chofer => {
        const idFila = chofer.Cedula_Chofer;
        const tr = document.createElement('tr');

        const tdCedula = document.createElement('td');
        tdCedula.textContent = chofer.Cedula_Chofer;
        tr.appendChild(tdCedula);

        const tdNombre = document.createElement('td');
        tdNombre.textContent = chofer.Nombre_Chofer;
        tr.appendChild(tdNombre);

        const tdApellido = document.createElement('td');
        tdApellido.textContent = chofer.Apellido_Chofer;
        tr.appendChild(tdApellido);

        const tdTelefono = document.createElement('td');
        tdTelefono.textContent = chofer.Telefono;
        tr.appendChild(tdTelefono);

        // Acciones
        const tdAcciones = document.createElement('td');

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => abrirModalEditarChofer(chofer); // Implementar modal/función si requieres edición
        tdAcciones.appendChild(btnEditar);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarChofer(idFila);
        tdAcciones.appendChild(btnEliminar);

        tr.appendChild(tdAcciones);
        tbody.appendChild(tr);
    });
}

function renderizarVehiculos(listaVehiculos) {
    const tbody = document.getElementById('tablaVehiculos');
    tbody.innerHTML = '';

    listaVehiculos.forEach(vehiculo => {
        const idFila = vehiculo.Matricula;
        const tr = document.createElement('tr');

        const tdMatricula = document.createElement('td');
        tdMatricula.textContent = vehiculo.Matricula;
        tr.appendChild(tdMatricula);

        const tdModelo = document.createElement('td');
        tdModelo.textContent = vehiculo.Modelo;
        tr.appendChild(tdModelo);

        const tdCapacidad = document.createElement('td');
        tdCapacidad.textContent = vehiculo.Capacidad;
        tr.appendChild(tdCapacidad);

        const tdTipo = document.createElement('td');
        tdTipo.textContent = vehiculo.Tipo_Vehiculo;
        tr.appendChild(tdTipo);

        // Acciones
        const tdAcciones = document.createElement('td');

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => abrirModalEditarVehiculo(vehiculo);
        tdAcciones.appendChild(btnEditar);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarVehiculo(idFila);
        tdAcciones.appendChild(btnEliminar);

        tr.appendChild(tdAcciones);
        tbody.appendChild(tr);
    });
}

function renderizarDestinos(listaDestinos) {
    const tbody = document.getElementById('tablaDestinos');
    tbody.innerHTML = '';

    listaDestinos.forEach(destino => {
        const idFila = destino.ID_Destino;
        const tr = document.createElement('tr');

        const tdId = document.createElement('td');
        tdId.textContent = destino.ID_Destino;
        tr.appendChild(tdId);

        const tdNombre = document.createElement('td');
        tdNombre.textContent = destino.Nombre;
        tr.appendChild(tdNombre);

        const tdDireccion = document.createElement('td');
        tdDireccion.textContent = destino.Direccion;
        tr.appendChild(tdDireccion);

        const tdRuta = document.createElement('td');
        tdRuta.textContent = destino.Ruta;
        tr.appendChild(tdRuta);

        // Acciones
        const tdAcciones = document.createElement('td');

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => abrirModalEditarDestino(destino);
        tdAcciones.appendChild(btnEditar);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarDestino(idFila);
        tdAcciones.appendChild(btnEliminar);

        tr.appendChild(tdAcciones);
        tbody.appendChild(tr);
    });
}

function renderizarPacientes(listaPacientes) {
    const tbody = document.getElementById('tablaPacientes');
    tbody.innerHTML = '';

    listaPacientes.forEach(paciente => {
        const idFila = paciente.CI;
        const tr = document.createElement('tr');

        const tdCI = document.createElement('td');
        tdCI.textContent = paciente.CI;
        tr.appendChild(tdCI);

        const tdNombre = document.createElement('td');
        tdNombre.textContent = paciente.Nombre;
        tr.appendChild(tdNombre);

        // Acciones
        const tdAcciones = document.createElement('td');

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => abrirModalEditarPaciente(paciente);
        tdAcciones.appendChild(btnEditar);

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.onclick = () => eliminarPaciente(idFila);
        tdAcciones.appendChild(btnEliminar);

        tr.appendChild(tdAcciones);
        tbody.appendChild(tr);
    });
}

async function cargarDatosTablas() {
    try {
        // Cargar Choferes
        const resChoferes = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/choferes');
        if (resChoferes.ok) renderizarChoferes(await resChoferes.json());

        // Cargar Vehículos
        const resVehiculos = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/vehiculos');
        if (resVehiculos.ok) renderizarVehiculos(await resVehiculos.json());

        // Cargar Destinos
        const resDestinos = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/destinos');
        if (resDestinos.ok) renderizarDestinos(await resDestinos.json());

        // Cargar Pacientes
        const resPacientes = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/pacientes');
        if (resPacientes.ok) renderizarPacientes(await resPacientes.json());
    } catch (error) {
        console.error('Error al cargar los catálogos en las tablas:', error);
    }
}

async function eliminarTraslado(id) {
    if (!confirm('¿Desea eliminar este traslado?')) {
        return;
    }

    try {
        const response = await fetch(`/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
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

async function eliminarChofer(cedula) {
    if (!confirm('¿Desea eliminar este chofer?')) {
        return;
    }
    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/choferes', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: cedula })
        });

        const datos = await response.json();

        if (!response.ok) {
            alert(datos.error);
            return;
        }

        alert(datos.mensaje);
        cargarDatosTablas();

    } catch (error) {
        console.error(error);
    }
}

async function eliminarVehiculo(matricula) {
    if (!confirm('¿Desea eliminar este vehículo?')) {
        return;
    }
    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/vehiculos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: matricula })
        });

        const datos = await response.json();

        if (!response.ok) {
            alert(datos.error);
            return;
        }

        alert(datos.mensaje);
        cargarDatosTablas();

    } catch (error) {
        console.error(error);
    }
}

async function eliminarDestino(id) {
    if (!confirm('¿Desea eliminar este destino?')) {
        return;
    }
    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/destinos', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        });

        const datos = await response.json();

        if (!response.ok) {
            alert(datos.error);
            return;
        }

        alert(datos.mensaje);
        cargarDatosTablas();

    } catch (error) {
        console.error(error);
    }
}

async function eliminarPaciente(cedula) {
    if (!confirm('¿Desea eliminar este paciente?')) {
        return;
    }
    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/pacientes', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: cedula })
        });

        const datos = await response.json();

        if (!response.ok) {
            alert(datos.error);
            return;
        }

        alert(datos.mensaje);
        cargarDatosTablas();

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
    document.getElementById('editarPisoRetiro').value = traslado.Piso_Retiro || '';
    document.getElementById('editarHabitacionRetiro').value = traslado.Habitacion_Retiro || '';

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
        id_destino: document.getElementById('idDestino').value,
        piso_retiro: document.getElementById('pisoRetiro').value,
        habitacion_retiro: document.getElementById('habitacionRetiro').value,
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
            id_destino: document.getElementById('editarIdDestino').value,
            piso_retiro: document.getElementById('editarPisoRetiro').value,
            habitacion_retiro: document.getElementById('editarHabitacionRetiro').value
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

const selectTipoEntidad = document.getElementById('tipoEntidad');
const modalRegistro = document.getElementById('modalNuevoRegistro');
const btnAbrirRegistro = document.getElementById('btnAbrirModalRegistro');
const btnCerrarRegistro = document.getElementById('btnCerrarModalRegistro');
const btnCancelarRegistro = document.getElementById('btnCancelarRegistro');

btnAbrirRegistro.addEventListener('click', () => modalRegistro.classList.add('mostrar'));
btnCerrarRegistro.addEventListener('click', () => modalRegistro.classList.remove('mostrar'));
btnCancelarRegistro.addEventListener('click', () => modalRegistro.classList.remove('mostrar'));

selectTipoEntidad.addEventListener('change', (e) => {
    const valor = e.target.value;

    // Ocultar todos los grupos de campos y quitarles el 'required' interno
    document.querySelectorAll('.grupo-campos').forEach(grupo => {
        grupo.style.display = 'none';
        grupo.querySelectorAll('input, select').forEach(input => input.required = false);
    });

    // Mostrar el grupo seleccionado y activar sus 'required'
    if (valor) {
        const grupoActivo = document.getElementById(valor === 'paciente' ? 'camposNuevoPaciente' : `campos${valor.charAt(0).toUpperCase() + valor.slice(1)}`);
        if (grupoActivo) {
            grupoActivo.style.display = 'block';
            grupoActivo.querySelectorAll('input, select').forEach(input => input.required = true);
        }
    }
});

document.getElementById('formNuevoRegistro').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tipo = selectTipoEntidad.value;

    let urlAPI = '';
    if (tipo === 'paciente') urlAPI = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/pacientes';
    else if (tipo === 'chofer') urlAPI = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/choferes';
    else if (tipo === 'vehiculo') urlAPI = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/vehiculos';
    else if (tipo === 'destino') urlAPI = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/entidades/destinos';

    try {
        const response = await fetch(urlAPI, {
            method: 'POST',
            body: JSON.stringify(Object.fromEntries(formData)),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const resultado = await response.json();

        if (response.ok && (resultado.success || resultado.mensaje)) {
            alert('¡Registro guardado con éxito!');
            modalRegistro.classList.remove('mostrar');
            e.target.reset();
            document.querySelectorAll('.grupo-campos').forEach(g => g.style.display = 'none');
            cargarOpcionesSelects();
            cargarOpcionesSelectsEdicion();
            cargarDatosTablas();
        } else {
            document.getElementById('mensajeRegistro').textContent = resultado.error || 'Ocurrió un error al guardar.';
        }
    } catch (error) {
        console.error('Error en la petición:', error);
    }
});