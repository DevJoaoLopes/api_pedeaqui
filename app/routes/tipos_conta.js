//Tipos de conta bancária

const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let tipos_conta = await mysql.queryAsync(`SELECT t.* FROM tipos_conta AS t WHERE t.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: tipos_conta
    })

})

route.post('/', async (request, response) => {

    const {tipo} = request.body

    let tipo_conta = await mysql.queryAsync(`INSERT INTO tipos_conta (tipo, created_at) VALUES (?, ?)`, [tipo, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: tipo_conta.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {tipo} = request.body

    await mysql.queryAsync(`UPDATE tipos_conta SET tipo = ?, updated_at = ? WHERE id = ?`, [tipo, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE tipos_conta SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route