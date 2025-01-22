import mongodb from 'mongodb'
import express from 'express'
import { config } from 'dotenv'

// Creating an app instance
const app=express()
const port=3000

// Load environment variables
config();

app.listen(port,()=>{
  console.log(`Server active on Port:${port}`)
})

// Connecting Express with MongoDB
const { MongoClient, ObjectId } = mongodb
const URI = process.env.MONGODB_CONNECTION_URL;
const client = new MongoClient(URI)

// Database name
const dbname='BookDB'

try{
  await client.connect()
  console.log('Successfully connected to the database')
}
catch(error)
{
  console.log(error)
}

// Create a client db object
const db=client.db(dbname)
const collection=db.collection('books')

app.use(express.json())

// GET method
app.get('/books',async(req,res)=>{
  try{
    const books=await collection.find({}).toArray()
    res.status(200).send(books)
  }
  catch(error)
  {
    res.status(500).send(error)
  }
})

// POST method
app.post('/books',async(req,res)=>{
  try{
      const book=await collection.insertOne(req.body)
      res.status(201).send(book)
  }
  catch(error)
  {
    res.status(500).send(error)
  }
})

// Get a particular book by its id
app.get('/books/:id',async(req,res)=>{
  try{
    const book=await collection.findOne({_id:new ObjectId(req.params.id)})
    if(!book)
    {
      res.status(404).send(book)
    }
    res.status(200).send(book)
  }
  catch(error)
  {
    res.status(500).send(error)
  }
})

// Update a book by its id
app.put('/books/:id',async(req,res)=>{
  try{
    const book=collection.findOneAndUpdate({_id:new ObjectId(req.params.id)},{$set:{title:req.body.title,genre:req.body.genre}})
    res.status(200).send(book)
  }
  catch(error)
  {
    res.status(500).send(error)
  }
})

// Delete a book by its id
app.delete('/books/:id',async(req,res)=>{
  try{
    const book=collection.deleteOne({_id:new ObjectId(req.params.id)})
    if(!book)
    {
      res.status(404).send("Book not found")
    }
    res.status(204).send(book)
  }
  catch(error)
  {
    res.status(500).send(error)
  }
})