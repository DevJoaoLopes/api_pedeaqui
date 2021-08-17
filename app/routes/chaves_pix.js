const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let chaves_pix = await mysql.queryAsync(`SELECT c.* FROM chaves_pix AS c WHERE c.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: chaves_pix
    })

})

route.post('/', async (request, response) => {

    const {chave} = request.body

    let chave_pix = await mysql.queryAsync(`INSERT INTO chaves_pix (chave, created_at) VALUES (?, ?)`, [chave, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: chave_pix.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {chave} = request.body

    await mysql.queryAsync(`UPDATE chaves_pix SET chave = ?, updated_at = ? WHERE id = ?`, [chave, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE chaves_pix SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route