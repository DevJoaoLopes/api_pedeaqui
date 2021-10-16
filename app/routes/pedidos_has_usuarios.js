const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let pedidos_has_usuarios = await mysql.queryAsync(`SELECT p.* FROM pedidos_has_usuarios AS p`)
    
    return response.status(200).json({
        data: pedidos_has_usuarios
    })

})

route.get('/:pedido_id', async (request, response) => {

    let pedidos_has_usuarios = await mysql.queryAsync(`
        SELECT pu.*, c.nome FROM pedidos_has_usuarios AS pu
        INNER JOIN usuarios AS u ON u.id = pu.usuario_id
        LEFT JOIN clientes AS c ON c.id = u.cliente_id
        WHERE pu.pedido_id = ?
    `, [request.params.pedido_id])
    
    return response.status(200).json({
        data: pedidos_has_usuarios
    })

})

route.post('/', async (request, response) => {

    const {pedido_id, usuario_id, admin, permitido} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO pedidos_has_usuarios (pedido_id, usuario_id, admin, chegada, permitido) VALUES (?, ?, ?, ?, ?)`, [pedido_id, usuario_id, admin, moment().format('YYYY-MM-DD HH:mm:ss'), permitido])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {pedido_id, usuario_id, admin, chegada, saida, permitido} = request.body

    await mysql.queryAsync(`UPDATE pedidos_has_usuarios SET pedido_id = ?, usuario_id = ?, admin = ?, chegada = ?, saida = ?, permitido = ? WHERE id = ?`, [pedido_id, usuario_id, admin, moment(chegada).format('YYYY-MM-DD HH:mm:ss'), moment(saida).format('YYYY-MM-DD HH:mm:ss'), permitido, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.post('/sair/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE pedidos_has_usuarios SET saida = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.post('/permitir/:id', async (request, response) => {

    const {permitido} = request.body

    await mysql.queryAsync(`UPDATE pedidos_has_usuarios SET permitido = ? WHERE id = ?`, [permitido, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

module.exports = route