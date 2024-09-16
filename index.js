const express = require('express')
const mongoose = require('mongoose')
const app = express()
app.use(express.json())

mongoose
.connect("mongodb://localhost:27017/livraria")
.then(() => console.log("Conectado ao MongoDB!"))
.catch((erro) => console.error("Erro ao conectar ao MongoDB:", erro))

const port = 3000
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})

// livros

const esquemaLivro = new mongoose.Schema({
    titulo: { type: String, required: true },
    autor: { type: String, required: true },
    ano: { type: Number, required: true },
    genero: { type: String, required: true },
    });
    
const Livro = mongoose.model("Livro", esquemaLivro);

async function criarLivro(titulo, autor, ano, genero) {
    try {  
        const novoLivro = new Livro({ titulo, autor, ano, genero })
        return await novoLivro.save()
    } catch (erro) {
        console.error("Erro ao criar livro:", erro);
        throw erro;
    }
}

app.post('/livros', async (req, res) => {
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

async function buscarLivros(){
    try {
        return await Livro.find();
    } catch (erro) {
        console.error("Error ao buscar livro", erro);
        throw erro;
    }
}

app.get("/livros", async (req, res) => {
    try {
        const livros = await buscarLivros();
        res.status(200).json(livros)
    } catch (erro) {
        res
        .status(500)
        .json({mensagem: "Error ao buscar livro:", erro: erro.mensage});
    }
})

async function atulizarLivro(id, titulo, autor, ano, genero){
    try {
        const livroAtualizar = await Livro.findByIdAndUpdate(
            id,
            { titulo, autor, ano, genero },
            { new: true, runValidators: true}
        );
        return livroAtualizar;
    } catch (erro) {
        console.error("Error ao editar livro:", erro);
        throw erro;
    }
}

app.put("/livros/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, autor, ano, genero } = req.body;
        const livroAtualizar = await atulizarLivro(
            id,
            titulo,
            autor,
            ano,
            genero
        );
        if (livroAtualizar) {
            res
                .status(200)
                .json({
                    mensagem: "livro atualizado com sucesso",
                    livro: livroAtualizar,
                });
        } else {
            res.status(404).json({mensagem: "livro nao encontrado"});
        }
    } catch (erro) {
        res
         .status(500)
         .json({ mensagem: "Error ao atualizar livro", erro: erro.message});
    }
});

async function deletarLivro(id){
    try {
        const livroDeletado = await Livro.findByIdAndUpdate(id);
        return livroDeletado;
    } catch (erro){
        console.error("Error ao deletar livro", erro);
        throw erro;
    }
}

app.delete("/livros/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const livroDeletado = await deletarLivro(id);
        if (livroDeletado) {
            res
             .status(200)
             .json({mensagem: "livro deletar com sucesso", livro: livroDeletado});
        } else {
            res.status(404).json({mensagem: "livro nao encontrado"});
        }
    } catch (erro){
        res
        .status(500)
        .json({ mensagem: "Erro ao deletar livro", erro: erro.message});
    }
});

// aluguel

const esquemaAluguel = new mongoose.Schema({
    idLivro: { type: Number, required: true },
    idEstudante: { type: Number, required: true },
    dataAluguel: { type: String, required: true },
    dataDevolucao: { type: String, required: true },
    });
    
const Aluguel = mongoose.model("Aluguel", esquemaAluguel);


async function criarAluguel(idLivro, idEstudante, dataAluguel, dataDevolucao) {
    try {  
        const novoAluguel = new Aluguel({ idLivro, idEstudante, dataAluguel, dataDevolucao })
        return await novoAluguel.save()
    } catch (erro) {
        console.error("Erro ao adicionar aluguel:", erro);
        throw erro;
    }
}

app.post('/alugueis', async (req, res) => {
    try {
        const { idLivro, idEstudante, dataAluguel, dataDevolucao } = req.body
        const novoAluguel = await criarAluguel(idLivro, idEstudante, dataAluguel, dataDevolucao)
        res.status(201).json({
            mensagem: "Aluguel adicionado com sucesso",
            aluguel: novoAluguel
        })
    } catch (erro) {
        res.status(500).json({ 
            mensagem: "Erro ao adicionar aluguel",
            erro: erro.message });
        }
})


async function buscarAluguel(){
    try {
        return await Aluguel.find();
    } catch (erro) {
        console.error("Error ao buscar alguel", erro);
        throw erro;
    }
}

app.get("/alugueis", async (req, res) => {
    try {
        const alugueis = await buscarAluguel();
        res.status(200).json(alugueis)
    } catch (erro) {
        res
        .status(500)
        .json({mensagem: "Error ao buscar aluguel:", erro: erro.mensage});
    }
})


async function atualizarAluguel( idLivro, idEstudante, dataAluguel, dataDevolucao ){
    try{
      const aluguelAtualizado = await Aluguel.findByIdAndUpdate(
        id,
        { idLivro,idEstudante,dataAluguel,dataDevolucao },
        { new: true, runValidators: true }
      )
      return aluguelAtualizado 
    } catch (erro) {
      console.error("Erro ao atualizar o aluguel: ", erro)
      throw erro
    }
  }
  
  app.put("/aluguel/:id", async (req,res) => {
    try{
      const { id } = req.params
      const { idLivro,idEstudante,dataAluguel,dataDevolucao } = req.body
      const aluguelAtualizado = await atualizarAluguel(
        idLivro,
        idEstudante,
        dataAluguel,
        dataDevolucao
      )
      if(aluguelAtualizado) {
        res
        .status(200)
        .json({
          mensagem: "Aluguel atualizado com sucesso",
          aluguel: aluguelAtualizado,
        })
      } else{
        res.status(404).json({mensagem: "Aluguel não encontrado"})
      }
    } catch (erro) {
      res
      .status(500)
      .json({mensagem: "Erro ao atualizar aluguel", erro: erro.message})
    }
  })
  
  async function deletarAluguel(id){
    try{
      const aluguelDeletado = await Aluguel.findByIdAndDelete(id)
      return aluguelDeletado
    } catch (erro) {
      console.error("Erro ao deletar livro:", erro)
      throw erro
    }
  }
  
  app.delete("/aluguel/:id", async (req,res) => {
    try {
      const { id } = req.params
      const aluguelDeletado = await deletarAluguel(id)
      if(aluguelDeletado) {
        res
        .status(200)
        .json({mensagem: "Aluguel deletado com sucesso", aluguel: aluguelDeletado})
      } else {
        res.status(404).json({mensagem: "Aluguel não encontrado"})
      }
    } catch (erro) {
      res
      .status(500)
      .json({mensagem: "Erro ao deletar livro", erro: erro.message})
    }
  })

// estudantes

const esquemaEstudante = new mongoose.Schema({
    nome: { type: String, required: true },
    matricula: { type: Number, required: true },
    curso: { type: String, required: true },
    ano: { type: Number, required: true },
    });
    
    const Estudante = mongoose.model("Estudante", esquemaEstudante);

//adicionar
async function criarEstudante(nome, matricula, curso, ano){
    try{
        const novoEstudante = new Estudante({nome, matricula, curso, ano})
        return await novoEstudante.save()
    } catch (erro){
        console.error("Error ao criar estudante:", erro)
        throw erro
    }
}

app.post("/estudantes", async (req, res) =>{
    try{
    const {nome, matricula, curso, ano} = req.body
    const novoEstudante = await criarEstudante(nome, matricula, curso, ano)
    res.status(201).json({mensagem: "Estudante adicionado com sucesso!", estudante:novoEstudante})
    }catch (erro){
        res.status(500).json({mensagem:"Erro ao  adicionar estudante", erro: erro.message})
    }
})

//listar

async function obterEstudantes() {
    try {
    return await Estudante.find();
    } catch (erro) {
    console.error("Erro ao obter livros:", erro);
    throw erro;
    }
    }

    app.get("/estudantes", async (req, res) =>{
        try{
            const estudantes = await obterEstudantes()
            res.status(200).json(estudantes)
        } catch (erro){
            res.status(500).json({mensagem: "Erro ao obter estudantes", erro: erro.message})
        }
    })
//atualizar

async function atualizarEstudante (id, nome, matricula, curso, ano){
    try{
        const estudanteAtualizado = await Estudante.findByIdAndDelete(
            id,
            { nome, matricula, curso, ano},
            {new:true, runValidators: true}
        )
        return estudanteAtualizado
    }catch (erro){
        console.error("Erro ao atualizar estudante:", erro)
        throw erro
    }
}


app.put ("/estudantes/:id", async (req, res) =>{
    try{
        const {id} = req.params
        const {nome, matricula, curso, ano } = req.body
        const estudanteAtualizado = await atualizarEstudante(
            id,
            nome,
            matricula,
            curso,
            ano
        )
        if (estudanteAtualizado){
            res.status(200).json({mensagem: "estudante atualizado com sucesso", estudante:estudanteAtualizado})
        }else{
            res.status(404).json({mensagem: "Estudante não encontrado"})
        }
    }catch (erro){
        res.status(500).json({mensagem: "Erro ao atualizar estudante", erro: erro.message})
    }
})


//deletar

async function deletarEstudante(id){
    try{
        const estudanteDeletado = await Estudante.findByIdAndDelete(id)
        return estudanteDeletado
    }catch (erro){
        console.error("Erro ao deletar estudante:", erro)
        throw erro
    }
}

app.delete("/estudantes/:id", async (req, res) =>{
    try{
        const {id} = req.params
        const estudanteDeletado = await deletarEstudante(id)
        if (estudanteDeletado){
            res.status(200).json({mensagem: " Estudante deletado com sucesso", estudante: estudanteDeletado})
        }else{
            res.status(404).json({mensagem: " Estudante não encontrado"})
        }
    }catch (erro){
        res.status(500).json ({mensagem: " Erro ao deletar estudar", erro: erro.message})
    }
})