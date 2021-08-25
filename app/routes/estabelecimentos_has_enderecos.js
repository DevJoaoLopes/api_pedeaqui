const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

route.get('/', async (request, response) => {

    let estabelecimentos_has_enderecos = await mysql.queryAsync(`SELECT e.* FROM estabelecimentos_has_enderecos AS e`)
    
    return response.status(200).json({
        data: estabelecimentos_has_enderecos
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, endereco_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO estabelecimentos_has_enderecos (estabelecimento_id, endereco_id) VALUES (?, ?)`, [estabelecimento_id, endereco_id])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {estabelecimento_id, endereco_id} = request.body

    await mysql.queryAsync(`UPDATE estabelecimentos_has_enderecos SET estabelecimento_id = ?, endereco_id = ? WHERE id = ?`, [estabelecimento_id, endereco_id, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM estabelecimentos_has_enderecos WHERE id = ?`, [request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route