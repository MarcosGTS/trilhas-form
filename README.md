# Trilhas Form 📝

Terceiro desafio do programa estadual **Trilhas Inova**.

**Trilhas Form** é uma API criada como parte do segundo desafio do programa estadual **Trilhas Inova**.

O projeto tem como objetivo permitir o envio de **formulários com dados pessoais e arquivos**, como parte de um processo seletivo, inscrição em atividades ou submissão de projetos. A API é responsável por:

- Receber e armazenar os dados submetidos por usuários;
- Fazer upload de arquivos enviados (ex: PDFs, imagens, documentos);
- Salvar essas informações em um banco de dados MySQL;
- Proteger senhas utilizando criptografia (`bcrypt`);
- Servir arquivos estáticos e permitir integração com uma interface web futura.

Essa estrutura serve como base para sistemas de inscrição, portais de submissão de documentos ou qualquer outro tipo de processo baseado em formulários e uploads.

> O foco do desafio é aplicar conhecimentos em backend, banco de dados, autenticação e organização de um projeto Node.js.


## 🚀 Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)
- [Multer](https://github.com/expressjs/multer) – Upload de arquivos
- [Bcrypt](https://github.com/kelektiv/node.bcrypt.js) – Criptografia de senhas
- [dotenv](https://github.com/motdotla/dotenv) – Gerenciamento de variáveis de ambiente
- [CORS](https://github.com/expressjs/cors)
- [body-parser](https://github.com/expressjs/body-parser)

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/MarcosGTS/trilhas-form.git
cd trilhas-form

# Instale as dependências
npm install
