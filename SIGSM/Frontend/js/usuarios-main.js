let usuarioActual = null;

document.addEventListener('DOMContentLoaded', cargarSesion);

async function cargarUsuarios() {
    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/usuarios');
        const listaUsuarios = await response.json();

        renderizarTabla(listaUsuarios);
    } catch (error) {
        console.error('Error al cargar la lista de usuarios:', error);
    }
}

// 2. Armar los elementos visuales en el HTML
function renderizarTabla(listaUsuarios) {
    
    const ciLogueada = document.getElementById('ciUsuario').textContent.trim();

    const tbody = document.getElementById('tablaUsuarios');
    tbody.innerHTML = '';

    listaUsuarios.forEach(usuario => {
        const ciFila = usuario.Cedula_Administrador || usuario.Cedula_Administrativo || usuario.Cedula_Enfermero || usuario.ci;

        const tr = document.createElement('tr');

        // Celdas de información
        const tdCi = document.createElement('td');
        tdCi.textContent = ciFila;
        tr.appendChild(tdCi);

        const tdNombre = document.createElement('td');
        tdNombre.textContent = usuario.Nombre_Administrador || usuario.Nombre_Administrativo || usuario.Nombre_Enfermero || usuario.nombre;
        tr.appendChild(tdNombre);

        const tdApellido = document.createElement('td');
        tdApellido.textContent = usuario.Apellido_Administrador || usuario.Apellido_Administrativo || usuario.Apellido_Enfermero || usuario.apellido;
        tr.appendChild(tdApellido);

        const tdCargo = document.createElement('td');
        tdCargo.textContent = usuario.Cargo || usuario.cargo;
        tr.appendChild(tdCargo);

        // Celda de Acciones
        const tdAcciones = document.createElement('td');

        // Botón Editar (siempre presente)
        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.onclick = () => abrirModalEditar(usuario);
        tdAcciones.appendChild(btnEditar);

        // IF SIMPLE: Solo agrega el botón Eliminar si la CI no coincide con la del span
        if (ciFila !== ciLogueada) {
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => eliminarUsuario(ciFila);
            tdAcciones.appendChild(btnEliminar);
        }

        tr.appendChild(tdAcciones);
        tbody.appendChild(tr);
    });
}


async function eliminarUsuario(ci) {
    if (!confirm('¿Desea eliminar este usuario?')) {
        return;
    }

    try {
        const response =
            await fetch(`/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/usuarios/${ci}`, {
                method: 'DELETE'
            });

        const datos = await response.json();

        if (!response.ok) {
            alert(datos.error);
            return;
        }

        alert(datos.mensaje);

        cargarUsuarios();

    } catch (error) {
        console.error(error);
    }
}

const modalNuevo = document.getElementById('modalNuevo');

const modalEditar = document.getElementById('modalEditar');

const btnNuevo = document.getElementById('btnNuevo');

const btnCerrarModal = document.getElementById('btnCerrarModal');

const btnCancelar = document.getElementById('btnCancelar');

const formNuevoUsuario = document.getElementById('formNuevoUsuario');

btnNuevo.addEventListener('click', abrirModal);

btnCerrarModal.addEventListener('click', cerrarModal);

btnCancelar.addEventListener('click', cerrarModal);

function abrirModal() {
    formNuevoUsuario.reset();
    modalNuevo.classList.add('mostrar');
}

function cerrarModal() {
    modalNuevo.classList.remove('mostrar');
}

formNuevoUsuario.addEventListener('submit', crearUsuario);

async function crearUsuario(event) {
    event.preventDefault();
    const datos = {
        ci: document.getElementById('ci').value,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        pass: document.getElementById('pass').value,
        cargo: document.getElementById('cargo').value
    };

    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/usuarios/', {
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

        alert('Usuario creado correctamente');

        cerrarModal();
        cargarUsuarios();
    } catch (error) {
        console.error(error);
    }
}

const opcionesPorCargo = {
    'Administrativo': ['Administrativo nuevo', 'Administrativo mayor', 'Administrativo'],
    'Enfermero': ['Enfermero de piso', 'Enfermero jefe', 'Enfermero'],
    'Administrador': ['Super Admin', 'Administrador de sistema', 'Administrador']
};

let cargoBase = '';

function abrirModalEditar(usuario) {
    document.getElementById('editarCi').value = usuario.ci;
    document.getElementById('editarNombre').value = usuario.nombre;
    document.getElementById('editarApellido').value = usuario.apellido;
    document.getElementById('editarCargo').value = usuario.cargo;
    document.getElementById('editarPass').value = usuario.pass;

    cargoBase = usuario.rolBase;
    const selectCargo = document.getElementById('editarCargo');
    selectCargo.innerHTML = '';

    const listaOpciones = opcionesPorCargo[usuario.rolBase] || [usuario.cargo];

    listaOpciones.forEach(opcion => {
        const opt = document.createElement('option');
        opt.value = opcion;
        opt.textContent = opcion;

        if (usuario.cargo === opcion) {
            opt.selected = true;
        }
        selectCargo.appendChild(opt);
    });

    modalEditar.classList.add('mostrar');
}

document.getElementById('btnCancelarEditar').addEventListener('click', cerrarModalEditar);
document.getElementById('btnCerrarModalEditar').addEventListener('click', cerrarModalEditar);

function cerrarModalEditar() {
    modalEditar.classList.remove('mostrar');
}

document.getElementById('formEditarUsuario').addEventListener('submit', async (e) => {
    e.preventDefault();

    const ci = document.getElementById('editarCi').value;
    const cargo = document.getElementById('editarCargo').value;

    const datos = {
        ci: ci,
        nombre: document.getElementById('editarNombre').value,
        apellido: document.getElementById('editarApellido').value,
        pass: document.getElementById('editarPass').value,
        cargo: cargo
    };

    let endpoint = '';

    if (cargoBase === 'Administrador') {
        endpoint = 'administradores';
    } else if (cargoBase === 'Administrativo') {
        endpoint = 'administrativos';
    } else if (cargoBase === 'Enfermero') {
        endpoint = 'enfermeros';
    }

    const url = `/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/usuarios/${endpoint}/${ci}`;

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });

        const resultado = await response.json();

        if (response.ok) {
            alert(resultado.mensaje || 'Usuario actualizado correctamente');
            cerrarModalEditar();
            cargarUsuarios();
        } else {
            alert(resultado.error || 'Error al actualizar');
        }
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
    }
});

