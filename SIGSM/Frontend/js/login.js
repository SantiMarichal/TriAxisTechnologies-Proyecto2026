const formulario = document.getElementById('loginForm');

const mensaje = document.getElementById('mensaje');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('password').value;

    try {
        const response = await fetch('../../API/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    user: user,
                    pass: pass
                })
            }
        );

        const datos = await response.json();

        if (!response.ok) {
            mensaje.textContent = datos.error;
            return;
        }


        console.log('Usuario:', datos.usuario);

        /*window.location.href = '/Prog/TrabajosEnClase/ej-fullstack/frontend/html/usuarios.html';*/
    } catch (error) {
        console.error(error);
        mensaje.textContent = 'Error de conexión';
    }
});