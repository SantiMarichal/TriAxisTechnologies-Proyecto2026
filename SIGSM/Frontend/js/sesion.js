document.addEventListener('DOMContentLoaded', cargarSesion);
document.getElementById('btnLogout').addEventListener('click', logout);

async function cargarSesion() {
    try {
        const response = await fetch('/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/sesion');
        const datos = await response.json();

        if (!datos.autenticado) {
            window.location.href = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/Frontend/index.html';
            return;
        }

        const nombre = datos.usuario.Nombre_Administrador || datos.usuario.Nombre_Administrativo || datos.usuario.Nombre_Enfermero;

        document.getElementById('nombreUsuario').textContent = nombre;
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
        console.error('Error al cerrar sesión:', error);
    }
}