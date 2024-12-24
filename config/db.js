const mongoose = require('mongoose')

mongoose.connect(process.env.DBSTRING).then(res=>{
    console.log("MongoDB Connection Success");
}).catch(err=>{
    console.log("MongoDB Connection Failed : " + err);  
})