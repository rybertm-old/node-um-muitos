var mysql = require('mysql');

var conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'empresa',
    multipleStatements: true,
});
conexao.connect();

console.log('Conectado ao bd, acesse: http://localhost:3000/empresa');

module.exports = conexao;