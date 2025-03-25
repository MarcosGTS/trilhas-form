const mysql = require('mysql2');

// Configuração da conexão com o banco de dados MariaDB
const connection = mysql.createConnection({
  host: 'localhost',  
  user: 'root',
  password: '12345',
  database: 'trilhas'
});

// Testar a conexão
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ', err);
    return;
  }
  console.log('Conectado ao banco de dados');
});

// Exportar a conexão para ser usada em outros arquivos
module.exports = connection;
