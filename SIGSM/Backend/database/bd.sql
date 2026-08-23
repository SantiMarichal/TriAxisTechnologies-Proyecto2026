CREATE DATABASE Proyecto;
USE Proyecto;

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

CREATE TABLE Preguntas (
    ID_Pregunta VARCHAR (10) PRIMARY KEY
);

CREATE TABLE Encuesta (
    ID_Encuesta VARCHAR (10) PRIMARY KEY,
    ID_Pregunta VARCHAR (10),
    Titulo VARCHAR (100),
    Descripcion VARCHAR (200),
    ID_Categoria VARCHAR (10),
    FOREIGN KEY (ID_Categoria) REFERENCES Categorias(ID_Categoria),
    FOREIGN KEY (ID_Pregunta) REFERENCES Preguntas(ID_Pregunta)
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

--DML:
INSERT INTO Administrativo
(Cedula_Administrativo, Nombre_Administrativo, Apellido_Administrativo, Contrasena, Cargo)
VALUES
('12345678', 'Juan', 'Perez', '123456', 'Admin'),
('23456789', 'Ana', 'Gomez', '234567', 'Admin'),
('34567890', 'Carlos', 'Rodriguez', '345678', 'Admin'),
('45678901', 'Maria', 'Fernandez', '456789', 'Admin'),
('56789012', 'Luis', 'Martinez', '567890', 'Admin');

INSERT INTO Categorias
(ID_Categoria, Nombre)
VALUES
('CAT001', 'Atencion'),
('CAT002', 'Limpieza'),
('CAT003', 'Instalaciones'),
('CAT004', 'Personal'),
('CAT005', 'Servicios');

INSERT INTO Preguntas
(ID_Pregunta)
VALUES
('P001'),
('P002'),
('P003'),
('P004'),
('P005');

INSERT INTO Encuesta
(ID_Encuesta, ID_Pregunta, Titulo, Descripcion, ID_Categoria)
VALUES
('ENC001', 'P001', 'Atencion recibida', 'Evaluacion de la atencion recibida en el hospital.', 'CAT001'),
('ENC002', 'P002', 'Limpieza', 'Evaluacion de la limpieza de las instalaciones.', 'CAT002'),
('ENC003', 'P003', 'Instalaciones', 'Evaluacion del estado de las instalaciones.', 'CAT003'),
('ENC004', 'P004', 'Personal', 'Evaluacion del trato recibido por el personal.', 'CAT004'),
('ENC005', 'P005', 'Servicios', 'Evaluacion general de los servicios ofrecidos.', 'CAT005');

INSERT INTO Documentos
(ID_Documento, Titulo, Descripcion, ID_Categoria, Cedula_Administrativo, HorayFecha)
VALUES
('DOC001', 'Reglamento', 'Reglamento general del hospital.', 'CAT001', '12345678', '2026-08-01 08:30:00'),
('DOC002', 'Protocolo', 'Protocolo de atencion al paciente.', 'CAT002', '23456789', '2026-08-05 09:15:00'),
('DOC003', 'Normativa', 'Normativa interna del hospital.', 'CAT003', '34567890', '2026-08-10 10:00:00'),
('DOC004', 'Horarios', 'Horarios de atencion de los servicios.', 'CAT004', '45678901', '2026-08-15 11:30:00'),
('DOC005', 'Informacion', 'Informacion general para los pacientes.', 'CAT005', '56789012', '2026-08-20 12:00:00');

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
    Tipo_Vehiculo ENUM('Ambulancia', 'Otro')
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
    Estado ENUM('Aprobado', 'Denegado', 'En proceso'),
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
    Accesorio ENUM('Bastón', 'Silla de ruedas', 'Otro'),
    Camilla ENUM('De emergencia', 'Normal'), 
    Oxigeno BOOLEAN,
    Aislamiento BOOLEAN,
    FOREIGN KEY (ID_Trasladable) REFERENCES Trasladable(ID_Trasladable)
);

CREATE TABLE Elemento(
    ID_Trasladable VARCHAR (10) PRIMARY KEY,
    Nombre VARCHAR (20),
    Descripcion VARCHAR (200),
    Tipo_Elemento ENUM('Organo', 'Documentos', 'Otro'),
    FOREIGN KEY (ID_Trasladable) REFERENCES Trasladable(ID_Trasladable)
);

CREATE TABLE Transporta(
    ID_Traslado VARCHAR (10) PRIMARY KEY,
    ID_Trasladable VARCHAR (10),
    FOREIGN KEY (ID_Traslado) REFERENCES Traslado(ID_Traslado),
    FOREIGN KEY (ID_Trasladable) REFERENCES Trasladable(ID_Trasladable)
);

--DML:
INSERT INTO Enfermero
(Cedula_Enfermero, Nombre_Enfermero, Apellido_Enfermero)
VALUES
('11111111', 'Pedro', 'Gonzalez'),
('22222222', 'Laura', 'Martinez'),
('33333333', 'Sofia', 'Rodriguez'),
('44444444', 'Diego', 'Fernandez'),
('55555555', 'Valentina', 'Lopez');

INSERT INTO Chofer
(Cedula_Chofer, Nombre_Chofer, Apellido_Chofer, Telefono)
VALUES
('66666666', 'Carlos', 'Perez', '099111111'),
('77777777', 'Martin', 'Gomez', '099222222'),
('88888888', 'Jorge', 'Silva', '099333333'),
('99999999', 'Andres', 'Diaz', '099444444'),
('10101010', 'Fernando', 'Suarez', '099555555');

INSERT INTO Vehiculo
(Matricula, Modelo, Capacidad, Tipo_Vehiculo)
VALUES
('ABC1234', 'Mercedes', 2, 'Ambulancia'),
('DEF5678', 'Renault', 3, 'Ambulancia'),
('GHI9012', 'Fiat', 2, 'Ambulancia'),
('JKL3456', 'Toyota', 4, 'Ambulancia'),
('MNO7890', 'Ford', 3, 'Ambulancia');

INSERT INTO Destino
(ID_Destino, Nombre, Direccion, Ruta)
VALUES
('DEST001', 'Hospital Clinicas', 'Av. Italia 2870', 'Ruta 1'),
('DEST002', 'Hospital Maciel', '25 de Mayo 174', 'Ruta 2'),
('DEST003', 'Hospital Pasteur', 'Av. Gral. Flores 1621', 'Ruta 3'),
('DEST004', 'Hospital Pereira Rossell', 'Bvar. Artigas 1550', 'Ruta 4'),
('DEST005', 'Hospital Español', 'Av. Gral. Flores 1529', 'Ruta 5');

INSERT INTO Trasladable
(ID_Trasladable, Piso_Retiro, Habitacion_Retiro)
VALUES
('TRAS001', 1, 101),
('TRAS002', 2, 205),
('TRAS003', 3, 310),
('TRAS004', 4, 402),
('TRAS005', 5, 515),
('TRAS006', 1, 110),
('TRAS007', 2, 215),
('TRAS008', 3, 320),
('TRAS009', 4, 425),
('TRAS010', 5, 530);

INSERT INTO Paciente
(ID_Trasladable, CI, Nombre, Accesorio, Camilla, Oxigeno, Aislamiento)
VALUES
('TRAS001', '12345678', 'Juan Perez', 'Bastón', 'De emergencia', FALSE, FALSE),
('TRAS002', '23456789', 'Ana Gomez', 'Silla de ruedas', 'Normal', FALSE, FALSE),
('TRAS003', '34567890', 'Luis Rodriguez', 'Bastón', 'Normal', FALSE, FALSE),
('TRAS004', '45678901', 'Maria Fernandez', 'Ninguno', 'De emergencia', TRUE, TRUE),
('TRAS005', '56789012', 'Carlos Martinez', 'Silla de ruedas', 'Normal', TRUE, FALSE);

INSERT INTO Elemento
(ID_Trasladable, Nombre, Descripcion, Tipo_Elemento)
VALUES
('TRAS006', 'Higado', 'Higado de donante', 'Organo'),
('TRAS007', 'Archivos', 'Archivos de pacientes', 'Documentos'),
('TRAS008', 'Riñon', 'Riñon de donante', 'Organo'),
('TRAS009', 'Documentación', 'Documentacion CASO-03', 'Documentos'),
('TRAS010', 'Archivos', 'Archivos de pacientes', 'Documentos');

INSERT INTO Traslado
(ID_Traslado, Fecha, Hora_Salida, Hora_Llegada, Estado, Lugar_Origen,
 Cedula_Chofer, Cedula_Enfermero, Matricula, ID_Destino)
VALUES
('T001', '2026-08-01', '08:00:00', '08:30:00', 'Aprobado',
 'Hospital Clinicas', '66666666', '11111111', 'ABC1234', 'DEST001'),

('T002', '2026-08-05', '09:15:00', '09:50:00', 'Aprobado',
 'Hospital Maciel', '77777777', '22222222', 'DEF5678', 'DEST002'),

('T003', '2026-08-10', '10:00:00', '10:40:00', 'Aprobado',
 'Hospital Pasteur', '88888888', '33333333', 'GHI9012', 'DEST003'),

('T004', '2026-08-15', '11:30:00', '12:10:00', 'En proceso',
 'Hospital Clinicas', '99999999', '44444444', 'JKL3456', 'DEST004'),

('T005', '2026-08-20', '13:00:00', '13:45:00', 'Denegado',
 'Hospital Español', '10101010', '55555555', 'MNO7890', 'DEST005');

 INSERT INTO Transporta
(ID_Traslado, ID_Trasladable)
VALUES
('T001', 'TRAS001'),
('T002', 'TRAS002'),
('T003', 'TRAS003'),
('T004', 'TRAS004'),
('T005', 'TRAS005');
