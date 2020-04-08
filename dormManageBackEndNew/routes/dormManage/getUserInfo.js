var express = require('express');
var router = express.Router();


router.post('/', function (req, res, next){
    var users = global.dbHelper.getModel('users');
    var dormrooms = global.dbHelper.getModel('dormrooms');
    var pageNo = req.body.pageNo;
    var keyword = req.body.keyword;
    var userStatus = req.body.userStatus;
    var d = new Date();
    dormrooms.find({"isDelete":"false"},function (error0,doc0) {
        if(error0){
            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+"  getUserInfo.js 查询dormrooms数据集合失败！"+error0)
            res.json({"errCode":"404","errorMessage":"查询房间表失败！"})
        }else {
            var arr = [];
            for (var d =0;d<doc0.length;d++){
                if (doc0[d].roomNo.indexOf(keyword)!= -1) {
                    arr.push(doc0[d]._id)
                }

            }
            //console.log(arr)
            if (keyword != "" && keyword !=undefined) {
                var reg = new RegExp(keyword, "i");
                var condition = {$or: [
                        {$or: [
                                {"userName": {$regex: reg}},
                                {"IDNo": {$regex: reg}},
                                {"startNo": {$regex: reg}},
                                {"gender": {$regex: reg}},
                                {"phoneNo": {$regex: reg}},
                                {"rank": {$regex: reg}},
                                {"belongToCompany": {$regex: reg}},
                                {"endNo": {$regex: reg}}
                            ]},{"roomId": {$in: arr}}
                    ]}

            }else{
                var condition = {}
            }
            //console.log(condition)
            users.find(condition, function (error, doc) {
                if (error) {
                    console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+"  getUserInfo.js 查询users数据集合失败！"+error)
                    res.json({"errorMessage": "查询失败！", "errorCode": "401"});
                } else if (doc) {
                    //console.log(doc+"123");
                    if (doc.length == 0) {
                        res.json({"errorCode": "303", "errMessage": "查询失败，未找到该关键字相关信息！"});
                    } else {
                        var doc1 = [];
                        var index = 0;
                        for (var i = 0; i < doc.length; i++) {
                            for (var j=0;j<doc0.length;j++){

                                if (keyword != "" && keyword !=undefined) {
                                    //console.log(doc[i].roomId + "   "+doc0[j]._id)
                                    if (doc[i].roomId == doc0[j]._id /*&& doc0[j].roomNo.indexOf(keyword)!= -1*/){
                                        index++;
                                        var total = 0
                                        if (doc[i].usedNoList.length > 0) {
                                            for (var k = 0 ;k<doc[i].usedNoList.length;k++){
                                                total += Number(doc[i].usedNoList[k].useNo)
                                            }
                                        }else{
                                            total = 0;
                                        }
                                        //console.log(741258)
                                        doc1.push({userName:doc[i].userName,IDNo:doc[i].IDNo,_id:doc[i]._id,startNo:doc[i].startNo,
                                            startTime:doc[i].startTime,endNo:doc[i].endNo,endTime:doc[i].endTime,
                                            roomNo:doc0[j].roomNo,id:index,usedNoList:total,gender:doc[i].gender,
                                            belongToCompany:doc[i].belongToCompany,rank:doc[i].rank,
                                            phoneNo:doc[i].phoneNo})
                                    }
                                }else{
                                    //console.log(i + "  " + j)
                                    if (doc[i].roomId == doc0[j]._id){

                                        index++;
                                        var total = 0
                                        //console.log(doc[i].usedNoList.length)
                                        if (doc[i].usedNoList.length > 0) {
                                            //console.log(11158)
                                            for (var k = 0 ;k<doc[i].usedNoList.length;k++){
                                                total += Number(doc[i].usedNoList[k].useNo)
                                            }
                                        }else{
                                            //console.log(11178)
                                             total = 0;
                                        }
                                        doc1.push({userName:doc[i].userName,IDNo:doc[i].IDNo,_id:doc[i]._id,startNo:doc[i].startNo,
                                            startTime:doc[i].startTime,endNo:doc[i].endNo,endTime:doc[i].endTime,
                                            roomNo:doc0[j].roomNo,id:index,usedNoList:total,gender:doc[i].gender,
                                            belongToCompany:doc[i].belongToCompany,rank:doc[i].rank,
                                            phoneNo:doc[i].phoneNo})
                                    }
                                }

                            }
                        }
                        //console.log(doc.length +"456")
                        var doc2 = [];
                        if (userStatus == 0) {
                            var index = 0;
                            for (var q = 0;q<doc1.length;q++){
                                if (doc1[q].endTime == "") {
                                    doc1[q].id = ++index;
                                    doc2.push(doc1[q])
                                }
                            } 
                        }else{
                            var index = 0;
                            for (var q = 0;q<doc1.length;q++){
                                if (doc1[q].endTime != "") {
                                    index++;
                                    doc1[q].id = index;
                                    doc2.push(doc1[q])
                                }
                            }
                        }
                        if (doc2.length - ((pageNo - 2) * 15) < 15) {
                            res.json({"errorCode": "302", "errMessage": "已经是最后一页了"});
                        } else {
                            res.json({"errorCode": "200", "errMessage": doc2.slice((pageNo - 1) * 15, pageNo * 15)});
                        }

                    }

                }
            })
        }
    })


});
module.exports = router;
