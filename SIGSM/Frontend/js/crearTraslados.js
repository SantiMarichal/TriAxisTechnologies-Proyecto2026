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