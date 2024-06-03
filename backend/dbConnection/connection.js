const mongoose = require("mongoose");

const connection = async () => {
  return await mongoose
    .connect(process.env.MONGO_URL)
    .then((data) => {
      console.log(`MongoDB connected with server ${data.connection.host}`);
    })
};

module.exports = connection;