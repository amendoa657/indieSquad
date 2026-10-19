-- MySQL Script
-- Model: IndieSquad    Version: 2.0
-- MySQL Workbench Forward Engineering
--
-- Esse script cria o banco inteiro ja na versao 2.
-- Quem ainda tem o banco da versao 1 deve rodar o scriptAtualizacaoV2.sql no lugar desse.

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema indieSquad
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `indieSquad` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `indieSquad` ;

-- -----------------------------------------------------
-- Table `indieSquad`.`usuario`
--
-- handle: apelido unico usado na URL do perfil (/perfil.html?handle=thales).
-- senha: guarda o hash, nunca a senha em texto. O hash do werkzeug passa de 160
--        caracteres, por isso a coluna foi de VARCHAR(90) pra VARCHAR(255).
-- objetivo: "montarEquipe", "entrarProjeto" ou "ambos". Decide a tela inicial.
-- disponibilidadeHoras: horas por semana que a pessoa tem pro projeto.
-- aceita*: os tipos de parceria que a pessoa aceita, pra cruzar com o projeto.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `handle` VARCHAR(30) NOT NULL,
  `usuario` VARCHAR(60) NOT NULL,
  `email` VARCHAR(90) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `bio` MEDIUMTEXT NULL,
  `objetivo` VARCHAR(45) NOT NULL DEFAULT 'ambos',
  `disponibilidadeHoras` INT NULL,
  `aceitaPortfolio` TINYINT(1) NOT NULL DEFAULT 0,
  `aceitaRevenueShare` TINYINT(1) NOT NULL DEFAULT 0,
  `aceitaRemunerado` TINYINT(1) NOT NULL DEFAULT 0,
  `dataCriacao` DATETIME NULL,
  `fotoDePerfil` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `handle_UNIQUE` (`handle` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `indieSquad`.`linkUsuario`
--
-- Os links de portfolio da pessoa (itch.io, GitHub, ArtStation, LinkedIn, site).
-- E tabela separada porque cada pessoa tem uma quantidade diferente de links.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`linkUsuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `tipo` VARCHAR(30) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_linkUsuario_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_linkUsuario_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `indieSquad`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `indieSquad`.`skills`
--
-- categoria agrupa as funcoes na tela de escolha (Programacao, Arte, Audio,
-- Design, Producao). O catalogo vem pronto no seedIndieSquad.sql.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`skills` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(90) NOT NULL,
  `categoria` VARCHAR(45) NOT NULL DEFAULT 'Outro',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `indieSquad`.`skillUsuario`
--
-- nivel: 1 Iniciante, 2 Intermediario, 3 Avancado, 4 Especialista.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`skillUsuario` (
  `skills_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `nivel` INT NOT NULL DEFAULT 1,
  PRIMARY KEY (`skills_id`, `usuario_id`),
  INDEX `fk_skills_has_usuario_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  INDEX `fk_skills_has_usuario_skills_idx` (`skills_id` ASC) VISIBLE,
  CONSTRAINT `fk_skills_has_usuario_skills`
    FOREIGN KEY (`skills_id`)
    REFERENCES `indieSquad`.`skills` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_skills_has_usuario_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `indieSquad`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `indieSquad`.`ferramenta`
--
-- Engines e programas (Unity, Godot, Blender, FMOD). Segue o mesmo desenho de
-- skills + skillUsuario, pra ficar coerente com o resto do banco.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`ferramenta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(90) NOT NULL,
  `categoria` VARCHAR(45) NOT NULL DEFAULT 'Outro',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `indieSquad`.`ferramentaUsuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`ferramentaUsuario` (
  `ferramenta_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  PRIMARY KEY (`ferramenta_id`, `usuario_id`),
  INDEX `fk_ferramenta_has_usuario_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  INDEX `fk_ferramenta_has_usuario_ferramenta1_idx` (`ferramenta_id` ASC) VISIBLE,
  CONSTRAINT `fk_ferramenta_has_usuario_ferramenta1`
    FOREIGN KEY (`ferramenta_id`)
    REFERENCES `indieSquad`.`ferramenta` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_ferramenta_has_usuario_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `indieSquad`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `indieSquad`.`projeto`
--
-- status: "ativo", "pausado", "concluido" ou "cancelado".
-- dataConclusao: preenchida quando o criador conclui o projeto. E o que libera
--                a avaliacao entre os membros.
-- genero / engine / tipoParceria / duracaoEstimada: campos que o formulario de
--                publicar projeto ja coletava e jogava fora.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`projeto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(90) NOT NULL,
  `descricao` MEDIUMTEXT NULL,
  `status` VARCHAR(45) NOT NULL,
  `genero` VARCHAR(45) NULL,
  `engine` VARCHAR(45) NULL,
  `tipoParceria` VARCHAR(45) NULL,
  `duracaoEstimada` VARCHAR(45) NULL,
  `dataCriacao` DATETIME NULL,
  `dataConclusao` DATETIME NULL,
  `logoProjeto` VARCHAR(255) NULL,
  `criador_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_projeto_usuario1_idx` (`criador_id` ASC) VISIBLE,
  CONSTRAINT `fk_projeto_usuario1`
    FOREIGN KEY (`criador_id`)
    REFERENCES `indieSquad`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `indieSquad`.`marcoProjeto`
--
-- Os marcos do projeto (prototipo jogavel, demo na Steam). "ordem" guarda a
-- posicao na lista pra nao depender do id.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`marcoProjeto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(90) NOT NULL,
  `concluido` TINYINT(1) NOT NULL DEFAULT 0,
  `ordem` INT NOT NULL DEFAULT 0,
  `projeto_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_marcoProjeto_projeto1_idx` (`projeto_id` ASC) VISIBLE,
  CONSTRAINT `fk_marcoProjeto_projeto1`
    FOREIGN KEY (`projeto_id`)
    REFERENCES `indieSquad`.`projeto` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `indieSquad`.`vagaProjeto`
--
-- nivelMinimo: nivel de skill que o criador espera (1 a 4), opcional.
-- status: "aberta" ou "preenchida".
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`vagaProjeto` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `titulo` VARCHAR(45) NOT NULL,
  `descricao` MEDIUMTEXT NULL,
  `status` VARCHAR(45) NOT NULL,
  `nivelMinimo` INT NULL,
  `dataCriacao` DATETIME NULL,
  `skills_id` INT NOT NULL,
  `projeto_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_vagaProjeto_skills1_idx` (`skills_id` ASC) VISIBLE,
  INDEX `fk_vagaProjeto_projeto1_idx` (`projeto_id` ASC) VISIBLE,
  CONSTRAINT `fk_vagaProjeto_skills1`
    FOREIGN KEY (`skills_id`)
    REFERENCES `indieSquad`.`skills` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_vagaProjeto_projeto1`
    FOREIGN KEY (`projeto_id`)
    REFERENCES `indieSquad`.`projeto` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `indieSquad`.`membroProjeto`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`membroProjeto` (
  `usuario_id` INT NOT NULL,
  `projeto_id` INT NOT NULL,
  `cargo` VARCHAR(30) NULL,
  `dataEntrada` DATETIME NULL,
  PRIMARY KEY (`usuario_id`, `projeto_id`),
  INDEX `fk_usuario_has_projeto_projeto1_idx` (`projeto_id` ASC) VISIBLE,
  INDEX `fk_usuario_has_projeto_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_has_projeto_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `indieSquad`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_has_projeto_projeto1`
    FOREIGN KEY (`projeto_id`)
    REFERENCES `indieSquad`.`projeto` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `indieSquad`.`candidaturaUsuario`
--
-- A chave primaria agora e so o id. Na versao 1 ela era (id, usuario_id,
-- vagaProjeto_id), o que nao impedia a mesma pessoa de se candidatar varias
-- vezes na mesma vaga. Quem impede isso agora e o indice unico abaixo.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`candidaturaUsuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `mensagem` MEDIUMTEXT NULL,
  `status` VARCHAR(45) NOT NULL,
  `dataCriacao` DATETIME NULL,
  `usuario_id` INT NOT NULL,
  `vagaProjeto_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_usuario_has_vagaProjeto_vagaProjeto1_idx` (`vagaProjeto_id` ASC) VISIBLE,
  INDEX `fk_usuario_has_vagaProjeto_usuario1_idx` (`usuario_id` ASC) VISIBLE,
  UNIQUE INDEX `uq_candidatura_usuario_vaga` (`usuario_id` ASC, `vagaProjeto_id` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_has_vagaProjeto_usuario1`
    FOREIGN KEY (`usuario_id`)
    REFERENCES `indieSquad`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_has_vagaProjeto_vagaProjeto1`
    FOREIGN KEY (`vagaProjeto_id`)
    REFERENCES `indieSquad`.`vagaProjeto` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `indieSquad`.`avaliacao`
--
-- A avaliacao agora e amarrada a um projeto: voce so avalia quem trabalhou com
-- voce, e so uma vez por pessoa por projeto (e o que o indice unico garante).
-- nota e a media das tres notas, guardada pronta pra nao recalcular toda hora.
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `indieSquad`.`avaliacao` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nota` INT NOT NULL,
  `notaComunicacao` INT NOT NULL,
  `notaPrazo` INT NOT NULL,
  `notaQualidade` INT NOT NULL,
  `comentario` MEDIUMTEXT NULL,
  `dataCriacao` DATETIME NULL,
  `avaliador_id` INT NOT NULL,
  `avaliado_id` INT NOT NULL,
  `projeto_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_avaliacao_usuario1_idx` (`avaliador_id` ASC) VISIBLE,
  INDEX `fk_avaliacao_usuario2_idx` (`avaliado_id` ASC) VISIBLE,
  INDEX `fk_avaliacao_projeto1_idx` (`projeto_id` ASC) VISIBLE,
  UNIQUE INDEX `uq_avaliacao_avaliador_avaliado_projeto` (`avaliador_id` ASC, `avaliado_id` ASC, `projeto_id` ASC) VISIBLE,
  CONSTRAINT `fk_avaliacao_usuario1`
    FOREIGN KEY (`avaliador_id`)
    REFERENCES `indieSquad`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_avaliacao_usuario2`
    FOREIGN KEY (`avaliado_id`)
    REFERENCES `indieSquad`.`usuario` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_avaliacao_projeto1`
    FOREIGN KEY (`projeto_id`)
    REFERENCES `indieSquad`.`projeto` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
