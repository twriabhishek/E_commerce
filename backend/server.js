require("dotenv").config();
const app = require("./app");
const connection = require("./dbConnection/connection.js");

//Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error:${err.message}`);
  console.log("Sutting down the server due to Uncaught Exception");
  process.exit(1);
});

const PORT = process.env.PORT || 8023;

// Make Connection
connection();

const server = app.listen(PORT, () => {
  console.log(`Server is listening on PORT: ${PORT}`);
});

//Unhandled Promise rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error:${err.message}`);
  console.log("Sutting down the server due to Unhandled Promise rejection");
  server.close(() => {
    process.exit(1);
  });
});
