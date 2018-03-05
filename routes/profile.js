var mongoose = require( 'mongoose' );
var User     = mongoose.model( 'User' );

module.exports = function (app,passport) {



//External Auths, Google & Facebook

app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));
    
// the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
  successRedirect : '/authsuccess',
  failureRedirect : '/profile/signup'
}))
    
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
app.get('/oauth2callback',
  passport.authenticate('google', {
      successRedirect : '/authsuccess',
      failureRedirect : '/profile/signup'
      }
      /*
  ,function(req, res) {
req.fhclSession.username = req.user;
req.fhclSession.loggedIn = true;
res.redirect('back');
    }
    */
      ))
  //

  app.get('/authsuccess',function(req,res){

    console.log ("Checking if authenticated");

    if (req.isAuthenticated())
                {
                    var guser = req.user;
                    console.log ("User Authenticated" +guser);
                    req.fhclSession.user = guser._id;
                    req.fhclSession.username = guser.name;
                    req.fhclSession.loggedIn = true;
                    return res.redirect('back');
                }
                return res.redirect('/profile');

  })

app.get('/profile',function(req,res){

  if(req.fhclSession.loggedIn)
  {
    console.log('Got a Request to View Profile of:'+req.fhclSession.user);
    User.findById(req.fhclSession.user, function(err, doc) {
    if(err) throw err;
    if (doc)
    {
      return res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,profilePage:true,user:doc});
    }
    //This sud not get hit, unless someone tries to hack in
    console.log('User'+req.fhclSession.user+' looks suspicious');
    return res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,profilePage:true});
    });
  }
  else
  {
    res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,profilePage:true});
  }
})

app.get('/profile/signout',function(req,res){
req.fhclSession.username = null;
req.fhclSession.loggedIn = false;

if(req.header('Referer').search("signin")>0)
{
  res.redirect('/index'); 
}
else
{
  res.redirect('back'); 
}

})

app.post('/profile/signin',function(req,res){

console.log('Got a Request to Login User\n'+req.body.username);

User.findById(req.body.username, function(err, user) {
  		if (err) throw err;
  		if (user) {
  				console.log('login Exists!'+user);

  				if(req.body.passwd===user.password)
  				{
  					req.fhclSession.loggedIn=true;
			    	req.fhclSession.username=user.name;
            req.fhclSession.user=user._id;
            var msg = ["Welcome Back"];
  					return res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,notifications:msg,profilePage:true});
  				}

  				//error In Password
          var msg = ["Either Username of Password is </strong>Wrong<strong>"];
          msg.push("Please try logging In");
  				return res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,notifications:msg,profilePage:true});
  				
  			} 

  			//User Doesn't Exist, Redirect to Signin/SignUp
         var msg = ["Either Username of Password is </strong>Wrong<strong>"];
          msg.push("Please try resetting Password In or Making an Account");
			return res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,notifications:msg,profilePage:true});
			});

})

	

//Get Signup Request

app.post('/profile/signup',function(req,res){

  //var req.body=JSON.stringify(req.body, null, 2);

	// create a new user
	console.log('Got a Request to Create User\n'+req.body.email);
		
		User.findById(req.body.email, function(err, user) {
  			if (err) throw err;
  			if (user) {
  				console.log('User Exists!'+user);
          var msg = ["An Account with This Email Already Exists"];
  				return res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,notifications:msg,profilePage:true});
  			} 

  			var newUser = new User({
  			_id: req.body.email,
  			name: req.body.name,
  			phone: req.body.phone,
  			password: req.body.passwd,
  			dob:req.body.dob
			});

  			newUser.save(function(err) {
  			if (err) throw err;
  			console.log('User created!');
  			req.fhclSession.loggedIn=true;
			req.fhclSession.username=newUser.name;
      var msg = ["<strong>Welcome Abord</strong>, Thanks for Beign a Part of Our Cause"];
      msg.push("Please find time to complate your profile for better service");
			return res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,notifications:msg,profilePage:true});
			});

		  	
		});

})

app.post('/profile/update',function(req,res)
{
  //var query = { _id: req.fhclSession.user };
  var change = {
    name : req.body.name,
    phone : req.body.phone,
    dob : req.body.dob,
    location : req.body.location,
    address: {
      line1: req.body.addrl1,
      line2: req.body.addrl2,
      city: req.body.addrc,
      state: req.body.addrs,
      country: req.body.addrcn,
      pincode: req.body.addrpn
    },
    social: {
      gplus:req.body.socailgp,
      fb:req.body.socailfb,
      tw:req.body.socailtw,
      ln:req.body.socailln
    }
  };

  User.findByIdAndUpdate(req.fhclSession.user,{ $set:change},function(err,doc){
    if (err) throw err;
    console.log('Doc After Modification : '+ doc);
    var msg = ["<strong>Profile</strong> changes saved.."];
    req.fhclSession.username = req.body.name; // If Name Changed
    return res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,profilePage:true,notifications:msg,user:doc});
  });
})

app.get('/profile/:pgoto',function(req,res){

  if(req.fhclSession.loggedIn)
  {

    var page ={
    edit : false,
    settings : false,
    mydon : false
  };

  if(req.params.pgoto=='edit')
  {
    page.edit = true;
  } 
  else if (req.params.pgoto=='settings')
  {
    page.settings =true;
  }
  else if (req.params.pgoto=='mydonations')
  {
    page.mydon =true;
  }
  else
  {
    res.render('error',{error404:'404',layout:false});
  }


    console.log('Got a Request to View Profile of:'+req.fhclSession.user);
    User.findById(req.fhclSession.user, function(err, doc) {
    if(err) throw err;
    if (doc)
    {
      return res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,profilePage:true,user:doc,pview:page});
    }
    //This sud not get hit, unless someone tries to hack in
    console.log('User'+req.fhclSession.user+' looks suspicious');
    return res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,profilePage:true});
    });
  }
  else
  {
    res.render('profile',{loggedIn:req.fhclSession.loggedIn,username:req.fhclSession.username,profilePage:true});
  }
})

//API Version 1.0 for Profiles 

app.get('/api/v1.0/:secret/profile',function(req,res){

  var email = req.params.secret ;

  User.findById(email).lean().exec(function (err, users) {


        if (err) throw err;

        console.log(users);

        if (users)
        {
          var result = {
            status : true,
            user : users
          };
          return res.json(result);
        }

          var result = {
            status : false,
            user : users
          };
          
          return res.json(result);
        });

})

app.post('/api/v1.0/signin',function(req,res){

  console.log('Got a Request to Login User\n'+req.body.username);

  User.findById(req.body.username, function(err, user) {
        if (err) throw err;
        if (user) {
        console.log('login Exists!'+user);

          if(req.body.passwd===user.password)
          {

            var msg = ["Welcome Back"];
            
            var result = {
            status : true,
            notifications : msg,
            user : user
            };
            return res.json(result);
          }

          var msg = ["Either Username of Password is Wrong"];
          msg.push("Please try logging In");
          
          var result = {
            status : false,
            notifications : msg,
            user : {}
          };
          return res.json(result);
          
        } 

        //User Doesn't Exist, Redirect to Signin/SignUp
        var msg = ["User Didn't Exist"];        
        var result = {
          status : false,
          notifications : msg,
          user : {}
        };
          return res.json(result);

      });

})

app.post('/api/v1.0/signup',function(req,res){


  console.log('Got a Request to Create User\n'+req.body.email);

  if(!req.body.email || !req.body.name || !req.body.passwd)
  {

    var msg = ["Incomplete or Incorrect Input"];
    msg.push("Name Email & Password are must");
          
    var result = {
        status : false,
        notifications : msg
    };

    return res.json(result);
  }
    
    User.findById(req.body.email, function(err, user) {
        if (err) throw err;
        if (user) {
          
          console.log('User Exists!'+user);

          var msg = ["An Account with This Email Already Exists"];
          
          var result = {
            status : false,
            notifications : msg
          };
          
          return res.json(result);
        } 

        var newUser = new User({
        _id: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.passwd,
        dob:req.body.dob,
        sex:req.body.sex
      });

        newUser.save(function(err) {
        if (err) throw err;
        console.log('User created!');

      var msg = ["Welcome Abord, Thanks for Beign a Part of Our Cause"];
      msg.push("Please find time to complete your profile for better service");
      
      var result = {
            status : true,
            notifications : msg
          };
          
      return res.json(result);
      
      });

        
    });

})



}