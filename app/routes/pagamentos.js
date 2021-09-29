const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

route.get('/', async (request, response) => {

    let pagamentos = await mysql.queryAsync(`SELECT p.* FROM pagamentos AS p WHERE p.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: pagamentos
    })

})

route.post('/', async (request, response) => {

    const {forma_pagamento_id, opcao_pagamento_id, pedido_has_usuario_id, cupom_estabelecimento_id, cupom_usuario_id, cartao_id, valor, desconto, porcentagem, descricao} = request.body

    let registro = await mysql.queryAsync(`INSERT INTO pagamentos (forma_pagamento_id, opcao_pagamento_id, pedido_has_usuario_id, cupom_estabelecimento_id, cupom_usuario_id, cartao_id, valor, desconto, porcentagem, descricao, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [forma_pagamento_id, opcao_pagamento_id, pedido_has_usuario_id, cupom_estabelecimento_id, cupom_usuario_id, cartao_id, valor, desconto, porcentagem, descricao, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {forma_pagamento_id, opcao_pagamento_id, pedido_has_usuario_id, cupom_estabelecimento_id, cupom_usuario_id, cartao_id, valor, desconto, porcentagem, descricao} = request.body

    await mysql.queryAsync(`UPDATE pagamentos SET forma_pagamento_id = ?, opcao_pagamento_id = ?, pedido_has_usuario_id = ?, cupom_estabelecimento_id = ?, cupom_usuario_id = ?, cartao_id = ?, valor = ?, desconto = ?, porcentagem = ?, descricao = ?, updated_at = ? WHERE id = ?`, [forma_pagamento_id, opcao_pagamento_id, pedido_has_usuario_id, cupom_estabelecimento_id, cupom_usuario_id, cartao_id, valor, desconto, porcentagem, descricao, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE pagamentos SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route