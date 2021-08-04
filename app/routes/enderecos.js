const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

route.get('/', async (request, response) => {

    let enderecos = await mysql.queryAsync(`SELECT e.* FROM enderecos AS e`)
    
    return response.status(200).json({
        data: enderecos
    })

})

route.post('/', async (request, response) => {

    const {cep, logradouro, numero, bairro, cidade, uf, complemento} = request.body

    let endereco = await mysql.queryAsync(`INSERT INTO enderecos (cep, logradouro, numero, bairro, cidade, uf, complemento) VALUES (?, ?, ?, ?, ?, ?, ?)`, [cep, logradouro, numero, bairro, cidade, uf, complemento])
    
    return response.status(200).json({
        data: endereco.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {cep, logradouro, numero, bairro, cidade, uf, complemento} = request.body

    await mysql.queryAsync(`UPDATE enderecos SET cep = ?, logradouro = ?, numero = ?, bairro = ?, cidade = ?, uf = ?, complemento = ? WHERE id = ?`, [cep, logradouro, numero, bairro, cidade, uf, complemento, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM enderecos WHERE id = ?`, [request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})


module.exports = route