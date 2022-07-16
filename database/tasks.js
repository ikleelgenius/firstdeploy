var server=require('./connection')
const bcrypt=require('bcrypt')
var jwt = require('jsonwebtoken');
const date = require('date-and-time');
const saltRounds = 10;
module.exports={
    Saveuser:async (userdetails,res)=>{
        const {USERNAME,AD_NO,email,BATCH,PASSWORD}={...userdetails}
        var samplechecksql="SELECT * FROM `users`   WHERE `AD_NO`= ? "
       await server.db.query(samplechecksql,[AD_NO],(sampleerror,sampler)=>{
            if(sampler[0]!==undefined){
                res.json({status:"EXISTING_ACCOUNT"})
            }else{
                bcrypt.genSalt(saltRounds,(err,salt)=>{
                    bcrypt.hash(PASSWORD,salt,async (err,crypt_password)=>{
                              var sql="INSERT INTO `users`(`AD_NO`, `USERNAME`, `EMAIL`, `BATCH`, `PASSWORD`) VALUES (?,?,?,?,?)"       
                        await server.db.query(sql,[AD_NO,USERNAME,email,BATCH,crypt_password],(err,response)=>{
                            if(response){
                                    res.status(200).json({status:"user_save_success"})
                            }else{
                                res.status(200).json({status:"EXISTING_ACCOUNT"})
                            }
                        })
                    })
                })
            }
        })
    },
    Finduser:async(req,res)=>{
        const {USERNAME,AD_NO,PASSWORD}={...req}
        var sql="SELECT * FROM `users` WHERE `AD_NO`= ? AND `USERNAME`= ? "
       await server.db.query(sql,[AD_NO, USERNAME],async(loginerror,userinfo)=>{
               
            if( userinfo[0]){
               await bcrypt.compare(PASSWORD,userinfo[0].PASSWORD).then(async(passwordmatch)=>{
                if(passwordmatch){
                    var token= await jwt.sign({adno:AD_NO,user:USERNAME},process.env.secret,{expiresIn:60*60*24})
                                res.json({status:"AUTH_SUCCESS",user:userinfo[0],token})
                }else{
                    res.json({status:"PASSWORD_MISMATCH"})
                }
               })
            }else{
                res.json({status:"UNREGISTERED_USER"})
            }
        })
    },
    startsession:(req,res)=>{
       const{AD_NO,PASSWORD,}={...req.body.user}
       const PC_NAME=req.body.PC_NAME
      // const START_TIME=req.body.START_TIME
      //get START TIME FROM SERVER PC
      const now = new Date();
      const pattern = date.compile('hh:mm A');
      var START_TIME=date.format(now,pattern)
       var confirmusersql="SELECT * FROM `users` WHERE `AD_NO`=?"
       server.db.query(confirmusersql,[AD_NO],(err,verifieduser)=>{
         console.log(err)
         console.log(verifieduser)
        if(verifieduser[0]){
            bcrypt.compare(PASSWORD,verifieduser[0].PASSWORD).then((verified)=>{
                if(verified){
                var sql="UPDATE `current_users` SET `AD_NO`=?,`START_TIME`=? WHERE `PC_NUMBER`= ?"
                server.db.query(sql,[AD_NO,START_TIME,PC_NAME],(err,updated)=>{
                    res.json({status:'UPDATE_SUCCESS'})
                })
                }else{
                    res.json({status:"PASSWORD_MISMATCH"})
                }
            })
        }else{
            //user not found
            res.json({status:"USER_NOT_FOUND"})
        }
       })
        
    },
    endsession:async(req,res)=>{
        var PC_NAME=req.body.PC_NAME
        var PASSWORD=req.body.user.PASSWORD
        //var DATE=req.body.DATE
        //var END_TIME=req.body.END_TIME
        const now = new Date();
        const pattern = date.compile('hh:mm A');
        const datepattern=date.compile('ddd, MMM DD YYYY')
        var END_TIME=date.format(now,pattern)
        var DATE=date.format(now,datepattern)
        var findusersql="SELECT  * FROM `current_users` LEFT JOIN users ON current_users.AD_NO = users.AD_NO WHERE `PC_NUMBER`= ? "
              await  server.db.query(findusersql,[PC_NAME],(err,user)=>{
               console.log(user)
                if(user[0]){
                    console.log(user[0],'on the way')
                    var USER=user[0].USERNAME
                    var ADNO=user[0].AD_NO
                    var STARTTIME=user[0].START_TIME
                    var findpasswordsql="SELECT `PASSWORD` FROM `users` WHERE `AD_NO` = ? "
                    server.db.query(findpasswordsql,[ADNO],(err,password)=>{
                        console.log(err, "password error")
                        var checkingpassword=password[0].PASSWORD
                        if(password[0]){
                            bcrypt.compare(PASSWORD,checkingpassword).then((response)=>{
                                console.log(response,"from password compare")
                                if(response){
                                    var updatehistorysql="INSERT INTO `history`(`AD_NO`, `NAME`, `PC_NO`, `START_TIME`, `END_TIME`, `DATE`) VALUES (?,?,?,?,?,?)"
                                    var sessionendsql="UPDATE `current_users` SET `AD_NO`=?,`START_TIME`=? WHERE `PC_NUMBER`= ?"
                                    server.db.query(updatehistorysql,[ADNO,USER,PC_NAME,STARTTIME,END_TIME,DATE],(err,response)=>{
                                        
                                        
                                    })
                                    server.db.query(sessionendsql,[null,null,PC_NAME],(err,response)=>{
                                      res.json({status:"TASK_FINISH"})
                                    })
                                }else{
                                    res.json({status:"PASSWORD_MISMATCH"})
                                }
                            })
                        }else{
                            //can't find password in users
                        }
                    })
                }else{
                        // no user in current_users
                }
        })
    },
    getuserhistory:(req,res)=>{
        //console.log(req.headers)
        const{USERNAME,AD_NO}={...req.query}
        var userhistorysql="SELECT  `PC_NO`, `START_TIME`, `END_TIME`, `DATE` FROM `history` WHERE `AD_NO`= ? AND `NAME`= ?"
        server.db.query(userhistorysql,[AD_NO,USERNAME],(err,response)=>{
            res.json({response})
        })
    },
    deleteuser:(req,res)=>{
       const {AD_NO}={...req.body}
       var userdeletesql="DELETE FROM `users` WHERE `AD_No` = ?"
       server.db.query(userdeletesql,[AD_NO],(err,deletesuccess)=>{
          if(deletesuccess.affectedRows>=1){
            res.json({status:"DELETE_SUCCESS"})
          }else{
            res.json({status:"DELETE_FAIL"})
          }
       })
    }
}