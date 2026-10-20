-- MySQL Script - IndieSquad versao 2
-- cria o banco inteiro; rode o seedIndieSquad.sql depois deste

-- declara a codificacao do arquivo antes de qualquer coisa
SET NAMES utf8mb4;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- schema indieSquad
CREATE SCHEMA IF NOT EXISTS `indieSquad` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ;
USE `indieSquad` ;

-- table `indieSquad`.`usuario`
-- senha guarda o hash; o hash do werkzeug passa de 160 caracteres, por isso varchar(255)
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


-- table `indieSquad`.`linkUsuario`
-- tabela separada porque cada pessoa tem uma quantidade diferente de links
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


-- table `indieSquad`.`skills`
-- categoria agrupa as funcoes na tela de escolha; o catalogo vem pronto no seed
CREATE TABLE IF NOT EXISTS `indieSquad`.`skills` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(90) NOT NULL,
  `categoria` VARCHAR(45) NOT NULL DEFAULT 'Outro',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) VISIBLE)
ENGINE = InnoDB;


-- table `indieSquad`.`skillUsuario`
-- nivel: 1 Iniciante, 2 Intermediario, 3 Avancado, 4 Especialista
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


-- table `indieSquad`.`ferramenta`
-- segue o mesmo desenho de skills e skillUsuario, pra ficar coerente com o resto do banco
CREATE TABLE IF NOT EXISTS `indieSquad`.`ferramenta` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(90) NOT NULL,
  `categoria` VARCHAR(45) NOT NULL DEFAULT 'Outro',
  PRIMARY KEY (`id`),
  UNIQUE INDEX `nome_UNIQUE` (`nome` ASC) VISIBLE)
ENGINE = InnoDB;


-- table `indieSquad`.`ferramentaUsuario`
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


-- table `indieSquad`.`projeto`
-- dataConclusao e o que libera a avaliacao entre os membros
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


-- table `indieSquad`.`marcoProjeto`
-- ordem guarda a posicao na lista pra nao depender do id
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


-- table `indieSquad`.`vagaProjeto`
-- status: aberta, preenchida ou fechada
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


-- table `indieSquad`.`membroProjeto`
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


-- table `indieSquad`.`candidaturaUsuario`
-- a chave agora e so o id; quem impede candidatura repetida e o indice unico abaixo
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


-- table `indieSquad`.`avaliacao`
-- amarrada ao projeto: so avalia quem trabalhou junto, e so uma vez por pessoa por projeto
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
