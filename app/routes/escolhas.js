const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let escolhas = await mysql.queryAsync(`SELECT e.* FROM escolhas AS e WHERE e.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: escolhas
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, escolha, descricao} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO escolhas (estabelecimento_id, escolha, descricao, created_at) VALUES (?, ?, ?, ?)`, [estabelecimento_id, escolha, descricao, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {estabelecimento_id, escolha, descricao} = request.body

    await mysql.queryAsync(`UPDATE escolhas SET estabelecimento_id = ?, escolha = ?, descricao = ?, updated_at = ? WHERE id = ?`, [estabelecimento_id, escolha, descricao, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE escolhas SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route