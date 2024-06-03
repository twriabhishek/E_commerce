const ErrorHandler = require("../utils/errorhandler.js");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  //Wrong Mongodb Id error
  if (err.name === "CastError") {
    const message = `Resorce not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  //Mongoose duplicate Key Error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  }

  //JWT token Error
  if (err.name === "JsonWebTokenError") {
    const message = `JsonWebToken is Invalid, Try again`;
    err = new ErrorHandler(message, 400);
  }

  //JWT expire Error
  if (err.name === "TokenExpiredError") {
    const message = `JsonWebToken is Expired, Try again`;
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    success: false,
    error: err.message,
  });
};
