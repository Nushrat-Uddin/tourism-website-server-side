const express=require('express');
const { MongoClient, MongoRuntimeError } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;


const cors=require('cors');
require('dotenv').config();

const app=express();
const port= process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hu6ur.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('destinationsInfo');
        const destinationsCollection = database.collection('destinations');
        
        const usersCollection =database.collection('users');
        // POST users
        app.post('/users', async(req,res)=>{
            const user = req.body;
            console.log('hit the post api',user);
            const result = await usersCollection.insertOne(user);
            console.log(result);
            res.json(result);
        })

        // GET API
        app.get('/destinations',async(req,res)=>{
            const cursor=destinationsCollection.find({});
            const destinations= await cursor.toArray();
            res.send(destinations);
        })


        // GET a single data
        app.get('/destinations/:id', async (req, res) => {
            const id = req.params.id
            console.log('Getting particular id', id)
            const query = { _id: ObjectId(id) };
            const destination = await destinationsCollection.findOne(query);
            res.json(destination);
            console.log(destination);
        })


        // POST API
   
        app.post('/destinations', async(req,res)=>{
            const destination  = req.body;
            console.log('hit the post api',destination);
            const result = await destinationsCollection.insertOne(destination);
            console.log(result);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('running assignment 11 server');
})

app.listen(port,()=>{
    console.log('Running assignment 11 server on',port );
})