//Categorias dos itens do cardápio

const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let categorias = await mysql.queryAsync(`SELECT c.* FROM categorias AS c WHERE c.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: categorias
    })

})

route.post('/', async (request, response) => {

    const {categoria, imagem} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO categorias (categoria, imagem, created_at) VALUES (?, ?, ?)`, [categoria, imagem, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {categoria, imagem} = request.body

    await mysql.queryAsync(`UPDATE categorias SET categoria = ?, imagem = ?, updated_at = ? WHERE id = ?`, [categoria, imagem, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE categorias SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route