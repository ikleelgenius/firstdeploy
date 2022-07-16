var express = require('express');
const jwt=require("jsonwebtoken")
const multer  = require('multer')
var fs=require('fs')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images/PROFILES/ADMINS/')
    },
    filename: function (req, file, cb) {
      
      cb(null,file.originalname)
    }
  })
  const upload = multer({storage:storage })
var router = express.Router();
var admintasks=require("../database/Admintasks")
/* GET users listing. */
router.get('/',function(req, res, next) {
  
  
});
router.get("/signup",(req,res)=>{
    admintasks.checkconfig(req,res)
})
router.post("/adminsignup",(req,res)=>{

})
router.post("/login",(req,res)=>{
    admintasks.adminlogin(req,res)
})
router.post("/configuremain",(req,res)=>{
    admintasks.configuremain(req,res)
})
router.get("/configurationstate",(req,res)=>{
    admintasks.findconfiguration(req,res)
})
router.post("/signup",(req,res)=>{
    admintasks.saveadminuser(req,res)
})
router.post("/newadminsessionrequest",(req,res)=>{
    admintasks.newusersession(req,res)
})
router.get("/allclients",(req,res)=>{
    admintasks.Getallclients(req,res)
})
router.post("/saveprofile",upload.single("file"),(req,res)=>{
    fs.rename(`./public/images/PROFILES/ADMINS/${req.body.AD_NO}`,`./public/images/PROFILES/ADMINS/${req.body.AD_NO}.jpg`,(err)=>{
        if(err){
          res.json({error:"file save failed"})
       }else{
          res.json({status:"PROFILE_UPDATE_SUCCESS"})
       }
       })
})
router.get("/validateAdminCookie",(req,res)=>{
    admintasks.validateAdminCookie(req,res)
})
router.get("/auth/refreshaccess",(req,res)=>{
    admintasks.refreshAccessToken(req,res)
})
router.post("/endsession",(req,res)=>{
    admintasks.Endusersession(req,res)
})
router.get("/computers",(req,res)=>{
    admintasks.Getallcomputers(req,res)
})
router.get("/activesessioncount",(req,res)=>{
    admintasks.Getactivesessions(req,res)
})
router.get("/activeclientcount",(req,res)=>{
    admintasks.Getactiveclients(req,res)
})
router.get("/activecomputerscount",(req,res)=>{
    admintasks.Getactivecomputers(req,res)
})
module.exports = router;
