document.addEventListener('DOMContentLoaded', () => {
    cargarDatosEncuesta();
});

async function cargarDatosEncuesta() {
    try {
        const response = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/encuestas');
        const encuesta = await response.json();

        if (encuesta) {
            document.getElementById('tituloEncuesta').textContent = encuesta.Titulo;
            document.getElementById('descripcionEncuesta').textContent = encuesta.Descripcion;
        }
    } catch (error) {
        console.error('Error al cargar la información de la encuesta:', error);
    }
}

const formularioEncuesta = document.getElementById("formEncuesta");

formularioEncuesta.addEventListener("submit", async function (event) {
    event.preventDefault();

    const datos = new FormData(formularioEncuesta);

    const satisfaccion = datos.get("satisfaccion");
    const aspectosSeleccionados = datos.getAll("aspectos[]");


    try {
        const respuesta = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/encuestas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                satisfaccion: satisfaccion,
                aspectos: aspectosSeleccionados
            })
        });

        const resultado = await respuesta.json();

        if (respuesta.ok) {
            alert('¡Encuesta enviada con éxito. Muchas gracias!');
            formularioEncuesta.reset();
        } else {
            alert(resultado.error || 'Error al enviar la encuesta.');
        }

    } catch (error) {
        console.error('Error al conectar con la API:', error);
        alert('Ocurrió un error al intentar enviar la encuesta al servidor.');
    }
});