const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")

const codigo_tamanho = (codigo) => {
    return codigo.length === 3 ? true : false
} 

const numero_remover_texto = (numero) => {
    return numero.replace(/\D/g, '')
} 

const numero_tamanho = (numero) => {
    return numero.length === 16 ? true : false
} 

const documento_titular_remover_texto = (documento_titular) => {
    return documento_titular.replace(/\D/g, '')
} 

const documento_titular_tamanho = (documento_titular) => {
    return documento_titular.length === 11 || documento_titular.length === 14 ? true : false
}

const validade_formatar = (validade) => {
    return validade.replace(/\D/g, '/')
} 

route.get('/', async (request, response) => {

    let cartoes = await mysql.queryAsync(`SELECT c.* FROM cartoes AS c WHERE c.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: cartoes
    })

})

route.post('/', async (request, response) => {

    let {cliente_id, tipo_conta_id, tipo_cartao_id, bandeira_id, titular, documento_titular, validade, numero, codigo} = request.body

    documento_titular = documento_titular_remover_texto(documento_titular)

    let validacao_documento_titular = documento_titular_tamanho(documento_titular)

    if(!validacao_documento_titular){
        return response.status(500).json({
            data: `Tamanho do CPF ou CNPJ está incorreto, verifique se há 11 (CPF) ou 14 (CNPJ) caracteres sem contar caracteres especiais e letras`
        })
    }
    
    numero = numero_remover_texto(numero)

    let validacao_numero = numero_tamanho(numero)

    if(!validacao_numero){
        return response.status(500).json({
            data: `Tamanho do número do cartão está incorreto, verifique se há 16 caracteres sem contar caracteres especiais e letras`
        })
    }
    
    let validacao_codigo = codigo_tamanho(codigo)

    if(!validacao_codigo){
        return response.status(500).json({
            data: `Tamanho do código do cartão está incorreto, verifique se há 3 caracteres`
        })
    }

    validade = validade_formatar(validade)

    let registro = await mysql.queryAsync(`INSERT INTO cartoes (cliente_id, tipo_conta_id, tipo_cartao_id, bandeira_id, titular, documento_titular, validade, numero, codigo, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [cliente_id, tipo_conta_id, tipo_cartao_id, bandeira_id, titular, documento_titular, validade, numero, codigo, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })

})

route.put('/:id', async (request, response) => {

    let {cliente_id, tipo_conta_id, tipo_cartao_id, bandeira_id, titular, documento_titular, validade, numero, codigo} = request.body

    documento_titular = documento_titular_remover_texto(documento_titular)

    let validacao_documento_titular = documento_titular_tamanho(documento_titular)

    if(!validacao_documento_titular){
        return response.status(500).json({
            data: `Tamanho do CPF ou CNPJ está incorreto, verifique se há 11 (CPF) ou 14 (CNPJ) caracteres sem contar caracteres especiais e letras`
        })
    }
    
    numero = numero_remover_texto(numero)

    let validacao_numero = numero_tamanho(numero)

    if(!validacao_numero){
        return response.status(500).json({
            data: `Tamanho do número do cartão está incorreto, verifique se há 16 caracteres sem contar caracteres especiais e letras`
        })
    }
    
    let validacao_codigo = codigo_tamanho(codigo)

    if(!validacao_codigo){
        return response.status(500).json({
            data: `Tamanho do código do cartão está incorreto, verifique se há 3 caracteres`
        })
    }

    validade = validade_formatar(validade)

    await mysql.queryAsync(`UPDATE cartoes SET cliente_id = ?, tipo_conta_id = ?, tipo_cartao_id = ?, bandeira_id = ?, titular = ?, documento_titular = ?, validade = ?, numero = ?, codigo = ?, updated_at = ? WHERE id = ?`, [cliente_id, tipo_conta_id, tipo_cartao_id, bandeira_id, titular, documento_titular, validade, numero, codigo, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE cartoes SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

module.exports = route