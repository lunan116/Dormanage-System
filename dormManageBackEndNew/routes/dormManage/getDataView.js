var express = require('express');
var router = express.Router();


router.post('/', function (req, res, next){
    var dataviews = global.dbHelper.getModel('dataviews');
    var d = new Date();
    var y = d.getFullYear();
    var reg = new RegExp(y, "i");
    var condition = {"month": {$regex: reg}}
    dataviews.find(condition,function (err,doc) {
        if (err){
            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  getDataView.js  查询数据库失败"+err)
            res.json({"errorCode":"404","errorMessage":"查询数据库失败！"})
        }else{
            if (doc.length == 0){
                res.json({"errorCode":"304","errorMessage":"暂无数据，本年度还未进行相关统计！"})
            } else{
                var monthArr = [],
                    peopleNumbersArr = [],
                    occupancyRateArr = [],
                    powerTotalArr = [],
                    newPeopleNumArr = [],
                    checkOutPeopleNumArr = [];
                for (var i=0;i<doc.length;i++){
                    var str = doc[i].month; //要截取的字符串
                    var index = str.indexOf(".");
                    var result = str.substr(index + 1,str.length)+"月";
                    monthArr.push(result);
                    peopleNumbersArr.push(doc[i].peopleNumbers);
                    occupancyRateArr.push(Number(doc[i].occupancyRate)*100);
                    powerTotalArr.push(Number(doc[i].powerTotal));
                    newPeopleNumArr.push(Number(doc[i].newPeopleNum));
                    checkOutPeopleNumArr.push(Number(doc[i].checkOutPeopleNum));
                }
                var data = {
                    monthArr,
                    peopleNumbersArr,
                    occupancyRateArr,
                    powerTotalArr,
                    newPeopleNumArr,
                    checkOutPeopleNumArr
                }
                res.json({"errorCode":"200","errorMessage":data})
            }

        }
    })



});
module.exports = router;
