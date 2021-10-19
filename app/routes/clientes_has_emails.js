const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

route.get('/', async (request, response) => {

    let clientes_has_emails = await mysql.queryAsync(`SELECT c.* FROM clientes_has_emails AS c`)
    
    return response.status(200).json({
        data: clientes_has_emails
    })

})

route.post('/', async (request, response) => {

    const {cliente_id, email_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO clientes_has_emails (cliente_id, email_id) VALUES (?, ?)`, [cliente_id, email_id])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {cliente_id, email_id} = request.body

    await mysql.queryAsync(`UPDATE clientes_has_emails SET cliente_id = ?, email_id = ? WHERE id = ?`, [cliente_id, email_id, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM clientes_has_emails WHERE id = ?`, [request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route