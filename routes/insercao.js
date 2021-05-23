var express = require('express');
var router = express.Router();
var dbConn = require('../db/db.js');

//----ROTA PARA DEFINIÇÃO DE PRODUTOS e FORNECEDORES
router.get('/adicionar', function (req, res, next) {
    //let idProduto = req.params.IdProduto; //recebe parâmetro id da pagina inserir.ejs
    var sql1 = 'SELECT IdCategoria, Tipo FROM categoria';
    var sql2 = 'SELECT * FROM fornecedor, produto WHERE CodProd=IdProduto'; // and IdProduto=' +id;
    dbConn.query(sql1, function (err, queryCategoria) { //executa sql1 para CATEGORIA
        if (err) throw err;
        dbConn.query(sql2, function (err, queryFornecedor) { //executa sql1 para CATEGORIA
            if (err) throw err;
            res.render('empresa/inserir.ejs', {
                dataCategoria: queryCategoria, // definicao atributos query (sql2) CATEGORIA
                Descricao: '',
                Preco: '',
                Unidade: '',
                CodCateg: '',
                dataFornecedor: queryFornecedor, // definicao atributos query (sql2) FORNECEDOR
                Nome: '',
                Endereco: '',
                Cidade: '',
                Cep: '',
                Pais: '',
                CodProd: '',

            });

        });
    });
});
//----TERMINO

// Insere PRODUTOS, valores vindo de name dos input no body do html .../adicionar
router.post('/adicionar', function (req, res, _) {    //'/adicionar' é o caminho indicado em inserir.ejs
    let Descricao = req.body.Descricao;
    let Preco = req.body.Preco;
    let Unidade = req.body.Unidade;
    let CodCateg = req.body.CodCateg;

    var insereDados = {
        Descricao: Descricao,
        Preco: Preco,
        Unidade: Unidade,
        CodCateg: CodCateg,
    }

    // ROTA PARA INSERIR REGISTRO
    dbConn.query('INSERT INTO produto SET ?', insereDados, function (err, result) {
        if (err) { //if(err) throw err
            req.flash('error', err)
            // renderizar página inserir.ejs
            res.render('empresa/inserir.ejs', {
                Descricao: insereDados.Descricao,
                Preco: parseFloat(insereDados.Preco),
                Unidade: insereDados.Unidade,
                CodCateg: insereDados.CodCateg,
            })
        } else {
            console.log(result.insertId);
            req.flash('success', 'Inserido com sucesso');
            res.redirect('/consulta');
        }
    });
});

// Insere FORNECEDOR, valores vindo de name dos input no body do html .../adicionar
router.post('/add', function (req, res, next) {    //'/adicionar' é o caminho indicado em inserir.ejs
    let Nome = req.body.Nome;
    let Endereco = req.body.Endereco;
    let Cidade = req.body.Cidade;
    let Cep = req.body.Cep;
    let Pais = req.body.Pais;
    let CodProd = req.body.CodProd;
    let errors = false;
    // se nenhum erro
    if (!errors) {
        var insereDadosF = {
            Nome: Nome,
            Endereco: Endereco,
            Cidade: Cidade,
            Cep: Cep,
            Pais: Pais,
            CodProd: CodProd
        }

        // ROTA PARA INSERIR REGISTRO
        dbConn.query('INSERT INTO fornecedor SET ?', insereDadosF, function (err, result) {
            if (err) { //if(err) throw err
                req.flash('error', err)
                res.render('empresa/inserir.ejs', {
                    Nome: insereDadosF.Nome,
                    Endereco: insereDadosF.Endereco,
                    Cidade: insereDadosF.Cidade,
                    Cep: insereDadosF.Cep,
                    Pais: insereDadosF.Pais,
                    CodProd: insereDadosF.CodProd
                })
            } else {
                req.flash('success', 'Inserido com sucesso');
                res.redirect('/insercao/adicionar');
            }
        })
    }
});

// ROTA PARA EDITAR REGISTRO
router.get('/atualizar/(:id)', function (req, res, next) {
    let id = req.params.id; //recebe id da página editar.ejs

    // let Nome = req.body.Nome;
    // let Endereco = req.body.Endereco;
    // let Cidade = req.body.Cidade;
    // let Cep = req.body.Cep;
    // let Pais = req.body.Pais;
    // let CodProd = req.body.CodProd;
    // let errors = false;


    dbConn.query('SELECT * FROM fornecedor WHERE IdFornec = ' + id,
        function (err, queryEditar, fields) {
            if (queryEditar.length <= 0) { //se query retornou vazia
                req.flash('error', 'Não encontrado fornecedor com id = ' + id)
                res.redirect('/consulta');
            } else {
                // render para editar.ejs com dados do departamento da query rows
                res.render('empresa/editar_fornecedor.ejs', {
                    title: 'Edita Departamento',
                    id: id,
                    Nome: queryEditar[0].Nome,
                    Endereco: queryEditar[0].Endereco,
                    Cidade: queryEditar[0].Cidade,
                    Cep: queryEditar[0].Cep,
                    Pais: queryEditar[0].Pais,
                    CodProd: queryEditar[0].CodProd,
                });
                res.render('/consulta')
            }
        });
});

// rota (post) para atualizar departamentos
router.post('/atualizar/:id', function (req, res, next) {
    let id = req.params.id;
    let Nome = req.body.Nome;
    let Endereco = req.body.Endereco;
    let Cidade = req.body.Cidade;
    let Cep = req.body.Cep;
    let Pais = req.body.Pais;
    let CodProd = req.body.CodProd;
    let errors = false;

    if (!errors) {
        var editaDados = {
            Nome: Nome,
            Endereco: Endereco,
            Cidade: Cidade,
            Cep: Cep,
            Pais: Pais,
            CodProd: CodProd
        }
        // update query
        dbConn.query('UPDATE fornecedor SET ? WHERE IdFornec = ' + id,
            editaDados, function (err, result) {
                if (err) {
                    req.flash('error', err)
                    // render para editar.ejs com os mesmos dados
                    // res.render('pesquisa/editar.ejs', {
                    //     Nome: insereDadosF.Nome,
                    //     Endereco: insereDadosF.Endereco,
                    //     Cidade: insereDadosF.Cidade,
                    //     Cep: insereDadosF.Cep,
                    //     Pais: insereDadosF.Pais,
                    //     CodProd: insereDadosF.CodProd
                    // })

                    res.redirect('../../consulta')
                } else {
                    req.flash('success', 'Fornecedor atualizado com sucesso');
                    res.redirect('../../consulta');
                }
            });
    }
});



module.exports = router;