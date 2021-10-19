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