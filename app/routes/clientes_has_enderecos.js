const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

route.get('/', async (request, response) => {

    let clientes_has_enderecos = await mysql.queryAsync(`SELECT c.* FROM clientes_has_enderecos AS c`)
    
    return response.status(200).json({
        data: clientes_has_enderecos
    })

})

route.post('/', async (request, response) => {

    const {cliente_id, endereco_id, descricao} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO clientes_has_enderecos (cliente_id, endereco_id, descricao) VALUES (?, ?, ?)`, [cliente_id, endereco_id, descricao])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {cliente_id, endereco_id, descricao} = request.body

    await mysql.queryAsync(`UPDATE clientes_has_enderecos SET cliente_id = ?, endereco_id = ?, descricao = ? WHERE id = ?`, [cliente_id, endereco_id, descricao, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM clientes_has_enderecos WHERE id = ?`, [request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route