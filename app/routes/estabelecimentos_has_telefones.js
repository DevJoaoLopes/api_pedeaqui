const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

route.get('/', async (request, response) => {

    let estabelecimentos_has_telefones = await mysql.queryAsync(`SELECT e.* FROM estabelecimentos_has_telefones AS e`)
    
    return response.status(200).json({
        data: estabelecimentos_has_telefones
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, telefone_id, descricao} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO estabelecimentos_has_telefones (estabelecimento_id, telefone_id, descricao) VALUES (?, ?, ?)`, [estabelecimento_id, telefone_id, descricao])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {estabelecimento_id, telefone_id, descricao} = request.body

    await mysql.queryAsync(`UPDATE estabelecimentos_has_telefones SET estabelecimento_id = ?, telefone_id = ?, descricao = ? WHERE id = ?`, [estabelecimento_id, telefone_id, descricao, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM estabelecimentos_has_telefones WHERE id = ?`, [request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})



module.exports = route