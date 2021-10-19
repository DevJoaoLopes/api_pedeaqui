const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")


const usuario_existe = async (usuario) => {
    let user = await mysql.queryAsync(`SELECT u.* FROM usuarios AS u WHERE u.usuario = ?`, usuario)
    return user
} 

route.get('/', async (request, response) => {

    let usuarios = await mysql.queryAsync(`SELECT u.id, u.usuario, u.created_at, u.updated_at FROM usuarios AS u WHERE u.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: usuarios
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, cliente_id, estabelecimento_email_id, cliente_email_id, usuario, senha} = request.body

    let validacao_usuario = await usuario_existe(usuario)

    if(validacao_usuario.length > 0){
        return response.status(500).json({
            data: `Usuário já existe`
        })
    }

    let registro = await mysql.queryAsync(`INSERT INTO usuarios (estabelecimento_id, cliente_id, estabelecimento_email_id, cliente_email_id, usuario, senha, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, [estabelecimento_id, cliente_id, estabelecimento_email_id, cliente_email_id, usuario, senha, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {estabelecimento_id, cliente_id, estabelecimento_email_id, cliente_email_id, usuario, senha} = request.body

    let validacao_usuario = await usuario_existe(usuario)

    if(validacao_usuario.length > 0 && validacao_usuario[0].usuario !== usuario){
        return response.status(500).json({
            data: `Usuário já existe`
        })
    }

    await mysql.queryAsync(`UPDATE usuarios SET estabelecimento_id = ?, cliente_id = ?, estabelecimento_email_id = ?, cliente_email_id = ?, usuario = ?, senha = ?, updated_at = ? WHERE id = ?`, [estabelecimento_id, cliente_id, estabelecimento_email_id, cliente_email_id, usuario, senha, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE usuarios SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route