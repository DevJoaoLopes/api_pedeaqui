const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let usuarios_has_permissoes = await mysql.queryAsync(`SELECT u.* FROM usuarios_has_permissoes AS u WHERE u.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: usuarios_has_permissoes
    })

})

route.post('/', async (request, response) => {

    const {usuario_id, permissao_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO usuarios_has_permissoes (usuario_id, permissao_id, created_at) VALUES (?, ?, ?)`, [usuario_id, permissao_id, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {usuario_id, permissao_id} = request.body

    await mysql.queryAsync(`UPDATE usuarios_has_permissoes SET usuario_id = ?, permissao_id = ?, updated_at = ? WHERE id = ?`, [usuario_id, permissao_id, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE usuarios_has_permissoes SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route