var express = require('express');
const multer  = require('multer')
var fs=require('fs')
const server=require("../database/connection")
const tasks=require("../database/tasks")
//initiate multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/PROFILES')
  },
  filename: function (req, file, cb) {
    
    cb(null,file.originalname)
  }
})
const upload = multer({storage:storage })
var router = express.Router();
var database=require("../database/connection");
const { json } = require('express');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get("/activeusers",(req,res)=>{
 //SELECT * FROM `current_users` LEFT JOIN users ON current_users.AD_NOAD_NO=users.AD_NO
  database.db.query("SELECT * FROM `current_users` LEFT JOIN users ON current_users.AD_NO=users.AD_NO ",(err,result)=>{
    res.json(result)
  })
})
router.post("/adduser",(req,res)=>{
  tasks.Saveuser(req.body,res)
})
router.post("/saveuserimage", upload.single("file"),(req,res)=>{
    
    fs.rename(`./public/images/PROFILES/${req.body.AD_NO}`,`./public/images/PROFILES/${req.body.AD_NO}.jpg`,(err)=>{
    if(err){
      res.json({error:"file save failed"})
   }else{
      res.json({status:"success"})
   }
   })
})
router.post("/loginuser",(req,res)=>{
  tasks.Finduser(req.body,res)
})
router.post("/newsessionrequest",(req,res)=>{
  tasks.startsession(req,res)
})
router.post("/endsession",(req,res)=>{
  tasks.endsession(req,res)
})
router.get("/userhistory",(req,res)=>{
 
 tasks.getuserhistory(req,res)
  
})
router.post("/deleteuser",(req,res)=>{
  tasks.deleteuser(req,res)
})
router.post("/updateprofile",upload.single("file"),(req,res)=>{
  fs.unlink(`./public/images/PROFILES/${req.body.AD_NO}.jpg`,(err)=>{
      if(err){
          console.log(err)
      }else{
      fs.rename(`./public/images/PROFILES/${req.body.AD_NO}`,`./public/images/PROFILES/${req.body.AD_NO}.jpg`,(err)=>{
          if(err){

          }else{
            res.json({status:"PROFILE_UPDATE_SUCCESS"})
          }
        })
      }
  })
})
module.exports = router;
