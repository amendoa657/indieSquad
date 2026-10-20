-- adiciona a cor do perfil num banco que ja existe, sem apagar nada
-- (quem criar o banco do zero com o scriptCreateIndieSquadV2.sql ja ganha a coluna)

SET NAMES utf8mb4;

use indieSquad;

alter table usuario
  add column corPerfil varchar(20) null after fotoDePerfil;
