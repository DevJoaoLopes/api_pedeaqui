const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let enderecos = await mysql.queryAsync(`SELECT e.* FROM enderecos AS e WHERE e.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: enderecos
    })

})

route.post('/', async (request, response) => {

    const {cep, logradouro, numero, bairro, cidade, uf, complemento} = request.body

    let endereco = await mysql.queryAsync(`INSERT INTO enderecos (cep, logradouro, numero, bairro, cidade, uf, complemento, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [cep, logradouro, numero, bairro, cidade, uf, complemento, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: endereco.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {cep, logradouro, numero, bairro, cidade, uf, complemento} = request.body

    await mysql.queryAsync(`UPDATE enderecos SET cep = ?, logradouro = ?, numero = ?, bairro = ?, cidade = ?, uf = ?, complemento = ?, updated_at = ? WHERE id = ?`, [cep, logradouro, numero, bairro, cidade, uf, complemento, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE enderecos SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })

})


module.exports = route