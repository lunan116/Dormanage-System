var express = require('express');
var router = express.Router();


router.post('/', function (req, res, next){
    var d = new Date();
    var param = req.body;
    var userName = param.name,
        IDNo = param.IDCard,
        roomID = param.roomID,
        startNo = param.startNo,
        gender = param.gender,
        phoneNo = param.phoneNo,
        belongToCompany = param.belongToCompany,
        rank = param.rank,
        startTime = Date.now().toString();
    var dynamicdormrooms = global.dbHelper.getModel('dynamicdormrooms');
    var dormrooms = global.dbHelper.getModel('dormrooms');
    var users = global.dbHelper.getModel('users');
    var usersforroomcharges = global.dbHelper.getModel("usersforroomcharges");
    //var data = {isDelete:"false","userInfoList.userName":userName,"userInfoList.IDNo":IDNo,"userInfoList.isEnd":"false"}
    var data = {isDelete:"false","userInfoList":{ $elemMatch: { "userName": userName, "IDNo": IDNo,"isEnd":"false"} }}
    dynamicdormrooms.find(data ,function (error,doc) {
        if (doc.length > 0){
            //console.log(doc);
            dormrooms.find({isDelete: "false"}, function (error1,doc1) {
                for (var j = 0;j<doc1.length;j++ ) {
                    if (doc[0].roomId == doc1[j]._id) {
                        var roomNo = doc1[j].roomNo;
                        res.json({"errorCode": "405", "errorMessage": "该住客已经登记过了！", "roomNo": roomNo});
                    }
                }
               // res.json({"errorCode": "402", "errorMessage": "该住客所住的房间已经被删除了！", "roomNo": doc[0].roomId});
            })

        } else if(error) {
            //console.log(error);
            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+"createUserInfo.js  添加失败！"+error)
            res.json({"errorCode":"404","errorMessage":"添加失败！"});
        }else{
            dynamicdormrooms.find({roomId:roomID},function(err2,doc2){
                var peopleNo = 0 ;
                var doc3 = {
                    roomId:roomID,
                    newNo:startNo,
                    isDelete:"false",
                    userInfoList:[]
                };
                for (var i =0;i<doc2[0].userInfoList.length;i++){
                    if (doc2[0].userInfoList[i].isEnd == "false"){
                        peopleNo++
                    }
                }
                //console.log(doc2[0].newNo + "  " + startNo)
                if (Number(doc2[0].newNo) > Number(startNo)){
                    res.json({"errorCode":"402","errorMessage":"电表起始数不能小于原房间电表数！"});
                } else{
                    var avgNo = (startNo - doc2[0].newNo)/peopleNo;
                    for (var i =0;i<doc2[0].userInfoList.length;i++){
                        if (doc2[0].userInfoList[i].isEnd == "false"){
                            doc3.userInfoList.push({
                                userName:doc2[0].userInfoList[i].userName,
                                IDNo:doc2[0].userInfoList[i].IDNo,
                                startTime:doc2[0].userInfoList[i].startTime,
                                usedNo:(Number(doc2[0].userInfoList[i].usedNo) + avgNo).toString(),
                                isEnd:doc2[0].userInfoList[i].isEnd,
                                endTime:doc2[0].userInfoList[i].endTime,
                            })
                        }else{
                            doc3.userInfoList.push(doc2[0].userInfoList[i])
                        }
                    }
                    //console.log(doc3)
                    doc3.userInfoList.push({
                        userName:userName,
                        IDNo:IDNo,
                        startTime:startTime,
                        usedNo:"0",
                        isEnd:"false",
                        endTime:"",
                    })
                    //console.log(doc3)
                    dynamicdormrooms.findOneAndUpdate({roomId:roomID},doc3,function (error,doc) {
                        if (error) {
                            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+"createUserInfo.js  查找数据库失败！"+error)
                            res.json({"errorCode": 407,"errorMessage": "修改失败！"});
                            //console.log(error);
                        }else{
                            //console.log(doc);
                            users.find({IDNo,isEnd:"false"},function (err4,doc4) {
                                if (err4){
                                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+"createUserInfo.js  更新用户表失败！"+err4)
                                } else{
                                    var user = {
                                        userName,
                                        IDNo,
                                        startNo,
                                        startTime,
                                        gender,
                                        phoneNo,
                                        belongToCompany,
                                        rank,
                                        endNo:"",
                                        endTime:"",
                                        isEnd:"false",
                                        roomId:roomID,
                                        usedNoList:[]
                                    }
                                    var  userForRoom = {
                                        userName,
                                        IDNo,
                                        startTime,
                                        gender,
                                        startNo,
                                        phoneNo,
                                        belongToCompany,
                                        rank,
                                        monthFee:"0",
                                        endNo:"",
                                        endTime:"",
                                        isEnd:"false",
                                        roomId:roomID,
                                        roomRechargesList:[]
                                    }
                                    //console.log(user)
                                    usersforroomcharges.create(userForRoom)
                                    users.create(user)
                                }
                            })
                            res.json({"errorCode": 200,"errorMessage": "修改成功！"});
                        }
                    })
                }
            })

        }
    })

});
module.exports = router;
