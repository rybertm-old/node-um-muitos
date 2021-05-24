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
router.get('/delete/(:IdProduto)', function (req, res, next) {
    let IdProduto = parseInt(req.params.IdProduto);
    dbConn.query('DELETE FROM produto WHERE IdProduto = ' + IdProduto, function (err, result) {
        if (err) {
            req.flash('error', err)
            res.redirect('/consulta') // redirecionar para página principal
        } else {
            req.flash('success', 'consulta deletado...! ID = ' + IdProduto)
            res.redirect('/consulta')
        }
    })
})
// EDITAR PRODUTO
router.get('/atualizar/(:IdProduto)', function(req, res, next) {
    let IdProduto = req.params.IdProduto;
    dbConn.query('SELECT * FROM produto WHERE IdProduto = ' + IdProduto,
    function(err, queryEditar, fields) {
    if (queryEditar.length <= 0) { //se query retornou vazia
    req.flash('error', 'Não encontrado produto com IdProduto = ' + IdProduto)
    res.redirect('/consulta')
    } else {
    // render para editar.ejs com dados do livro da query rows
    res.render('empresa/editar.ejs', {
    title: 'Edita produto', 
    IdProduto: queryEditar[0].IdProduto,
    Descricao: queryEditar[0].Descricao,
    Unidade: queryEditar[0].Unidade,
    Preco: queryEditar[0].Preco,
    CodCateg: queryEditar[0].CodCateg
    })
    }
    })
    })
    
    // rota (post) para atualizar livros
    router.post('/atualizar/:IdProduto', function(req, res, next) {
    let IdProduto = req.params.IdProduto;
    let Descricao = req.body.Descricao;
    let Preco = req.body.Preco;
    let Unidade = req.body.Unidade;
    let CodCateg = req.body.CodCateg;
    let errors = false;
    if( !errors ) {
    var editaDados = {
    Descricao: Descricao,
    Preco: Preco,
    Unidade: Unidade,
    CodCateg: CodCateg
    }
    // update query
dbConn.query('UPDATE produto SET ? WHERE IdProduto = ' + IdProduto,
editaDados, function(err, result) {
if (err) {
req.flash('error', err)
// render para editar.ejs com os mesmos dados
res.render('empresa/editar.ejs', {
IdProduto: req.params.IdProduto,
Descricao: editaDados.Descricao, 
Preco: editaDados.Preco,
Unidade: editaDados.Unidade, 
CodCateg: editaDados.CodCateg
})
} else {
req.flash('success', 'Produto atualizado com sucesso');
res.redirect('/consulta');
}
})
}
})



module.exports = router;