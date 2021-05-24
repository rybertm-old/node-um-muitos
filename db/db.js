var mysql = require('mysql');

var conexao = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'example',
    database: 'empresa',
    multipleStatements: true,
});
conexao.connect();

module.exports = conexao;