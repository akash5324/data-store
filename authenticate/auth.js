module.exports={

	isAuthenticated:function(req,res,next){

	if(req.isAuthenticated()){
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else{
    	req.flash('error_msg','please login to continue');
        res.redirect("/login");
    }

	}

}