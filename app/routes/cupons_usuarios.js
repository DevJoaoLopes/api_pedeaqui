const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let cupons_usuarios = await mysql.queryAsync(`SELECT c.* FROM cupons_usuarios AS c WHERE c.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: cupons_usuarios
    })

})

route.post('/', async (request, response) => {

    const {usuario_id, codigo, valor, inicio, termino, quantidade, ativo} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO cupons_usuarios (usuario_id, codigo, valor, inicio, termino, quantidade, ativo, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [usuario_id, codigo, valor, inicio, termino, quantidade, ativo, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {usuario_id, codigo, valor, inicio, termino, quantidade, ativo} = request.body

    await mysql.queryAsync(`UPDATE cupons_usuarios SET usuario_id = ?, codigo = ?, valor = ?, inicio = ?, termino = ?, quantidade = ?, ativo = ?, updated_at = ? WHERE id = ?`, [usuario_id, codigo, valor, inicio, termino, quantidade, ativo, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE cupons_usuarios SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route