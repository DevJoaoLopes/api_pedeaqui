const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let acompanhamentos_has_itens_cardapios = await mysql.queryAsync(`SELECT a.* FROM acompanhamentos_has_itens_cardapios AS a WHERE a.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: acompanhamentos_has_itens_cardapios
    })

})

route.post('/', async (request, response) => {

    const {acompanhamento_id, item_cardapio_id, valor} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO acompanhamentos_has_itens_cardapios (acompanhamento_id, item_cardapio_id, valor, created_at) VALUES (?, ?, ?, ?)`, [acompanhamento_id, item_cardapio_id, valor, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {acompanhamento_id, item_cardapio_id, valor} = request.body

    await mysql.queryAsync(`UPDATE acompanhamentos_has_itens_cardapios SET acompanhamento_id = ?, item_cardapio_id = ?, valor = ?, updated_at = ? WHERE id = ?`, [acompanhamento_id, item_cardapio_id, valor, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE acompanhamentos_has_itens_cardapios SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route