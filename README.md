# 🚑 SIGSM - Sistema Informatico de Gestión de Servicios Médicos

**SIGSM** es una solución web integral diseñada para la coordinación, control y seguimiento en tiempo real de traslados de pacientes y transporte de elementos u órganos dentro y fuera del **Hospital de Clínicas**.
El proyecto fue desarrollado como parte del proyecto académico de la carrera bachillerato en **Tecnologias de la Información (TriAxis Technologies / UTU ISBO, 2026)**.
---

##  Objetivo del Proyecto

Optimizar la logística intra y extrahospitalaria mediante una plataforma centralizada que permite:
- Gestionar solicitudes de traslado para pacientes y elementos/órganos.
- Registrar el catálogo de pacientes de forma independiente y segura.
- Asignar de manera eficiente choferes, enfermeros, vehículos (ambulancias) y destinos.
- Monitorear en tiempo real el estado de cada traslado (Aprobado, Denegado, En proceso).

---

##  Tecnologías Utilizadas

- **Frontend:** HTML5, CSS3 (Flexbox/Grid), JavaScript (vanilla con Fetch API)
- **Backend:** PHP 8.x (POO y PDO)
- **Base de Datos:** MySQL  (Arquitectura Relacional con Restricciones de Integridad y Claves Foráneas)
- **Servidor:** Apache (XAMPP / Entorno Web)
- **Control de Versiones:** Git y GitHub

---

##  Estructura del Proyecto

La aplicación se organiza bajo una arquitectura limpia modular orientada a APIs RESTful en PHP y gestión independiente del cliente web.

```
SIGSM/
│
├── API/
|    ├── documentos/
|    |       └── documentos.php
|    ├── encuestas/
|    |       └── encuestas.php
|    ├── pacientes/
|    |       └── pacientes.php
|    ├── traslados/
|    |       └── traslados.php
|    ├── entidades/
|    |       ├── choferes.php
|    |       ├── destinos.php
|    |       ├── pacientes.php
|    |       └── vehiculos.php
|    |
|    ├── categorias/
|    |       └── categorias.php
│    ├── index.php
|    ├── login.php
|    ├── .htaccess
│    ├── logout.php
│    └── sesion.php
│   # Enrutadores HTTP (REST API). Puntos de entrada para las peticiones JSON del Frontend.
│
├── backend/
│   ├── config/
│   │   └── Database.php      # Patrón Singleton para la conexión PDO a MySQL.
│   │
│   ├── models/
│   |    ├── Administrador.php     
│   |    ├── Administrativo.php      
│   |    ├── Categoria.php       
|   |    ├── Documento.php
|   |    ├── Encuesta.php
|   |    ├── Enfermero.php
|   |    ├── Pregunta.php
|   |    ├── Respuesta.php
|   |    └── Traslado.php
│   |
|   └── database/
|         └── bd.sql
|
|
├── Frontend/
│   ├── assets/
│   │   ├── icons/            # Iconografía (.ico, .svg)
│   │   ├── img/    # Recortes y logotipos (Hospital de Clínicas)
|   |   └── fonts/             
│   │
│   ├── html/
│   │   ├── DocumentacionParaPacientes.html
│   │   ├── EleccionDeModulo.html
│   │   ├── EleccionDeModuloAdmin.html
│   │   ├── EleccionDeModuloEnfermero.html
│   │   ├── Encuesta.html
│   │   ├── PanelAdministrativo.html
│   │   ├── PanelAdministrativoRestringido.html
│   │   ├── TransportedeVehiculos.html
│   │   ├── TransportedeVehiculosRestringido.html
│   │   └── usuarios.html
│   │
│   ├── js/
│   │   ├── listaTraslados.js 
│   │   ├── sesion.js        
│   │   ├── crearTraslado.js
│   │   ├── documentos.js
│   │   ├── documentosPacientes.js
│   │   ├── encuesta.js
│   │   ├── listaTraslados.js
│   │   ├── login.js
│   │   ├── sesion-usuarios.js
│   │   ├── sesion.js
│   │   └── usuarios-main.js
│   │
│   ├── style/
│   │   ├── style-CreacionDeUsuarioAdministrador.css
│   │   ├── style-DocumentacionParaPaciente.css
│   │   ├── style-EleccionDeModulo.css
│   │   ├── style-EleccionDeModuloAdministrativo.css
│   │   ├── style-EleccionDeModuloEnfermero.css
│   │   ├── style-PanelAdministrativo.css
│   │   ├── style-PanelAdministrativoRestaurado.css
│   │   ├── style-TransportedeVehiculos.css
│   │   ├── style-TransportedeVehiculosRestaurado.css
│   │   ├── style-encuesta.css
│   │   ├── style-index.css
│   │   └── style-usuarios.css
│   |
|   └── index.html
│
└── README.md
│
│
└── scripts
      ├── firewall.sh
      ├── grupos.sh
      ├── logs.sh
      ├── MenuScripts.sh
      ├── red.sh
      ├── respaldos.sh
      └── usuarios.sh
```

---

##  Despliegue e Instalación con XAMPP

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/SantiMarichal/TriAxisTechnologies-Proyecto2026.git
   ```
2. **Configurar la Base de Datos:**
   - Importa `Backend/database/bd.sql` en tu gestor MySQL (phpMyAdmin).
3. **Servidor Web:**
   - Ubica la carpeta `SIGSM` dentro del directorio de tu servidor local (`htdocs` para XAMPP o `www` para WampServer/Apache).
   - Ajusta las credenciales de conexión en `backend/config/Database.php`.
4. **Acceso al sistema:**
   - Navega en tu navegador a `http://localhost/Prog/TriAxisTechnologies-Proyecto2026/SIGSM/Frontend/index.html`.

## Despliegue e Instalación con Docker

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/SantiMarichal/TriAxisTechnologies-Proyecto2026.git](https://github.com/SantiMarichal/TriAxisTechnologies-Proyecto2026.git)
   cd TriAxisTechnologies-Proyecto2026/SIGSM
2. **Configurar la Base de Datos:**
   - Asegurate de que las credenciales en el archivo `Backend/config/Database.php` apunten al host correcto.
3. **Servidor Web:**
   - Para levantar el contenedor se utiliza el comando: `docker compose up -d --build`
4. **Acceso al sistema:**
   - En tu navegador se ingresa `http://192.168.1.22:8080/Frontend/index.html`
---

##  Equipo de Desarrollo - TriAxis Technologies

| Integrante            | GitHub                                                     |
| --------------------- | -----------------------------------------------------------|
| **Santiago da Rosa**  | [@SantiagoDaRosa099](https://github.com/SantiagoDaRosa099) |
| **Joaquín Estefan**   | [@JoacoEstefan](https://github.com/JoacoEstefan)           |
| **Julieta Suarez**    | [@JulietaSuarez3MN](https://github.com/JulietaSuarez3MN)   |
| **Santiago Marichal** | [@SantiMarichal](https://github.com/SantiMarichal)         |

---

##  Licencia

Este proyecto ha sido desarrollado con fines puramente **académicos y educativos** para el Hospital de Clínicas. Todos los derechos sobre marcas e imágenes institucionales pertenecen a sus respectivos organismos.
