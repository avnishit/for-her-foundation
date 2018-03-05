var path=require('path');

module.exports = function (app) {
	
app.redirect("/index*", "/");
app.get('/',function(req,res){
res.render('home',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username});
})

app.get('/about',function(req,res){
res.render('about',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username});
})

app.get('/team',function(req,res){
res.render('team',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,teampage:true});
})

app.get('/board',function(req,res){
res.render('board',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,teampage:true});
})

app.get('/programmes',function(req,res){
res.render('programmes',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username});
})

app.get('/partners',function(req,res){
res.render('partners',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username});
})

app.get('/mediacoverage',function(req,res){
res.render('mediacoverage',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username});
})

app.get('/founders',function(req,res){
res.render('founder',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username});
})

app.get('/contact',function(req,res){
res.render('contact',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username});
})

app.get('/volunteer',function(req,res){
res.render('contact',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,jumpto:'#volunteer'});
})

app.get('/intern',function(req,res){
res.render('contact',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,jumpto:'#intern'});
})

		//API Version 1.0 for Generic Use

app.get('/api/v1.0/home',function(req,res){
res.sendFile(path.join(__dirname+'/../app/home.json'));
});

app.get('/api/v1.0/team',function(req,res){
res.sendFile(path.join(__dirname+'/../app/team.json'));
});

}