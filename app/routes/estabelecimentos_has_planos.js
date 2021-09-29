const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

const desabilitar_planos = async (estabelecimento) => {
    return await mysql.queryAsync(`UPDATE estabelecimentos_has_planos SET ativo = 0 WHERE estabelecimento_id = ?`, estabelecimento)
}

route.get('/', async (request, response) => {

    let estabelecimentos_has_planos = await mysql.queryAsync(`SELECT e.* FROM estabelecimentos_has_planos AS e WHERE ativo = 1`)
    
    return response.status(200).json({
        data: estabelecimentos_has_planos
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, plano_id} = request.body

    await desabilitar_planos(estabelecimento_id)

    let registro = await mysql.queryAsync(`INSERT INTO estabelecimentos_has_planos (estabelecimento_id, plano_id, ativo) VALUES (?, ?, ?)`, [estabelecimento_id, plano_id, 1])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {estabelecimento_id, plano_id, ativo} = request.body

    await mysql.queryAsync(`UPDATE estabelecimentos_has_planos SET estabelecimento_id = ?, plano_id = ?, ativo = ? WHERE id = ?`, [estabelecimento_id, plano_id, ativo, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})


module.exports = route