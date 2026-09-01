const formulario = document.getElementById('loginForm');

const mensaje = document.getElementById('mensaje');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const ci = document.getElementById('ci').value;
    const nombre = document.getElementById('nombre').value;
    const pass = document.getElementById('password').value;

    try {
        const response = await fetch('../API/login.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                ci: ci,
                nombre: nombre,
                pass: pass
            })
        }
        );

        const datos = await response.json();

        if (!response.ok) {
            mensaje.textContent = datos.error;
            return;
        }

        if (datos.usuario.Cargo === 'Administrador') {
            window.location.href = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/Frontend/html/EleccionDeModulo.html';
        } else if (datos.usuario.Cargo === 'Administrativo') {
            window.location.href = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/Frontend/html/EleccionDeModuloAdmin.html';
        } else if (datos.usuario.Cargo === 'Enfermero') {
            window.location.href = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/Frontend/html/EleccionDeModuloEnfermero.html';
        }
    } catch (error) {
        console.error(error);
        mensaje.textContent = 'Error de conexión';
    }
});