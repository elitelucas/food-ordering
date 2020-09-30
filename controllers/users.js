const User = require('../models/user');
const jwtDecode = require('jwt-decode');
const { body, validationResult } = require('express-validator');
const { createToken, hashPassword, verifyPassword } = require('../utils/authentication');
const crypto=require('crypto');

exports.authenticate = async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array({ onlyFirstError: true });
    return res.status(422).json({ errors });
  }
  try {
    // verify captchca
    // var secretKey = process.env.CAPTCHA_SECRET;
    // var response =req.body['g-recaptcha-response'];
    // const remoteip=req.ip;
    // const captcha=await verifyCaptcha(secretKey,response,remoteip);
    // if(!captcha.success)
    //   return res.status(422).json({ message:'Please select Captcha' });


    const { username, password } = req.body;
    const user = await User.findOne({
      username: username.toLowerCase()
    });

    if (!user) {
      return res.status(403).json({
        message: 'Wrong username or password.'
      });
    }
    // if(!user.phoneVerified){
    //   return res.status(403).json({
    //     message: 'Please have a phone verification.'
    //   });
    // }
    const passwordValid = await verifyPassword(password, user.password);

    if (passwordValid) {
      const token = createToken(user);
      const decodedToken = jwtDecode(token);
      const expiresAt = decodedToken.exp;
      const { username, role, id, created } = user;
      const userInfo = { username, role, id, created };

      res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        expiresAt
      });
    } else {
      res.status(403).json({
        message: 'Wrong username or password.'
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: 'Something went wrong.'
    });
  }
};


////User
exports.listUsers = async (req, res, next) => {
  try {
    const { sortType = '-created' } = req.body;
    const users = await User.find().sort(sortType);
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.search = async (req, res, next) => {
  try {
    const users = await User.find({ username: { $regex: req.params.search, $options: 'i' } });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.find = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
  
    res.json({user});
  } catch (error) {
    next(error);
  }
};
exports.delete = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    await user.delete();
  
    res.json({message:'ok'});
  } catch (error) {
    next(error);
  }
};
exports.create = async (req, res, next) => {
  try {
    const comp={};
    comp.username=req.body.username;
    comp.password=hashpassword(req.body.password);
    comp.fullname=req.body.fullname;
    const user = new User(comp);

    await user.save();
  
    res.json({message:'ok'});
  } catch (error) {
    next(error);
  }
};

exports.validateLogin = [
  // body('g-recaptcha-response')
  //   .exists()
  //   .withMessage('Please select captcha')

  //   .notEmpty()
  //   .withMessage('Please select captcha'),
  body('username')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ max: 16 })
    .withMessage('must be at most 16 characters long')

    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('contains invalid characters'),

  body('password')
    .exists()
    .trim()
    .withMessage('is required')

    .notEmpty()
    .withMessage('cannot be blank')

    .isLength({ min: 6 })
    .withMessage('must be at least 6 characters long')

    .isLength({ max: 50 })
    .withMessage('must be at most 50 characters long')
  

   
];
