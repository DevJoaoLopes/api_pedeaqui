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

route.get('/:pedido_id', async (request, response) => {

    let itens_pedidos = await mysql.queryAsync(`
        SELECT i.*, sp.status, c.nome FROM itens_pedidos AS i
        INNER JOIN status_pedidos AS sp ON sp.id = i.status_pedido_id
        INNER JOIN pedidos_has_usuarios AS pu ON pu.id = i.pedido_has_usuario_id
        INNER JOIN usuarios AS u ON u.id = pu.usuario_id
        INNER JOIN clientes AS c ON c.id = u.cliente_id
        WHERE pu.pedido_id = ?
    `, [request.params.pedido_id])

    let promocoes = await mysql.queryAsync(`
        SELECT p.* FROM promocoes AS p
        WHERE p.id IN (?)
    `, [itens_pedidos.map(i => i.promocao_id ? i.promocao_id : 0)])
    
    let acompanhamentos = await mysql.queryAsync(`
        SELECT ia.*, a.acompanhamento, a.obrigatorio FROM itens_pedidos_has_acompanhamentos AS ia
        INNER JOIN acompanhamentos_has_itens_cardapios AS ai ON ai.id = ia.acompanhamento_has_item_cardapio_id
        INNER JOIN acompanhamentos AS a ON a.id = ai.acompanhamento_id
        WHERE ia.item_pedido_id IN (?)
    `, [itens_pedidos.map(i => i.id)])
    
    let adicionais = await mysql.queryAsync(`
        SELECT ia.*, a.adicional FROM itens_pedidos_has_adicionais AS ia
        INNER JOIN adicionais_has_itens_cardapios AS ai ON ai.id = ia.adicional_has_item_cardapio_id
        INNER JOIN adicionais_itens AS a ON a.id = ai.adicional_id
        WHERE ia.item_pedido_id IN (?)
    `, [itens_pedidos.map(i => i.id)])

    itens_pedidos.map((i) => {
        i.promocao = promocoes.find(p => p.id === i.promocao_id)
        i.acompanhamentos = acompanhamentos.filter(a => a.item_pedido_id === i.id)
        i.adicionais = adicionais.filter(a => a.item_pedido_id === i.id)

        return null
    })

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