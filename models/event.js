// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var eventSchema = mongoose.Schema({
  _id:String,
  title:  String,
  author: {name: String, photo: String, id:String },
  program: {name: String, id:String },
  body:   String,
  summary:String,
  location:   String,
  comments: [{ body: String, date: Date, user:String, email:String }],
  start_date: Date,
  end_date: Date,
  hidden: { type: Boolean, default: true },
  tags : [String],
  meta: {
    votes: Number,
    favs:  Number,
    be_there : Number,
    ppl_promise:[String],
    attended :Number,
    people : [String]
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

module.exports = mongoose.model('Event', eventSchema);