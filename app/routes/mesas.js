const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

const gerar_codigo = async () => {
    let codigo = ''
    let caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (var i = 0; i < 6; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }

    if(await validar_codigo(codigo)){
        return codigo
    } 
    else{
        await gerar_codigo() 
    } 
}

const validar_codigo = async (codigo) => {
    
    let mesa = await mysql.queryAsync(`SELECT m.* FROM mesas AS m WHERE m.codigo = ? AND m.deleted_at IS NULL`, [codigo])
    
    return mesa.length === 0 
}

route.get('/', async (request, response) => {
    
    let mesas = await mysql.queryAsync(`SELECT m.* FROM mesas AS m WHERE m.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: mesas
    })
    
})

route.post('/identificar', async (request, response) => {
    
    const {codigo} = request.body

    let mesa = await mysql.queryAsync(`SELECT m.* FROM mesas AS m WHERE m.codigo = ? AND m.deleted_at IS NULL`, [codigo])

    let pedido = await mysql.queryAsync(`SELECT p.* FROM pedidos AS p WHERE p.mesa_id = ? AND p.encerrado IS NULL`, [mesa.length > 0 ? mesa[0].id : 0])
    
    let pedido_has_usuarios = []
    
    if(pedido.length > 0){
        pedido_has_usuarios = await mysql.queryAsync(`
            SELECT pu.*, c.nome FROM pedidos_has_usuarios AS pu 
            INNER JOIN usuarios AS u ON u.id = pu.usuario_id
            LEFT JOIN clientes AS c ON c.id = u.cliente_id
            WHERE pu.pedido_id = ?
        `, [pedido[0].id])
    }
    
    return response.status(200).json({
        data: {
            mesa: mesa,
            pedido: pedido,
            usuarios: pedido_has_usuarios
        }
    })

})

route.post('/', async (request, response) => {

    const {estabelecimento_id, identificacao, quantidade_pessoas} = request.body

    let codigo = await gerar_codigo()

    let registro = await mysql.queryAsync(`INSERT INTO mesas (estabelecimento_id, identificacao, codigo, quantidade_pessoas, created_at) VALUES (?, ?, ?, ?, ?)`, [estabelecimento_id, identificacao, codigo, quantidade_pessoas, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {identificacao, quantidade_pessoas} = request.body

    await mysql.queryAsync(`UPDATE mesas SET identificacao = ?, quantidade_pessoas = ?, updated_at = ? WHERE id = ?`, [identificacao, quantidade_pessoas, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE mesas SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route