document.addEventListener('DOMContentLoaded', () => {
    cargarEncuesta(1);
});

async function cargarEncuesta(idCategoria) {
    try {
        const respuesta = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/encuestas/encuestas.php?categoria=' + idCategoria);
        const encuesta = await respuesta.json();

        document.getElementById('tituloEncuesta').textContent = encuesta.Titulo;
        document.getElementById('descripcionEncuesta').textContent = encuesta.Descripcion;

        const contenedor = document.getElementById('contenedorPreguntas');
        contenedor.innerHTML = '';

        encuesta.preguntas.forEach((pregunta, index) => {
            const fieldset = document.createElement('fieldset');
            fieldset.className = 'grupo-preferencias';

            const legend = document.createElement('legend');
            legend.textContent = 'Pregunta ' + (index + 1);
            fieldset.appendChild(legend);

            const p = document.createElement('p');
            p.className = 'descripcion-grupo';
            p.textContent = pregunta.Texto;
            fieldset.appendChild(p);

            const div = document.createElement('div');
            div.className = 'opciones-preferencias';

            pregunta.respuestas.forEach((resp, idx) => {
                const label = document.createElement('label');
                label.className = 'opcion-preferencia';

                const input = document.createElement('input');
                input.type = 'radio';
                input.name = pregunta.ID_Pregunta;
                input.value = resp.ID_Respuesta;
                if (idx === 0) input.checked = true;
                input.required = true;

                const span = document.createElement('span');
                span.className = 'opcion-contenido';

                const spanTitulo = document.createElement('span');
                spanTitulo.className = 'opcion-titulo';
                spanTitulo.textContent = resp.Texto;

                span.appendChild(spanTitulo);
                label.appendChild(input);
                label.appendChild(span);
                div.appendChild(label);
            });

            fieldset.appendChild(div);
            contenedor.appendChild(fieldset);
        });

        document.getElementById('contenedorBotonEnviar').style.display = 'block';
    } catch (error) {
        console.error('Error:', error);
    }
}

document.addEventListener('click', (e) => {
    const boton = e.target.closest('.btn-filtro');
    
    if (boton) {
        const categoria = boton.getAttribute('data-categoria');
        cargarEncuesta(categoria);
    }
});

const formulario = document.getElementById('formEncuesta');

formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(formulario);
    const respuestas = {};
    
    formData.forEach((valor, clave) => {
        respuestas[clave] = valor;
    });

    try {
        const respuesta = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/encuestas/encuestas.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ respuestas: respuestas })
        });

        const resultado = await respuesta.json();
        const mensaje = document.getElementById('mensajeEncuesta');

        mensaje.textContent = resultado.mensaje || resultado.error;
        mensaje.style.color = resultado.mensaje ? 'green' : 'red';

        if (resultado.mensaje) {
            formulario.reset();
            cargarEncuesta(1);
        }
    } catch (error) {
        console.error('Error al enviar:', error);
    }
});