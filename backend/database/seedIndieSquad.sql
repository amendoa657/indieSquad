-- Dados iniciais do IndieSquad.
--
-- A primeira parte (catalogo de funcoes e ferramentas) e obrigatoria: o app
-- espera que essas listas existam.
-- A segunda parte sao dados de exemplo pra demonstracao, da pra nao rodar.
--
-- Rode esse script depois do scriptCreateIndieSquadV2.sql.

-- Declara a codificacao do arquivo antes de qualquer coisa.
--
-- Sem essa linha, o cliente do MySQL usa a codificacao padrao dele (que em
-- muita maquina e latin1) e grava os acentos errados: o banco fica com
-- "ProduÃ§Ã£o" no lugar de "Produção". O terminal ainda mostra certo, porque
-- le de volta com a mesma codificacao errada, mas a API mostra o lixo.
SET NAMES utf8mb4;

use indieSquad;


-- -----------------------------------------------------
-- Catalogo de funcoes (obrigatorio)
--
-- O usuario escolhe de uma lista, nao digita livre. E isso que impede o banco
-- de encher de duplicata ("Programador", "programador", "Progamador", "Dev").
-- -----------------------------------------------------

insert into skills (nome, categoria) values
  ('Programador', 'Programação'),
  ('Programador de Gameplay', 'Programação'),
  ('Programador de Engine', 'Programação'),
  ('Tech Artist', 'Programação'),
  ('Artista 2D', 'Arte'),
  ('Artista 3D', 'Arte'),
  ('Pixel Artist', 'Arte'),
  ('Animador', 'Arte'),
  ('Concept Artist', 'Arte'),
  ('Ilustrador', 'Arte'),
  ('Compositor', 'Áudio'),
  ('Sound Designer', 'Áudio'),
  ('Dublador', 'Áudio'),
  ('Game Designer', 'Design'),
  ('Level Designer', 'Design'),
  ('Narrative Designer', 'Design'),
  ('Roteirista', 'Design'),
  ('UI/UX Designer', 'Design'),
  ('Produtor', 'Produção'),
  ('QA Tester', 'Produção'),
  ('Community Manager', 'Produção'),
  ('Tradutor', 'Produção')
on duplicate key update categoria = values(categoria);


-- -----------------------------------------------------
-- Catalogo de ferramentas (obrigatorio)
-- -----------------------------------------------------

insert into ferramenta (nome, categoria) values
  ('Unity', 'Engine'),
  ('Godot', 'Engine'),
  ('Unreal Engine', 'Engine'),
  ('GameMaker', 'Engine'),
  ('Construct', 'Engine'),
  ('RPG Maker', 'Engine'),
  ('Bevy', 'Engine'),
  ('Blender', 'Arte'),
  ('Aseprite', 'Arte'),
  ('Photoshop', 'Arte'),
  ('Krita', 'Arte'),
  ('Spine', 'Arte'),
  ('Substance Painter', 'Arte'),
  ('FMOD', 'Áudio'),
  ('Wwise', 'Áudio'),
  ('Audacity', 'Áudio'),
  ('Reaper', 'Áudio'),
  ('FL Studio', 'Áudio'),
  ('Figma', 'Design'),
  ('Trello', 'Produção'),
  ('Git', 'Produção')
on duplicate key update categoria = values(categoria);


-- -----------------------------------------------------
-- Dados de exemplo (opcional, so pra demonstracao)
--
-- A senha de todos os usuarios de exemplo e: indiesquad123
-- O que esta gravado na coluna e o hash dela, nunca a senha em texto.
-- -----------------------------------------------------

insert into usuario
  (handle, usuario, email, senha, bio, objetivo, disponibilidadeHoras, aceitaPortfolio, aceitaRevenueShare, aceitaRemunerado, dataCriacao)
values
  ('thales', 'Thales Alves', 'thales@indiesquad.dev',
   'scrypt:32768:8:1$eeDZFwqc7OGfpDAU$59deff6d1a098f3a4651e4ad018252ad5b05761d9ec3932a1171d26dd7a1ff8b8e4ddaa83d638f033fa92889fd23d5fe97b81a5ea55ffc1268ca61104ca70acb',
   'Programador de gameplay. Passo o dia tentando fazer o pulo parecer bom.', 'montarEquipe', 20, 1, 1, 0, '2026-02-10 09:00:00'),

  ('italo', 'Ítalo Cunha', 'italo@indiesquad.dev',
   'scrypt:32768:8:1$bozQ5OeULJCnaOBX$3e3a7a829a24b09645d9beb0d1ae6bfb18d84fd6abc7f390478067ae0b5aea3a09c08bec7fbc7c93dd920d6661e3016972c7d85e35b954029d9dd4a21dc01861',
   'Game designer e level designer. Gosto de metroidvania e de puzzle ruim de propósito.', 'ambos', 15, 1, 1, 0, '2026-02-12 14:30:00'),

  ('laura', 'Laura Pacheco', 'laura@indiesquad.dev',
   'scrypt:32768:8:1$vwuqUHqbqYK4fVUr$9338e8b21a2a5b822c6bf8c695525ce97c7a2478f5bd795acf8b81c1c177c1d80456ec4bd969aa0f324489dee1530cc85c8fb7392a92d07e7b6b5996f2ecaea5',
   'Pixel artist e animadora. Aseprite aberto desde 2019.', 'entrarProjeto', 10, 1, 1, 1, '2026-03-01 11:15:00'),

  ('estevao', 'Estêvão Nery', 'estevao@indiesquad.dev',
   'scrypt:32768:8:1$rIl2vmtupR7LEsEa$22f7c278da4ff400b455c95ce5350c5588de544da30bc60267d1220c256a968cd9ca2f4eded9ec21208ff2653709e063e19a5bdb192e0c51b1c4b9b2d092cb9d',
   'Compositor e sound designer. Trilha de jogo é meu lugar favorito do mundo.', 'entrarProjeto', 8, 1, 0, 1, '2026-03-04 19:45:00'),

  ('lucas', 'Lucas Rocha', 'lucas@indiesquad.dev',
   'scrypt:32768:8:1$BksRkrmzjonAiwDv$65834f0ac85b23d68a8c646eb0ef7c73b17ecea62994fe5822add14696d5ca5fd7585b483d9205fe8524e9cc3bd1698db8a637a879d7a9e39c17167a5d4eb78c',
   'Artista 3D. Blender e café.', 'entrarProjeto', 25, 0, 1, 1, '2026-03-09 08:20:00'),

  ('heitor', 'Heitor Castro', 'heitor@indiesquad.dev',
   'scrypt:32768:8:1$8Hc615yv7vm7Gewk$acd41210eab3ff05b88d77027cfcdeec57351c15e4b11873632d040ccbf82ae73b427b4460c4bc3f4a480e81462a00cc3a48751852b1714a5f6fd12f5937cfe0',
   'Produtor. Sou a pessoa que lembra o grupo que tem prazo.', 'ambos', 12, 1, 1, 0, '2026-03-15 16:00:00');


-- Funcoes de cada pessoa (nivel: 1 Iniciante, 2 Intermediario, 3 Avancado, 4 Especialista)
insert into skillUsuario (skills_id, usuario_id, nivel)
select s.id, u.id, v.nivel
from (
  select 'thales' as handle, 'Programador de Gameplay' as skill, 3 as nivel union all
  select 'thales', 'Programador', 3 union all
  select 'italo', 'Game Designer', 3 union all
  select 'italo', 'Level Designer', 2 union all
  select 'laura', 'Pixel Artist', 4 union all
  select 'laura', 'Animador', 3 union all
  select 'estevao', 'Compositor', 3 union all
  select 'estevao', 'Sound Designer', 2 union all
  select 'lucas', 'Artista 3D', 3 union all
  select 'heitor', 'Produtor', 2 union all
  select 'heitor', 'QA Tester', 2
) as v
join usuario u on u.handle = v.handle
join skills s on s.nome = v.skill;


-- Ferramentas de cada pessoa
insert into ferramentaUsuario (ferramenta_id, usuario_id)
select f.id, u.id
from (
  select 'thales' as handle, 'Godot' as ferramenta union all
  select 'thales', 'Git' union all
  select 'italo', 'Godot' union all
  select 'italo', 'Figma' union all
  select 'laura', 'Aseprite' union all
  select 'laura', 'Spine' union all
  select 'estevao', 'FMOD' union all
  select 'estevao', 'Reaper' union all
  select 'lucas', 'Blender' union all
  select 'lucas', 'Substance Painter' union all
  select 'heitor', 'Trello'
) as v
join usuario u on u.handle = v.handle
join ferramenta f on f.nome = v.ferramenta;


-- Links de portfolio
insert into linkUsuario (tipo, url, usuario_id)
select v.tipo, v.url, u.id
from (
  select 'thales' as handle, 'github' as tipo, 'https://github.com/thales' as url union all
  select 'thales', 'itchio', 'https://thales.itch.io' union all
  select 'laura', 'artstation', 'https://artstation.com/laura' union all
  select 'laura', 'itchio', 'https://laura.itch.io' union all
  select 'estevao', 'site', 'https://estevaoaudio.com' union all
  select 'lucas', 'artstation', 'https://artstation.com/lucas'
) as v
join usuario u on u.handle = v.handle;


-- Projetos
insert into projeto
  (nome, descricao, status, genero, engine, tipoParceria, duracaoEstimada, dataCriacao, dataConclusao, criador_id)
select
  v.nome, v.descricao, v.status, v.genero, v.engine, v.tipoParceria, v.duracaoEstimada, v.dataCriacao, v.dataConclusao, u.id
from (
  select 'Hollow Signal' as nome,
         'Metroidvania 2D em pixel art sobre uma antena de rádio que capta vozes de um mundo que não existe mais. A protagonista explora uma cidade submersa procurando a origem do sinal.' as descricao,
         'ativo' as status, 'Metroidvania' as genero, 'Godot' as engine,
         'revenueShare' as tipoParceria, '8 meses' as duracaoEstimada,
         '2026-03-02 10:00:00' as dataCriacao, null as dataConclusao, 'thales' as handle
  union all
  select 'Zé Gotinha: O Retorno',
         'Plataforma cooperativo de 2 jogadores em que uma gota de água e uma gota de tinta precisam atravessar uma fábrica sem se misturar.',
         'ativo', 'Puzzle Plataforma', 'Unity', 'portfolio', '4 meses',
         '2026-03-20 15:30:00', null, 'italo'
  union all
  select 'Café da Última Estação',
         'Jogo narrativo curto de gerenciamento de cafeteria na última estação de trem antes do fim do mundo. Feito para uma game jam de 72 horas e finalizado depois.',
         'concluido', 'Narrativo', 'Godot', 'portfolio', '3 semanas',
         '2026-02-14 20:00:00', '2026-03-08 23:00:00', 'thales'
) as v
join usuario u on u.handle = v.handle;


-- Marcos dos projetos
insert into marcoProjeto (titulo, concluido, ordem, projeto_id)
select v.titulo, v.concluido, v.ordem, p.id
from (
  select 'Hollow Signal' as projeto, 'Protótipo jogável' as titulo, 1 as concluido, 1 as ordem union all
  select 'Hollow Signal', 'Primeira área completa', 1, 2 union all
  select 'Hollow Signal', 'Trilha sonora base', 0, 3 union all
  select 'Hollow Signal', 'Demo na Steam', 0, 4 union all
  select 'Zé Gotinha: O Retorno', 'Mecânica de mistura funcionando', 1, 1 union all
  select 'Zé Gotinha: O Retorno', '10 fases prontas', 0, 2 union all
  select 'Café da Última Estação', 'Build da jam', 1, 1 union all
  select 'Café da Última Estação', 'Versão final publicada', 1, 2
) as v
join projeto p on p.nome = v.projeto;


-- Equipe de cada projeto
insert into membroProjeto (usuario_id, projeto_id, cargo, dataEntrada)
select u.id, p.id, v.cargo, v.dataEntrada
from (
  select 'laura' as handle, 'Hollow Signal' as projeto, 'Membro' as cargo, '2026-03-11 09:00:00' as dataEntrada union all
  select 'estevao', 'Café da Última Estação', 'Membro', '2026-02-16 10:00:00' union all
  select 'laura', 'Café da Última Estação', 'Membro', '2026-02-16 10:05:00'
) as v
join usuario u on u.handle = v.handle
join projeto p on p.nome = v.projeto;


-- Vagas abertas
insert into vagaProjeto (titulo, descricao, status, nivelMinimo, dataCriacao, skills_id, projeto_id)
select v.titulo, v.descricao, v.status, v.nivelMinimo, v.dataCriacao, s.id, p.id
from (
  select 'Hollow Signal' as projeto, 'Compositor' as skill, 'Compositor' as titulo,
         'Preciso de trilha ambiente, bem esparsa, pensando em rádio velho e água. Referência: Hyper Light Drifter.' as descricao,
         'aberta' as status, 2 as nivelMinimo, '2026-03-05 11:00:00' as dataCriacao
  union all
  select 'Hollow Signal', 'Pixel Artist', 'Pixel Artist',
         'Tilesets de cidade submersa e 2 bosses. A Laura já está no personagem principal, você pegaria cenário.',
         'preenchida', 3, '2026-03-05 11:10:00'
  union all
  select 'Hollow Signal', 'Level Designer', 'Level Designer',
         'Montar o mapa das 4 áreas seguindo a progressão de habilidades. Trabalho direto comigo.',
         'aberta', 2, '2026-03-06 08:30:00'
  union all
  select 'Zé Gotinha: O Retorno', 'Artista 2D', 'Artista 2D',
         'Arte de fábrica, canos e esteiras. Estilo limpo, cores fortes, bem legível.',
         'aberta', 1, '2026-03-21 09:00:00'
  union all
  select 'Zé Gotinha: O Retorno', 'Sound Designer', 'Sound Designer',
         'Efeitos de água, tinta e máquina. Uns 40 efeitos curtos.',
         'aberta', 1, '2026-03-21 09:10:00'
) as v
join projeto p on p.nome = v.projeto
join skills s on s.nome = v.skill;


-- Candidaturas
insert into candidaturaUsuario (mensagem, status, dataCriacao, usuario_id, vagaProjeto_id)
select v.mensagem, v.status, v.dataCriacao, u.id, vg.id
from (
  select 'estevao' as handle, 'Compositor' as vaga, 'Hollow Signal' as projeto,
         'Curti muito a ideia do rádio. Fiz uma faixa de 40 segundos pensando no seu jogo, está no meu site.' as mensagem,
         'pendente' as status, '2026-03-07 21:00:00' as dataCriacao
  union all
  select 'laura', 'Pixel Artist', 'Hollow Signal',
         'Topo demais. Cidade submersa é exatamente o que eu queria desenhar esse ano.',
         'aceita', '2026-03-10 13:00:00'
  union all
  select 'italo', 'Level Designer', 'Hollow Signal',
         'Posso montar o mapa. Tenho experiência com progressão de metroidvania.',
         'pendente', '2026-03-08 10:30:00'
  union all
  select 'lucas', 'Artista 2D', 'Zé Gotinha: O Retorno',
         'Sou mais 3D, mas faço 2D limpo também. Quer ver uns testes?',
         'pendente', '2026-03-22 17:00:00'
) as v
join usuario u on u.handle = v.handle
join projeto p on p.nome = v.projeto
join vagaProjeto vg on vg.titulo = v.vaga and vg.projeto_id = p.id;


-- Avaliacoes do projeto que ja foi concluido
insert into avaliacao
  (nota, notaComunicacao, notaPrazo, notaQualidade, comentario, dataCriacao, avaliador_id, avaliado_id, projeto_id)
select v.nota, v.notaComunicacao, v.notaPrazo, v.notaQualidade, v.comentario, v.dataCriacao, av.id, ad.id, p.id
from (
  select 'thales' as avaliador, 'estevao' as avaliado, 'Café da Última Estação' as projeto,
         5 as nota, 5 as notaComunicacao, 5 as notaPrazo, 5 as notaQualidade,
         'Entregou a trilha antes do prazo e ainda refez uma faixa porque ele mesmo não gostou. Trabalharia de novo sem pensar.' as comentario,
         '2026-03-09 10:00:00' as dataCriacao
  union all
  select 'thales', 'laura', 'Café da Última Estação',
         5, 5, 4, 5,
         'Arte impecável. Atrasou dois dias no final, avisou antes e compensou. Zero problema.',
         '2026-03-09 10:05:00'
  union all
  select 'estevao', 'thales', 'Café da Última Estação',
         4, 4, 4, 5,
         'Código muito bom e deu liberdade total pro áudio. Poderia ter respondido mais rápido no começo.',
         '2026-03-10 19:00:00'
  union all
  select 'laura', 'thales', 'Café da Última Estação',
         5, 5, 5, 5,
         'Organizado, claro no que queria e nunca mudou o escopo no meio. Raro.',
         '2026-03-11 08:30:00'
) as v
join usuario av on av.handle = v.avaliador
join usuario ad on ad.handle = v.avaliado
join projeto p on p.nome = v.projeto;
