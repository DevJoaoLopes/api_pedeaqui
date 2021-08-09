const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

const cpf_existe = async (cpf) => {
    let cliente = await mysql.queryAsync(`SELECT c.* FROM clientes AS c WHERE c.cpf = ?`, cpf)
    return  cliente
} 

const cpf_tamanho = (cpf) => {
    return cpf.length === 11 ? true : false
} 

const cpf_remover_texto = (cpf) => {
    return cpf.replace(/\D/g, '')
} 

route.get('/', async (request, response) => {

    let clientes = await mysql.queryAsync(`SELECT c.* FROM clientes AS c WHERE c.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: clientes
    })

})

route.post('/', async (request, response) => {

    let {nome, cpf, imagem_perfil} = request.body

    cpf = cpf_remover_texto(cpf)

    let validacao_cpf = cpf_tamanho(cpf)

    if(!validacao_cpf){
        return response.status(500).json({
            data: `Tamanho do CPF está incorreto, verifique se há 14 caracteres sem contar caracteres especiais e letras`
        })
    }

    validacao_cpf = await cpf_existe(cpf)

    if(validacao_cpf.length > 0){
        return response.status(500).json({
            data: `CPF já existente`
        })
    }

    let cliente = await mysql.queryAsync(`INSERT INTO clientes (nome, cpf, imagem_perfil, created_at) VALUES (?, ?, ?, ?)`, [nome, cpf, imagem_perfil, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: cliente.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {nome, imagem_perfil} = request.body

    await mysql.queryAsync(`UPDATE clientes SET nome = ?, imagem_perfil = ?, updated_at = ? WHERE id = ?`, [nome, imagem_perfil, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE clientes SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.post('/habilitar/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE clientes SET deleted_at = NULL WHERE id = ?`, [request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})


module.exports = route