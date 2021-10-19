const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

route.get('/', async (request, response) => {

    let estabelecimentos_has_emails = await mysql.queryAsync(`SELECT e.* FROM estabelecimentos_has_emails AS e`)
    
    return response.status(200).json({
        data: estabelecimentos_has_emails
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, email_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO estabelecimentos_has_emails (estabelecimento_id, email_id) VALUES (?, ?)`, [estabelecimento_id, email_id])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {estabelecimento_id, email_id} = request.body

    await mysql.queryAsync(`UPDATE estabelecimentos_has_emails SET estabelecimento_id = ?, email_id = ? WHERE id = ?`, [estabelecimento_id, email_id, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM estabelecimentos_has_emails WHERE id = ?`, [request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route