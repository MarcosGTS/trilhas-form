require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const mysql = require('mysql2/promise');
const multer = require('multer');

const path = require('path');
const fs = require('fs');

// Configuração do app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Configuração de armazenamento para uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = './uploads';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD, 
};

// Função para criar pool de conexão
async function createPool() {
  try {
    const pool = mysql.createPool(dbConfig);
    await pool.query('SELECT 1');
    console.log('Conexão com o banco de dados estabelecida com sucesso');
    return pool;
  } catch (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    throw error;
  }
}

// Pool global de conexão
let pool;

// Inicializar perfis (roles) se necessário
async function initRoles() {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM role');
    if (rows[0].count === 0) {
      await pool.query(`
        INSERT INTO role (id, role) VALUES 
        (1, 'admin'),
        (2, 'participante')
      `);
      console.log('Roles inicializadas');
    }
  } catch (error) {
    console.error('Erro ao inicializar roles:', error);
  }
}

// Função para verificar se um email já existe
async function checkEmailExists(email) {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM user WHERE email = ?', [email]);
  return rows[0].count > 0;
}

// Função para verificar se um username já existe
async function checkUsernameExists(username) {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM user WHERE username = ?', [username]);
  return rows[0].count > 0;
}

// Função para verificar se um CPF já existe
async function checkCPFExists(cpf) {
  const [rows] = await pool.query('SELECT COUNT(*) as count FROM user WHERE cpf = ?', [cpf]);
  return rows[0].count > 0;
}

// Rota para login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body; // 'username' aqui será tratado como username ou email

  try {
    const [rows] = await pool.query(
      'SELECT * FROM user WHERE username = ? OR email = ?',
      [username, username] // Usamos o mesmo valor para ambos os campos
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Usuário ou email não encontrado' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.senha);
    
    if (match) {
      // Retornando usuário sem a senha
      const { senha, ...userWithoutPassword } = user;
      return res.status(200).json({ success:true,
        message: 'Login bem-sucedido',
        user: userWithoutPassword
      });
    } else {
      return res.status(401).json({ message: 'Senha incorreta' });
    }
  } catch (error) {
    console.error('Erro durante login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para verificar disponibilidade de username
app.get('/api/check-username/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const exists = await checkUsernameExists(username);
    res.json({ available: !exists });
  } catch (error) {
    console.error('Erro ao verificar username:', error);
    res.status(500).json({ message: 'Erro ao verificar disponibilidade de username' });
  }
});

// Rota para registro de usuário - usando fields para processar múltiplos arquivos
app.post('/api/register', upload.fields([
  { name: 'documento', maxCount: 1 },
  { name: 'comprovante', maxCount: 1 }
]), async (req, res) => {
  console.log(req.body);

  try {
    // Verificar se os arquivos foram enviados
    if (!req.files || !req.files.documento || !req.files.comprovante) {
      return res.status(400).json({ message: 'Os documentos de identidade e comprovante de residência são obrigatórios' });
    }
    
    const userData = req.body;

    // Verificar se o email já existe
    const emailExists = await checkEmailExists(userData.email);
    if (emailExists) {
      return res.status(409).json({ message: 'Este email já está cadastrado' });
    }

    // Verificar se o username já existe
    const usernameExists = await checkUsernameExists(userData.username);
    if (usernameExists) {
      return res.status(409).json({ message: 'Este nome de usuário já está em uso' });
    }
    
    // Verificar se o CPF já existe
    const cpfExists = await checkCPFExists(userData.cpf);
    if (cpfExists) {
      return res.status(409).json({ message: 'Este CPF já está cadastrado no sistema' });
    }
    
    // Iniciar transação
    await pool.query('START TRANSACTION');
    
    // 1. Inserir endereço
    const [enderecoResult] = await pool.query(
      'INSERT INTO endereco (cep, rua, numero, cidade, estado, comprovante, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
      [userData.cep, userData.rua, userData.numero, userData.cidade, userData.estado, req.files.comprovante[0].path]
    );
    
    const enderecoId = enderecoResult.insertId;
    
    // 2. Criptografar senha
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // 3. Obter ID da trilha
    let trilhaId;
    switch(userData.trilha) {
      case 'front-end': trilhaId = 1; break;
      case 'back-end': trilhaId = 2; break;
      case 'jogos': trilhaId = 3; break;
      case 'design': trilhaId = 4; break;
      case 'dados': trilhaId = 5; break;
      default: trilhaId = 1;
    }
    
    // 4. Inserir usuário
    await pool.query(
      'INSERT INTO user (nome_completo, dt_nasc, cpf, email, sexo, telefone, comprovante_cpf, senha, username, fk_role, fk_trilha, fk_endereco) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        userData.nome, 
        userData.data_nascimento, 
        userData.cpf, 
        userData.email, 
        userData.sexo, 
        userData.telefone, 
        req.files.documento[0].path,
        hashedPassword,
        userData.username,
        2, // Perfil padrão: participante
        trilhaId,
        enderecoId
      ]
    );
    
    // Confirmar transação
    await pool.query('COMMIT');
    
    res.status(201).json({ success: true, message: 'Usuário registrado com sucesso' });
  } catch (error) {
    // Reverter transação em caso de erro
    await pool.query('ROLLBACK');
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ message: 'Erro ao registrar usuário: ' + error.message });
  }
});

// Rota para servir página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para servir página de registro
app.get('/sign-up', (req, res) => {
  res.sendFile(path.join(__dirname, 'sign-up.html'));
});

// Inicializar servidor e banco de dados
async function startServer() {
  try {
    pool = await createPool();
    
    // Inicializar dados base
    await initRoles();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
  }
}

startServer();