const mongoose=require('mongoose');
const myschema =mongoose.Schema;


const userSchema=new myschema({


		name:{

			type:String,
			required:true
		},
		email:{

			type:String,
			required:true
		},
		password:{

			type:String,
			required:true
		},
		createdAt:{

			type:Date,
			default:Date.now
		},


});


var User=mongoose.model('User',userSchema);

module.exports={User};