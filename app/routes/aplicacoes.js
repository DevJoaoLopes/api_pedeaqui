const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let aplicacoes = await mysql.queryAsync(`SELECT a.* FROM aplicacoes AS a WHERE a.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: aplicacoes
    })

})

route.post('/', async (request, response) => {

    const {aplicacao} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO aplicacoes (aplicacao, created_at) VALUES (?, ?)`, [aplicacao, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {aplicacao} = request.body

    await mysql.queryAsync(`UPDATE aplicacoes SET aplicacao = ?, updated_at = ? WHERE id = ?`, [aplicacao, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE aplicacoes SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route