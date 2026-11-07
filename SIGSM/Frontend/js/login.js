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

        if (datos.usuario.Cargo === 'Administrador' && datos.usuario.Estado === 'Activo') {
            window.location.href = '/Frontend/html/EleccionDeModulo.html';
        } else if (datos.usuario.Cargo === 'Administrativo' && datos.usuario.Estado === 'Activo') {
            window.location.href = '/Frontend/html/EleccionDeModuloAdmin.html';
        } else if (datos.usuario.Cargo === 'Enfermero' && datos.usuario.Estado === 'Activo') {
            window.location.href = '/Frontend/html/EleccionDeModuloEnfermero.html';
        }else{
            mensaje.textContent = 'Usuario inactivo. Por favor, contacte al administrador.';
        }
    } catch (error) {
        console.error(error);
        mensaje.textContent = 'Error de conexión';
    }
});