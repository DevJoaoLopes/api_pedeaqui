const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let escolhas_opcoes = await mysql.queryAsync(`SELECT e.* FROM escolhas_opcoes AS e WHERE e.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: escolhas_opcoes
    })

})

route.post('/', async (request, response) => {

    const {escolha_id, opcao} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO escolhas_opcoes (escolha_id, opcao, created_at) VALUES (?, ?, ?)`, [escolha_id, opcao, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {escolha_id, opcao} = request.body

    await mysql.queryAsync(`UPDATE escolhas_opcoes SET escolha_id = ?, opcao = ?, updated_at = ? WHERE id = ?`, [escolha_id, opcao, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE escolhas_opcoes SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route