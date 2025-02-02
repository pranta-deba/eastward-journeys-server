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
    // await client.connect();

    const categoriesCollection = client
      .db("eastwardJourneys")
      .collection("categories");
    const subCategoriesCollection = client
      .db("eastwardJourneys")
      .collection("subCategories");
    const placesCollection = client.db("eastwardJourneys").collection("places");
    const userCollection = client.db("eastwardJourneys").collection("users");

    /*------------------------------------------------------------------------------*/
    // continent
    app.post("/add_continent", async (req, res) => {
      const newContinent = req.body;
      const result = await categoriesCollection.insertOne(newContinent);
      res.send(result);
    });
    app.put("/continent/:id", async (req, res) => {
      const { id } = req.params;
      const updatedContinent = req.body;
      const options = { upsert: true };
      const query = { _id: new ObjectId(id) };
      const result = await categoriesCollection.updateOne(
        query,
        { $set: updatedContinent },
        options
      );
      res.send(result);
    });
    app.get("/continents", async (req, res) => {
      const allCategories = await categoriesCollection.find().toArray();
      res.send(allCategories);
    });
    app.get("/continents/:id", async (req, res) => {
      const { id } = req.params;
      const allCountry = await subCategoriesCollection.find().toArray();
      const filteringCountry = allCountry.filter(
        (country) => country.continentId === id
      );
      res.send(filteringCountry);
    });
    app.delete("/continent/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await categoriesCollection.deleteOne(query);
      res.send(result);
    });
    // country
    app.post("/add_country", async (req, res) => {
      const newCountry = req.body;
      const result = await subCategoriesCollection.insertOne(newCountry);
      res.send(result);
    });
    app.get("/countries", async (req, res) => {
      const allCountry = await subCategoriesCollection.find().toArray();
      res.send(allCountry);
    });
    app.delete("/country/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await subCategoriesCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/country/:id", async (req, res) => {
      const { id } = req.params;
      const updatedCountry = req.body;
      const options = { upsert: true };
      const query = { _id: new ObjectId(id) };
      const result = await subCategoriesCollection.updateOne(
        query,
        { $set: updatedCountry },
        options
      );
      res.send(result);
    });
    // places
    app.post("/add_places", async (req, res) => {
      const newPlace = req.body;
      const result = await placesCollection.insertOne(newPlace);
      res.send(result);
    });
    app.get("/places", async (req, res) => {
      const allPlaces = await placesCollection.find().toArray();
      res.send(allPlaces);
    });
    app.get("/places/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await placesCollection.findOne(query);
      res.send(result);
    });
    app.get("/filter_places/:country", async (req, res) => {
      const { country } = req.params;
      const allPlaces = await placesCollection.find().toArray();
      const filteringPlaces = allPlaces.filter(
        (place) => place.countryName === country
      );
      res.send(filteringPlaces);
    });
    app.delete("/places/:id", async (req, res) => {
      const { id } = req.params;
      const query = { _id: new ObjectId(id) };
      const result = await placesCollection.deleteOne(query);
      res.send(result);
    });
    app.put("/places/:id", async (req, res) => {
      const { id } = req.params;
      const updatedPlace = req.body;
      const options = { upsert: true };
      const query = { _id: new ObjectId(id) };
      const result = await placesCollection.updateOne(
        query,
        { $set: updatedPlace },
        options
      );
      res.send(result);
    });

    //user 
    app.post("/add_user", async (req, res) => {
      const newUser = req.body;
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const allUsers = await userCollection.find().toArray();
      res.send(allUsers);
    });
    app.patch("/users", async (req, res) => {
      const updatedUser = req.body;
      const query = { email: updatedUser.email };
      const result = await userCollection.updateOne(query, {
        $set: {
          lastSignInTime: updatedUser.lastSignInTime,
        },
      });
      res.send(result);
    });
    /*------------------------------------------------------------------------------*/

    // await client.db("admin").command({ ping: 1 });
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
