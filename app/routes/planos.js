const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let planos = await mysql.queryAsync(`SELECT p.* FROM planos AS p WHERE p.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: planos
    })

})

route.post('/', async (request, response) => {

    const {plano, valor, inicio, termino, desconto} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO planos (plano, valor, inicio, termino, desconto, created_at) VALUES (?, ?, ?, ?, ?, ?)`, [plano, valor, inicio, termino, desconto, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {plano, valor, inicio, termino, desconto} = request.body

    await mysql.queryAsync(`UPDATE planos SET plano = ?, valor = ?, inicio = ?, termino = ?, desconto = ?, updated_at = ? WHERE id = ?`, [plano, valor, inicio, termino, desconto, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE planos SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route