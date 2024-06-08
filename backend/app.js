const express = require('express');
const app = express();
const productRoute = require('./routes/product.route.js');
const userRoute = require('./routes/user.route.js');
const orderRoute = require('./routes/order.route.js');
const errorMiddleware = require('./middleware/error.js');
const cookieParser = require('cookie-parser');


//Use Middleware
app.use(express.json());
app.use(cookieParser());

//Routes
app.use("/api/v1/product", productRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/order", orderRoute);

//Error Handler Middleware
app.use(errorMiddleware);

module.exports = app;