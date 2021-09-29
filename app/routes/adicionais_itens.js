const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let adicionais_itens = await mysql.queryAsync(`SELECT a.* FROM adicionais_itens AS a WHERE a.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: adicionais_itens
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, adicional, quantidade, serve, repetir_item, descricao} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO adicionais_itens (estabelecimento_id, adicional, quantidade, serve, repetir_item, descricao, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, [estabelecimento_id, adicional, quantidade, serve, repetir_item, descricao, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {estabelecimento_id, adicional, quantidade, serve, repetir_item, descricao} = request.body

    await mysql.queryAsync(`UPDATE adicionais_itens SET estabelecimento_id = ?, adicional = ?, quantidade = ?, serve = ?, repetir_item = ?, descricao = ?, updated_at = ? WHERE id = ?`, [estabelecimento_id, adicional, quantidade, serve, repetir_item, descricao, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE adicionais_itens SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route