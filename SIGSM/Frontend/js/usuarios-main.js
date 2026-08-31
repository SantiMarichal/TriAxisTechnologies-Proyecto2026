let usuarioActual = null;

document.addEventListener('DOMContentLoaded', cargarSesion);

async function cargarSesion() {
    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/sesion');

        const datos = await response.json();

        if (!datos.autenticado) {
            window.location.href = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/Frontend/index.html';
            return;
        }
        usuarioActual = datos.usuario;

        // Si es admin puede obtener usuarios
        cargarUsuarios();
    } catch (error) {
        console.error(error);
    }
}

async function cargarUsuarios() {
    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/usuarios');
        const usuarios = await response.json();
        const tabla = document.getElementById('tablaUsuarios');

        tabla.innerHTML = '';
        usuarios.forEach((usuario) => {
            // Se crea una fila
            const fila = document.createElement('tr');

            /* Se crean las diferentes columnas o celdas --- INICIO --- */
            const celdaCi = document.createElement('td');
            celdaCi.textContent = usuario.ci;
            fila.appendChild(celdaCi);

            const celdaNombre = document.createElement('td');
            celdaNombre.textContent = usuario.nombre;
            fila.appendChild(celdaNombre);

            const celdaApellido = document.createElement('td');
            celdaApellido.textContent = usuario.apellido;
            fila.appendChild(celdaApellido);

            const celdaCargo = document.createElement('td');
            celdaCargo.textContent = usuario.cargo;
            fila.appendChild(celdaCargo);

            const celdaAcciones = document.createElement('td');
            celdaAcciones.classList.add('celda-acciones'); // Agregamos la clase

            const botonEditar = document.createElement('button');
            botonEditar.textContent = 'Editar';
            botonEditar.classList.add('btn-editar');
            botonEditar.addEventListener('click', () => abrirModalEditar(usuario));

            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';

            botonEliminar.addEventListener('click', () => {
                eliminarUsuario(usuario.ci);
            });

            celdaAcciones.appendChild(botonEliminar);
            celdaAcciones.appendChild(botonEditar);

            fila.appendChild(celdaAcciones);

            /* Se crean las diferentes columnas o celdas --- FIN --- */

            // Agregar fila a la tabla
            tabla.appendChild(fila);
            
        });
    } catch (error) {
        console.error(error);
    }
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

let cargoBase= '';

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

