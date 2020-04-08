var express = require('express');
var router = express.Router();


router.post('/', function (req, res, next){
    var d=new Date()
    var roomNo = req.body.roomNo;
    var useNo = req.body.useNo;
    var roomId = req.body.roomID;
    var dynamicdormrooms = global.dbHelper.getModel('dynamicdormrooms');
    var historicalpowerconsumptions = global.dbHelper.getModel('historicalpowerconsumptions');
    var databackups = global.dbHelper.getModel('databackups');
    var users = global.dbHelper.getModel('users');
    dynamicdormrooms.find({roomId},function (err,doc) {
        //console.log(doc)
        if (err || doc.length == 0){
            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  monthlySettlement.js  查询dynamicdormrooms数据集合失败"+err)
            res.json({"errorCode":"404","errorMessage":"未找到该房间号！"})
        } else{
            if (doc[0].newNo > useNo){
                res.json({"errorCode":"405","errorMessage":"登记失败，请检查该房间的电表读数，读数不能小于前一次的登记值！"})
            }else{
                var peopleNo = 0 ;
                var indexMsg = 0;
                var docc = {
                    _id:doc[0]._id,
                    roomId,
                    newNo:useNo,
                    isDelete:"false",
                    isComputed:"true",
                    userInfoList:[]
                }
                var docc1 = {
                    roomId,
                    newNo:useNo,
                    isDelete:"false",
                    isComputed:"true",
                    userInfoList:[]
                }
                for (var i =0;i<doc[0].userInfoList.length;i++){
                    if (doc[0].userInfoList[i].isEnd == "false"){
                        peopleNo++
                    }
                }
                var avgNo = (useNo - doc[0].newNo)/peopleNo;
                var userArr = []
                for (var i =0;i<doc[0].userInfoList.length;i++){
                    if (doc[0].userInfoList[i].isEnd == "false"){
                            userArr.push({userName:doc[0].userInfoList[i].userName,IDNo:doc[0].userInfoList[i].IDNo,startTime:doc[0].userInfoList[i].startTime,
                                usedNo:(Number(doc[0].userInfoList[i].usedNo) + avgNo).toString()})
                            docc1.userInfoList.push({
                                userName:doc[0].userInfoList[i].userName,
                                IDNo:doc[0].userInfoList[i].IDNo,
                                startTime:doc[0].userInfoList[i].startTime,
                                usedNo:(Number(doc[0].userInfoList[i].usedNo) + avgNo).toString(),
                                isEnd:doc[0].userInfoList[i].isEnd,
                                endTime:"",
                            })
                            docc.userInfoList.push({
                                userName:doc[0].userInfoList[i].userName,
                                IDNo:doc[0].userInfoList[i].IDNo,
                                startTime:doc[0].userInfoList[i].startTime,
                                usedNo:"0",
                                isEnd:doc[0].userInfoList[i].isEnd,
                                endTime:doc[0].userInfoList[i].endTime,
                            })


                    }else{
                        docc1.userInfoList.push(doc[0].userInfoList[i])
                    }
                }
                //console.log("oiwtgowergjeoih"+userArr.length)
                function f(num){
                    if(num<1){
                        return 1;
                    }else{
                        users.update({userName:userArr[num-1].userName,IDNo:userArr[num-1].IDNo,startTime:userArr[num-1].startTime,roomId},
                            {$push:{usedNoList:{"month":d.getFullYear()+"."+(d.getMonth()),"useNo":userArr[0].usedNo}}},function (errr,doccc) {
                                if (errr){
                                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  monthlySettlement.js  更新users数据集合失败"+errr)
                                    //console.log(errr)
                                } else{
                                    //console.log(doccc)
                                }
                            });
                        return f(num-1);
                    }
                }
                f(userArr.length)
                dynamicdormrooms.findOneAndUpdate({roomId},docc,function (error1,doc1) {
                    if (error1) {
                        console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  monthlySettlement.js  更新dynamicdormrooms数据集合失败"+error1)
                        res.json({"errorCode": 407,"errorMessage": "修改动态表失败！"});
                        //console.log(error);
                    }else{
                        historicalpowerconsumptions.find({roomId},function (error2,doc2) {
                            if (error2 || doc2.length == 0){
                                res.json({"errorCode": 407,"errorMessage": "修改历史记录表失败！"});
                            } else{
                                var doc3 = {
                                    _id:doc2[0]._id,
                                    roomId:doc2[0].roomId,
                                    isDelete:doc2[0].isDelete,
                                    powerNoList:doc2[0].powerNoList
                                }
                                doc3.powerNoList.push({
                                    "month": d.getFullYear()+"."+(d.getMonth()),
                                    "useNo":useNo
                                })
                                var data1 = {
                                    month:d.getFullYear()+"."+(d.getMonth()),
                                    roomInfo:[]
                                }
                                data1.roomInfo.push(docc1)
                                databackups.find({month:d.getFullYear()+"."+(d.getMonth())},function (err6,doc6) {
                                    if (err6){
                                        console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  monthlySettlement.js  查询databackups数据集合失败"+err6)
                                        //console.log(err6)
                                    } else if (doc6.length == 0){
                                        //console.log("shujuweikong")
                                        databackups.create(data1)
                                    } else{
                                        databackups.findOneAndUpdate({month:d.getFullYear()+"."+(d.getMonth())},{$push:{roomInfo:docc1}},function (errr,doccc) {
                                            if (errr){
                                                console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  monthlySettlement.js  更新databackups数据集合失败"+errr)
                                                //console.log(errr)
                                            } else{
                                                //console.log(doccc)
                                            }
                                        })
                                        //console.log("oiwregjeorihjreoohj"+doc6)
                                    }
                                })
                                //console.log(doc3)
                                historicalpowerconsumptions.findOneAndUpdate({roomId},doc3,function (error4,doc4) {
                                    if (error4){
                                        console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  monthlySettlement.js  更新historicalpowerconsumptions数据集合失败"+error4)
                                        //console.log(error4)
                                        res.json({"errorCode": 408,"errorMessage": "修改历史记录表失败！"});
                                    } else{
                                        res.json({"errorCode": 200,"errorMessage": "录入成功！"});
                                    }
                                })
                            }
                        })
                    }
                })


            }
        }
    })



});
module.exports = router;
