const mongoose=require('mongoose');
const myschema =mongoose.Schema;


const dataSchema=new myschema({


		title:{

			type:String,
			required:true
		},
		description:{

			type:String,
			required:true
		},
		createdAt:{

			type:Date,
			default:Date.now
		},

		user:{

			type:String,
			required:true
		}


});


var Data=mongoose.model('Data',dataSchema);

module.exports={Data};