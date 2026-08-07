use indieSquad;

select * from usuario;


DESCRIBE usuario;

alter table usuario
add unique (email);


alter table usuario
modify fotoDePerfil varchar(255);

select * from projeto;
alter table projeto
add column logoProjeto VARCHAR(255);

select * from membroProjeto;
alter table membroProjeto
add column cargo varchar(30);


select * from skillUsuario;

alter table skillUsuario
modify nivel int not null;


insert into skills (nome) values ("Progamador");

select * from skills;

describe skillUsuario;


select * from vagaProjeto;

alter table vagaProjeto
add column titulo varchar(45);

alter table vagaProjeto
add column dataCriacao datetime;