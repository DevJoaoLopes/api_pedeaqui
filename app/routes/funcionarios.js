const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let funcionarios = await mysql.queryAsync(`SELECT f.* FROM funcionarios AS f WHERE f.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: funcionarios
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, usuario_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO funcionarios (estabelecimento_id, usuario_id, created_at) VALUES (?, ?, ?)`, [estabelecimento_id, usuario_id, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {estabelecimento_id, usuario_id} = request.body

    await mysql.queryAsync(`UPDATE funcionarios SET estabelecimento_id = ?, usuario_id = ?, updated_at = ? WHERE id = ?`, [estabelecimento_id, usuario_id, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE funcionarios SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route