var express = require('express');
var router = express.Router();
var dbConn = require('../db/db.js');

// ROTA PARA mostrar a pagina index.ejs, no evento da pasta raiz '/'
router.get('/', function (req, res, next) {
    dbConn.query('SELECT * FROM produto p, categoria c WHERE  p.CodCateg=c.IdCategoria ORDER BY p.IdProduto desc', function (err, queryProduto) {
        if (err) {
            req.flash('error', err);
            // preparar dados para página em views/empresa/index.ejs. 'empresa' é a pasta em view
            res.render('empresa', { dataProduto: '' });
        } else {
            // preparar dados para página em views/editora/index.ejs
            res.render('empresa', { dataProduto: queryProduto });
        }
    });
});
// DELETAR PRODUTO
router.get('/delete/(:IdProduto)', function(req, res, next) {
    let IdProduto = parseInt(req.params.IdProduto);
    dbConn.query('DELETE FROM produto WHERE IdProduto = ' + IdProduto, function(err, result) {
    if (err) {
    req.flash('error', err)
    res.redirect('/empresa') // redirecionar para página principal
    } else {
    req.flash('success', 'consulta deletado...! ID = ' + IdProduto)
    res.redirect('/empresa')
    }
    })
    })
module.exports = router;