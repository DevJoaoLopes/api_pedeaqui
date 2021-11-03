const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let itens_pedidos = await mysql.queryAsync(`SELECT i.* FROM itens_pedidos AS i`)
    
    return response.status(200).json({
        data: itens_pedidos
    })

})

route.post('/', async (request, response) => {

    const {indice, item_cardapio_id, pedido_has_usuario_id, status_pedido_id, promocao_id, observacao, adicionais, acompanhamentos, adicionais_obrigatorios, acompanhamentos_obrigatorios} = request.body
 
    let item_pedido = await mysql.queryAsync(`INSERT INTO itens_pedidos (item_cardapio_id, pedido_has_usuario_id, status_pedido_id, promocao_id, observacao, created_at) VALUES (?, ?, ?, ?, ?, ?)`, [item_cardapio_id, pedido_has_usuario_id, status_pedido_id, promocao_id, observacao, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    adicionais.map(async (a) => {
        await mysql.queryAsync(`INSERT INTO itens_pedidos_has_adicionais (item_pedido_id, adicional_has_item_cardapio_id, valor, created_at) VALUES (?, ?, ?, ?)`, [item_pedido.insertId, a.adicional_has_item_cardapio_id, a.valor, moment().format('YYYY-MM-DD HH:mm:ss')])
    })
    
    adicionais_obrigatorios.map(async (a) => {
        await mysql.queryAsync(`INSERT INTO itens_pedidos_has_adicionais (item_pedido_id, adicional_has_item_cardapio_id, valor, created_at) VALUES (?, ?, ?, ?)`, [item_pedido.insertId, a.adicional_has_item_cardapio_id, a.valor, moment().format('YYYY-MM-DD HH:mm:ss')])
    })
    
    acompanhamentos.map(async (a) => {
        await mysql.queryAsync(`INSERT INTO itens_pedidos_has_acompanhamentos (item_pedido_id, acompanhamento_has_item_cardapio_id, valor, created_at) VALUES (?, ?, ?, ?)`, [item_pedido.insertId, a.acompanhamento_has_item_cardapio_id, a.valor, moment().format('YYYY-MM-DD HH:mm:ss')])
    })
    
    acompanhamentos_obrigatorios.map(async (a) => {
        await mysql.queryAsync(`INSERT INTO itens_pedidos_has_acompanhamentos (item_pedido_id, acompanhamento_has_item_cardapio_id, valor, created_at) VALUES (?, ?, ?, ?)`, [item_pedido.insertId, a.acompanhamento_has_item_cardapio_id, a.valor, moment().format('YYYY-MM-DD HH:mm:ss')])
    })

    return response.status(201).json({
        data: item_pedido.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {status_pedido_id, promocao_id, observacao} = request.body
    
    await mysql.queryAsync(`UPDATE itens_pedidos SET status_pedido_id = ?, promocao_id = ?, observacao = ?, updated_at = ? WHERE id = ?`, [status_pedido_id, promocao_id, observacao, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
    
})

route.delete('/:id', async (request, response) => {

    const {excluso_por} = request.body

    await mysql.queryAsync(`UPDATE itens_pedidos SET excluso_por = ?, deleted_at = ? WHERE id = ?`, [excluso_por, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route