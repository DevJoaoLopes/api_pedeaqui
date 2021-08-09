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
const clientes = require('./app/routes/clientes')
const autenticacao = require('./app/routes/autenticacao')
const enderecos = require('./app/routes/enderecos')
const emails = require('./app/routes/emails')
const estabelecimentos = require('./app/routes/estabelecimentos')


/**
 * @description Rotas
 */
app.get(`/`, (request, response) => {
    return response.status(200).json({
        data: 'Bem vindo a API da aplicação PedeAqui.'
    })
})

app.use(`/login`, autenticacao)
app.use(`/clientes`, clientes)
app.use(`/enderecos`, enderecos)
app.use(`/emails`, emails)
app.use(`/estabelecimentos`, estabelecimentos)


/**
 * @description Inicialização API
 */
app.listen(app.get('port'), () => {
    console.log(`Port ${app.get('port')} foi inicializada`)
})
