require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASSWORD}@cluster0.girnwoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const categoriesCollection = client
      .db("eastwardJourneys")
      .collection("categories");
    const subCategoriesCollection = client
      .db("eastwardJourneys")
      .collection("subCategories");
      
    const placesCollection = client.db("eastwardJourneys").collection("places");
    const userCollection = client.db("eastwardJourneys").collection("users");

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Eastward journeys Server is running......");
});
app.listen(port, () => {
  console.log(`Eastward journeys app listening on port ${port}`);
});
