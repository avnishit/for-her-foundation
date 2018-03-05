var mongoose = require( 'mongoose' );
var User     = mongoose.model( 'User' );
var Blog	 = mongoose.model('Blog');
module.exports = function (app) {

		app.get('/blog',function(req,res){

			Blog.find().sort({'created_at': -1}).limit(12).lean().exec(function (err, post) {
    			return res.render('blog',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,posts:post,nextnum:2 });
				
				});
		
		})

		app.get('/blog/:num',function(req,res){

			var currpage = parseInt(req.params.num);
			var toskip= (req.params.num - 1) * 12;
			Blog.find().sort({'created_at': -1}).skip(toskip).limit(12).lean().exec(function (err, post) {
    			return res.render('blog',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,posts:post,prevnum:currpage-1,nextnum:currpage+1});
				});
		})

		app.get('/blog/posts/readmode/:num',function(req,res){

			Blog.findById(req.params.num).lean().exec(function (err, doc) {
				console.log(doc);
    			return res.render('blogpost',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,post:doc,layout:'index_nodist'});
				});		
		})

		app.get('/blog/posts/:num',function(req,res){

			Blog.findById(req.params.num).lean().exec(function (err, doc) {
				console.log(doc);
    			return res.render('blogpost',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,post:doc});
				});		
		})

		app.post('/blog/comments/:num',function (req,res) {

			Blog.findById(req.params.num).exec(function (err, doc) {
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

					Blog.findById(req.params.num).lean().exec(function (err, doc) {


					return res.render('blogpost',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,post:doc});

				});
				});

				});	
		})

		//API Version 1.0 for Blog 

		app.get('/api/v1.0/blog',function(req,res){
			Blog.find().sort({'created_at': -1}).limit(12).lean().exec(function (err, posts) {

				var result = { posts : posts };
    			return res.json(result);
				});
		})

		app.get('/api/v1.0/blog/:num',function(req,res){
			var toskip= (req.params.num - 1) * 12;
			Blog.find().sort({'created_at': -1}).skip(toskip).limit(12).lean().exec(function (err, posts) {

				var result = { posts : posts };
    			return res.json(result);
				});
		})

		app.get('/api/v1.0/blog/:num/:limit',function(req,res){
			var toskip= (req.params.num - 1) * req.params.limit;
			Blog.find().sort({'created_at': -1}).skip(toskip).limit(req.params.limit).lean().exec(function (err, posts) {
				var result = { posts : posts };
    			return res.json(result);
				});
		})

}
