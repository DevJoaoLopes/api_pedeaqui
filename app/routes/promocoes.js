const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let promocoes = await mysql.queryAsync(`SELECT p.* FROM promocoes AS p WHERE p.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: promocoes
    })

})

route.post('/', async (request, response) => {

    const {item_cardapio_id, valor, inicio, termino, quantidade, ativo} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO promocoes (item_cardapio_id, valor, inicio, termino, quantidade, ativo, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)`, [item_cardapio_id, valor, inicio, termino, quantidade, ativo, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {item_cardapio_id, valor, inicio, termino, quantidade, ativo} = request.body

    await mysql.queryAsync(`UPDATE promocoes SET item_cardapio_id = ?, valor = ?, inicio = ?, termino = ?, quantidade = ?, ativo = ?, updated_at = ? WHERE id = ?`, [item_cardapio_id, valor, inicio, termino, quantidade, ativo, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE promocoes SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route