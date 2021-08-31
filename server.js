const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv/config")
const jwt = require('jsonwebtoken')
const routes_without_token = require('./app/helpers/routes_without_token')

app.use(function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    
    validationToken(request, response, next)
})

app.use(cors())
app.use(express.json())

app.set('port', process.env.API_PORT || 3131)

const validationToken = (request, response, next) => {

    var token = request.headers['authorization']

    if(!routes_without_token.find((r) => { return r.route === request.originalUrl && r.method === request.method })){
        if(!token){
            response.statusCode = 401
            return response.json({data: 'Token inexistente'}) 
        }
        jwt.verify(token, process.env.SECRET, (erro, decodificar) => {
            if(erro){
                response.statusCode = 401
                return response.json({data: 'Token inválido'}) 
            } 
            request.user = decodificar
        })
    }
    
    next()
    
}

/**
 * @description Arquivos
 */
const aplicacoes = require('./app/routes/aplicacoes')
const autenticacao = require('./app/routes/autenticacao')
const categorias = require('./app/routes/categorias')
const categorias_estabelecimentos = require('./app/routes/categorias_estabelecimentos')
const categorias_has_estabelecimentos = require('./app/routes/categorias_has_estabelecimentos')
const chaves_pix = require('./app/routes/chaves_pix')
const clientes_has_emails = require('./app/routes/clientes_has_emails')
const clientes_has_enderecos = require('./app/routes/clientes_has_enderecos')
const clientes_has_telefones = require('./app/routes/clientes_has_telefones')
const clientes = require('./app/routes/clientes')
const cupons_estabelecimentos = require('./app/routes/cupons_estabelecimentos')
const cupons_usuarios = require('./app/routes/cupons_usuarios')
const emails = require('./app/routes/emails')
const enderecos = require('./app/routes/enderecos')
const estabelecimento_compartilhado = require('./app/routes/estabelecimento_compartilhado')
const estabelecimentos_has_emails = require('./app/routes/estabelecimentos_has_emails')
const estabelecimentos_has_enderecos = require('./app/routes/estabelecimentos_has_enderecos')
const estabelecimentos_has_planos = require('./app/routes/estabelecimentos_has_planos')
const estabelecimentos_has_telefones = require('./app/routes/estabelecimentos_has_telefones')
const estabelecimentos = require('./app/routes/estabelecimentos')
const formas_pagamento = require('./app/routes/formas_pagamento')
const mesas = require('./app/routes/mesas')
const opcoes_pagamento = require('./app/routes/opcoes_pagamento')
const permissoes = require('./app/routes/permissoes')
const planos = require('./app/routes/planos')
const setores = require('./app/routes/setores')
const status_pedidos = require('./app/routes/status_pedidos')
const telefones = require('./app/routes/telefones')
const tipos_cartao = require('./app/routes/tipos_cartao')
const tipos_conta = require('./app/routes/tipos_conta')
const tipos_telefone = require('./app/routes/tipos_telefone')


/**
 * @description Rotas
 */
app.get(`/`, (request, response) => {
    return response.status(200).json({
        data: 'Bem vindo a API da aplicação PedeAqui.'
    })
})

app.use(`/aplicacoes`, aplicacoes)
app.use(`/categorias/cardapio`, categorias)
app.use(`/categorias/categorias_has_estabelecimentos`, categorias_has_estabelecimentos)
app.use(`/categorias/estabelecimentos`, categorias_estabelecimentos)
app.use(`/chaves_pix`, chaves_pix)
app.use(`/clientes_has/emails`, clientes_has_emails)
app.use(`/clientes_has/enderecos`, clientes_has_enderecos)
app.use(`/clientes_has/telefones`, clientes_has_telefones)
app.use(`/clientes`, clientes)
app.use(`/cupons/estabelecimentos`, cupons_estabelecimentos)
app.use(`/cupons/usuarios`, cupons_usuarios)
app.use(`/emails`, emails)
app.use(`/enderecos`, enderecos)
app.use(`/estabelecimento_compartilhado`, estabelecimento_compartilhado)
app.use(`/estabelecimentos_has/emails`, estabelecimentos_has_emails)
app.use(`/estabelecimentos_has/enderecos`, estabelecimentos_has_enderecos)
app.use(`/estabelecimentos_has/planos`, estabelecimentos_has_planos)
app.use(`/estabelecimentos_has/telefones`, estabelecimentos_has_telefones)
app.use(`/estabelecimentos`, estabelecimentos)
app.use(`/formas_pagamento`, formas_pagamento)
app.use(`/login`, autenticacao)
app.use(`/mesas`, mesas)
app.use(`/opcoes_pagamento`, opcoes_pagamento)
app.use(`/permissoes`, permissoes)
app.use(`/planos`, planos)
app.use(`/setores`, setores)
app.use(`/status/pedidos`, status_pedidos)
app.use(`/telefones`, telefones)
app.use(`/tipos/cartao`, tipos_cartao)
app.use(`/tipos/conta`, tipos_conta)
app.use(`/tipos/telefone`, tipos_telefone)


/**
 * @description Inicialização API
 */
app.listen(app.get('port'), () => {
    console.log(`Port ${app.get('port')} foi inicializada`)
})
