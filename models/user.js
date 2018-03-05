// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var userSchema = new Schema({

  _id: { type: String, unique: true },
  name: { type: String },
  password: { type: String, },
  dob: String,
  location: String,
  phone:String,
  image:String,
  sex:String,
  address: {
    line1:String,
    line2:String,
    city:String,
    state:String,
    country:String,
    pincode:Number
  },
  role: {
    team: Boolean,
    volunteer: Boolean,
    donor: Boolean,
    board: Boolean,
    founder: Boolean,
    admin: Boolean
  },
  social: {
    gplus: String,
    fb: String,
    tw: String,
    ln: String
  },
  settings:{
    notifications:Boolean,
    city_events:Boolean,
    email_newsletter:Boolean,
    cancall:Boolean
  },
  level:Number,
  donations:{
    total:Number,
    instance:[{
    date : Date,
    amount : String,
    id : String
     }]
  },
  created_at: Date,
  updated_at: Date
});

// on every save, add the date
userSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

userSchema.methods.calcTotalDonation = function() {
  // add donations
  this.donations.total = 0;
  for (i = 0; i < this.donations.instance.length; i++) {
    this.donations.total+=this.donations.instance[i].amount;
    }
};

// the schema is useless so far
// we need to create a model using it
//var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
//module.exports = User;

module.exports = mongoose.model('User', userSchema);