var express = require('express');
var router = express.Router();


router.post('/', function (req, res, next){
    var dormrooms = global.dbHelper.getModel('dormrooms');
    var historicalpowerconsumptions = global.dbHelper.getModel('historicalpowerconsumptions');
    var pageNo = req.body.pageNo;
    var keyword = req.body.keyword;
    var dd = new Date();
    var year = dd.getFullYear();
    var mon = dd.getMonth()+1;
    var date = dd.getDate();
    if (Number(mon) <= Number(keyword)) {
        res.json({"errorCode":"406","errorMessage":"当前为"+mon+"月份，无法获取"+keyword+"月份的用电量"})
    }else if(Number(mon) == Number(keyword)+1 && date>0 &&date<8){
        var month = dd.getFullYear()+"."+keyword;
        //console.log("month:"+month);
        dormrooms.find({"isDelete":"false"},function (error0,doc0) {
            if(error0){
                console.log(dd.toLocaleDateString()+"  "+dd.toLocaleTimeString()+"  getMonthsPowerUserNo.js 查询dormrooms数据集合失败！"+error0)
                res.json({"errorCode":"404","errorMessage":"查询房间表失败！"})
            }else {
                historicalpowerconsumptions.find({"isDelete":"false"}, function (error, doc) {
                    if (error) {
                        console.log(dd.toLocaleDateString()+"  "+dd.toLocaleTimeString()+"  getMonthsPowerUserNo.js 查询historicalpowerconsumptions数据集合失败！"+error)
                        res.json({"errorMessage": "查询失败！", "errorCode": "401"});
                    } else if (doc) {
                        if (doc.length == 0) {
                            res.json({"errorCode": "303", "errMessage": "查询失败，未找到该关键字相关信息！"});
                        } else {
                            //console.log(doc)
                            var doc1 = [];
                            var index = 0;
                            for (var i = 0; i < doc.length; i++) {
                                for (var j=0;j<doc0.length;j++){
                                    //console.log(doc[i].roomId + "   "+doc0[j]._id)
                                    if (doc[i].roomId == doc0[j]._id /*&& doc0[j].roomNo.indexOf(keyword)!= -1*/){
                                        index++;
                                        //console.log(index)
                                        if (doc[i].powerNoList.length > 0){
                                            var monthFlag = false;
                                            for (var k = 0;k<doc[i].powerNoList.length;k++){
                                                if (doc[i].powerNoList[k].month == month) {
                                                    monthFlag = true;
                                                    doc1.push({_id:doc0[j]._id,id:index,roomNo:doc0[j].roomNo,useNo:doc[i].powerNoList[k].useNo});
                                                }
                                            }
                                            if(monthFlag == false){
                                                doc1.push({_id:doc0[j]._id,id:index,roomNo:doc0[j].roomNo,useNo:"----"});
                                            }
                                        }else{
                                            //console.log(index)
                                            doc1.push({_id:doc0[j]._id,id:index,roomNo:doc0[j].roomNo,useNo:"----"});
                                        }


                                    }

                                }
                            }
                            //console.log(doc1)
                            if (doc1.length - ((pageNo - 2) * 15) < 15) {
                                res.json({"errorCode": "302", "errMessage": "已经是最后一页了"});
                            } else {
                                res.json({"errorCode": "200", "errMessage": doc1.slice((pageNo - 1) * 15, pageNo * 15)});
                            }

                        }

                    }
                })
            }
        })
    }else{
        var month = dd.getFullYear()+"."+keyword;
        //console.log("month:"+month);
        dormrooms.find({"isDelete":"false"},function (error0,doc0) {
            if(error0){
                //console.log("getUserInfo.js 查询房间表失败！")
                console.log(dd.toLocaleDateString()+"  "+dd.toLocaleTimeString()+"  getMonthsPowerUserNo.js 查询dormrooms数据集合失败！"+error0)
                res.json({"errorCode":"404","errorMessage":"查询房间表失败！"})
            }else {
                historicalpowerconsumptions.find({"powerNoList.month":month,"isDelete":"false"}, function (error, doc) {
                    if (error) {
                        console.log(dd.toLocaleDateString()+"  "+dd.toLocaleTimeString()+"  getMonthsPowerUserNo.js 查询historicalpowerconsumptions数据集合失败！"+error)
                        res.json({"errorMessage": "查询失败！", "errorCode": "401"});
                    } else if (doc) {
                        if (doc.length == 0) {
                            res.json({"errorCode": "303", "errMessage": "查询失败，未找到该关键字相关信息！"});
                        } else {
                            //console.log(doc)
                            var doc1 = [];
                            var index = 0;
                            for (var i = 0; i < doc.length; i++) {
                                for (var j=0;j<doc0.length;j++){
                                    //console.log(doc[i].roomId + "   "+doc0[j]._id)
                                    if (doc[i].roomId == doc0[j]._id /*&& doc0[j].roomNo.indexOf(keyword)!= -1*/){
                                        index++;
                                        for (var k = 0;k<doc[i].powerNoList.length;k++){
                                            if (doc[i].powerNoList[k].month == month) {
                                                doc1.push({_id:doc0[j]._id,id:index,roomNo:doc0[j].roomNo,useNo:doc[i].powerNoList[k].useNo});
                                            }
                                        }

                                    }

                                }
                            }
                            //console.log(doc1)
                            if (doc1.length - ((pageNo - 2) * 15) < 15) {
                                res.json({"errorCode": "302", "errMessage": "已经是最后一页了"});
                            } else {
                                res.json({"errorCode": "200", "errMessage": doc1.slice((pageNo - 1) * 15, pageNo * 15)});
                            }

                        }

                    }
                })
            }
        })
    }



});
module.exports = router;
