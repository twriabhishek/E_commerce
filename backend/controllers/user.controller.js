const ErrorHandler = require("../utils/errorhandler.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");
const User = require("../models/user.model.js");
const sendToken = require("../utils/jwtToken.js");
const sendEmail = require("../utils/sendEmail.js");
const crypto = require("crypto");

//Register a User
const handleRegisterUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is a sample ID",
      url: "sampleurl",
    },
  });
  sendToken(user, 201, res);
});

//Login User
const handleLoginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //checking if user has given password and email both
  if (!email || !password) {
    return next(new ErrorHandler("Please Enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email and password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email and password", 401));
  }

  sendToken(user, 200, res);
});

//Logged Out
const handleLogoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged out Successfully",
  });
});

//Forgot Password
const handleForgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  //Get Reset Password Token
  const resetToken = await user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/password/reset/${resetToken}`;

  const message = `Your Password reset token is:- \n\n ${resetPasswordUrl} \n\n If you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email send to ${user.email} successfully.`,
    });
  } catch (error) {
    console.log("Inside Catch", error);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password
const handleResetPassword = catchAsyncError(async (req, res, next) => {
  //Creating Token Hash
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is Invalid or has been expired",
        404
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});

module.exports = {
  handleRegisterUser,
  handleLoginUser,
  handleLogoutUser,
  handleForgotPassword,
  handleResetPassword,
};
