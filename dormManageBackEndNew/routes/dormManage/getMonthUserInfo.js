var express = require('express');
var router = express.Router();


router.post('/', function (req, res, next){
    var users = global.dbHelper.getModel('users');
    var dormrooms = global.dbHelper.getModel('dormrooms');
    var pageNo = req.body.pageNo;
    var keyword = req.body.keyword;
    var month = req.body.month;
    var d = new Date();
    var month1 = d.getMonth()+1

    dormrooms.find({"isDelete":"false"},function (err,doc) {
        if (err){
            res.json({"errorCode":"301","errorMessage":"查询数据库失败，请稍后再试！"})
        } else{
            if (month == "" || month == undefined || month == null){
                month = d.getFullYear() + "." + (d.getMonth()+1);
            } else{
                month = d.getFullYear()+"."+month;
            }
            if (keyword != "" && keyword !=undefined) {
                var reg = new RegExp(keyword, "i");
                var condition = {$and: [
                        {$or: [
                                {"userName": {$regex: reg}},
                                {"IDNo": {$regex: reg}},
                                {"startNo": {$regex: reg}},
                                {"endNo": {$regex: reg}},
                                {"gender": {$regex: reg}},
                                {"rank": {$regex: reg}},
                                {"phoneNo": {$regex: reg}},
                                {"belongToCompany": {$regex: reg}}
                            ]},{"usedNoList.month": month}
                    ]}

            }else{
                var condition = {"usedNoList.month": month}
            }
            users.find(condition, function (error1, doc1) {
                if (error1){
                    res.json({"errorCode":"302","errorMessage":"查询数据库失败，请稍后再试！"})
                } else{
                    var docc = [];
                    var index = 0;
                    for (var i = 0; i < doc1.length; i++) {
                        for (var j=0;j<doc.length;j++) {
                            if (doc1[i].roomId == doc[j]._id){
                                for (var k = 0 ;k<doc1[i].usedNoList.length;k++){
                                    if (doc1[i].usedNoList[k].month == month){
                                        index++;
                                        docc.push({
                                            userName:doc1[i].userName,IDNo:doc1[i].IDNo,startNo:doc1[i].startNo,
                                            startTime:doc1[i].startTime,endNo:doc1[i].endNo,endTime:doc1[i].endTime,
                                            roomNo:doc[j].roomNo,id:index,usedNo:doc1[i].usedNoList[k].useNo,
                                            gender:doc1[i].gender,belongToCompany:doc1[i].belongToCompany,rank:doc1[i].rank,
                                            phoneNo:doc1[i].phoneNo
                                        })
                                    }
                                }
                            }
                        }
                    }
                    if (docc.length - ((pageNo - 2) * 15) < 15) {
                        res.json({"errorCode": "302", "errMessage": "已经是最后一页了"});
                    } else {
                        res.json({"errorCode": "200", "errMessage": docc.slice((pageNo - 1) * 15, pageNo * 15)});
                    }

                }
            })
        }
    })


    


});
module.exports = router;
