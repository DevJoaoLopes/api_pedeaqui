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
        SELECT i.*, sp.status, c.nome, ic.item, i.pedido_has_usuario_id FROM itens_pedidos AS i
        INNER JOIN status_pedidos AS sp ON sp.id = i.status_pedido_id
        INNER JOIN itens_cardapios AS ic ON ic.id = i.item_cardapio_id
        INNER JOIN pedidos_has_usuarios AS pu ON pu.id = i.pedido_has_usuario_id
        INNER JOIN usuarios AS u ON u.id = pu.usuario_id
        INNER JOIN clientes AS c ON c.id = u.cliente_id
        WHERE pu.pedido_id = ? AND i.deleted_at IS NULL
    `, [request.params.pedido_id])

    let valor = 0
    if(itens_pedidos.length > 0){
        let promocoes = await mysql.queryAsync(`
            SELECT p.* FROM promocoes AS p
            WHERE p.id IN (?)
        `, [itens_pedidos.map(i => i.promocao_id ? i.promocao_id : 0)])
        
        let acompanhamentos = await mysql.queryAsync(`
            SELECT ia.*, a.acompanhamento, a.obrigatorio FROM itens_pedidos_has_acompanhamentos AS ia
            INNER JOIN acompanhamentos_has_itens_cardapios AS ai ON ai.id = ia.acompanhamento_has_item_cardapio_id
            INNER JOIN acompanhamentos AS a ON a.id = ai.acompanhamento_id
            WHERE ia.item_pedido_id IN (?) AND ia.deleted_at IS NULL
        `, [itens_pedidos.map(i => i.id)])
        
        let adicionais = await mysql.queryAsync(`
            SELECT ia.*, a.adicional FROM itens_pedidos_has_adicionais AS ia
            INNER JOIN adicionais_has_itens_cardapios AS ai ON ai.id = ia.adicional_has_item_cardapio_id
            INNER JOIN adicionais_itens AS a ON a.id = ai.adicional_id
            WHERE ia.item_pedido_id IN (?) AND ia.deleted_at IS NULL
        `, [itens_pedidos.map(i => i.id)])
        
        let escolhas = await mysql.queryAsync(`
            SELECT ie.*, e.escolha, eo.opcao FROM itens_pedidos_has_escolhas AS ie
            INNER JOIN escolhas_has_itens_cardapios AS ei ON ei.id = ie.escolha_has_item_cardapio_id
            INNER JOIN escolhas AS e ON e.id = ei.escolha_id
            INNER JOIN escolhas_opcoes AS eo ON eo.id = ie.escolha_opcao_id
            WHERE ie.item_pedido_id IN (?) AND ie.deleted_at IS NULL
        `, [itens_pedidos.map(i => i.id)])
        
        let imagens = await mysql.queryAsync(`
            SELECT iic.*, ip.id AS item_pedido_id FROM imagens_itens_cardapios AS iic
            INNER JOIN itens_cardapios AS ic ON ic.id = iic.item_cardapio_id
            INNER JOIN itens_pedidos AS ip ON ip.item_cardapio_id = iic.id
            WHERE ip.id IN (?) AND iic.deleted_at IS NULL
        `, [itens_pedidos.map(i => i.id)])
    
        itens_pedidos.map((i) => {
            i.promocao = promocoes.find(p => p.id === i.promocao_id)
            i.acompanhamentos = acompanhamentos.filter(a => a.item_pedido_id === i.id)
            i.adicionais = adicionais.filter(a => a.item_pedido_id === i.id)
            i.escolhas = escolhas.filter(e => e.item_pedido_id === i.id)
            i.imagens = imagens.filter(i => i.item_pedido_id === i.id)
    
            return null
        })
    
        itens_pedidos.map((ip) => {
            let item_valor = 0
    
            item_valor += ip.promocao.valor ? ip.promocao.valor : 0
            item_valor += ip.acompanhamentos.filter(a => !a.obrigatorio).map(a => a.valor).reduce((x, y) => x + y, 0) 
            item_valor += ip.adicionais.map(a => a.valor).reduce((x, y) => x + y, 0) 
    
            ip.valor = item_valor
            valor += item_valor
    
            return null
        })
    }

    return response.status(200).json({
        data: {
            itens_pedidos,
            valor_total: valor
        }
    })

})

route.get('/estabelecimentos/cozinha/:estabelecimento_id', async (request, response) => {

    let inicio = moment().subtract(5, 'hours').format('YYYY-MM-DD HH:mm:ss')
    let termino = moment().format('YYYY-MM-DD HH:mm:ss')

    let itens_pedidos = await mysql.queryAsync(`
        SELECT i.*, sp.status, c.nome, ic.item, i.pedido_has_usuario_id, s.setor AS preparado_por, m.identificacao FROM itens_pedidos AS i
        INNER JOIN status_pedidos AS sp ON sp.id = i.status_pedido_id
        INNER JOIN itens_cardapios AS ic ON ic.id = i.item_cardapio_id
        INNER JOIN setores AS s ON s.id = ic.preparado_por_id
        INNER JOIN pedidos_has_usuarios AS pu ON pu.id = i.pedido_has_usuario_id
        INNER JOIN pedidos AS p ON p.id = pu.pedido_id
        INNER JOIN mesas AS m ON m.id = p.mesa_id
        INNER JOIN usuarios AS u ON u.id = pu.usuario_id
        INNER JOIN clientes AS c ON c.id = u.cliente_id
        WHERE ic.estabelecimento_id = ? AND i.deleted_at IS NULL AND s.setor = 'Cozinha'
    `, [request.params.estabelecimento_id])
    //     WHERE ic.estabelecimento_id = ? AND i.deleted_at IS NULL AND
    //     i.created_at >= ? AND i.created_at <= ?
    // `, [request.params.estabelecimento_id, inicio, termino])

    if(itens_pedidos.length > 0){
        let promocoes = await mysql.queryAsync(`
            SELECT p.* FROM promocoes AS p
            WHERE p.id IN (?)
        `, [itens_pedidos.map(i => i.promocao_id ? i.promocao_id : 0)])
        
        let acompanhamentos = await mysql.queryAsync(`
            SELECT ia.*, a.acompanhamento, a.obrigatorio FROM itens_pedidos_has_acompanhamentos AS ia
            INNER JOIN acompanhamentos_has_itens_cardapios AS ai ON ai.id = ia.acompanhamento_has_item_cardapio_id
            INNER JOIN acompanhamentos AS a ON a.id = ai.acompanhamento_id
            WHERE ia.item_pedido_id IN (?) AND ia.deleted_at IS NULL
        `, [itens_pedidos.map(i => i.id)])
        
        let adicionais = await mysql.queryAsync(`
            SELECT ia.*, a.adicional FROM itens_pedidos_has_adicionais AS ia
            INNER JOIN adicionais_has_itens_cardapios AS ai ON ai.id = ia.adicional_has_item_cardapio_id
            INNER JOIN adicionais_itens AS a ON a.id = ai.adicional_id
            WHERE ia.item_pedido_id IN (?) AND ia.deleted_at IS NULL
        `, [itens_pedidos.map(i => i.id)])

        let escolhas = await mysql.queryAsync(`
            SELECT ie.*, e.escolha, eo.opcao FROM itens_pedidos_has_escolhas AS ie
            INNER JOIN escolhas_has_itens_cardapios AS ei ON ei.id = ie.escolha_has_item_cardapio_id
            INNER JOIN escolhas AS e ON e.id = ei.escolha_id
            INNER JOIN escolhas_opcoes AS eo ON eo.id = ie.escolha_opcao_id
            WHERE ie.item_pedido_id IN (?) AND ie.deleted_at IS NULL
        `, [itens_pedidos.map(i => i.id)])
        
        itens_pedidos.map((i) => {
            i.promocao = promocoes.find(p => p.id === i.promocao_id)
            i.acompanhamentos = acompanhamentos.filter(a => a.item_pedido_id === i.id)
            i.adicionais = adicionais.filter(a => a.item_pedido_id === i.id)
            i.escolhas = escolhas.filter(e => e.item_pedido_id === i.id)
    
            return null
        })
    }

    return response.status(200).json({
        data: itens_pedidos
    })

})

route.post('/', async (request, response) => {

    const {indice, item_cardapio_id, pedido_has_usuario_id, status_pedido_id, promocao_id, observacao, adicionais, acompanhamentos, adicionais_obrigatorios, acompanhamentos_obrigatorios, escolhas} = request.body
 
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
    
    escolhas.map(async (e) => {
        await mysql.queryAsync(`INSERT INTO itens_pedidos_has_escolhas (item_pedido_id, escolha_has_item_cardapio_id, escolha_opcao_id, created_at) VALUES (?, ?, ?, ?)`, [item_pedido.insertId, e.escolha.escolha_has_item_cardapio_id, e.opcao.id, moment().format('YYYY-MM-DD HH:mm:ss')])
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

    let pedido_has_usuario = await mysql.queryAsync(`
        SELECT pu.id FROM itens_pedidos AS ip 
        INNER JOIN pedidos_has_usuarios AS pu ON pu.id = ip.pedido_has_usuario_id
        WHERE pu.usuario_id = ?
    `, [request.user])

    await mysql.queryAsync(`UPDATE itens_pedidos SET excluso_por = ?, deleted_at = ? WHERE id = ?`, [pedido_has_usuario[0].id, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route