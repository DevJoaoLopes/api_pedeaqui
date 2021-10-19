const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let opcoes_pagamento = await mysql.queryAsync(`SELECT o.* FROM opcoes_pagamento AS o WHERE o.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: opcoes_pagamento
    })

})

route.post('/', async (request, response) => {

    const {opcao_pagamento} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO opcoes_pagamento (opcao_pagamento, created_at) VALUES (?, ?)`, [opcao_pagamento, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {opcao_pagamento} = request.body

    await mysql.queryAsync(`UPDATE opcoes_pagamento SET opcao_pagamento = ?, updated_at = ? WHERE id = ?`, [opcao_pagamento, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE opcoes_pagamento SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route