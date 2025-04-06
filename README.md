# Formulário Trilhas

## O que é o projeto

Este projeto foi desenvolvido como parte de um desafio proposto pelo **Programa Trilhas Inova**, em parceria com a **SECTI**, **FAPEMA** e o **Governo do Estado do Maranhão**.

O objetivo principal é criar um **formulário estático de inscrição** para um programa de formação tecnológica, permitindo que candidatos preencham seus dados de forma organizada e intuitiva.

O formulário visa resolver o problema da gestão de um grande volume de inscritos (cerca de **10.000 por ano**), garantindo um fluxo de inscrição eficiente e acessível.

---

## Como rodar localmente

### 1. Clonar o repositório

Para executar o projeto, é necessário ter uma cópia de todos os arquivos na sua máquina local. Para isso:

1. Acesse o repositório do projeto;
2. Clique no botão verde **Code**;
3. Selecione **Download ZIP**.

![github_tutorial](https://github.com/user-attachments/assets/da7b1758-f50d-449a-b767-a36de26f8adf)

Como alternativa, você pode utilizar o Git para clonar o repositório via HTTPS:

```bash
git clone https://github.com/MarcosGTS/trilhas-form.git
```

![github_tutorial1](https://github.com/user-attachments/assets/43dad97c-e471-461c-9055-6462137c23a8)

---

### 2. Instalar dependências do projeto

Para o sistema funcionar corretamente, algumas dependências precisam ser instaladas. É necessário ter o **Node.js** e o **npm** previamente instalados na máquina.

Em seguida, execute o comando:

```bash
npm install
```

> **Observação:** Certifique-se de executar o comando no diretório raiz do projeto.

---

### 3. Criar banco de dados

O sistema necessita de uma conexão com banco de dados para funcionar corretamente. Na pasta do projeto, está disponível um arquivo `.sql` que define a estrutura do banco de dados (**MySQL/MariaDB**), além de uma imagem ilustrativa.

> **Importante:** Verifique se os campos de ID estão configurados com **auto-incremento**.

---

### 4. Executar o projeto

Quase lá! Agora, você precisa configurar as credenciais de acesso ao banco de dados. Para isso:

1. Crie um arquivo `.env` na raiz do projeto;
2. Use o arquivo `.env.example` como base.

![setup_tutorial](https://github.com/user-attachments/assets/982a5373-690f-40b8-a282-7ed3ae5be4c0)

Feito isso, execute o projeto com o comando:

```bash
node server.js
```

Se tudo estiver certo, o terminal exibirá a porta onde o sistema está disponível. Agora é só aproveitar!

---

## Tecnologias utilizadas

- HTML  
- CSS  
- JavaScript  
- Node.js  
- MariaDB  
- Git  

---

## Principais funcionalidades

### ✅ Validação dos campos do formulário

Todos os campos possuem validação de entrada, com mensagens específicas que facilitam o preenchimento correto do formulário.

![functionalities1](https://github.com/user-attachments/assets/ebb7c52d-2068-4418-b371-0d4a2ab83b09)

---

### 💾 Armazenamento temporário dos dados

O formulário mantém os dados preenchidos mesmo que o envio não seja concluído, evitando que o usuário perca informações. O botão **Cancelar** limpa os campos preenchidos.

---

### 📱 Responsividade

O site é compatível com diversas resoluções de tela, garantindo uma experiência fluida em diferentes dispositivos.

---

### 🌙 Modo escuro

O sistema possui suporte a **tema escuro**, tornando a interface mais confortável para uso em ambientes com pouca luz.

![functionalities2](https://github.com/user-attachments/assets/166acd0d-d46d-4d3d-bc6c-d4c043728b54)

---

### 🗂️ Persistência de dados

Os dados preenchidos são armazenados em um banco de dados (MySQL), viabilizando futuras funcionalidades como autenticação, autorização, visualização e gestão dos dados.

![functionalities3](https://github.com/user-attachments/assets/93e5c9e7-61a2-48dc-b2e8-5e7caeb56511)

---

### ✨ Efeitos visuais

O site possui animações e pequenos efeitos que tornam a experiência mais agradável e interativa.

---

## 🎥 Lista de vídeos

- [Apresentação 1](https://drive.google.com/file/d/1p6mRJ1Y5g6twMDGgjz8j99cxkSlytLfn/view?usp=sharing)
- [Apresentação 2](https://youtu.be/l-IkDvE58Pc)


> **Observação:** Os documentos obrigatórios estão disponíveis na pasta `Documents`.

