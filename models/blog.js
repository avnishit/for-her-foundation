// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var blogSchema = mongoose.Schema({
  _id:String,
  title:  String,
  author: {name: String, photo: String, id:String },
  body:   String,
  summary: String,
  comments: [{ body: String, date: Date, user:String, email:String }],
  created_at: { type: Date, default: Date.now },
  updated_at: Date,
  hidden: { type: Boolean, default: true },
  tags : [String],
  category : String,
  subcategory :String,
  meta: {
    votes: Number,
    favs:  Number
  },
  images:
  {
    featured : String,
    common :[ {
      url :String,
      caption:String
    }
    ]
  },
  videos:
  {
    featured : String,
    common :[ {
      url :String,
      title:String
    }
    ]
  }
});

// on every save, add the date
blogSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  next();
});


// the schema is useless so far
// we need to create a model using it
//var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
//module.exports = User;

module.exports = mongoose.model('Blog', blogSchema);