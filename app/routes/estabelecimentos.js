const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

const cnpj_existe = async (cnpj) => {
    let estabelecimento = await mysql.queryAsync(`SELECT e.* FROM estabelecimentos AS e WHERE e.cnpj = ?`, cnpj)
    return  estabelecimento
} 

const cnpj_tamanho = (cnpj) => {
    return cnpj.length === 14 ? true : false
} 

const cnpj_remover_texto = (cnpj) => {
    return cnpj.replace(/\D/g, '')
} 

route.get('/', async (request, response) => {

    let estabelecimentos = await mysql.queryAsync(`SELECT e.* FROM estabelecimentos AS e WHERE deleted_at IS NULL`)
    
    return response.status(200).json({
        data: estabelecimentos
    })

})

route.get('/:id', async (request, response) => {

    let estabelecimento = await mysql.queryAsync(`SELECT e.* FROM estabelecimentos AS e WHERE deleted_at IS NULL AND e.id = ?`, [request.params.id])
    
    return response.status(200).json({
        data: estabelecimento
    })

})

route.post('/', async (request, response) => {

    let {razao_social, nome_fantasia, cnpj, logo, descricao} = request.body

    cnpj = cnpj_remover_texto(cnpj)

    let validacao_cnpj = cnpj_tamanho(cnpj)

    if(!validacao_cnpj){
        return response.status(500).json({
            data: `Tamanho do CNPJ está incorreto, verifique se há 14 caracteres sem contar caracteres especiais e letras`
        })
    }
    
    validacao_cnpj = await cnpj_existe(cnpj)

    if(validacao_cnpj.length > 0){
        return response.status(500).json({
            data: `CNPJ já existente`
        })
    }

    let estabelecimento = await mysql.queryAsync(`INSERT INTO estabelecimentos (razao_social, nome_fantasia, cnpj, logo, descricao, created_at) VALUES (?, ?, ?, ?, ?, ?)`, [razao_social, nome_fantasia, cnpj, logo, descricao, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(201).json({
        data: estabelecimento.insertId
    })

})

route.put('/:id', async (request, response) => {

    const {razao_social, nome_fantasia, logo, descricao} = request.body

    await mysql.queryAsync(`UPDATE estabelecimentos SET razao_social = ?, nome_fantasia = ?, logo = ?, descricao = ?, updated_at = ? WHERE id = ?`, [razao_social, nome_fantasia, logo, descricao, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE estabelecimentos SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(204).json({
        data: parseInt(request.params.id)
    })

})

route.post('/habilitar/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE estabelecimentos SET deleted_at = NULL WHERE id = ?`, [request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})


module.exports = route