const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let mesas = await mysql.queryAsync(`SELECT m.* FROM mesas AS m WHERE m.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: mesas
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, identificacao, quantidade_pessoas} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO mesas (estabelecimento_id, identificacao, quantidade_pessoas, created_at) VALUES (?, ?, ?, ?)`, [estabelecimento_id, identificacao, quantidade_pessoas, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {identificacao, quantidade_pessoas} = request.body

    await mysql.queryAsync(`UPDATE mesas SET identificacao = ?, quantidade_pessoas = ?, updated_at = ? WHERE id = ?`, [identificacao, quantidade_pessoas, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE mesas SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route