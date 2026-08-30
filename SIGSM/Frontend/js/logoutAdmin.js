document.addEventListener('DOMContentLoaded', cargarSesion);
document.getElementById('btnLogout').addEventListener('click', logout);

async function cargarSesion() {
    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/sesion');
        const datos = await response.json();
        console.log('Datos de la sesión:', datos.usuario);

        if (!datos.autenticado) {
            window.location.href = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/Frontend/index.html';
            return;
        }

        document.getElementById('nombreUsuario').textContent = datos.usuario.Nombre_Administrativo;
        document.getElementById('rolUsuario').textContent = datos.usuario.Cargo;

    } catch (error) {
        console.error('Error al cargar la sesión:', error);
    }
}

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