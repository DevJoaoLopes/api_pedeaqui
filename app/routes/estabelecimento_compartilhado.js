const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

route.get('/', async (request, response) => {

    let estabelecimento_compartilhado = await mysql.queryAsync(`SELECT e.* FROM estabelecimento_compartilhado AS e`)
    
    return response.status(200).json({
        data: estabelecimento_compartilhado
    })

})

route.post('/', async (request, response) => {

    const {principal_id, estabelecimento_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO estabelecimento_compartilhado (principal_id, estabelecimento_id) VALUES (?, ?)`, [principal_id, estabelecimento_id])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {principal_id, estabelecimento_id} = request.body

    await mysql.queryAsync(`UPDATE estabelecimento_compartilhado SET principal_id = ?, estabelecimento_id = ? WHERE id = ?`, [principal_id, estabelecimento_id, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM estabelecimento_compartilhado WHERE id = ?`, [request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route