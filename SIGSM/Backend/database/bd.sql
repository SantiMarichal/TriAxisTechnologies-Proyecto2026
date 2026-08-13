-- Módulo Ambulancias
Traslado(ID_Traslado, Fecha, Hora_Salida, Hora_Llegada, Estado, Lugar_Origen, Cedula_Chofer, Cedula_Enfermero, Matricula, ID_Destino)
FK1: Cedula_Chofer → Chofer(Cedula_Chofer)
FK2: Cedula_Enfermero → Enfermero(Cedula_Enfermero)
FK3: Matricula → Vehiculo(Matricula)
FK4: ID_Destino → Destino(ID_Destino)

Enfermero(Cedula_Enfermero, Nombre_Enfermero, Apellido_Enfermero)

Chofer(Cedula_Chofer, Nombre_Chofer, Apellido_Chofer, Telefono)

Vehiculo(Matricula, Modelo, Capacidad, Tipo_Vehiculo)

Destino(ID_Destino, Nombre, Direccion, Ruta)

Trasladable(ID_Trasladable, Piso_Retiro, Habitacion_Retiro)

Paciente(ID_Trasladable, CI, Nombre, Accesorio, Camilla, Oxigeno)
FK1: ID_Trasladable → Trasladable(ID_Trasladable)

Elemento(ID_Trasladable, Nombre, Descripcion, Tipo_Elemento)
FK1: ID_Trasladable → Trasladable(ID_Trasladable)

Transporta(ID_Traslado, ID_Trasladable)
FK1: ID_Traslado → Traslado(ID_Traslado)
FK2: ID_Trasladable → Trasladable(ID_Trasladable)




-- Módulo Documentación
--Administrativo(Cedula_Administrativo, Nombre Administrativo, Apellido_Administrativo, Contraseña, Cargo)

--Documentos(ID_Documento, Titulo, Descripcion, ID_Categoria, Cedula_Administrativo, Hora, Fecha)

FK1: ID_Categoria → Categorias(ID_Categoria)
FK2: Hora → Carga(Hora)
FK3: Fecha → Carga(Fecha)
--FK4: Cedula_Administrativo → Administrativo(Cedula_Administrativo)

--Categorias(ID_Categoria, Nombre)

--Encuesta(ID_Encuesta, Preguntas, Titulo, Descripción, ID_Categoria)
FK1: ID_Categoria → Categorias(ID_Categoria)

Paciente(NombreDelUsuario)

Preguntas(ID_Pregunta)

--Completa(ID_Encuesta, ID_Pregunta, NombreDelUsuario)
FK1: ID_Encuesta → Encuesta(ID_Encuesta)
FK2: ID_Pregunta → Pregunta(ID_Pregunta)
FK3: Cedula_Paciente → Paciente(Cedula_Paciente)

Visualiza(ID_Documento, NombreDeUsuario)
FK1: ID_Documento →Documento(ID_Documento)
FK2: Cedula_Paciente → Paciente(Cedula_Paciente)

create table administrativo (
    Cedula_Administrativo varchar (10) primary key,
    Nombre_Administrativo varchar, 
    Apellido_Administrativo varchar,
    Contraseña integer,
    Cargo varchar
);

create table Documentos (
    ID_Documento varchar (10) primary key,
    Titulo varchar,
    Descripcion varchar,
    ID_Categoria varchar,
    foreign key Cedula_Administrativo references,
    Hora date,
    Fecha date
);

create table Categorias (
    ID_Categoria varchar (10) primary key,
    Nombre varchar
);

create table Encuesta (
    ID_Categoria varchar (10) primary key,
    Nombre varchar
);
Encuesta(ID_Encuesta, Preguntas, Titulo, Descripción, ID_Categoria)

create table Categorias (
    ID_Categoria varchar (10) primary key,
    Nombre varchar
);
Completa(ID_Encuesta, ID_Pregunta, NombreDelUsuario)
