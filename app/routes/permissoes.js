const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let permissoes = await mysql.queryAsync(`SELECT p.* FROM permissoes AS p WHERE p.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: permissoes
    })

})

route.post('/', async (request, response) => {

    const {permissao} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO permissoes (permissao, created_at) VALUES (?, ?)`, [permissao, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {permissao} = request.body

    await mysql.queryAsync(`UPDATE permissoes SET permissao = ?, updated_at = ? WHERE id = ?`, [permissao, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE permissoes SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route