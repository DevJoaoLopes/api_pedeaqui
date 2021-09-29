const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let itens_pedidos_has_adicionais = await mysql.queryAsync(`SELECT i.* FROM itens_pedidos_has_adicionais AS i WHERE i.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: itens_pedidos_has_adicionais
    })

})

route.post('/', async (request, response) => {

    const {item_pedido_id, adicional_has_item_cardapio_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO itens_pedidos_has_adicionais (item_pedido_id, adicional_has_item_cardapio_id, created_at) VALUES (?, ?, ?)`, [item_pedido_id, adicional_has_item_cardapio_id, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {item_pedido_id, adicional_has_item_cardapio_id} = request.body

    await mysql.queryAsync(`UPDATE itens_pedidos_has_adicionais SET item_pedido_id = ?, adicional_has_item_cardapio_id = ?, updated_at = ? WHERE id = ?`, [item_pedido_id, adicional_has_item_cardapio_id, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE itens_pedidos_has_adicionais SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route