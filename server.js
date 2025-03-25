const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const db = require('./db');

const app = express();

// Definindo a porta do servidor
const PORT = 3000;

// Middleware para processar JSON no corpo da requisição
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

// Rota para cadastro (POST)
app.post('/trilhas/cadastro', (req, res) => {
  
  const { nome, dt_nasc, cpf, sexo, email, telefone, senha, username, endereco, role, trilha } = req.body;

  // Validando os dados
  if (!nome || !dt_nasc || !cpf || !sexo || !email || !telefone || !senha || !username || !endereco || !role || !trilha) {
    return res.status(400).json({ success: false, message: 'Todos os campos são obrigatórios!' });
  }

  // Inserir dados na tabela de endereço primeiro
  const queryEndereco = `
    INSERT INTO endereco (cep, rua, numero, cidade, estado, comprovante, created_at) 
    VALUES (?, ?, ?, ?, ?, ?, NOW())
  `;
  db.query(queryEndereco, [endereco.cep, endereco.rua, endereco.numero, endereco.cidade, endereco.estado, endereco.comprovante], (err, resultEndereco) => {
    if (err) {
      console.error('Erro ao inserir dados no endereço:', err);
      return res.status(500).json({ success: false, message: 'Erro ao salvar endereço. Tente novamente.' });
    }

    const enderecoId = resultEndereco.insertId;  

    // Inserir dados na tabela de usuário
    const queryUser = `
      INSERT INTO user (nome_completo, dt_nasc, cpf, email, sexo, telefone, senha, username, fk_role, fk_trilha, fk_endereco) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(queryUser, [nome, dt_nasc, cpf, email, sexo, telefone, senha, username, role, trilha, enderecoId], (err, resultUser) => {
      if (err) {
        console.error('Erro ao inserir dados no usuário:', err);
        return res.status(500).json({ success: false, message: 'Erro ao realizar o cadastro. Tente novamente.' });
      }

      // Retornar sucesso
      res.status(200).json({ success: true, message: 'Cadastro realizado com sucesso!' });
    });
  });
});

// Iniciando o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});