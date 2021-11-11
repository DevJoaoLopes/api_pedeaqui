const express = require('express')
const app = express()
const cors = require('cors')
require("dotenv/config")
const jwt = require('jsonwebtoken')
const routes_without_token = require('./app/helpers/routes_without_token')
const validation_user = require('./app/helpers/validation_user')

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    
    validationToken(request, response, next)
})

app.use(cors())
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.set('port', process.env.API_PORT || 3131)

const validationRoute = (request) => {
    if(request.method === 'OPTIONS') return false
    
    var rotas = routes_without_token.filter(r => r.route.indexOf('/*') > -1)
    var rota_acessada = rotas.find((r, i) => {
        var split_request = request.originalUrl.split('/')
        var split_rotas = r.route.split('/')
        var index_all = split_rotas.indexOf('*')
        return request.originalUrl.indexOf(r.route.replace('/*', '')) > -1 && split_rotas[index_all - 1] == split_request[index_all - 1]
    })

    if(!rota_acessada){
        return !routes_without_token.find((r) => { return r.route === request.originalUrl && r.method === request.method })
    }
    else{
        return false 
    }
}

const validationToken = (request, response, next) => {

    var token = request.headers['authorization']

    if(validationRoute(request)){
        if(!token){
            response.statusCode = 401
            return response.json({data: 'Token inexistente'}) 
        }
        jwt.verify(token, process.env.SECRET, async (erro, decodificar) => {
            if(erro){
                response.statusCode = 401
                return response.json({data: 'Token inválido'}) 
            } 

            if(!(await validation_user.validation(decodificar))){
                response.statusCode = 401
                return response.json({data: 'Usuário desativado'}) 
            }
            
            request.user = decodificar

            next()
        })
    }
    else{
        next()
    }

    
}

/**
 * @description Arquivos
 */
const acompanhamentos_has_itens_cardapios = require('./app/routes/acompanhamentos_has_itens_cardapios')
const acompanhamentos = require('./app/routes/acompanhamentos')
const adicionais_has_itens_cardapios = require('./app/routes/adicionais_has_itens_cardapios')
const adicionais_itens = require('./app/routes/adicionais_itens')
const aplicacoes_has_formas_pagamento = require('./app/routes/aplicacoes_has_formas_pagamento')
const aplicacoes = require('./app/routes/aplicacoes')
const autenticacao = require('./app/routes/autenticacao')
const bandeiras = require('./app/routes/bandeiras')
const cartoes = require('./app/routes/cartoes')
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
const escolhas_has_itens_cardapios = require('./app/routes/escolhas_has_itens_cardapios')
const escolhas = require('./app/routes/escolhas')
const escolhas_opcoes = require('./app/routes/escolhas_opcoes')
const emails = require('./app/routes/emails')
const enderecos = require('./app/routes/enderecos')
const estabelecimento_compartilhado = require('./app/routes/estabelecimento_compartilhado')
const estabelecimentos_has_emails = require('./app/routes/estabelecimentos_has_emails')
const estabelecimentos_has_enderecos = require('./app/routes/estabelecimentos_has_enderecos')
const estabelecimentos_has_planos = require('./app/routes/estabelecimentos_has_planos')
const estabelecimentos_has_telefones = require('./app/routes/estabelecimentos_has_telefones')
const estabelecimentos = require('./app/routes/estabelecimentos')
const formas_pagamento = require('./app/routes/formas_pagamento')
const funcionarios_has_setores = require('./app/routes/funcionarios_has_setores')
const funcionarios = require('./app/routes/funcionarios')
const imagens_itens_cardapios = require('./app/routes/imagens_itens_cardapios')
const itens_cardapios = require('./app/routes/itens_cardapios')
const itens_pedidos_has_acompanhamentos = require('./app/routes/itens_pedidos_has_acompanhamentos')
const itens_pedidos_has_adicionais = require('./app/routes/itens_pedidos_has_adicionais')
const itens_pedidos_has_escolhas = require('./app/routes/itens_pedidos_has_escolhas')
const itens_pedidos = require('./app/routes/itens_pedidos')
const mesas = require('./app/routes/mesas')
const opcoes_pagamento = require('./app/routes/opcoes_pagamento')
const pagamentos = require('./app/routes/pagamentos')
const pedidos_has_usuarios = require('./app/routes/pedidos_has_usuarios')
const pedidos = require('./app/routes/pedidos')
const permissoes_has_planos = require('./app/routes/permissoes_has_planos')
const permissoes = require('./app/routes/permissoes')
const pix_estabelecimentos = require('./app/routes/pix_estabelecimentos')
const pix = require('./app/routes/pix')
const planos = require('./app/routes/planos')
const promocoes = require('./app/routes/promocoes')
const setores = require('./app/routes/setores')
const status_pedidos = require('./app/routes/status_pedidos')
const telefones = require('./app/routes/telefones')
const tipos_cartao = require('./app/routes/tipos_cartao')
const tipos_conta = require('./app/routes/tipos_conta')
const tipos_telefone = require('./app/routes/tipos_telefone')
const usuarios_has_permissoes = require('./app/routes/usuarios_has_permissoes')
const usuarios = require('./app/routes/usuarios')


/**
 * @description Rotas
 */
app.get(`/`, (request, response) => {
    return response.status(200).json({
        data: 'Bem vindo a API da aplicação PedeAqui.'
    })
})

app.use('/imagens', express.static(__dirname + '/app/images'));

app.use(`/acompanhamentos_has/itens_cardapios`, acompanhamentos_has_itens_cardapios)
app.use(`/acompanhamentos`, acompanhamentos)
app.use(`/adicionais/itens_cardapios`, adicionais_has_itens_cardapios)
app.use(`/adicionais/itens`, adicionais_itens)
app.use(`/aplicacoes_has/formas_pagamento`, aplicacoes_has_formas_pagamento)
app.use(`/aplicacoes`, aplicacoes)
app.use(`/bandeiras`, bandeiras)
app.use(`/cartoes`, cartoes)
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
app.use(`/escolhas_has/itens_cardapios`, escolhas_has_itens_cardapios)
app.use(`/escolhas`, escolhas)
app.use(`/escolhas/opcoes`, escolhas_opcoes)
app.use(`/emails`, emails)
app.use(`/enderecos`, enderecos)
app.use(`/estabelecimento_compartilhado`, estabelecimento_compartilhado)
app.use(`/estabelecimentos_has/emails`, estabelecimentos_has_emails)
app.use(`/estabelecimentos_has/enderecos`, estabelecimentos_has_enderecos)
app.use(`/estabelecimentos_has/planos`, estabelecimentos_has_planos)
app.use(`/estabelecimentos_has/telefones`, estabelecimentos_has_telefones)
app.use(`/estabelecimentos`, estabelecimentos)
app.use(`/formas_pagamento`, formas_pagamento)
app.use(`/funcionarios_has/setores`, funcionarios_has_setores)
app.use(`/funcionarios`, funcionarios)
app.use(`/itens/cardapios/imagens`, imagens_itens_cardapios)
app.use(`/itens/cardapios`, itens_cardapios)
app.use(`/itens_pedidos/acompanhamentos`, itens_pedidos_has_acompanhamentos)
app.use(`/itens_pedidos/adicionais`, itens_pedidos_has_adicionais)
app.use(`/itens_pedidos/escolhas`, itens_pedidos_has_escolhas)
app.use(`/itens_pedidos`, itens_pedidos)
app.use(`/login`, autenticacao)
app.use(`/mesas`, mesas)
app.use(`/opcoes_pagamento`, opcoes_pagamento)
app.use(`/pagamentos`, pagamentos)
app.use(`/pedidos/usuarios`, pedidos_has_usuarios)
app.use(`/pedidos`, pedidos)
app.use(`/permissoes/planos`, permissoes_has_planos)
app.use(`/permissoes`, permissoes)
app.use(`/pix/clientes`, pix)
app.use(`/pix/estabelecimentos`, pix_estabelecimentos)
app.use(`/planos`, planos)
app.use(`/promocoes`, promocoes)
app.use(`/setores`, setores)
app.use(`/status/pedidos`, status_pedidos)
app.use(`/telefones`, telefones)
app.use(`/tipos/cartao`, tipos_cartao)
app.use(`/tipos/conta`, tipos_conta)
app.use(`/tipos/telefone`, tipos_telefone)
app.use(`/usuarios/permissoes`, usuarios_has_permissoes)
app.use(`/usuarios`, usuarios)


/**
 * @description Inicialização API
 */
app.listen(app.get('port'), () => {
    console.log(`Port ${app.get('port')} foi inicializada`)
})
