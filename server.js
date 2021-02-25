const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')
require("dotenv/config")
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

/**
 * @description Arquivos
 */
const teste = require('./app/routes/teste');

app.use(function(request, response, next) {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    response.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    next();
});

app.use(cookieParser())
app.use(bodyParser.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}))
app.use(cors())


app.set('port', process.env.API_PORT || 3131);

const validationToken = (request, response, next) => {
    var token = request.headers['authorization']
    if(!token){
        response.statusCode = 500
        return response.json({data: 'Token inválido ou inexistente'}) 
    }
    jwt.verify(token, process.env.SECRET, function(erro, decodificar) {
        if(erro){
            response.statusCode = 500
            return response.json({data: 'Token inválido ou inexistente'}) 
        } 
        request.userId = decodificar.id
        next()
    });
}

app.get(`/`, (request, response) => {
    return response.status(200).json({
        data: 'Bem vindo a nossa API.'
    })
})

app.use(`/teste`, teste)

if(parseInt(process.env.PRODUCAO) === 1){
    app.listen(app.get('port'), () => {
        console.log(`Port ${app.get('port')} foi inicializada`);
    })
}
else{
    const optionsSSL = {
        key: fs.readFileSync(__dirname + process.env.KEYPEM),
        cert: fs.readFileSync(__dirname + process.env.CERT),
    }

    https.createServer(optionsSSL, app).listen(app.get('port'), () => {
        console.log(`Port ${app.get('port')} foi inicializada com SSL`);
    })
}