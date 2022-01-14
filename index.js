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
          const bookedCollection = database.collection('booked')
          const usersCollection = database.collection('users')

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
               
               const query = {email: email, date: date};
               const cursor = bookedCollection.find(query);
               const result = await cursor.toArray();
               res.json(result)
          })

          //User Collection Users Store
          app.post('/users', async(req, res)=>{
               const user = req.body;
               // console.log(user);
               const result = await usersCollection.insertOne(user)
               res.json(result)
          })
          //Put method for google sign stroe user
          app.put('/users', async(req, res)=>{
               const user = req.body;
               const filter = {email : user.email}
               const options = {upsert: true}
               const updateDoc={$set: user}
               const result = await usersCollection.updateOne(filter, updateDoc, options)
               res.json(result)
          })
          //Set/Make Admin role to general user
          app.put('/users/admin', async(req, res)=>{
               const user = req.body;
               const filter = {email: user.email}
               const updateDoc = { $set: {role:'admin'}}
               const result = await usersCollection.updateOne(filter, updateDoc)
               res.json(result)

          })
          //Check Admin or Not
          app.get('/users/:email', async(req, res)=>{
               const email = req.params.email;
               const query = {email : email};
               const user = await usersCollection.findOne(query);
               let isAdmin = false;
               if(user?.role === 'admin'){
                    isAdmin = true;
               }
               res.json({ admin: isAdmin })

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