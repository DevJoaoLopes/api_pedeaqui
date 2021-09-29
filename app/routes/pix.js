const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let pix = await mysql.queryAsync(`SELECT p.* FROM pix AS p WHERE p.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: pix
    })

})

route.post('/', async (request, response) => {

    const {cliente_id, chave_pix_id, pix} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO pix (cliente_id, chave_pix_id, pix, created_at) VALUES (?, ?, ?, ?)`, [cliente_id, chave_pix_id, pix, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {cliente_id, chave_pix_id, pix} = request.body

    await mysql.queryAsync(`UPDATE pix SET cliente_id = ?, chave_pix_id = ?, pix = ?, updated_at = ? WHERE id = ?`, [cliente_id, chave_pix_id, pix, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE pix SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route