const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let setores = await mysql.queryAsync(`SELECT s.* FROM setores AS s WHERE s.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: setores
    })

})

route.post('/', async (request, response) => {

    const {setor} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO setores (setor, created_at) VALUES (?, ?)`, [setor, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {setor} = request.body

    await mysql.queryAsync(`UPDATE setores SET setor = ?, updated_at = ? WHERE id = ?`, [setor, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE setores SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route