document.addEventListener('DOMContentLoaded', () => {
    cargarTraslados();
});

async function cargarTraslados() {
    try {
        const response = await fetch('http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/API/traslados');
        const listaTraslados = await response.json();

        renderizarTraslados(listaTraslados);
    } catch (error) {
        console.error('Error al cargar la lista de traslados:', error);
    }
}

function renderizarTraslados(listaTraslados) {
    const contenedor = document.getElementById('ListaTraslados');
    contenedor.innerHTML = '';

    listaTraslados.forEach(traslado => {
        const divAmbulancia = document.createElement('div');
        divAmbulancia.classList.add('ambulancia');

        const divChofer = document.createElement('div');
        divChofer.classList.add('chofer');

        const imgAmbulancia = document.createElement('img');
        imgAmbulancia.src = '../assets/img/ambulance.svg';
        imgAmbulancia.alt = 'Ambulancia';
        imgAmbulancia.classList.add('imgAmbulancia');

        const pId = document.createElement('p');
        pId.textContent = `N° Traslado: ${traslado.ID_Traslado}`;

        const pEstado = document.createElement('p');
        pEstado.textContent = `Estado: ${traslado.Estado}`;

        const pFecha = document.createElement('p');
        pFecha.textContent = `Fecha: ${traslado.Fecha}`;

        divChofer.appendChild(imgAmbulancia);
        divChofer.appendChild(pId);
        divChofer.appendChild(pEstado);
        divChofer.appendChild(pFecha);

        const divInfo = document.createElement('div');
        divInfo.classList.add('info');

        const divInfo1 = document.createElement('div');
        divInfo1.classList.add('info1');

        const pOrigen = document.createElement('p');
        pOrigen.textContent = `Origen: ${traslado.Lugar_Origen}`;

        const pDestino = document.createElement('p');
        pDestino.textContent = `ID Destino: ${traslado.ID_Destino}`;

        const pChofer = document.createElement('p');
        pChofer.textContent = `Cédula Chofer: ${traslado.Cedula_Chofer}`;

        const pEnfermero = document.createElement('p');
        pEnfermero.textContent = `Cédula Enfermero: ${traslado.Cedula_Enfermero}`;

        divInfo1.appendChild(pOrigen);
        divInfo1.appendChild(pDestino);
        divInfo1.appendChild(pChofer);
        divInfo1.appendChild(pEnfermero);

        const divInfo2 = document.createElement('div');
        divInfo2.classList.add('info2');

        const pMatricula = document.createElement('p');
        pMatricula.textContent = `Matrícula: ${traslado.Matricula}`;

        const pVehiculo = document.createElement('p');
        pVehiculo.textContent = `Tipo Vehículo: ${traslado.Tipo_vehiculo ?? 'N/A'}`;

        const pSalida = document.createElement('p');
        pSalida.textContent = `Hora Salida: ${traslado.Hora_Salida}`;

        const pLlegada = document.createElement('p');
        pLlegada.textContent = `Hora Llegada: ${traslado.Hora_Llegada}`;

        divInfo2.appendChild(pMatricula);
        divInfo2.appendChild(pVehiculo);
        divInfo2.appendChild(pSalida);
        divInfo2.appendChild(pLlegada);

        divInfo.appendChild(divInfo1);
        divInfo.appendChild(divInfo2);

        divAmbulancia.appendChild(divChofer);
        divAmbulancia.appendChild(divInfo);

        contenedor.appendChild(divAmbulancia);
    });
}