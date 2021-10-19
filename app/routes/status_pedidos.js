const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let status_pedidos = await mysql.queryAsync(`SELECT s.* FROM status_pedidos AS s WHERE s.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: status_pedidos
    })

})

route.post('/', async (request, response) => {

    const {status} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO status_pedidos (status, created_at) VALUES (?, ?)`, [status, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {status} = request.body

    await mysql.queryAsync(`UPDATE status_pedidos SET status = ?, updated_at = ? WHERE id = ?`, [status, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE status_pedidos SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route