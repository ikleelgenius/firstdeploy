var mysql=require('mysql')
const database=mysql.createConnection({
    host:'localhost',
    user:'root',
    password:"",
    database:process.env.DB_NAME
})
module.exports={
    connect:()=>{
        database.connect((err)=>{
            if(err){
                console.log(err)
            }else{
                console.log("connected with db with id "+database.threadId)
              
            }
        })
    },
    db:database   
}
