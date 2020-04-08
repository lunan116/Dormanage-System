var express = require('express');
var router = express.Router();
var ObjectId = require('mongodb').ObjectId;
var moment = require('moment');


router.post('/', function (req, res, next){
    var d=new Date()
    var param = req.body;
    var userName = param.name,
        IDNo = param.IDCard,
        startNo = param.startNo,
        endNo = param.endNo;
        endTime = Date.now().toString();
    var dynamicdormrooms = global.dbHelper.getModel('dynamicdormrooms');
    var dormrooms = global.dbHelper.getModel('dormrooms');
    var users = global.dbHelper.getModel('users');
    var usersforroomcharges = global.dbHelper.getModel("usersforroomcharges");
    var data = {isDelete:"false","userInfoList.userName":userName,"userInfoList.IDNo":IDNo,"userInfoList.isEnd":"false"}
    var roomcharges = global.dbHelper.getModel('roomcharges');
    //获取每个月的天数
    function mGetDate(year, month){
        var dc = new Date(year, month, 0);
        return dc.getDate();
    }
    /*时间格式化*/
    function a(d){
        if(parseInt(d) < 10){
            return  "0"+d
        }else{
            return d
        }
    }
    function timestampToTime(timestamp) {
        var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        var D = a(date.getDate()) + ' ';
        var h = a(date.getHours()) + ':';
        var m = a(date.getMinutes()) + ':';
        var s = a(date.getSeconds());
        return Y + M + D + h + m + s;
    }
    dynamicdormrooms.find(data ,function (error,doc) {
        if (doc.length = 0){
            //console.log(doc);
            dormrooms.find({isDelete: "false"}, function (error1,doc1) {
                for (var j = 0;j<doc1.length;j++ ) {
                    if (doc[0].roomId == doc1[j]._id) {
                        var roomNo = doc1[j].roomNo;
                        res.json({"errorCode": "405", "errorMessage": "未找到该住户的登记记录，请检查该用户的登记情况！", "roomNo": roomNo});
                    }
                }
                // res.json({"errorCode": "402", "errorMessage": "该住客所住的房间已经被删除了！", "roomNo": doc[0].roomId});
            })

        } else if(error) {
            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  updateUserInfo.js  查询dynamicdormrooms数据集合失败"+error)
            //console.log(error);
            res.json({"errorCode":"404","errorMessage":"登记失败！"});
        }else{
            dynamicdormrooms.find(data,function(err2,doc2){
                var peopleNo = 0 ;
                var indexMsg = 0;
                var doc3 = {
                    roomId:doc2[0].roomId,
                    newNo:endNo,
                    isDelete:"false",
                    userInfoList:[]
                };
                for (var i =0;i<doc2[0].userInfoList.length;i++){
                    if (doc2[0].userInfoList[i].isEnd == "false"){
                        peopleNo++
                    }
                }
                if (Number(doc2[0].newNo) > Number(endNo)){
                    res.json({"errorCode":"402","errorMessage":"电表登记数不能小于原房间电表数！"});
                } else{
                    var avgNo = (endNo - doc2[0].newNo)/peopleNo;
                    for (var i =0;i<doc2[0].userInfoList.length;i++){
                        if (doc2[0].userInfoList[i].isEnd == "false"){
                            if (doc2[0].userInfoList[i].userName == userName) {
                                indexMsg = i;
                                doc3.userInfoList.push({
                                    userName:doc2[0].userInfoList[i].userName,
                                    IDNo:doc2[0].userInfoList[i].IDNo,
                                    startTime:doc2[0].userInfoList[i].startTime,
                                    usedNo:(Number(doc2[0].userInfoList[i].usedNo) + avgNo).toString(),
                                    isEnd:"true",
                                    endTime:endTime,
                                })
                            }else{
                                doc3.userInfoList.push({
                                    userName:doc2[0].userInfoList[i].userName,
                                    IDNo:doc2[0].userInfoList[i].IDNo,
                                    startTime:doc2[0].userInfoList[i].startTime,
                                    usedNo:(Number(doc2[0].userInfoList[i].usedNo) + avgNo).toString(),
                                    isEnd:doc2[0].userInfoList[i].isEnd,
                                    endTime:doc2[0].userInfoList[i].endTime,
                                })
                            }

                        }else{
                            doc3.userInfoList.push(doc2[0].userInfoList[i])
                        }
                    }
                    //console.log("147258369"+doc3)
                    dynamicdormrooms.findOneAndUpdate(data,doc3,function (error,doc) {
                        if (error) {
                            res.json({"errorCode": 407,"errorMessage": "修改失败！"});
                        }else{
                            users.find({IDNo,isEnd:"false"},function (err4,doc4) {
                                if (err4){
                                    res.json({"errorCode": 407,"errorMessage": "修改失败！"});
                                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" updateUserInfo.js  查询users数据集合失败！"+err4)
                                } else{
                                    doc4[0].usedNoList.push({
                                        "month": d.getFullYear()+"."+(d.getMonth()+1),
                                        "useNo":(Number(doc2[0].userInfoList[indexMsg].usedNo) + avgNo).toString()
                                    })
                                    var user = {
                                        userName,
                                        IDNo,
                                        startNo,
                                        startTime:doc4[0].startTime,
                                        endNo:endNo,
                                        endTime:endTime,
                                        isEnd:"true",
                                        roomId:doc4[0].roomId,
                                        usedNoList:doc4[0].usedNoList
                                    }
                                    users.findOneAndUpdate({userName,startNo,IDNo,isEnd:"false"},user,function (err5,doc5) {
                                        if (err5){
                                            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" updateUserInfo.js 修改users数据集合失败" + err5)
                                            res.json({"errorCode": 500,"errorMessage": "修改用户表失败！"});
                                        } else{
                                            usersforroomcharges.find({userName,startNo,IDNo,isEnd:"false"},function (err6,doc6) {
                                                if (err6){
                                                    res.json({"errorCode": 500,"errorMessage": "查找房费表失败！"});
                                                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" updateUserInfo.js 查询usersforroomcharges数据集合失败" + err6)
                                                } else{
                                                    //console.log(doc6.length)
                                                    if (doc6.length > 0){
                                                        //console.log(timestampToTime(parseInt(doc6[0].startTime)))
                                                        var date = timestampToTime(parseInt(doc6[0].startTime));
                                                        var year = date.substring(0,4);
                                                        var month = date.substring(5,7);
                                                        var date1 = date.substring(8,10);
                                                        if (parseInt(year)< parseInt(d.getFullYear()) || (parseInt(year)== parseInt(d.getFullYear()) &&
                                                            parseInt(month)<parseInt(d.getMonth()+1))){
                                                            //一个月以上按月结算
                                                            dormrooms.find({isDelete: "false",_id:doc4[0].roomId}, function (error7,doc7) {
                                                                if (error7){
                                                                    res.json({"errorCode": 500,"errorMessage": "修改失败！"});
                                                                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" updateUserInfo.js 查询dormrooms数据集合失败" + error7)
                                                                } else{
                                                                    if (doc7.length > 0){
                                                                        roomcharges.find({maxNo:doc7[0].maxNo},function (err8,doc8) {
                                                                            if (err8){
                                                                                res.json({"errorCode": 500,"errorMessage": "修改失败！"});
                                                                                console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" updateUserInfo.js 查询roomcharges数据集合失败" + err8)
                                                                            } else{
                                                                                var charges = 0;
                                                                                //console.log(doc8)
                                                                                if (doc8.length >0) {
                                                                                    var narr = doc6[0].roomRechargesList;
                                                                                    var dNum = mGetDate(d.getFullYear(),d.getMonth()+1);//当月的天数
                                                                                    charges = parseInt(d.getDate())*parseInt(doc8[0].charges)/parseInt(dNum);
                                                                                    //console.log("dnum:"+dNum);
                                                                                    narr.push({
                                                                                        month:d.getFullYear()+"."+(d.getMonth()+1),
                                                                                        monthlyRecharges:charges
                                                                                    })
                                                                                    var roomrecharge = {
                                                                                        userName,
                                                                                        IDNo,
                                                                                        startTime:doc6[0].startTime,
                                                                                        monthFee:doc6[0].monthFee,
                                                                                        gender:doc6[0].gender,
                                                                                        startNo,
                                                                                        phoneNo:doc6[0].phoneNo,
                                                                                        belongToCompany:doc6[0].belongToCompany,
                                                                                        rank:doc6[0].rank,
                                                                                        endTime:endTime,
                                                                                        isEnd:"true",
                                                                                        roomId:doc4[0].roomId,
                                                                                        roomRechargesList:narr
                                                                                    }
                                                                                    //console.log(roomrecharge)
                                                                                    usersforroomcharges.findOneAndUpdate({userName,startNo,IDNo,isEnd:"false"},roomrecharge,function(err9,doc9){
                                                                                        if(err9){
                                                                                            res.json({"errorCode": 500,"errorMessage": "修改失败！"});
                                                                                            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" updateUserInfo.js 更新usersforroomcharges数据集合失败" + err9)
                                                                                        }else{
                                                                                            res.json({"errorCode": 200,"errorMessage": "修改成功！"});
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        } else{
                                                            //未满一个月按天结算
                                                            dormrooms.find({isDelete: "false",_id:doc4[0].roomId}, function (error7,doc7) {
                                                                if (error7){
                                                                    res.json({"errorCode": 500,"errorMessage": "修改失败！"});
                                                                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" updateUserInfo.js 查询dormrooms数据集合失败" + error7)
                                                                } else{
                                                                    if (doc7.length > 0){
                                                                        roomcharges.find({maxNo:doc7[0].maxNo},function (err8,doc8) {
                                                                            if (err8){
                                                                                res.json({"errorCode": 500,"errorMessage": "修改失败！"});
                                                                                console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" updateUserInfo.js 查询roomcharges数据集合失败" + err8)
                                                                            } else{
                                                                                var charges = 0;
                                                                                //console.log(doc8)
                                                                                if (doc8.length >0) {
                                                                                    var narr = doc6[0].roomRechargesList;
                                                                                    var dNum = mGetDate(d.getFullYear(),d.getMonth()+1);//当月的天数
                                                                                    charges = (parseInt(d.getDate())-parseInt(date1))*parseInt(doc8[0].charges)/parseInt(dNum);
                                                                                    //console.log("dnum:"+dNum);
                                                                                    narr.push({
                                                                                        month:d.getFullYear()+"."+(d.getMonth()+1),
                                                                                        monthlyRecharges:charges
                                                                                    })
                                                                                    var roomrecharge = {
                                                                                        userName,
                                                                                        IDNo,
                                                                                        startTime:doc6[0].startTime,
                                                                                        monthFee:doc6[0].monthFee,
                                                                                        gender:doc6[0].gender,
                                                                                        startNo,
                                                                                        phoneNo:doc6[0].phoneNo,
                                                                                        belongToCompany:doc6[0].belongToCompany,
                                                                                        rank:doc6[0].rank,
                                                                                        endTime:endTime,
                                                                                        isEnd:"true",
                                                                                        roomId:doc4[0].roomId,
                                                                                        roomRechargesList:narr
                                                                                    }
                                                                                    //console.log(roomrecharge)
                                                                                    usersforroomcharges.findOneAndUpdate({userName,startNo,IDNo,isEnd:"false"},roomrecharge,function(err9,doc9){
                                                                                        if(err9){
                                                                                            res.json({"errorCode": 500,"errorMessage": "修改失败！"});
                                                                                            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+" updateUserInfo.js 更新usersforroomcharges数据集合失败" + err9)
                                                                                        }else{
                                                                                            res.json({"errorCode": 200,"errorMessage": "修改成功！"});
                                                                                        }
                                                                                    })
                                                                                }
                                                                            }
                                                                        })
                                                                    }
                                                                }
                                                            })
                                                        }

                                                    }
                                                    //res.json({"errorCode": 200,"errorMessage": "修改成功！"});
                                                }
                                            })

                                        }
                                    })
                                }
                            })

                        }
                    })
                }
            })

        }
    })

});
module.exports = router;
