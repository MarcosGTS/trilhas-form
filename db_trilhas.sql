CREATE TABLE `user` (
  `id` integer PRIMARY KEY,
  `nome_completo` varchar(255),
  `dt_nasc` date,
  `cpf` varchar(255),
  `email` varchar(255),
  `sexo` varchar(255),
  `telefone` varchar(255),
  `senha` varchar(255),
  `username` varchar(255),
  `comprovante_cpf` varchar(255),
  `fk_role` integer,
  `fk_trilha` integer,
  `fk_endereco` integer
);

CREATE TABLE `endereco` (
  `id` integer PRIMARY KEY,
  `cep` varchar(255),
  `rua` varchar(255),
  `numero` varchar(255),
  `cidade` varchar(255),
  `estado` varchar(255),
  `comprovante` varchar(255),
  `created_at` timestamp
);

CREATE TABLE `role` (
  `id` integer PRIMARY KEY,
  `role` varchar(255)
);

CREATE TABLE `trilha` (
  `id` integer PRIMARY KEY,
  `titulo` varchar(255),
  `descricao` varchar(255),
  `imagem_logo` varchar(255)
);

ALTER TABLE `user` ADD FOREIGN KEY (`fk_endereco`) REFERENCES `endereco` (`id`);

ALTER TABLE `user` ADD FOREIGN KEY (`fk_role`) REFERENCES `role` (`id`);

ALTER TABLE `user` ADD FOREIGN KEY (`fk_trilha`) REFERENCES `trilha` (`id`);
