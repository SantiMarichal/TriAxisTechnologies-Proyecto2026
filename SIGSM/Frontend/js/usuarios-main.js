let usuarioActual = null;

/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API
/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/Frontend

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

        document.getElementById('nombreUsuario').textContent = usuarioActual.nombre;

        document.getElementById('rolUsuario').textContent = usuarioActual.rol;


        if (usuarioActual.rol !== 'admin') {
            document.getElementById('administracion').style.display = 'none';
            return;
        }

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

            const celdaUsuario = document.createElement('td');
            celdaUsuario.textContent = usuario.user_name;
            fila.appendChild(celdaUsuario);

            const celdaRol = document.createElement('td');
            celdaRol.textContent = usuario.rol;
            fila.appendChild(celdaRol);

            const celdaAcciones = document.createElement('td');

            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';

            botonEliminar.addEventListener('click', () => {
                eliminarUsuario(usuario.ci);
            });

            celdaAcciones.appendChild(botonEliminar);

            fila.appendChild(celdaAcciones);

            /* Se crean las diferentes columnas o celdas --- FIN --- */

            // Agregar fila a la tabla
            tabla.appendChild(fila);
        });
    } catch (error) {
        console.error(error);
    }
}

document.getElementById('btnLogout').addEventListener('click', logout);

async function logout() {
    try {
        await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/logout', {
            method: 'POST'
        });

        window.location.href = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/Frontend/index.html';

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
        user: document.getElementById('user').value,
        pass: document.getElementById('pass').value,
        rol: document.getElementById('rol').value
    };

    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/usuarios', {
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