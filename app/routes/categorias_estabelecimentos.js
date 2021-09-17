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


const salvar_imagem = async (nome_imagem, extensao_imagem, imagem) => {
    
    let criptografia_nome = `${createHmac('sha256', process.env.SECRET_FILE).update(nome_imagem).digest('hex')}.${extensao_imagem.replace(/[^a-zA-Z]+/g, '')}`

    var pasta = `./app/images/categorias_estabelecimentos/`
    var pasta_salvar = `imagens/categorias_estabelecimentos/`

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

    let categorias_estabelecimentos = await mysql.queryAsync(`SELECT c.* FROM categorias_estabelecimentos AS c WHERE c.deleted_at IS NULL`)
    
    return response.status(200).json({
        data: categorias_estabelecimentos
    })

})

route.post('/', async (request, response) => {

    const {categoria, nome_imagem, extensao_imagem, imagem} = request.body

    let pasta = imagem ? await salvar_imagem(nome_imagem, extensao_imagem, imagem) : null

    if(pasta !== false){
        let categoria_estabelecimentos = await mysql.queryAsync(`INSERT INTO categorias_estabelecimentos (categoria, nome_imagem, extensao_imagem, imagem, created_at) VALUES (?, ?, ?, ?, ?)`, [categoria, nome_imagem, extensao_imagem, pasta, moment().format('YYYY-MM-DD HH:mm:ss')])
        
        return response.status(200).json({
            data: categoria_estabelecimentos.insertId
        })
    }
    else{
        return response.status(500).json({
            data: "Erro ao salvar imagem"
        })
    }

})

route.put('/:id', async (request, response) => {

    const {categoria, nome_imagem, extensao_imagem, imagem} = request.body

    const atualizar = await mysql.queryAsync(`SELECT c.* FROM categorias_estabelecimentos AS c WHERE c.deleted_at IS NULL AND c.id = ?`, [request.params.id])

    let pasta = imagem ? imagem : atualizar[0].imagem

    if(typeof imagem === "string" && imagem.indexOf('imagens/categorias_estabelecimentos/') == -1){
        pasta = imagem ? await salvar_imagem(nome_imagem, extensao_imagem, imagem) : null
    }
    
    if(pasta !== false){
        await mysql.queryAsync(`UPDATE categorias_estabelecimentos SET categoria = ?, nome_imagem = ?, extensao_imagem = ?, imagem = ?, updated_at = ? WHERE id = ?`, [categoria, nome_imagem, extensao_imagem, pasta, moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
        
        return response.status(200).json({
            data: parseInt(request.params.id)
        })
    }
    else{
        return response.status(500).json({
            data: "Erro ao salvar imagem"
        })
    }

})

route.delete('/:id', async (request, response) => {

    await mysql.queryAsync(`UPDATE categorias_estabelecimentos SET deleted_at = ? WHERE id = ?`, [moment().format('YYYY-MM-DD HH:mm:ss'), request.params.id])
    
    return response.status(200).json({
        data: parseInt(request.params.id)
    })
})


module.exports = route