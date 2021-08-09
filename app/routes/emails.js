const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

route.get('/', async (request, response) => {

    let emails = await mysql.queryAsync(`SELECT e.* FROM emails AS e`)
    
    return response.status(200).json({
        data: emails
    })

})

route.post('/', async (request, response) => {

    const {email} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO emails (email) VALUES (?)`, [email])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {email} = request.body

    await mysql.queryAsync(`UPDATE emails SET email = ? WHERE id = ?`, [email, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM emails WHERE id = ?`, [request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})


module.exports = route