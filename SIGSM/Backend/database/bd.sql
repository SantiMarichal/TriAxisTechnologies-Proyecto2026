CREATE DATABASE Proyecto;

USE Proyecto;


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
    foreign key  (ID_Categoria) references Categorias (ID_Categoria),
    foreign key (Cedula_Administrativo) references administrativo (Cedula_Administrativo),
    Hora date,
    Fecha date
);

create table Categorias (
    ID_Categoria varchar (10) primary key,
    Nombre varchar
);

create table Encuesta (
    ID_Encuesta varchar (10) primary key,
    ID_Pregunta varchar,
    Titulo varchar,
    Descripcion varchar,
    foreign key ID_Categoria references Categorias (ID_Categoria)
);

create table Preguntas (
    ID_Pregunta varchar (10) primary key
);




