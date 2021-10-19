const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let pix_estabelecimentos = await mysql.queryAsync(`SELECT p.* FROM pix_estabelecimentos AS p WHERE p.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: pix_estabelecimentos
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, chave_pix_id, pix} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO pix_estabelecimentos (estabelecimento_id, chave_pix_id, pix, created_at) VALUES (?, ?, ?, ?)`, [estabelecimento_id, chave_pix_id, pix, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {estabelecimento_id, chave_pix_id, pix} = request.body

    await mysql.queryAsync(`UPDATE pix_estabelecimentos SET estabelecimento_id = ?, chave_pix_id = ?, pix = ?, updated_at = ? WHERE id = ?`, [estabelecimento_id, chave_pix_id, pix, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE pix_estabelecimentos SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route