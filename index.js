const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
let cors = require('cors')
require('dotenv').config()
const port =process.env.PORT ||  5000;

app.use(express.json())
app.use(cors());


//MongoDB connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.luy9u.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//Database Methods
async function run(){

     try{

          await client.connect();
          console.log('Database Connect successfully');
          //Create database and collections
          const database = client.db('book_Store');
          const bookedCollection = database.collection('booked');

          //Post learner Booked books
          app.post('/booked', async(req, res)=>{
               const booked = req.body;
               const result = await bookedCollection.insertOne(booked)
               // console.log(result)
               res.json(result)
          })

          //Get learner Booked books
          app.get('/booked', async(req, res)=>{
               const email = req.query.email;
               const date= new Date(req.query.date).toLocaleDateString();
               console.log(date);
               const query = {email: email, date: date};
               const cursor = bookedCollection.find(query);
               const result = await cursor.toArray();
               res.json(result)
          })



     }finally{
          // await client.close();
     }

}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Start Okshi Learner Server!')
})

app.listen(port, () => {
  console.log(` Listening Port ${port}`)
})