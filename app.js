var express=require('express');
var exphbs  = require('express-handlebars');
const port=process.env.PORT || 3000;
const mongoose =require('mongoose');
const passport=require('passport');
const {Data}=require('./models/data');
const {User}=require('./models/user');
const bodyParser=require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
var methodOverride = require('method-override');
var {isAuthenticated}=require('./authenticate/auth');
const users=require('./routes/user');
//express
const app=express();
require('./config/passport')(passport);
//mongoose connection
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost:27017/dataStore',{

		useNewUrlParser: true

})
.then(()=>console.log('database is connected'))
.catch((err)=>console.log(err));
//handlebars

app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));

app.use(session({
  secret: 'thisismysecretkey',
  resave: true,
  saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});

//routes
app.get('/',(req,res)=>{

res.render('index');

});

app.get('/viewData',isAuthenticated,(req,res)=>{

Data.find({user:req.user.id})
.sort({date:'desc'})
.then((items)=>{

	res.render('viewData',{

		data:items
	});

})
});

app.get('/addData',isAuthenticated,(req,res)=>{

res.render('addData');

});

app.post('/addData',isAuthenticated,(req,res)=>{

let errors=[];

if(!req.body.title){

	errors.push({text:'Please add the title'})
}
if(!req.body.description){

	errors.push({text:'Please add the description'})
}

if(errors.length>0){

	res.render('addData',{

		errors:errors,
		title:req.body.title,
		description:req.body.description
	});
}
else{

	const data=new Data({

			title:req.body.title,
			description:req.body.description,
			user:req.user.id

	});
	data.save().then((item)=>{

			req.flash('success_msg', 'Data added successfully');
			res.redirect('/addData');


	},(e)=>{

		req.flash('error_msg', 'Data added successfully');
		res.status(400).send(e)

	});
}


});

app.get('/editData/:id',isAuthenticated,(req,res)=>{


		Data.findOne({

		_id:req.params.id
	})
	.then((items)=>{
		if(items.user!=req.user.id){


			req.flash('error_msg','oops!!Unauthorized Access');
			res.redirect('/viewData');

		}
else{


		res.render('editData',{

				data:items

		});
}
	
	});

});

app.put('/editData/:id',isAuthenticated,(req,res)=>{

	Data.findOne({

		_id:req.params.id
	})
	.then((items)=>{
		if(items.user!=req.user.id){

		req.flash('error_msg','oops!!Unauthorized Access');
		res.redirect('/viewData');

		}
		else{

					items.title=req.body.title;
					items.description=req.body.description;
					items.save().then((item)=>{

					req.flash('success_msg','Data updated successfully');
					res.redirect('/viewData');

	})

		}

});
});

app.delete('/editData/:id',isAuthenticated,(req,res)=>{

	Data.remove({

		_id:req.params.id
	})
	.then(()=>{

		
			res.redirect('/viewData');
	})

});



app.use(users);

app.listen(port,()=>{

console.log(`server is running on ${port}`);

});