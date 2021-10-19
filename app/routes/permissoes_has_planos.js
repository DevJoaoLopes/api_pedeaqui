const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

route.get('/', async (request, response) => {

    let permissoes_has_planos = await mysql.queryAsync(`SELECT p.* FROM permissoes_has_planos AS p`)
    
    return response.status(200).json({
        data: permissoes_has_planos
    })

})

route.post('/', async (request, response) => {

    const {permissao_id, plano_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO permissoes_has_planos (permissao_id, plano_id) VALUES (?, ?)`, [permissao_id, plano_id])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {permissao_id, plano_id} = request.body

    await mysql.queryAsync(`UPDATE permissoes_has_planos SET permissao_id = ?, plano_id = ? WHERE id = ?`, [permissao_id, plano_id, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM permissoes_has_planos WHERE id = ?`, [request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route