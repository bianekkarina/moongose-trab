const express = require('express')
const mongoose = require('mongoose')
const port = 3000
const app = express()
app.use(express.json())

mongoose
.connect("mongodb://localhost:27017/livraria")
.then(() => console.log("Conectado ao MongoDB!"))
.catch((erro) => console.error("Erro ao conectar ao MongoDB:", erro))

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})

async function criarLivro(titulo, autor, ano, genero) {
    try {
        const novoLivro = new Livro({ titulo, autor, ano, genero })
        return await novoLivro.save()
    } catch (erro) {
        console.error("Erro ao criar livro:", erro);
        throw erro;
    }
}

app.post('/', async (req, res) => {
    try {
        const { titulo, autor, ano, genero } = req.body
        const novoLivro = await criarLivro(titulo, autor, ano, genero)
        res.status(201).json({
            mensagem: "Livro criado com sucesso",
            livro: novoLivro
        })
    } catch (erro) {
        res.status(500).json({ 
            mensagem: "Erro ao criar livro",
            erro: erro.message });
        }
})