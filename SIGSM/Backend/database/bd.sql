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
    ID_Categoria INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Nombre VARCHAR (20) NOT NULL
);

CREATE TABLE Encuesta (
    ID_Encuesta INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    Titulo VARCHAR (100) NOT NULL,
    Descripcion VARCHAR (200) NOT NULL,
    ID_Categoria INT NOT NULL,
    FOREIGN KEY (ID_Categoria) REFERENCES Categorias(ID_Categoria)
);

CREATE TABLE Preguntas (
    ID_Pregunta INT AUTO_INCREMENT NOT NULL,
    ID_Encuesta INT NOT NULL,
    Texto VARCHAR (200) NOT NULL,
    PRIMARY KEY (ID_Pregunta, ID_Encuesta),
    FOREIGN KEY (ID_Encuesta) REFERENCES Encuesta(ID_Encuesta)
);

CREATE TABLE Respuestas (
    ID_Respuesta INT AUTO_INCREMENT PRIMARY KEY NOT NULL,
    ID_Pregunta INT NOT NULL,
    ID_Encuesta INT NOT NULL,
    Texto VARCHAR(200) NOT NULL,
    Cantidad_Votos INT DEFAULT 0 NOT NULL,
    FOREIGN KEY (ID_Encuesta, ID_Pregunta) REFERENCES Preguntas(ID_Encuesta, ID_Pregunta)
);

CREATE TABLE Documentos (
    ID_Documento INT PRIMARY KEY AUTO_INCREMENT NOT NULL,
    CI_Usuario VARCHAR(10),
    Titulo VARCHAR (100) NOT NULL,
    Descripcion VARCHAR (200) NOT NULL,
    ID_Categoria INT NOT NULL,
    Estado VARCHAR (20) NOT NULL,
    Nombre_archivo VARCHAR(255),
    Ruta_archivo VARCHAR(1000),
    FOREIGN KEY (ID_Categoria) REFERENCES Categorias(ID_Categoria)
);

CREATE TABLE Carga (
    Cedula_Administrativo VARCHAR (10) NOT NULL,
    ID_Documento INT NOT NULL,
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
(1, 'Atencion'),
(2, 'Limpieza'),
(3, 'Instalaciones'),
(4, 'Personal'),
(5, 'Servicios');

INSERT INTO Encuesta (ID_Encuesta, Titulo, Descripcion, ID_Categoria) VALUES
(1, 'Atencion recibida', 'Evaluacion de la atencion recibida en el hospital.', 1),
(2, 'Limpieza', 'Evaluacion de la limpieza de las instalaciones.', 2),
(3, 'Instalaciones', 'Evaluacion del estado de las instalaciones.', 3),
(4, 'Personal', 'Evaluacion del trato recibido por el personal.', 4),
(5, 'Servicios', 'Evaluacion general de los servicios ofrecidos.', 5);

INSERT INTO Preguntas (ID_Pregunta, ID_Encuesta, Texto) VALUES
(1, 1, '¿Que opinas de la limpieza?'),
(2, 1, '¿Que opinas de la atención al cliente?'),
(3, 2, '¿Que opinas de la instalación?'),
(4, 2, '¿Que opinas de la documentación digital?'),
(5, 2, '¿Que opinas de los enfermeros?'),
(1, 3, '¿Cómo califica el estado general de las instalaciones?'),
(2, 3, '¿Las áreas comunes se encontraban accesibles y señalizadas?'),
(1, 4, '¿Cómo evalúa la amabilidad y el trato del personal?'),
(2, 4, '¿El personal respondió a sus inquietudes con claridad?'),
(1, 5, '¿Cómo califica la eficiencia de los servicios ofrecidos?'),
(2, 5, '¿Utilizaría nuevamente los servicios de este centro?');

INSERT INTO Respuestas (ID_Respuesta, ID_Pregunta, ID_Encuesta, Texto) VALUES
(1, 1, 1, 'Muy Bueno'),
(2, 1, 1, 'Bueno'),
(3, 1, 1, 'Regular'),
(4, 1, 1, 'Malo'),
(5, 2, 1, 'Muy Bueno'),
(6, 2, 1, 'Bueno'),
(7, 2, 1, 'Regular'),
(8, 2, 1, 'Malo'),
(9, 3, 2, 'Muy Bueno'),
(10, 3, 2, 'Bueno'),
(11, 3, 2, 'Regular'),
(12, 3, 2, 'Malo'),
(13, 4, 2, 'Muy Bueno'),
(14, 4, 2, 'Bueno'),
(15, 4, 2, 'Regular'),
(16, 4, 2, 'Malo'),
(17, 5, 2, 'Muy Bueno'),
(18, 5, 2, 'Bueno'),
(19, 5, 2, 'Regular'),
(20, 5, 2, 'Malo'),
(21, 1, 3, 'Muy Bueno'),
(22, 1, 3, 'Bueno'),
(23, 1, 3, 'Regular'),
(24, 1, 3, 'Malo'),
(25, 2, 3, 'Muy Bueno'),
(26, 2, 3, 'Bueno'),
(27, 2, 3, 'Regular'),
(28, 2, 3, 'Malo'),
(29, 1, 4, 'Muy Bueno'),
(30, 1, 4, 'Bueno'),
(31, 1, 4, 'Regular'),
(32, 1, 4, 'Malo'),
(33, 2, 4, 'Muy Bueno'),
(34, 2, 4, 'Bueno'),
(35, 2, 4, 'Regular'),
(36, 2, 4, 'Malo'),
(37, 1, 5, 'Muy Bueno'),
(38, 1, 5, 'Bueno'),
(39, 1, 5, 'Regular'),
(40, 1, 5, 'Malo'),
(41, 2, 5, 'Sí'),
(42, 2, 5, 'No');

INSERT INTO Documentos (ID_Documento, CI_Usuario, Titulo, Descripcion, ID_Categoria, Estado) VALUES
(1, '1111111', 'Reglamento', 'Reglamento general del hospital.', 1, 'Aprobado'),
(2, '2222222', 'Protocolo', 'Protocolo de atencion al paciente.', 2, 'Aprobado'),
(3, '3333333', 'Normativa', 'Normativa interna del hospital.', 3, 'Aprobado'),
(4, '4444444', 'Horarios', 'Horarios de atencion de los servicios.', 4, 'Aprobado'),
(5, '5555555', 'Informacion', 'Informacion general para los pacientes.', 5, 'Aprobado');

INSERT INTO Carga (Cedula_Administrativo, ID_Documento, HoraYFecha) VALUES
('12345678', 1, '2026-08-30 09:30:00'),
('23456789', 2, '2026-08-30 10:15:00'),
('34567890', 3, '2026-08-30 11:00:00'),
('45678901', 4, '2026-08-30 14:45:00'),
('56789012', 5, '2026-08-30 16:20:00');


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

CREATE TABLE Paciente (
    CI VARCHAR(10) PRIMARY KEY NOT NULL,
    Nombre VARCHAR(50) NOT NULL
);

CREATE TABLE Trasladable (
    ID_Trasladable INT AUTO_INCREMENT PRIMARY KEY NOT NULL, 
    Piso_Retiro INT NOT NULL,
    Habitacion_Retiro INT NOT NULL,
    CI VARCHAR(10) NULL, 
    Camilla ENUM('De emergencia', 'Normal') NULL, 
    Oxigeno BOOLEAN DEFAULT FALSE,
    Aislamiento BOOLEAN DEFAULT FALSE,
    Accesorio ENUM('Bastón', 'Silla de ruedas', 'Otro', 'Ninguno') NULL,
    FOREIGN KEY (CI) REFERENCES Paciente(CI) ON DELETE CASCADE
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

INSERT INTO Paciente (CI, Nombre)
VALUES
('12345678', 'Juan Perez'),
('23456789', 'Ana Gomez'),
('34567890', 'Luis Rodriguez'),
('45678901', 'Maria Fernandez'),
('56789012', 'Carlos Martinez');

INSERT INTO Trasladable (Piso_Retiro, Habitacion_Retiro, CI, Camilla, Oxigeno, Aislamiento, Accesorio)
VALUES
-- Traslados de Pacientes (IDs 1 al 5)
(1, 101, '12345678', 'De emergencia', FALSE, FALSE, 'Bastón'),
(2, 205, '23456789', 'Normal', FALSE, FALSE, 'Silla de ruedas'),
(3, 310, '34567890', 'Normal', FALSE, FALSE, 'Bastón'),
(4, 402, '45678901', 'De emergencia', TRUE, TRUE, 'Ninguno'),
(5, 515, '56789012', 'Normal', TRUE, FALSE, 'Silla de ruedas'),
(1, 110, NULL, NULL, NULL, NULL, NULL),
(2, 220, NULL, NULL, NULL, NULL, NULL),
(3, 330, NULL, NULL, NULL, NULL, NULL),
(4, 440, NULL, NULL, NULL, NULL, NULL),
(5, 550, NULL, NULL, NULL, NULL, NULL),
(2, 215, NULL, NULL, NULL, NULL, NULL),
(3, 320, NULL, NULL, NULL, NULL, NULL),
(4, 425, NULL, NULL, NULL, NULL, NULL),
(5, 530, NULL, NULL, NULL, NULL, NULL);

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