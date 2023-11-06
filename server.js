const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);


async function insertData(email, pass) {
  try {
    await client.connect();
    const db = client.db("elearn");
    const collection = db.collection("courses");

    const document = {
      Email: email,
      password: pass,
     
    };

    const result = await collection.insertOne(document);
    console.log("Data inserted with _id: " + result.insertedId);
  } catch (err) {
    console.error("Error inserting data: ", err);
  } finally {
    await client.close();
  }
}

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

app.post("/add", (req, res) => {
  const { email, pass } = req.body;

 
  const pat = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  if (pat.test(email) && pass.length <= 10) {
    insertData(email, pass);
    res.send("Data inserted successfully.");
  } else {
    res.status(400).send("Invalid data. Please check your input.");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
