// config inicial
const express = require ('express')
const app = express()
const mongoose = require("mongoose")
const Person = require("./models/Person")


app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json())

//Primeira rota

app.get('/',(req, res)=>{
    res.send({message: 'Bem-vindo ao meu servidor'})
})


//CREATE
app.post('/person' ,async (req, res)=>{
    const {name, salary, approved} = req.body; 
    const person ={
        name,
        salary,
        approved,
    }
    
    try{
        await Person.create(person)
        res.status(201).json({message:"Pessoa inserida no sistema com sucesso!"})
    }catch (error){
        res.status(500).json({error: error})
    }

})
//READ
    app.get("/person", async (req, res)=>{
    try{
        const people = await Person.find()
            res.status(200).json(people)
        
    }catch{
        res.status(500).json({error: error})
    }

})

//read by id
app.get('/person/:id', async (req, res) =>{

    const id = req.params.id
    try{

        const people = await Person.findOne({_id:id})

        if(!people){
            res.status(422).json({message: 'Usuario não encontrado'})
            return
        }
        res.status(200).json(people)
    
    }catch(error){

        res.status(500).send({erro: error})

    }
})

//UPDATE
app.patch("/person/:id",async (req, res)=>{

    const id = req.params.id
    const {name, salary,approved} = req.body

    const person ={
        name,
        salary,
        approved,
    }

    try{
        const updatePerson = await Person.updateOne({_id: id}, person)
        if(updatePerson.matcheCount ===0){

            res.status(422).json({messsage: "Usuario não encontrado"})
            return
        }
        res.status(200).json(person)

    }catch(error){

        req.status(500).json({erro: error})

    }

})

//DELETE
app.delete("/person/:id",async (req, res)=>{
    const id = req.params.id
    
    const person = await Person.findOne({_id: id})
    
    if (!person){

        res.status(422).json({message: "Usuario não encontrado"})
        return

    }
    try{

        await Person.deleteOne({_id: id})
        res.status(200).json({message: "Usuario removido com sucesso"})

    }
    catch (error){

        res.status(500).json({erro: error})
    }


})



mongoose.connect('mongodb://localhost:27017').then(() => {
    console.log('Conectado ao banco de dados')
    app.listen(3000)
}).catch((err) => {
    console.log('Erro ao conectar ao banco de dados: ' + err)
})