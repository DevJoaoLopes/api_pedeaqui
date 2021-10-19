const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")

route.get('/', async (request, response) => {

    let aplicacoes_has_formas_pagamento = await mysql.queryAsync(`SELECT a.* FROM aplicacoes_has_formas_pagamento AS a`)
    
    return response.status(200).json({
        data: aplicacoes_has_formas_pagamento
    })

})

route.post('/', async (request, response) => {

    const {aplicacao_id, forma_pagamento_id} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO aplicacoes_has_formas_pagamento (aplicacao_id, forma_pagamento_id) VALUES (?, ?)`, [aplicacao_id, forma_pagamento_id])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {aplicacao_id, forma_pagamento_id} = request.body

    await mysql.queryAsync(`UPDATE aplicacoes_has_formas_pagamento SET aplicacao_id = ?, forma_pagamento_id = ? WHERE id = ?`, [aplicacao_id, forma_pagamento_id, request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`DELETE FROM aplicacoes_has_formas_pagamento WHERE id = ?`, [request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route