const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const MONGOURI = process.env.CONNECTION_URL;

const mongoDB = async () => {
  try {
    await mongoose.connect(MONGOURI, { useNewUrlParser: true });
    console.log('Connected successfully');
    const collection = await  mongoose.connection.db.collection("food_items");
    const data = await collection.find({}).toArray();

    const category = await mongoose.connection.db.collection("foodCategory");
    const categoryData =  await category.find({}).toArray();
    global.food_items = data;
    global.foodCategory = categoryData;
    
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
};

module.exports = mongoDB();


