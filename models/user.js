const mysql = require('mysql');

const UserSchema = {
  username:{
    type: string,
    required: true
  },
  email:{
    type: string,
    required: true
  },
  password:{
    type: string,
    required: true
  }
};

const User = module.exports = UserSchema;
