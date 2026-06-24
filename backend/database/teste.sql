use indieSquad;

select * from usuario;


DESCRIBE usuario;

alter table usuario
add unique (email);


alter table usuario
modify fotoDePerfil varchar(255);