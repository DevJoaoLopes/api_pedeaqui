const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let categorias_estabelecimentos = await mysql.queryAsync(`SELECT c.* FROM categorias_estabelecimentos AS c WHERE c.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: categorias_estabelecimentos
    })

})

route.post('/', async (request, response) => {

    const {categoria, imagem} = request.body

    let categoria_estabelecimentos = await mysql.queryAsync(`INSERT INTO categorias_estabelecimentos (categoria, imagem, created_at) VALUES (?, ?, ?)`, [categoria, imagem, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: categoria_estabelecimentos.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {categoria, imagem} = request.body

    await mysql.queryAsync(`UPDATE categorias_estabelecimentos SET categoria = ?, imagem = ?, updated_at = ? WHERE id = ?`, [categoria, imagem, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE categorias_estabelecimentos SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route