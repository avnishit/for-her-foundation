//Dummy apis for server testing

//var path=require('path');


module.exports = function (app,path) {

  app.get('/api/dummy/home',function(req,res){
res.sendFile(path.join(__dirname+'/../app/home.json'));
})

app.get('/api/dummy/signin/:username',function(req,res){
req.fhclSession.username = req.params.username;
req.fhclSession.loggedIn = true;
res.redirect('back'); 
})

app.get('/api/dummy/signout',function(req,res){
req.fhclSession.username = null;
req.fhclSession.loggedIn = false;
res.render('home',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username});
})

}