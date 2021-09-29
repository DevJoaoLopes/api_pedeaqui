const express = require("express")
const route = express.Router()
const { mysql } = require("../helpers/mysql")
const moment = require("moment")
const fs = require("fs")
const fs_promises = require("fs").promises
require("dotenv/config")
const {
    createHmac
} = require("crypto")

const salvar_imagem = async (item_cardapio_id, nome_imagem, extensao_imagem, imagem) => {
    
    let item_cardapio = await mysql.queryAsync(`SELECT i.* FROM itens_cardapios AS i WHERE i.id = ?`, [item_cardapio_id])
    let criptografia_nome = `${createHmac('sha256', process.env.SECRET_FILE).update(nome_imagem).digest('hex')}.${extensao_imagem.replace(/[^a-zA-Z]+/g, '')}`

    var pasta = `./app/images/cardapios/${createHmac('sha256', process.env.SECRET_PATH).update(`${item_cardapio[0].estabelecimento_id}`).digest('hex')}/${item_cardapio[0].id}/`
    var pasta_salvar = `imagens/cardapios/${createHmac('sha256', process.env.SECRET_PATH).update(`${item_cardapio[0].estabelecimento_id}`).digest('hex')}/${item_cardapio[0].id}/`

    if (!fs.existsSync(pasta)){
        fs.mkdirSync(pasta, { recursive: true })
    }

    let image = new Buffer.from(imagem, 'base64')

    try{
        await fs_promises.writeFile(`${pasta}${criptografia_nome}`, image)
        return `${pasta_salvar}${criptografia_nome}`
    }
    catch{
        return false
    }
    
}

route.get('/', async (request, response) => {

    let imagens_itens_cardapios = await mysql.queryAsync(`SELECT i.* FROM imagens_itens_cardapios AS i WHERE i.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: imagens_itens_cardapios
    })

})

route.post('/', async (request, response) => {

    const {item_cardapio_id, nome_imagem, extensao_imagem, imagem} = request.body

    let pasta = await salvar_imagem(item_cardapio_id, nome_imagem, extensao_imagem, imagem)
    
    if(!pasta){
        return response.status(500).json({
            data: "Erro ao salvar imagem"
        })
    }

    let registro = await mysql.queryAsync(`INSERT INTO imagens_itens_cardapios (item_cardapio_id, nome_imagem, extensao_imagem, imagem, created_at) VALUES (?, ?, ?, ?, ?)`, [item_cardapio_id, nome_imagem, extensao_imagem, pasta, moment().format('YYYY-MM-DD HH:mm:ss')])
    
    return response.status(200).json({
        data: registro.insertId
    })
    
})

route.put('/:id', async (request, response) => {

    const {item_cardapio_id, nome_imagem, extensao_imagem, imagem} = request.body

    let pasta = imagem

    if(imagem.indexOf('imagens/cardapios') == -1){
        pasta = await salvar_imagem(item_cardapio_id, nome_imagem, extensao_imagem, imagem)
    }
    
    if(!pasta){
        return response.status(500).json({
            data: "Erro ao salvar imagem"
        })
    }
    
    await mysql.queryAsync(`UPDATE imagens_itens_cardapios SET item_cardapio_id = ?, nome_imagem = ?, extensao_imagem = ?, imagem = ?, updated_at = ? WHERE id = ?`, [item_cardapio_id, nome_imagem, extensao_imagem, pasta, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE imagens_itens_cardapios SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route