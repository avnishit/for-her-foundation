var mongoose = require( 'mongoose' );
var User     = mongoose.model( 'User' );
var Event	 = mongoose.model('Event');
module.exports = function (app) {

		app.get('/events',function(req,res){

			Event.find().sort({'created_at': -1}).limit(12).lean().exec(function (err, docs) {
    			return res.render('events',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,posts:docs,nextnum:2 });
				});
		
		});

		app.get('/events/:num',function(req,res){

			var currpage = parseInt(req.params.num);
			var toskip= (req.params.num - 1) * 12;
			Event.find().sort({'created_at': -1}).skip(toskip).limit(12).lean().exec(function (err, post) {
    			return res.render('events',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,posts:post,prevnum:currpage-1,nextnum:currpage+1});
				});
		});

		app.get('/events/posts/readmode/:num',function(req,res){

			Event.findById(req.params.num).lean().exec(function (err, doc) {
				console.log(doc);
    			return res.render('eventpost',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,post:doc,layout:'index_nodist'});
				});		
		})

		app.get('/events/posts/:num',function(req,res){

			Event.findById(req.params.num).lean().exec(function (err, doc) {
				console.log(doc);
    			return res.render('eventpost',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,post:doc});
				});		
		})

		app.post('/events/comments/:num',function (req,res) {

			Event.findById(req.params.num).exec(function (err, doc) {
				console.log(doc);
				var newComment = {
					user : req.body.name,
					email : req.body.email,
					body : req.body.body,
					date : new Date()
				};
				doc.comments.push(newComment);
				doc.save (function (err){
					if (err) throw err;

					Event.findById(req.params.num).lean().exec(function (err, doc) {


					return res.render('eventpost',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,post:doc});

				});
				});

				});	
		})

		//API Version 1.0 for Events 

		app.get('/api/v1.0/events',function(req,res){
			Event.find().sort({'created_at': -1}).limit(12).lean().exec(function (err, docs) {

				var result = { posts : docs };
    			return res.json(result);
				});
		})

		app.get('/api/v1.0/events/:num',function(req,res){
			var toskip= (req.params.num - 1) * 12;
			Event.find().sort({'created_at': -1}).skip(toskip).limit(12).lean().exec(function (err, docs) {

				var result = { posts : docs };
    			return res.json(result);
				});
		})

		app.get('/api/v1.0/events/:num/:limit',function(req,res){
			var toskip= (req.params.num - 1) * req.params.limit;
			Event.find().sort({'created_at': -1}).skip(toskip).limit(req.params.limit).lean().exec(function (err, docs) {

				var result = { posts : docs };
    			return res.json(result);
				});
		})

}