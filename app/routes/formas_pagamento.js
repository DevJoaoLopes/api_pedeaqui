const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let formas_pagamento = await mysql.queryAsync(`SELECT f.* FROM formas_pagamento AS f WHERE f.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: formas_pagamento
    })

})

route.post('/', async (request, response) => {

    const {forma_pagamento} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO formas_pagamento (forma_pagamento, created_at) VALUES (?, ?)`, [forma_pagamento, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {forma_pagamento} = request.body

    await mysql.queryAsync(`UPDATE formas_pagamento SET forma_pagamento = ?, updated_at = ? WHERE id = ?`, [forma_pagamento, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE formas_pagamento SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route