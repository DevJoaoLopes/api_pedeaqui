const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let pedidos = await mysql.queryAsync(`SELECT p.* FROM pedidos AS p`)
    
    return response.status(200).json({
        data: pedidos
    })

})

route.post('/', async (request, response) => {

    const {mesa_id, estabelecimento_compartilhado_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO pedidos (mesa_id, estabelecimento_compartilhado_id, criado) VALUES (?, ?, ?)`, [mesa_id, estabelecimento_compartilhado_id, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    await mysql.queryAsync(`INSERT INTO pedidos_has_usuarios (pedido_id, usuario_id, admin, chegada, permitido) VALUES (?, ?, ?, ?, ?)`, [registro.insertId, request.user, 1, moment().format('YYYY-MM-DD HH:mm:ss'), 1])

    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {mesa_id, estabelecimento_compartilhado_id, criado, encerrado} = request.body

    await mysql.queryAsync(`UPDATE pedidos SET mesa_id = ?, estabelecimento_compartilhado_id = ?, criado = ?, encerrado = ? WHERE id = ?`, [mesa_id, estabelecimento_compartilhado_id, moment(criado).format('YYYY-MM-DD HH:mm:ss'), moment(encerrado).format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.post('/encerrar/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE pedidos SET encerrado = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

module.exports = route