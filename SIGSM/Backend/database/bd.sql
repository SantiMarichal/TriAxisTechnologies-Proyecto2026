CREATE DATABASE Proyecto;
USE Proyecto;

-- Módulo Ambulancias

--DDL:
CREATE TABLE Enfermero(
    Cedula_Enfermero VARCHAR (10) PRIMARY KEY,
    Nombre_Enfermero VARCHAR (20),
    Apellido_Enfermero VARCHAR (20)
);

CREATE TABLE Chofer(
    Cedula_Chofer VARCHAR (10) PRIMARY KEY,
    Nombre_Chofer VARCHAR (20),
    Apellido_Chofer VARCHAR (20),
    Telefono VARCHAR (10)
);

CREATE TABLE Vehiculo(
    Matricula VARCHAR (10) PRIMARY KEY,
    Modelo VARCHAR (10),
    Capacidad INT,
    Tipo_Vehiculo VARCHAR (10)
);

CREATE TABLE Destino(
    ID_Destino VARCHAR (10) PRIMARY KEY,
    Nombre VARCHAR (20),
    Direccion VARCHAR (100),
    Ruta VARCHAR (100)
);

CREATE TABLE Trasladable(
    ID_Trasladable VARCHAR (10) PRIMARY KEY,
    Piso_Retiro INT,
    Habitacion_Retiro INT
);

CREATE TABLE Traslado(
    ID_Traslado VARCHAR (10) PRIMARY KEY,
    Fecha DATE,
    Hora_Salida TIME,
    Hora_Llegada TIME,
    Estado VARCHAR (10),
    Lugar_Origen VARCHAR (100),
    Cedula_Chofer VARCHAR (10),
    Cedula_Enfermero VARCHAR (10),
    Matricula VARCHAR (10),
    ID_Destino VARCHAR (10),
    FOREIGN KEY (Cedula_Chofer) REFERENCES Chofer(Cedula_Chofer),
    FOREIGN KEY (Cedula_Enfermero) REFERENCES Enfermero(Cedula_Enfermero),
    FOREIGN KEY (Matricula) REFERENCES Vehiculo(Matricula),
    FOREIGN KEY (ID_Destino) REFERENCES Destino(ID_Destino)
);

CREATE TABLE Paciente(
    ID_Trasladable VARCHAR (10) PRIMARY KEY,
    CI VARCHAR(10)UNIQUE,
    Nombre VARCHAR (20),
    Accesorio VARCHAR (100),
    Camilla VARCHAR (100), --Boolean?
    Oxigeno VARCHAR (100), --Boolean?
    FOREIGN KEY (ID_Trasladable) REFERENCES Trasladable(ID_Trasladable)
);

CREATE TABLE Elemento(
    ID_Trasladable VARCHAR (10) PRIMARY KEY,
    Nombre VARCHAR (20),
    Descripcion VARCHAR (200),
    Tipo_Elemento VARCHAR (50),
    FOREIGN KEY (ID_Trasladable) REFERENCES Trasladable(ID_Trasladable)
);

CREATE TABLE Transporta(
    ID_Traslado VARCHAR (10),
    ID_Trasladable VARCHAR (10),
    PRIMARY KEY (ID_Traslado, ID_Trasladable),
    FOREIGN KEY (ID_Traslado) REFERENCES Traslado(ID_Traslado),
    FOREIGN KEY (ID_Trasladable) REFERENCES Trasladable(ID_Trasladable)
);

--DML:

-- Módulo Documentación

--DDL:
CREATE TABLE Administrativo (
    Cedula_Administrativo VARCHAR (10) PRIMARY KEY,
    Nombre_Administrativo VARCHAR (20), 
    Apellido_Administrativo VARCHAR (20),
    Contrasena VARCHAR (20),
    Cargo VARCHAR (10)
);

CREATE TABLE Categorias (
    ID_Categoria VARCHAR (10) PRIMARY KEY,
    Nombre VARCHAR (20)
);

CREATE TABLE Encuesta (
    ID_Encuesta VARCHAR (10) PRIMARY KEY,
    ID_Pregunta VARCHAR (10),
    Titulo VARCHAR (100),
    Descripcion VARCHAR (200),
    ID_Categoria VARCHAR (10),
    FOREIGN KEY (ID_Categoria) REFERENCES Categorias(ID_Categoria)
);

CREATE TABLE Documentos (
    ID_Documento VARCHAR (10) PRIMARY KEY,
    Titulo VARCHAR (100),
    Descripcion VARCHAR (200),
    ID_Categoria VARCHAR (10),
    Cedula_Administrativo VARCHAR (10),
    FOREIGN KEY  (ID_Categoria) REFERENCES Categorias(ID_Categoria),
    FOREIGN KEY (Cedula_Administrativo) REFERENCES Administrativo(Cedula_Administrativo),
    HorayFecha datetime
);

CREATE TABLE Preguntas (
    ID_Pregunta VARCHAR (10) PRIMARY KEY
);

--DML:




