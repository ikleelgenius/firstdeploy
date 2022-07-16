var server=require('./connection')
const bcrypt=require('bcrypt')
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const date = require('date-and-time');
const { db } = require('./connection');
module.exports={
    checkconfig:async(req,res)=>{
        const configsql="SELECT * FROM `masterconfig`"
       await server.db.query(configsql,[],(err,response)=>{
           if(response[0]==undefined){
            res.json({status:"UNSET_CONFIG"})
           }else{
            res.json({status:"SET_CONFIG"})
           }
        })
    },
    configuremain:async(req,res)=>{
        const username=req.body.USERNAME
        const password=req.body.PASSWORD
        var configurationsql="INSERT INTO `masterconfig`(`USERNAME`, `PASSWORD`) VALUES (?,?)"
        bcrypt.genSalt(saltRounds,(err,responsesalt)=>{
            bcrypt.hash(password,responsesalt,async(err,cryptpassword)=>{
                if(err){
                    res.json({status:"ERROR_PASSWORD_ENCRYPTION"})

                }else{
                    await server.db.query(configurationsql,[username,cryptpassword],(err,response)=>{
                        if(response){
                             res.json({status:"CONFIG_UPDATED"})
                        }else{
                             res.json({status:"CONFIG_UPDATE_DBERROR"})
                        }
                    })
                }
            })
        }) 
    },
    findconfiguration:(req,res)=>{
        var findconfigsql="SELECT * FROM `masterconfig`"
        server.db.query(findconfigsql,[],(err,result)=>{
            if(result.length>=1){
                res.json({status:"CONFIGURED"})
            }else{
                res.json({status:"UNCONFIGURED"})
            }
        })
    },
    saveadminuser:async(req,res)=>{
        const{USERNAME,AD_NO,email,PASSWORD}={...req.body}
      const  adminfindersql="SELECT * FROM `admins` WHERE AD_NO= ?"
     await server.db.query(adminfindersql,[AD_NO],async(err,existingusers)=>{
            if(existingusers.length>=1){
                res.json({status:"EXISTING_ADMIN"})
            }else{
                await  bcrypt.genSalt(saltRounds,(err,salt)=>{
                    bcrypt.hash(PASSWORD,salt,async(err,cryptopassword)=>{
                        const saveadminsql="INSERT INTO `admins`( `USERNAME`, `AD_NO`, `PASSWORD`) VALUES (?,?,?)"
                      await  server.db.query(saveadminsql,[USERNAME,AD_NO,cryptopassword],(err,response)=>{
                        if(response){
                            res.json({status:"ADMIN_SAVED"})
                        }else{
                            res.json({status:"ADMIN_REGISTRATION_FAILED"})
                        }
                      })
                    })
                })
            }
      })
      
       
    },
    adminlogin:async(req,res)=>{
        const{USERNAME,PASSWORD}={...req.body}
        adminloginsql="SELECT * FROM `admins` WHERE USERNAME= ? "
      await  server.db.query(adminloginsql,[USERNAME],(err,currentuser)=>{
            if(currentuser.length>=1){
                    bcrypt.compare(PASSWORD,currentuser[0].PASSWORD).then(async(response)=>{
                        if(response){
                            const token=await jwt.sign({token:currentuser[0]},process.env.secret,{expiresIn:"24h"})
                            res.json({status:"AUTH_SUCCESS",user:currentuser,token:token})
                        }else{
                            res.json({status:'WRONG_PASSWORD'})
                        }
                    })
            }else{
                res.json({status:'ADMIN_UNFOUND'})
            }
        })

    },
    newusersession:(req,res)=>{
        const{AD_NO}={...req.body.user}
        const PC_NAME=req.body.PC_NAME
       // const START_TIME=req.body.START_TIME
       //get START TIME FROM SERVER PC
       const now = new Date();
       const pattern = date.compile('hh:mm A');
       var START_TIME=date.format(now,pattern)
        var confirmusersql="SELECT * FROM `users` WHERE `AD_NO`=?"
        server.db.query(confirmusersql,[AD_NO],(err,verifieduser)=>{

         if(verifieduser[0]){
            var sql="UPDATE `current_users` SET `AD_NO`=?,`START_TIME`=? WHERE `PC_NUMBER`= ?"
            server.db.query(sql,[AD_NO,START_TIME,PC_NAME],(err,updated)=>{
                res.json({status:'UPDATE_SUCCESS'})
            })
         }else{
             //user not found
             res.json({status:"USER_NOT_FOUND"})
         }
        })
    },
    Getallclients:(req,res)=>{
        const allclientssql="SELECT * FROM `users`"
        server.db.query(allclientssql,(err,clientslist)=>{
            res.json({clients:clientslist})
        })
    },
    validateAdminCookie:(req,res)=>{
        const rawtoken=req.headers.authorization
        console.log(rawtoken);
        const refreshtoken=rawtoken.split(" ")
        jwt.verify(refreshtoken[1],process.env.secret,(err,result)=>{
            if(result==undefined){
                res.json({user:"INVALID_USER"})
            }else{
                const cookiechecksql="SELECT `USERNAME`, `AD_NO`,`PASSWORD` FROM `admins` WHERE `USERNAME`=?"
                server.db.query(cookiechecksql,[result.token.USERNAME],(err,cookieuser)=>{
                    if(cookieuser.length>0){
                            if(result.token.PASSWORD===cookieuser[0].PASSWORD){
                                const{USERNAME,AD_NO}={...cookieuser[0]}
                                const validuser={
                                    USERNAME,
                                    AD_NO,
                                    IsAdmin:true
                                }
                                const accesstoken=jwt.sign(validuser,process.env.secret,{expiresIn:"1h"})
                                res.json({user:validuser,accesstoken})
                            }else{
                                res.json({user:"INVALID_USER"});
                            }
                    }else{
    
                    }
                })

            }
           
        })
        

    },
    refreshAccessToken:(req,res)=>{
        const rawaccesstoken=req.headers.authorisation
        const accesstoken=rawaccesstoken.split(" ")
        jwt.verify(accesstoken[1],process.env.secret,(err,verifiedaccesstoken)=>{
            if(verifiedaccesstoken.exp-Math.floor(Date.now()/1000)<900){
                   const {USERNAME,AD_NO,IsAdmin}={...verifiedaccesstoken}
                  
                jwt.sign({USERNAME,AD_NO,IsAdmin},process.env.secret,{expiresIn:"1h"},(err,newtoken)=>{
                    
                    res.json({newtoken})
                })
            }else{
                res.json({token:"TOKEN_VALID"})
            }
            
        })
    },
    Endusersession:(req,res)=>{
        const {PC_NAME,AD_NO}={...req.body}
        //get START TIME FROM SERVER PC
        const now = new Date();
        const pattern = date.compile('hh:mm A');
        const datepattern=date.compile('ddd, MMM DD YYYY')
         var  END_TIME=date.format(now,pattern)
         var DATE=date.format(now,datepattern)
        const findusersql="SELECT  * FROM `current_users` LEFT JOIN users ON current_users.AD_NO = users.AD_NO WHERE `PC_NUMBER`= ? "
        const addhistorysql="INSERT INTO `history`(`AD_NO`, `NAME`, `PC_NO`, `START_TIME`, `END_TIME`, `DATE`) VALUES (?,?,?,?,?,?)"
        const sessionEndsql="UPDATE `current_users` SET `AD_NO`=?,`START_TIME`=? WHERE `PC_NUMBER`= ?"
        server.db.query(findusersql,[PC_NAME],(err,currentuser)=>{
            if(currentuser[0]){
                const{AD_NO,USERNAME,START_TIME}={...currentuser[0]}
                server.db.query(addhistorysql,[AD_NO,USERNAME,PC_NAME,START_TIME,END_TIME,DATE],(error,historyadded)=>{
                   if(historyadded.affectedRows>=1){
                    server.db.query(sessionEndsql,[null,null,PC_NAME],(err,sessionresult)=>{
                        if(sessionresult.affectedRows>=1){
                           res.json({status:"TASK_FINISH"})
                        }else{
                           res.json({status:"something went wrong"})
                        }
                    })
                   }else{

                   } 
                })
            }else{

            }
        })   
    },
    Getallcomputers:(req,res)=>{
        findpcsql="SELECT * FROM `computers`"
        server.db.query(findpcsql,(err,pcs)=>{
            res.json({computers:pcs})
        })
    },
    Getactivesessions:(req,res)=>{
        const sessioncountsql="SELECT * FROM `current_users` WHERE AD_NO IS NOT NULL"
        server.db.query(sessioncountsql,[],(err,numberarray)=>{
            res.json({sessions:numberarray})
        })
    },
    Getactiveclients:(req,res)=>{
        const clientcountsql="SELECT * FROM `users`"
        server.db.query(clientcountsql,[],(err,numberarray)=>{
            res.json({sessions:numberarray})
        })
    },
    Getactivecomputers:(req,res)=>{
        const computercountsql="SELECT * FROM `computers` WHERE ACTIVE='true'"
        server.db.query(computercountsql,[],(err,numberarray)=>{
            res.json({sessions:numberarray})
        })
    }
}