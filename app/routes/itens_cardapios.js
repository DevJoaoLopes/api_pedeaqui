const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let itens_cardapios = await mysql.queryAsync(`SELECT i.* FROM itens_cardapios AS i WHERE i.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: itens_cardapios
    })

})

route.get('/:estabelecimento_id', async (request, response) => {

    let itens_cardapios = await mysql.queryAsync(`SELECT i.* FROM itens_cardapios AS i WHERE i.deleted_at IS NULL AND i.estabelecimento_id = ?`, [request.params.estabelecimento_id])
    let imagens_itens_cardapios = await mysql.queryAsync(`SELECT i.* FROM imagens_itens_cardapios AS i WHERE i.deleted_at IS NULL`)
    let promocoes_itens_cardapios = await mysql.queryAsync(`
        SELECT p.* FROM promocoes AS p
        WHERE p.deleted_at IS NULL AND inicio <= ? AND termino >= ? AND ativo = 1 AND
        p.quantidade > (
            SELECT COUNT(i.id) AS utilizado FROM itens_pedidos AS i
            WHERE i.deleted_at IS NULL AND i.promocao_id = p.id
        )
    `, [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')])

    itens_cardapios.map((i) => {
        i.imagens = imagens_itens_cardapios.filter(imagem => imagem.item_cardapio_id === i.id)
        return null
    })
    
    itens_cardapios.map((i) => {
        i.promocoes = promocoes_itens_cardapios.filter(promocao => promocao.item_cardapio_id === i.id)
        return null
    })
    
    return response.status(200).json({
        data: itens_cardapios
    })

})

route.get('/detalhe/:id', async (request, response) => {

    let item_cardapio = (await mysql.queryAsync(`SELECT i.* FROM itens_cardapios AS i WHERE i.deleted_at IS NULL AND i.id = ?`, [request.params.id]))[0]  
    let imagens_item_cardapio = await mysql.queryAsync(`SELECT i.* FROM imagens_itens_cardapios AS i WHERE i.deleted_at IS NULL AND i.item_cardapio_id = ?`, [item_cardapio.id])
    let acompanhamentos_item_cardapio = await mysql.queryAsync(`
        SELECT a.*, ai.id AS acompanhamento_has_item_cardapio_id, ai.valor FROM acompanhamentos_has_itens_cardapios AS ai 
        INNER JOIN acompanhamentos AS a ON a.id = ai.acompanhamento_id
        WHERE ai.deleted_at IS NULL AND a.deleted_at IS NULL AND ai.item_cardapio_id = ?
    `, [item_cardapio.id])
    let adicionais_item_cardapio = await mysql.queryAsync(`
        SELECT a.*, ai.id AS adicional_has_item_cardapio_id, ai.valor FROM adicionais_has_itens_cardapios AS ai 
        INNER JOIN adicionais_itens AS a ON a.id = ai.adicional_id
        WHERE ai.deleted_at IS NULL AND a.deleted_at IS NULL AND ai.item_cardapio_id = ?
    `, [item_cardapio.id])
    let escolhas_item_cardapio = await mysql.queryAsync(`
        SELECT e.*, ei.id AS escolha_has_item_cardapio_id FROM escolhas_has_itens_cardapios AS ei 
        INNER JOIN escolhas AS e ON e.id = ei.escolha_id
        WHERE ei.deleted_at IS NULL AND e.deleted_at IS NULL AND ei.item_cardapio_id = ?
    `, [item_cardapio.id])
    if(escolhas_item_cardapio.length > 0){
        let escolhas_opcoes = await mysql.queryAsync(`
            SELECT eo.* FROM escolhas_opcoes AS eo 
            WHERE eo.deleted_at IS NULL AND eo.escolha_id IN (?)
        `, [escolhas_item_cardapio.map(e => e.id)])
        escolhas_item_cardapio.map(e => {
            e.opcoes = escolhas_opcoes.filter(eo => eo.escolha_id === e.id)
        })
    }
    let promocoes_item_cardapio = await mysql.queryAsync(`
        SELECT p.* FROM promocoes AS p
        WHERE p.deleted_at IS NULL AND inicio <= ? AND termino >= ? AND ativo = 1 AND p.item_cardapio_id = ? AND
        p.quantidade > (
            SELECT COUNT(i.id) AS utilizado FROM itens_pedidos AS i
            WHERE i.deleted_at IS NULL AND i.promocao_id = p.id
        )
    `, [moment().format('YYYY-MM-DD'), moment().format('YYYY-MM-DD'), item_cardapio.id])

    item_cardapio.imagens = imagens_item_cardapio
    item_cardapio.acompanhamentos = acompanhamentos_item_cardapio
    item_cardapio.adicionais = adicionais_item_cardapio
    item_cardapio.escolhas = escolhas_item_cardapio
    item_cardapio.promocoes = promocoes_item_cardapio
    
    return response.status(200).json({
        data: item_cardapio
    })

})

route.post('/', async (request, response) => {

    const {categoria_id, estabelecimento_id, preparado_por_id, item, valor, quantidade, serve, descricao} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO itens_cardapios (categoria_id, estabelecimento_id, preparado_por_id, item, valor, quantidade, serve, descricao, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [categoria_id, estabelecimento_id, preparado_por_id, item, valor, quantidade, serve, descricao, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {categoria_id, estabelecimento_id, preparado_por_id, item, valor, quantidade, serve, descricao} = request.body

    await mysql.queryAsync(`UPDATE itens_cardapios SET categoria_id = ?, estabelecimento_id = ?, preparado_por_id = ?, item = ?, valor = ?, quantidade = ?, serve = ?, descricao = ?, updated_at = ? WHERE id = ?`, [categoria_id, estabelecimento_id, preparado_por_id, item, valor, quantidade, serve, descricao, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE itens_cardapios SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route