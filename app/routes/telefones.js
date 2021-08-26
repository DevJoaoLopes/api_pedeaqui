const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

const numero_remover_texto = (numero) => {
    return numero.replace(/\D/g, '')
} 

route.get('/', async (request, response) => {

    let telefones = await mysql.queryAsync(`SELECT t.* FROM telefones AS t WHERE t.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: telefones
    })

})

route.post('/', async (request, response) => {

    let {numero, tipo_telefone_id} = request.body

    numero = numero_remover_texto(numero)

    let telefone = await mysql.queryAsync(`INSERT INTO telefones (numero, tipo_telefone_id, created_at) VALUES (?, ?, ?)`, [numero, tipo_telefone_id, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: telefone.insertId
    })

})

route.put('/:id', async (request, response) => {

    let {numero, tipo_telefone_id} = request.body

    numero = numero_remover_texto(numero)

    await mysql.queryAsync(`UPDATE telefones SET numero = ?, tipo_telefone_id = ?, updated_at = ? WHERE id = ?`, [numero, tipo_telefone_id, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE telefones SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route