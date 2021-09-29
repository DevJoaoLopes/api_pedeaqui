const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let acompanhamentos = await mysql.queryAsync(`SELECT a.* FROM acompanhamentos AS a WHERE a.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: acompanhamentos
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, setor_id, acompanhamento, obrigatorio, quantidade, serve, repetir_item, descricao} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO acompanhamentos (estabelecimento_id, setor_id, acompanhamento, obrigatorio, quantidade, serve, repetir_item, descricao, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`, [estabelecimento_id, setor_id, acompanhamento, obrigatorio, quantidade, serve, repetir_item, descricao, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {estabelecimento_id, setor_id, acompanhamento, obrigatorio, quantidade, serve, repetir_item, descricao} = request.body

    await mysql.queryAsync(`UPDATE acompanhamentos SET estabelecimento_id = ?, setor_id = ?, acompanhamento = ?, obrigatorio = ?, quantidade = ?, serve = ?, repetir_item = ?, descricao = ?, updated_at = ? WHERE id = ?`, [estabelecimento_id, setor_id, acompanhamento, obrigatorio, quantidade, serve, repetir_item, descricao, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE acompanhamentos SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route