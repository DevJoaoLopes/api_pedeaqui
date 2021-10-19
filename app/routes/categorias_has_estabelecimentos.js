const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

const categoria_existe = async (id) => {
    let categoria = await mysql.queryAsync(`SELECT c.* FROM categorias_estabelecimentos AS c WHERE c.id = ? AND c.deleted_at IS NULL`, id)
    return categoria
} 

const estabelecimento_existe = async (id) => {
    let estabelecimento = await mysql.queryAsync(`SELECT e.* FROM estabelecimentos AS e WHERE e.id = ? AND e.deleted_at IS NULL`, id)
    return estabelecimento
} 

route.get('/', async (request, response) => {

    let categorias_has_estabelecimentos = await mysql.queryAsync(`SELECT c.* FROM categorias_has_estabelecimentos AS c`)
    
    return response.status(200).json({
        data: categorias_has_estabelecimentos
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, categoria_id} = request.body

    let validacao_estabelecimento = await estabelecimento_existe(estabelecimento_id)
    let validacao_categoria = await categoria_existe(categoria_id)

    if(validacao_estabelecimento.length === 0){
        return response.status(500).json({
            data: `Estabelecimento não existente`
        })
    }

    if(validacao_categoria.length === 0){
        return response.status(500).json({
            data: `Categoria não existente`
        })
    }

    let categorias_has_estabelecimentos = await mysql.queryAsync(`INSERT INTO categorias_has_estabelecimentos (estabelecimento_id, categoria_id) VALUES (?, ?)`, [estabelecimento_id, categoria_id])
    
    return response.status(201).json({
        data: categorias_has_estabelecimentos.insertId
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM categorias_has_estabelecimentos WHERE id = ?`, [request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route