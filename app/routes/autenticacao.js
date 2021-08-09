const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
require("dotenv/config")
const jwt = require('jsonwebtoken')

route.post('/', async (request, response) => {

    const {acesso, senha} = request.body

    let usuario = await mysql.queryAsync(`
        SELECT u.id, u.usuario, em.email FROM usuarios AS u
        LEFT JOIN estabelecimentos AS e ON e.id = u.estabelecimento_id
        LEFT JOIN clientes AS c ON c.id = u.cliente_id
        LEFT JOIN estabelecimentos_has_emails AS ee ON ee.id = u.estabelecimento_email_id
        LEFT JOIN clientes_has_emails AS ce ON ce.id = u.cliente_email_id
        LEFT JOIN emails AS em ON em.id = ee.email_id OR em.id = ce.email_id
        WHERE (em.email = ? OR u.usuario = ?) AND senha = ? AND em.deleted_at IS NULL`, [acesso, acesso, senha]
    )
    
    if(usuario.length > 0){

        let permissoes = await mysql.queryAsync(`
            SELECT p.permissao FROM usuarios_has_permissoes AS up
            INNER JOIN permissoes AS p ON p.id = up.permissao_id
            WHERE up.usuario_id = ?`, [usuario[0].id]
        )

        return response.status(200).json({
            data: {token: jwt.sign(usuario[0].id, process.env.SECRET), usuario: usuario, permissoes: permissoes}
        })
        
    }

    return response.status(404).json({
        data: `Falha ao realizar login, verifique os dados de acesso`
    })

})


module.exports = route