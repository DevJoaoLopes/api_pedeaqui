const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let escolhas_has_itens_cardapios = await mysql.queryAsync(`SELECT e.* FROM escolhas_has_itens_cardapios AS e WHERE e.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: escolhas_has_itens_cardapios
    })

})

route.post('/', async (request, response) => {

    const {escolha_id, item_cardapio_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO escolhas_has_itens_cardapios (escolha_id, item_cardapio_id, created_at) VALUES (?, ?, ?)`, [escolha_id, item_cardapio_id, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {escolha_id, item_cardapio_id} = request.body

    await mysql.queryAsync(`UPDATE escolhas_has_itens_cardapios SET escolha_id = ?, item_cardapio_id = ?, updated_at = ? WHERE id = ?`, [escolha_id, item_cardapio_id, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE escolhas_has_itens_cardapios SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route