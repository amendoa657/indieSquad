-- atualizacao do banco da versao 1 pra versao 2

-- declara a codificacao do arquivo antes de qualquer coisa
SET NAMES utf8mb4;

use indieSquad;


-- usuario

-- o hash da senha passa de 160 caracteres, nao cabe mais em varchar(90)
alter table usuario
modify senha varchar(255) not null;

-- apelido unico usado na URL do perfil
alter table usuario
add column handle varchar(30) null after id;

update usuario
set handle = concat('usuario', id)
where handle is null;

alter table usuario
modify handle varchar(30) not null;

alter table usuario
add unique index handle_UNIQUE (handle);

-- montarEquipe, entrarProjeto ou ambos: decide a tela inicial do app
alter table usuario
add column objetivo varchar(45) not null default 'ambos';

alter table usuario
add column disponibilidadeHoras int null;

alter table usuario
add column aceitaPortfolio tinyint(1) not null default 0;

alter table usuario
add column aceitaRevenueShare tinyint(1) not null default 0;

alter table usuario
add column aceitaRemunerado tinyint(1) not null default 0;

-- atencao: as senhas antigas estao em texto puro e nao viram hash sozinhas


-- skills

alter table skills
add column categoria varchar(45) not null default 'Outro';

-- corrige o erro de digitacao que ficou gravado na versao 1
update skills
set nome = 'Programador'
where nome = 'Progamador';

alter table skills
add unique index nome_UNIQUE (nome);


-- skillUsuario

-- o nivel agora e de 1 a 4; os valores antigos estavam numa escala solta
update skillUsuario
set nivel = 4
where nivel > 4;

update skillUsuario
set nivel = 1
where nivel < 1;

alter table skillUsuario
modify nivel int not null default 1;


-- projeto

alter table projeto
add column genero varchar(45) null;

alter table projeto
add column engine varchar(45) null;

alter table projeto
add column tipoParceria varchar(45) null;

alter table projeto
add column duracaoEstimada varchar(45) null;

alter table projeto
add column dataConclusao datetime null;


-- vagaProjeto

update vagaProjeto
set titulo = 'Vaga'
where titulo is null;

alter table vagaProjeto
modify titulo varchar(45) not null;

alter table vagaProjeto
add column nivelMinimo int null;


-- candidaturaUsuario

-- na versao 1 a chave nao impedia a mesma pessoa de se candidatar varias vezes na mesma vaga
alter table candidaturaUsuario
drop primary key,
add primary key (id);

alter table candidaturaUsuario
modify mensagem mediumtext null;

alter table candidaturaUsuario
add unique index uq_candidatura_usuario_vaga (usuario_id, vagaProjeto_id);


-- avaliacao

alter table avaliacao
add column notaComunicacao int not null default 0;

alter table avaliacao
add column notaPrazo int not null default 0;

alter table avaliacao
add column notaQualidade int not null default 0;

alter table avaliacao
add column projeto_id int not null;

alter table avaliacao
add constraint fk_avaliacao_projeto1
foreign key (projeto_id) references projeto (id)
on delete cascade;

alter table avaliacao
add unique index uq_avaliacao_avaliador_avaliado_projeto (avaliador_id, avaliado_id, projeto_id);


-- tabelas novas

create table if not exists linkUsuario (
  id int not null auto_increment,
  tipo varchar(30) not null,
  url varchar(255) not null,
  usuario_id int not null,
  primary key (id),
  index fk_linkUsuario_usuario1_idx (usuario_id),
  constraint fk_linkUsuario_usuario1
    foreign key (usuario_id) references usuario (id)
    on delete cascade
) engine = InnoDB;


create table if not exists ferramenta (
  id int not null auto_increment,
  nome varchar(90) not null,
  categoria varchar(45) not null default 'Outro',
  primary key (id),
  unique index nome_UNIQUE (nome)
) engine = InnoDB;


create table if not exists ferramentaUsuario (
  ferramenta_id int not null,
  usuario_id int not null,
  primary key (ferramenta_id, usuario_id),
  index fk_ferramenta_has_usuario_usuario1_idx (usuario_id),
  constraint fk_ferramenta_has_usuario_ferramenta1
    foreign key (ferramenta_id) references ferramenta (id)
    on delete cascade,
  constraint fk_ferramenta_has_usuario_usuario1
    foreign key (usuario_id) references usuario (id)
    on delete cascade
) engine = InnoDB;


create table if not exists marcoProjeto (
  id int not null auto_increment,
  titulo varchar(90) not null,
  concluido tinyint(1) not null default 0,
  ordem int not null default 0,
  projeto_id int not null,
  primary key (id),
  index fk_marcoProjeto_projeto1_idx (projeto_id),
  constraint fk_marcoProjeto_projeto1
    foreign key (projeto_id) references projeto (id)
    on delete cascade
) engine = InnoDB;
