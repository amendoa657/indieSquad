/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-12.3.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: indieSquad
-- ------------------------------------------------------
-- Server version	12.3.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Current Database: `indieSquad`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `indieSquad` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `indieSquad`;

--
-- Table structure for table `avaliacao`
--

DROP TABLE IF EXISTS `avaliacao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `avaliacao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `avaliador_id` int(11) NOT NULL,
  `avaliado_id` int(11) NOT NULL,
  `nota` int(11) NOT NULL,
  `comentario` mediumtext DEFAULT NULL,
  `dataCriacao` datetime NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `avaliado_id_UNIQUE` (`avaliado_id`),
  UNIQUE KEY `avaliador_id_UNIQUE` (`avaliador_id`),
  KEY `fk_avaliacao_usuario1_idx` (`avaliador_id`),
  KEY `fk_avaliacao_usuario2_idx` (`avaliado_id`),
  CONSTRAINT `fk_avaliacao_usuario1` FOREIGN KEY (`avaliador_id`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_avaliacao_usuario2` FOREIGN KEY (`avaliado_id`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `avaliacao`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `avaliacao` WRITE;
/*!40000 ALTER TABLE `avaliacao` DISABLE KEYS */;
/*!40000 ALTER TABLE `avaliacao` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `candidaturaUsuario`
--

DROP TABLE IF EXISTS `candidaturaUsuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `candidaturaUsuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `vagaProjeto_id` int(11) NOT NULL,
  `dataCriacao` datetime NOT NULL,
  `status` varchar(45) NOT NULL,
  `mensagem` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`,`usuario_id`,`vagaProjeto_id`),
  UNIQUE KEY `usuario_id_UNIQUE` (`usuario_id`),
  UNIQUE KEY `vagaProjeto_id_UNIQUE` (`vagaProjeto_id`),
  KEY `fk_usuario_has_vagaProjeto_vagaProjeto1_idx` (`vagaProjeto_id`),
  KEY `fk_usuario_has_vagaProjeto_usuario1_idx` (`usuario_id`),
  CONSTRAINT `fk_usuario_has_vagaProjeto_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_has_vagaProjeto_vagaProjeto1` FOREIGN KEY (`vagaProjeto_id`) REFERENCES `vagaProjeto` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `candidaturaUsuario`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `candidaturaUsuario` WRITE;
/*!40000 ALTER TABLE `candidaturaUsuario` DISABLE KEYS */;
/*!40000 ALTER TABLE `candidaturaUsuario` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `membroProjeto`
--

DROP TABLE IF EXISTS `membroProjeto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `membroProjeto` (
  `usuario_id` int(11) NOT NULL,
  `projeto_id` int(11) NOT NULL,
  `dataEntrada` datetime NOT NULL,
  `cargo` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`usuario_id`,`projeto_id`),
  KEY `fk_usuario_has_projeto_projeto1_idx` (`projeto_id`),
  KEY `fk_usuario_has_projeto_usuario1_idx` (`usuario_id`),
  CONSTRAINT `fk_usuario_has_projeto_projeto1` FOREIGN KEY (`projeto_id`) REFERENCES `projeto` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_has_projeto_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `membroProjeto`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `membroProjeto` WRITE;
/*!40000 ALTER TABLE `membroProjeto` DISABLE KEYS */;
INSERT INTO `membroProjeto` VALUES
(6,1,'2026-08-05 23:15:59','MEMBRO');
/*!40000 ALTER TABLE `membroProjeto` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `projeto`
--

DROP TABLE IF EXISTS `projeto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `projeto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(90) NOT NULL,
  `descricao` mediumtext DEFAULT NULL,
  `status` varchar(45) NOT NULL,
  `dataCriacao` datetime DEFAULT NULL,
  `criador_id` int(11) NOT NULL,
  `logoProjeto` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_projeto_usuario1_idx` (`criador_id`),
  CONSTRAINT `fk_projeto_usuario1` FOREIGN KEY (`criador_id`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projeto`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `projeto` WRITE;
/*!40000 ALTER TABLE `projeto` DISABLE KEYS */;
INSERT INTO `projeto` VALUES
(1,'IndieSquad','A indie squad eh o melhor projetos de todos!','ativo','2026-08-05 01:05:37',6,NULL),
(4,'ZeGotinha','Ze gota eh top demais','ativo','2026-08-05 23:23:56',6,NULL);
/*!40000 ALTER TABLE `projeto` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `skillUsuario`
--

DROP TABLE IF EXISTS `skillUsuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `skillUsuario` (
  `skills_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `nivel` int(11) NOT NULL,
  PRIMARY KEY (`skills_id`,`usuario_id`),
  KEY `fk_skills_has_usuario_usuario1_idx` (`usuario_id`),
  KEY `fk_skills_has_usuario_skills_idx` (`skills_id`),
  CONSTRAINT `fk_skills_has_usuario_skills` FOREIGN KEY (`skills_id`) REFERENCES `skills` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_skills_has_usuario_usuario1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skillUsuario`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `skillUsuario` WRITE;
/*!40000 ALTER TABLE `skillUsuario` DISABLE KEYS */;
INSERT INTO `skillUsuario` VALUES
(1,6,10),
(5,6,5);
/*!40000 ALTER TABLE `skillUsuario` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `skills`
--

DROP TABLE IF EXISTS `skills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `skills` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(90) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `skills`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `skills` WRITE;
/*!40000 ALTER TABLE `skills` DISABLE KEYS */;
INSERT INTO `skills` VALUES
(1,'Progamador'),
(4,'Artista'),
(5,'Musico'),
(6,'Game designer');
/*!40000 ALTER TABLE `skills` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario` varchar(60) NOT NULL,
  `email` varchar(90) NOT NULL,
  `senha` varchar(90) NOT NULL,
  `bio` mediumtext DEFAULT NULL,
  `dataCriacao` datetime NOT NULL,
  `fotoDePerfil` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES
(6,'Italo Cunha','italocisarpinheiro@gmail.com','123456',NULL,'2026-06-25 01:05:05',NULL),
(8,'Pedro Cunha cisar','pedrocisarpinheiro@gmail.com','123456',NULL,'2026-06-25 01:05:24',NULL),
(9,'Usuario legal top','usuarioLegalTop@gmail.com','123456',NULL,'2026-07-01 11:14:40',NULL);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `vagaProjeto`
--

DROP TABLE IF EXISTS `vagaProjeto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `vagaProjeto` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `descricao` mediumtext DEFAULT NULL,
  `status` varchar(45) NOT NULL,
  `skills_id` int(11) NOT NULL,
  `projeto_id` int(11) NOT NULL,
  PRIMARY KEY (`id`,`skills_id`,`projeto_id`),
  KEY `fk_vagaProjeto_skills1_idx` (`skills_id`),
  KEY `fk_vagaProjeto_projeto1_idx` (`projeto_id`),
  CONSTRAINT `fk_vagaProjeto_projeto1` FOREIGN KEY (`projeto_id`) REFERENCES `projeto` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_vagaProjeto_skills1` FOREIGN KEY (`skills_id`) REFERENCES `skills` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vagaProjeto`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `vagaProjeto` WRITE;
/*!40000 ALTER TABLE `vagaProjeto` DISABLE KEYS */;
/*!40000 ALTER TABLE `vagaProjeto` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-08-06 11:44:27
