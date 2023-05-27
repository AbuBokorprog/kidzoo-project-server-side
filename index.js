const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
//${process.env.NAME}
//${process.env.PASS}

const uri = `mongodb+srv://${process.env.NAME}:${process.env.PASS}@cluster0.kq57d4a.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("KidZoo");
    const storesToyCollection = database.collection("storesToy");
    //storesToy
    app.get("/storesToy", async (req, res) => {
      const cursor = storesToyCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //storesToy details
    app.get("/storesToy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await storesToyCollection.findOne(query);
      res.send(result);
    });

    //Create Toys
    const toyCollection = client.db("KidZoo").collection("toy");

    app.post("/toy", async (req, res) => {
      const toy = req.body;
      const result = await toyCollection.insertOne(toy);
      res.send(result);
    });

    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.findOne(query);
      res.send(result);
    });

    app.get("/toy", async (req, res) => {
      console.log(req.query);
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const result = await toyCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toyCollection.deleteOne(query);
      res.send(result);
    });

    app.put("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const toy = req.body;
      const updateDoc = {
        $set: {
          Price: toy.Price,
          AvailableQuantity: toy.AvailableQuantity,
          Description: toy.Description,
        },
      };
      const result = await toyCollection.updateOne(query, updateDoc, options);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toy store is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
