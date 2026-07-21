INSERT INTO SUBDIRECCION (NOMBRE, DESCRIPCION) VALUES
('Subdireccion Administrativa', 'Area encargada de administracion y recursos humanos'),
('Subdireccion Tecnologia', 'Area de sistemas y desarrollo tecnologico'),
('Subdireccion Financiera', 'Area financiera y contable');

INSERT INTO PUESTO (NOMBRE, DESCRIPCION, NIVEL) VALUES
('Director General', 'Responsable de direccion institucional', 'Ejecutivo'),
('Gerente Administrativo', 'Gestion administrativa', 'Gerencial'),
('Analista Programador', 'Desarrollo de sistemas', 'Profesional'),
('Administrador de Base de Datos', 'Gestion de bases de datos', 'Profesional'),
('Contador', 'Procesos contables', 'Profesional'),
('Analista Recursos Humanos', 'Gestion del talento humano', 'Profesional'),
('Secretaria', 'Apoyo administrativo', 'Operativo'),
('Tecnico Soporte', 'Soporte tecnologico', 'Tecnico'),
('Supervisor', 'Supervision operativa', 'Tecnico'),
('Auxiliar Administrativo', 'Apoyo general', 'Operativo');

INSERT INTO TIPO_CONTRATO (NOMBRE, DESCRIPCION) VALUES
('Indefinido', 'Contrato permanente'),
('Temporal', 'Contrato por tiempo definido'),
('Servicios Profesionales', 'Contrato por servicios');

INSERT INTO EMPLEADO
(NOMBRES, APELLIDOS, DPI, NIT, FECHA_NACIMIENTO, FECHA_INGRESO, CORREO, TELEFONO, DIRECCION)
VALUES
('Carlos','Gonzalez','100000001','1234567-1','1990-01-15','2020-01-10','carlos.gonzalez@email.com','55510001','Zona 1'),
('Maria','Perez','100000002','1234567-2','1992-03-20','2021-02-15','maria.perez@email.com','55510002','Zona 2'),
('Jose','Lopez','100000003','1234567-3','1988-05-10','2019-05-20','jose.lopez@email.com','55510003','Zona 3'),
('Ana','Martinez','100000004','1234567-4','1995-07-25','2022-01-05','ana.martinez@email.com','55510004','Zona 4'),
('Luis','Ramirez','100000005','1234567-5','1991-09-12','2020-06-18','luis.ramirez@email.com','55510005','Zona 5'),

('Pedro','Hernandez','100000006','1234567-6','1987-11-01','2018-04-10','pedro.h@email.com','55510006','Zona 6'),
('Laura','Castillo','100000007','1234567-7','1993-02-14','2021-08-01','laura.castillo@email.com','55510007','Zona 7'),
('Miguel','Morales','100000008','1234567-8','1989-06-22','2019-09-15','miguel.morales@email.com','55510008','Zona 8'),
('Sofia','Vasquez','100000009','1234567-9','1996-12-05','2023-01-10','sofia.v@email.com','55510009','Zona 9'),
('Daniel','Ruiz','100000010','1234567-10','1994-04-18','2022-03-20','daniel.ruiz@email.com','55510010','Zona 10'),

('Andrea','Mendoza','100000011','1234567-11','1990-08-30','2020-07-15','andrea.m@email.com','55510011','Zona 11'),
('Ricardo','Santos','100000012','1234567-12','1985-10-11','2017-05-12','ricardo.s@email.com','55510012','Zona 12'),
('Gabriela','Diaz','100000013','1234567-13','1997-01-19','2023-02-01','gabriela.d@email.com','55510013','Zona 13'),
('Oscar','Flores','100000014','1234567-14','1986-03-03','2018-08-22','oscar.f@email.com','55510014','Zona 14'),
('Patricia','Ortiz','100000015','1234567-15','1992-09-09','2021-11-11','patricia.o@email.com','55510015','Zona 15'),

('Fernando','Cruz','100000016','1234567-16','1991-12-12','2020-10-10','fernando.c@email.com','55510016','Zona 16'),
('Rosa','Herrera','100000017','1234567-17','1993-04-04','2022-06-01','rosa.h@email.com','55510017','Zona 17'),
('Jorge','Reyes','100000018','1234567-18','1988-07-07','2019-12-01','jorge.r@email.com','55510018','Zona 18'),
('Carmen','Molina','100000019','1234567-19','1995-05-05','2023-03-01','carmen.m@email.com','55510019','Zona 19'),
('Victor','Aguilar','100000020','1234567-20','1987-08-08','2018-01-15','victor.a@email.com','55510020','Zona 20'),

('Mario','Salazar','100000021','1234567-21','1990-02-02','2020-02-20','mario.s@email.com','55510021','Zona 21'),
('Elena','Pineda','100000022','1234567-22','1994-06-06','2022-09-09','elena.p@email.com','55510022','Zona 22'),
('Hugo','Mejia','100000023','1234567-23','1989-10-10','2019-03-03','hugo.m@email.com','55510023','Zona 23'),
('Claudia','Rojas','100000024','1234567-24','1996-11-11','2023-04-04','claudia.r@email.com','55510024','Zona 24'),
('Esteban','Vega','100000025','1234567-25','1992-12-12','2021-05-05','esteban.v@email.com','55510025','Zona 25'),

('Monica','Carrillo','100000026','1234567-26','1993-03-03','2022-07-07','monica.c@email.com','55510026','Zona 26'),
('Ivan','Soto','100000027','1234567-27','1988-01-01','2019-01-01','ivan.s@email.com','55510027','Zona 27'),
('Beatriz','Navas','100000028','1234567-28','1995-05-15','2023-05-01','beatriz.n@email.com','55510028','Zona 28'),
('Raul','Campos','100000029','1234567-29','1991-09-19','2020-09-09','raul.c@email.com','55510029','Zona 29'),
('Silvia','Estrada','100000030','1234567-30','1997-07-17','2024-01-01','silvia.e@email.com','55510030','Zona 30');

INSERT INTO DEPARTAMENTO
(ID_SUBDIRECCION, NOMBRE, DESCRIPCION, ID_JEFE)
VALUES
(1,'Recursos Humanos','Gestion del personal y contratos',2),
(1,'Administracion','Procesos administrativos internos',6),
(2,'Tecnologias de Informacion','Desarrollo y soporte tecnologico',3),
(3,'Finanzas','Control financiero y contable',5),
(1,'Compras','Adquisiciones institucionales',12);

INSERT INTO UNIDAD_FUNCIONAL
(ID_DEPARTAMENTO,NOMBRE,DESCRIPCION)
VALUES
(1,'Gestion Humana','Procesos relacionados al personal'),
(1,'Reclutamiento','Seleccion y contratacion'),
(2,'Servicios Administrativos','Administracion general'),
(3,'Desarrollo de Software','Creacion de sistemas'),
(3,'Infraestructura','Servidores y soporte'),
(4,'Contabilidad','Registro financiero'),
(5,'Adquisiciones','Compras institucionales');

INSERT INTO UNIDAD_OPERATIVA
(ID_UNIDAD_FUNCIONAL,NOMBRE,DESCRIPCION)
VALUES
(1,'Nomina','Administracion de pagos'),
(1,'Capacitacion','Formacion del personal'),
(2,'Contrataciones','Procesos de ingreso'),
(3,'Archivo','Control documental'),
(4,'Desarrollo Web','Aplicaciones internas'),
(4,'Bases de Datos','Administracion de informacion'),
(5,'Mesa de Ayuda','Soporte tecnico'),
(6,'Contabilidad General','Registro contable'),
(7,'Compras Generales','Gestion de proveedores');

INSERT INTO CONTRATO
(ID_EMPLEADO,ID_TIPO_CONTRATO,NUMERO_CONTRATO,FECHA_INICIO,FECHA_FIN,OBSERVACIONES)
VALUES
(1,1,'CTR-0001','2020-01-10',NULL,'Contrato indefinido'),
(2,1,'CTR-0002','2021-02-15',NULL,'Contrato indefinido'),
(3,1,'CTR-0003','2019-05-20',NULL,'Contrato indefinido'),
(4,2,'CTR-0004','2022-01-05','2024-01-05','Contrato temporal renovado'),
(5,1,'CTR-0005','2020-06-18',NULL,'Contrato indefinido'),

(6,1,'CTR-0006','2018-04-10',NULL,'Contrato indefinido'),
(7,1,'CTR-0007','2021-08-01',NULL,'Contrato indefinido'),
(8,2,'CTR-0008','2019-09-15','2023-09-15','Contrato temporal'),
(9,1,'CTR-0009','2023-01-10',NULL,'Contrato indefinido'),
(10,1,'CTR-0010','2022-03-20',NULL,'Contrato indefinido'),

(11,1,'CTR-0011','2020-07-15',NULL,'Contrato indefinido'),
(12,1,'CTR-0012','2017-05-12',NULL,'Contrato indefinido'),
(13,2,'CTR-0013','2023-02-01','2025-02-01','Contrato temporal'),
(14,1,'CTR-0014','2018-08-22',NULL,'Contrato indefinido'),
(15,1,'CTR-0015','2021-11-11',NULL,'Contrato indefinido'),

(16,1,'CTR-0016','2020-10-10',NULL,'Contrato indefinido'),
(17,2,'CTR-0017','2022-06-01','2025-06-01','Contrato temporal'),
(18,1,'CTR-0018','2019-12-01',NULL,'Contrato indefinido'),
(19,1,'CTR-0019','2023-03-01',NULL,'Contrato indefinido'),
(20,1,'CTR-0020','2018-01-15',NULL,'Contrato indefinido'),

(21,1,'CTR-0021','2020-02-20',NULL,'Contrato indefinido'),
(22,2,'CTR-0022','2022-09-09','2024-09-09','Contrato temporal'),
(23,1,'CTR-0023','2019-03-03',NULL,'Contrato indefinido'),
(24,1,'CTR-0024','2023-04-04',NULL,'Contrato indefinido'),
(25,1,'CTR-0025','2021-05-05',NULL,'Contrato indefinido'),

(26,1,'CTR-0026','2022-07-07',NULL,'Contrato indefinido'),
(27,1,'CTR-0027','2019-01-01',NULL,'Contrato indefinido'),
(28,2,'CTR-0028','2023-05-01','2025-05-01','Contrato temporal'),
(29,1,'CTR-0029','2020-09-09',NULL,'Contrato indefinido'),
(30,1,'CTR-0030','2024-01-01',NULL,'Contrato indefinido');


INSERT INTO HISTORIAL_PUESTOS
(ID_EMPLEADO,ID_PUESTO,FECHA_INICIO,FECHA_FIN,MOTIVO)
VALUES
(1,10,'2020-01-10','2021-12-31','Ingreso inicial'),
(1,6,'2022-01-01',NULL,'Ascenso a RRHH'),

(2,7,'2021-02-15','2022-12-31','Ingreso inicial'),
(2,6,'2023-01-01',NULL,'Cambio de puesto'),

(3,8,'2019-05-20','2020-12-31','Ingreso inicial'),
(3,3,'2021-01-01',NULL,'Promocion desarrollo'),

(4,10,'2022-01-05',NULL,'Ingreso inicial'),

(5,5,'2020-06-18','2022-12-31','Ingreso inicial'),
(5,2,'2023-01-01',NULL,'Ascenso administrativo'),

(6,9,'2018-04-10',NULL,'Ingreso inicial'),

(7,7,'2021-08-01',NULL,'Ingreso inicial'),

(8,8,'2019-09-15',NULL,'Ingreso inicial'),

(9,3,'2023-01-10',NULL,'Ingreso inicial'),

(10,4,'2022-03-20',NULL,'Ingreso inicial'),

(11,6,'2020-07-15',NULL,'Ingreso inicial'),

(12,2,'2017-05-12',NULL,'Ingreso inicial'),

(13,10,'2023-02-01',NULL,'Ingreso inicial'),

(14,5,'2018-08-22',NULL,'Ingreso inicial'),

(15,7,'2021-11-11',NULL,'Ingreso inicial');

INSERT INTO HISTORIAL_PUESTOS
(ID_EMPLEADO,ID_PUESTO,FECHA_INICIO,FECHA_FIN,MOTIVO)
VALUES
(16,3,'2020-10-10','2022-12-31','Ingreso inicial'),
(16,4,'2023-01-01',NULL,'Cambio a administrador BD'),

(17,10,'2022-06-01',NULL,'Ingreso inicial'),

(18,9,'2019-12-01','2021-12-31','Ingreso inicial'),
(18,2,'2022-01-01',NULL,'Ascenso supervisor'),

(19,7,'2023-03-01',NULL,'Ingreso inicial'),

(20,5,'2018-01-15',NULL,'Ingreso inicial'),

(21,8,'2020-02-20','2022-06-30','Ingreso inicial'),
(21,3,'2022-07-01',NULL,'Cambio desarrollo'),

(22,10,'2022-09-09',NULL,'Ingreso inicial'),

(23,3,'2019-03-03',NULL,'Ingreso inicial'),

(24,7,'2023-04-04',NULL,'Ingreso inicial'),

(25,9,'2021-05-05',NULL,'Ingreso inicial'),

(26,6,'2022-07-07',NULL,'Ingreso inicial'),

(27,8,'2019-01-01',NULL,'Ingreso inicial'),

(28,10,'2023-05-01',NULL,'Ingreso inicial'),

(29,3,'2020-09-09','2023-12-31','Ingreso inicial'),
(29,1,'2024-01-01',NULL,'Ascenso director'),

(30,7,'2024-01-01',NULL,'Ingreso inicial');


INSERT INTO HISTORIAL_DEPARTAMENTOS
(ID_EMPLEADO,ID_UNIDAD_OPERATIVA,FECHA_INICIO,FECHA_FIN,MOTIVO)
VALUES
(1,1,'2020-01-10',NULL,'Ingreso RRHH'),

(2,2,'2021-02-15','2022-12-31','Reclutamiento'),
(2,1,'2023-01-01',NULL,'Cambio de area'),

(3,5,'2019-05-20','2020-12-31','Soporte inicial'),
(3,6,'2021-01-01',NULL,'Desarrollo sistemas'),

(4,3,'2022-01-05',NULL,'Contrataciones'),

(5,8,'2020-06-18',NULL,'Contabilidad'),

(6,7,'2018-04-10',NULL,'Mesa de ayuda'),

(7,2,'2021-08-01',NULL,'Capacitacion'),

(8,7,'2019-09-15',NULL,'Soporte'),

(10,6,'2022-03-20',NULL,'Base de datos'),

(11,1,'2020-07-15',NULL,'Gestion humana'),

(12,3,'2017-05-12',NULL,'Administracion'),

(13,4,'2023-02-01',NULL,'Archivo'),

(14,8,'2018-08-22',NULL,'Contabilidad'),

(15,9,'2021-11-11',NULL,'Compras'),

(16,6,'2020-10-10',NULL,'Bases de datos'),

(17,3,'2022-06-01',NULL,'Contrataciones'),

(18,7,'2019-12-01',NULL,'Soporte'),

(19,2,'2023-03-01',NULL,'Capacitacion'),

(20,8,'2018-01-15',NULL,'Contabilidad'),
(21,6,'2022-07-01','2024-07-31','Ingreso inicial'),
(21,5,'2024-08-01','2024-12-31','Cambio a Desarrollo Web'),
(21,6,'2025-01-01','2025-05-31','Cambio a Bases de Datos'),
(21,7,'2025-06-01','2025-10-31','Cambio a Mesa de Ayuda'),
(21,3,'2025-11-01',NULL,'Cambio a Contrataciones'),

(22,3,'2022-09-09',NULL,'Administracion'),

(23,5,'2019-03-03','2024-08-31','Ingreso inicial'),
(23,1,'2024-09-01','2025-01-31','Cambio a Nomina'),
(23,2,'2025-02-01','2025-05-31','Cambio a Capacitacion'),
(23,3,'2025-06-01','2025-10-31','Cambio a Contrataciones'),
(23,4,'2025-11-01',NULL,'Cambio a Desarrollo Web'),

(24,1,'2023-04-04',NULL,'RRHH'),

(25,7,'2021-05-05',NULL,'Soporte'),

(26,2,'2022-07-07',NULL,'Capacitacion'),

(27,7,'2019-01-01',NULL,'Soporte'),

(28,3,'2023-05-01',NULL,'Contratos'),

(29,5,'2020-09-09',NULL,'Desarrollo'),

(30,2,'2024-01-01',NULL,'Capacitacion');

INSERT INTO HISTORIAL_SALARIOS
(ID_EMPLEADO,SALARIO,FECHA_INICIO,FECHA_FIN,MOTIVO)
VALUES
(1,4500,'2020-01-10','2022-12-31','Salario inicial'),
(1,6000,'2023-01-01',NULL,'Aumento anual'),

(2,4000,'2021-02-15','2023-12-31','Ingreso'),
(2,5500,'2024-01-01',NULL,'Ajuste salarial'),

(3,5000,'2019-05-20','2021-12-31','Ingreso'),
(3,8000,'2022-01-01',NULL,'Promocion'),

(4,3500,'2022-01-05',NULL,'Ingreso'),

(5,6500,'2020-06-18','2022-12-31','Ingreso'),
(5,9000,'2023-01-01',NULL,'Ascenso'),

(6,4500,'2018-04-10',NULL,'Ingreso'),

(7,3800,'2021-08-01',NULL,'Ingreso'),

(8,4200,'2019-09-15',NULL,'Ingreso'),

(9,7000,'2023-01-10',NULL,'Ingreso'),

(10,7500,'2022-03-20',NULL,'Ingreso'),

(11,5000,'2020-07-15',NULL,'Ingreso'),

(12,8500,'2017-05-12',NULL,'Ingreso'),

(13,3200,'2023-02-01',NULL,'Ingreso'),

(14,6500,'2018-08-22',NULL,'Ingreso'),

(15,4000,'2021-11-11',NULL,'Ingreso'),

(16,7000,'2020-10-10',NULL,'Ingreso'),

(17,3500,'2022-06-01',NULL,'Ingreso'),

(18,6000,'2019-12-01',NULL,'Ingreso'),

(19,3000,'2023-03-01',NULL,'Ingreso'),

(20,6500,'2018-01-15',NULL,'Ingreso'),

(21,7000,'2020-02-20',NULL,'Ingreso'),

(22,3500,'2022-09-09',NULL,'Ingreso'),

(23,7500,'2019-03-03',NULL,'Ingreso'),

(24,4000,'2023-04-04',NULL,'Ingreso'),

(25,4500,'2021-05-05',NULL,'Ingreso'),

(26,5500,'2022-07-07',NULL,'Ingreso'),

(27,4200,'2019-01-01',NULL,'Ingreso'),

(28,3500,'2023-05-01',NULL,'Ingreso'),

(29,9000,'2020-09-09','2023-12-31','Ingreso'),
(29,12000,'2024-01-01',NULL,'Ascenso'),

(30,3000,'2024-01-01',NULL,'Ingreso');
