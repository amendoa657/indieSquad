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