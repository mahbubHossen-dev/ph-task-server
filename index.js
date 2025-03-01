const express = require('express')
const app = express()
var cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()


app.use(express.json())

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://job-task-22470.web.app'
        ],
    credentials: true,
    optionsSuccessStatus: 200
}))
// phTask
// dIW0RulLCUtyaYLW


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.PH_TASK_USER}:${process.env.PH_TASK_PASS}@cluster0.xdjfp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const db= client.db('ph-task')
        const userCollection = db.collection('users')
        const taskCollection = db.collection('taskData')
        app.post('/users/:email', async(req, res) => {
            const user = req.body
            const email = req.params.email;
            const query = {email}
            const isExist = await userCollection.findOne(query)
            if(isExist){
                return res.send(isExist)
            }
            const result = await userCollection.insertOne(user)
            res.send(result)
        })  

        app.post('/tasks', async(req, res) => {
            const data = req.body
            const result = await taskCollection.insertOne(data)
            res.send(result)
        })

        app.get('/tasks/:category', async (req, res) => {
            const category = req.params.category
            const query = {category}
            const result = await taskCollection.find(query).toArray()
            res.send(result)
        })

        
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await taskCollection.deleteOne(query)
            res.send(result)
            console.log(query)
        })

        app.put('/taskUpdate/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            console.log(data)
            const query = {_id: new ObjectId(id)}

            const updatedDoc = {
                $set: {
                    title: data.title,
                    category: data.category,
                    description: data.description,
                }
            }
            const result = await taskCollection.updateOne(query, updatedDoc)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Task Server is Running')
})

app.listen(port, () => {
    console.log(`port ${port}`)
})