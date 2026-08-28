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


        console.log('Usuario:', datos.usuario);

        window.location.href = '/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/Frontend/html/EleccionDeModulo.html';    
    } catch (error) {
        console.error(error);
        mensaje.textContent = 'Error de conexión';
    }
});