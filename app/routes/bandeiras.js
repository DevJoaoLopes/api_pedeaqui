const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let bandeiras = await mysql.queryAsync(`SELECT b.* FROM bandeiras AS b WHERE b.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: bandeiras
    })

})

route.post('/', async (request, response) => {

    const {bandeira} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO bandeiras (bandeira, created_at) VALUES (?, ?)`, [bandeira, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {bandeira} = request.body

    await mysql.queryAsync(`UPDATE bandeiras SET bandeira = ?, updated_at = ? WHERE id = ?`, [bandeira, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE bandeiras SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route