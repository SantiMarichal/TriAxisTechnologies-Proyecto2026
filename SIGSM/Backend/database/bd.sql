CREATE DATABASE IF NOT EXISTS Proyecto2026;
USE Proyecto2026;

-- Módulo Documentación

-- DDL:
CREATE TABLE Administrativo (
    Cedula_Administrativo VARCHAR (10) PRIMARY KEY NOT NULL,
    Nombre_Administrativo VARCHAR (20) NOT NULL, 
    Apellido_Administrativo VARCHAR (20) NOT NULL,
    Contrasena VARCHAR (20) NOT NULL,
    Cargo VARCHAR (20) NOT NULL
);

CREATE TABLE Categorias (
    ID_Categoria VARCHAR (10) PRIMARY KEY NOT NULL,
    Nombre VARCHAR (20) NOT NULL
);

CREATE TABLE Encuesta (
    ID_Encuesta VARCHAR (10) PRIMARY KEY NOT NULL,
    Titulo VARCHAR (100) NOT NULL,
    Descripcion VARCHAR (200) NOT NULL,
    ID_Categoria VARCHAR (10) NOT NULL,
    FOREIGN KEY (ID_Categoria) REFERENCES Categorias(ID_Categoria)
);

CREATE TABLE Preguntas (
    ID_Pregunta VARCHAR (10) NOT NULL,
    ID_Encuesta VARCHAR (10) NOT NULL,
    Texto VARCHAR (200) NOT NULL,
    PRIMARY KEY (ID_Encuesta, ID_Pregunta),
    FOREIGN KEY (ID_Encuesta) REFERENCES Encuesta(ID_Encuesta)
);

CREATE TABLE Respuestas (
    ID_Respuesta VARCHAR(10) PRIMARY KEY NOT NULL,
    ID_Pregunta VARCHAR(10) NOT NULL,
    ID_Encuesta VARCHAR(10) NOT NULL,
    Texto VARCHAR(200) NOT NULL,
    FOREIGN KEY (ID_Encuesta, ID_Pregunta) REFERENCES Preguntas(ID_Encuesta, ID_Pregunta)
);

CREATE TABLE Documentos (
    ID_Documento VARCHAR (10) PRIMARY KEY NOT NULL,
    Titulo VARCHAR (100) NOT NULL,
    Descripcion VARCHAR (200) NOT NULL,
    ID_Categoria VARCHAR (10) NOT NULL,
    FOREIGN KEY (ID_Categoria) REFERENCES Categorias(ID_Categoria)
);

CREATE TABLE Carga (
    Cedula_Administrativo VARCHAR (10) NOT NULL,
    ID_Documento VARCHAR (10) NOT NULL,
    HoraYFecha datetime NOT NULL,
    PRIMARY KEY (Cedula_Administrativo, ID_Documento),
    FOREIGN KEY (Cedula_Administrativo) REFERENCES Administrativo(Cedula_Administrativo) ON DELETE CASCADE,
    FOREIGN KEY (ID_Documento) REFERENCES Documentos(ID_Documento)
);

-- DML:
INSERT INTO Administrativo (Cedula_Administrativo, Nombre_Administrativo, Apellido_Administrativo, Contrasena, Cargo) VALUES
('12345678', 'Juan', 'Perez', '123456', 'Administrativo'),
('23456789', 'Ana', 'Gomez', '234567', 'Administrativo'),
('34567890', 'Carlos', 'Rodriguez', '345678', 'Administrativo'),
('45678901', 'Maria', 'Fernandez', '456789', 'Administrativo'),
('56789012', 'Luis', 'Martinez', '567890', 'Administrativo');

INSERT INTO Categorias (ID_Categoria, Nombre) VALUES
('CAT001', 'Atencion'),
('CAT002', 'Limpieza'),
('CAT003', 'Instalaciones'),
('CAT004', 'Personal'),
('CAT005', 'Servicios');

INSERT INTO Encuesta (ID_Encuesta, Titulo, Descripcion, ID_Categoria) VALUES
('ENC001', 'Atencion recibida', 'Evaluacion de la atencion recibida en el hospital.', 'CAT001'),
('ENC002', 'Limpieza', 'Evaluacion de la limpieza de las instalaciones.', 'CAT002'),
('ENC003', 'Instalaciones', 'Evaluacion del estado de las instalaciones.', 'CAT003'),
('ENC004', 'Personal', 'Evaluacion del trato recibido por el personal.', 'CAT004'),
('ENC005', 'Servicios', 'Evaluacion general de los servicios ofrecidos.', 'CAT005');

INSERT INTO Preguntas (ID_Pregunta, ID_Encuesta, Texto) VALUES
('P001', 'ENC001', '¿Que opinas de la limpieza?'),
('P002', 'ENC001', '¿Que opinas de la atención al cliente?'),
('P003', 'ENC002', '¿Que opinas de la instalación?'),
('P004', 'ENC002', '¿Que opinas de la documentación digital?'),
('P005', 'ENC002', '¿Que opinas de los enfermeros?');

INSERT INTO Respuestas (ID_Respuesta, ID_Pregunta, ID_Encuesta, Texto) VALUES
('R001', 'P001', 'ENC001', 'Muy Bueno'),
('R002', 'P002', 'ENC001', 'Bueno'),
('R003', 'P003', 'ENC002', 'Regular'),
('R004', 'P004', 'ENC002', 'Malo'),
('R005', 'P005', 'ENC002', 'Muy Bueno');

INSERT INTO Documentos (ID_Documento, Titulo, Descripcion, ID_Categoria) VALUES
('DOC001', 'Reglamento', 'Reglamento general del hospital.', 'CAT001'),
('DOC002', 'Protocolo', 'Protocolo de atencion al paciente.', 'CAT002'),
('DOC003', 'Normativa', 'Normativa interna del hospital.', 'CAT003'),
('DOC004', 'Horarios', 'Horarios de atencion de los servicios.', 'CAT004'),
('DOC005', 'Informacion', 'Informacion general para los pacientes.', 'CAT005');

INSERT INTO Carga (Cedula_Administrativo, ID_Documento, HoraYFecha) VALUES
('12345678', 'DOC001', '2026-08-30 09:30:00'),
('23456789', 'DOC002', '2026-08-30 10:15:00'),
('34567890', 'DOC003', '2026-08-30 11:00:00'),
('45678901', 'DOC004', '2026-08-30 14:45:00'),
('56789012', 'DOC005', '2026-08-30 16:20:00');


-- Módulo Ambulancias

-- DDL:
CREATE TABLE Enfermero(
    Cedula_Enfermero VARCHAR (10) PRIMARY KEY NOT NULL,
    Nombre_Enfermero VARCHAR (20) NOT NULL,
    Apellido_Enfermero VARCHAR (20) NOT NULL,
    Contrasena VARCHAR (20) NOT NULL,
    Cargo VARCHAR (20) NOT NULL
);

CREATE TABLE Chofer(
    Cedula_Chofer VARCHAR (10) PRIMARY KEY NOT NULL,
    Nombre_Chofer VARCHAR (20) NOT NULL,
    Apellido_Chofer VARCHAR (20) NOT NULL,
    Telefono VARCHAR (10) NOT NULL
);

CREATE TABLE Vehiculo(
    Matricula VARCHAR (10) PRIMARY KEY NOT NULL,
    Modelo VARCHAR (10) NOT NULL,
    Capacidad INT NOT NULL,
    Tipo_Vehiculo ENUM('Ambulancia', 'Otro') NOT NULL
);

CREATE TABLE Destino(
    ID_Destino VARCHAR (10) PRIMARY KEY NOT NULL,
    Nombre VARCHAR (20) NOT NULL,
    Direccion VARCHAR (100) NOT NULL,
    Ruta VARCHAR (100) NOT NULL
);

CREATE TABLE Trasladable(
    ID_Trasladable INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
    Piso_Retiro INT NOT NULL,
    Habitacion_Retiro INT NOT NULL
);

CREATE TABLE Traslado(
    ID_Traslado INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Fecha DATE NOT NULL,
    Hora_Salida TIME NOT NULL,
    Hora_Llegada TIME NOT NULL,
    Estado ENUM('Aprobado', 'Denegado', 'En proceso') NOT NULL,
    Lugar_Origen VARCHAR (100) NOT NULL,
    Cedula_Chofer VARCHAR (10) NOT NULL,
    Cedula_Enfermero VARCHAR (10) NOT NULL,
    Matricula VARCHAR (10) NOT NULL,
    ID_Destino VARCHAR (10) NOT NULL,
    FOREIGN KEY (Cedula_Chofer) REFERENCES Chofer(Cedula_Chofer),
    FOREIGN KEY (Cedula_Enfermero) REFERENCES Enfermero(Cedula_Enfermero) ON DELETE CASCADE,
    FOREIGN KEY (Matricula) REFERENCES Vehiculo(Matricula),
    FOREIGN KEY (ID_Destino) REFERENCES Destino(ID_Destino)
);

CREATE TABLE Paciente(
    ID_Trasladable INT PRIMARY KEY NOT NULL,
    CI VARCHAR(10) UNIQUE NOT NULL,
    Nombre VARCHAR (20) NOT NULL,
    Accesorio ENUM('Bastón', 'Silla de ruedas', 'Otro', 'Ninguno') NOT NULL,
    Camilla ENUM('De emergencia', 'Normal') NOT NULL, 
    Oxigeno BOOLEAN DEFAULT FALSE NOT NULL,
    Aislamiento BOOLEAN DEFAULT FALSE NOT NULL,
    FOREIGN KEY (ID_Trasladable) REFERENCES Trasladable(ID_Trasladable)
);

CREATE TABLE Elemento(
    ID_Trasladable INT PRIMARY KEY NOT NULL,
    Nombre VARCHAR (20) NOT NULL,
    Descripcion VARCHAR (200) NOT NULL,
    Tipo_Elemento ENUM('Organo', 'Documentos', 'Otro') NOT NULL,
    FOREIGN KEY (ID_Trasladable) REFERENCES Trasladable(ID_Trasladable)
);

CREATE TABLE Transporta(
    ID_Traslado INT NOT NULL,
    ID_Trasladable INT NOT NULL,
    PRIMARY KEY (ID_Traslado, ID_Trasladable),
    FOREIGN KEY (ID_Traslado) REFERENCES Traslado(ID_Traslado) ON DELETE CASCADE,
    FOREIGN KEY (ID_Trasladable) REFERENCES Trasladable(ID_Trasladable) ON DELETE CASCADE
);

-- DML:
INSERT INTO Enfermero
(Cedula_Enfermero, Nombre_Enfermero, Apellido_Enfermero, Contrasena, Cargo)
VALUES
('11111111', 'Pedro', 'Gonzalez', '123455', 'Enfermero'),
('22222222', 'Laura', 'Martinez', '123458', 'Enfermero'),
('33333333', 'Sofia', 'Rodriguez', '1234346', 'Enfermero'),
('44444444', 'Diego', 'Fernandez', '123453', 'Enfermero'),
('55555555', 'Valentina', 'Lopez', '123455', 'Enfermero');

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
(Piso_Retiro, Habitacion_Retiro)
VALUES
(1, 101),
(2, 205),
(3, 310),
(4, 402),
(5, 515),
(1, 110),
(2, 215),
(3, 320),
(4, 425),
(5, 530);

INSERT INTO Paciente
(ID_Trasladable, CI, Nombre, Accesorio, Camilla, Oxigeno, Aislamiento)
VALUES
(1, '12345678', 'Juan Perez', 'Bastón', 'De emergencia', FALSE, FALSE),
(2, '23456789', 'Ana Gomez', 'Silla de ruedas', 'Normal', FALSE, FALSE),
(3, '34567890', 'Luis Rodriguez', 'Bastón', 'Normal', FALSE, FALSE),
(4, '45678901', 'Maria Fernandez', 'Ninguno', 'De emergencia', TRUE, TRUE),
(5, '56789012', 'Carlos Martinez', 'Silla de ruedas', 'Normal', TRUE, FALSE);

INSERT INTO Elemento
(ID_Trasladable, Nombre, Descripcion, Tipo_Elemento)
VALUES
(6, 'Higado', 'Higado de donante', 'Organo'),
(7, 'Archivos', 'Archivos de pacientes', 'Documentos'),
(8, 'Riñon', 'Riñon de donante', 'Organo'),
(9, 'Documentación', 'Documentacion CASO-03', 'Documentos'),
(10, 'Archivos', 'Archivos de pacientes', 'Documentos');

INSERT INTO Traslado
(Fecha, Hora_Salida, Hora_Llegada, Estado, Lugar_Origen, Cedula_Chofer, Cedula_Enfermero, Matricula, ID_Destino)
VALUES
('2026-08-01', '08:00:00', '08:30:00', 'Aprobado', 'Hospital Clinicas', '66666666', '11111111', 'ABC1234', 'DEST001'),
('2026-08-05', '09:15:00', '09:50:00', 'Aprobado', 'Hospital Maciel', '77777777', '22222222', 'DEF5678', 'DEST002'),
('2026-08-10', '10:00:00', '10:40:00', 'Aprobado', 'Hospital Pasteur', '88888888', '33333333', 'GHI9012', 'DEST003');

INSERT INTO Transporta (ID_Traslado, ID_Trasladable) VALUES
(1, 1),
(2, 2),
(3, 3);

-- Tabla Administrador
CREATE TABLE Administrador(
    Cedula_Administrador VARCHAR (10) PRIMARY KEY NOT NULL,
    Nombre_Administrador VARCHAR (20) NOT NULL, 
    Apellido_Administrador VARCHAR (20) NOT NULL,
    Contrasena VARCHAR (20) NOT NULL,
    Cargo VARCHAR (20) NOT NULL
);

INSERT INTO Administrador
(Cedula_Administrador, Nombre_Administrador, Apellido_Administrador, Contrasena, Cargo)
VALUES
('90876533', 'Kenia', 'Kronberg', '1234', 'Administrador'),
('90876534', 'Santiago', 'da Rosa', '123', 'Administrador'),
('90876536', 'Joaquin', 'Estefan', '12344', 'Administrador'),
('90876535', 'Gennaro', 'Rodriguez', '12345', 'Administrador'),
('90876530', 'Valentina', 'Garcia', '12346', 'Administrador');