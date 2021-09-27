const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

route.get('/', async (request, response) => {

    let funcionarios_has_setores = await mysql.queryAsync(`SELECT p.* FROM funcionarios_has_setores AS p`)
    
    return response.status(200).json({
        data: funcionarios_has_setores
    })

})

route.post('/', async (request, response) => {

    const {funcionario_id, setor_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO funcionarios_has_setores (funcionario_id, setor_id) VALUES (?, ?)`, [funcionario_id, setor_id])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {funcionario_id, setor_id} = request.body

    await mysql.queryAsync(`UPDATE funcionarios_has_setores SET funcionario_id = ?, setor_id = ? WHERE id = ?`, [funcionario_id, setor_id, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM funcionarios_has_setores WHERE id = ?`, [request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route