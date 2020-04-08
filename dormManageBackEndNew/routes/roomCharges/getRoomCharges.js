var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next){
    var roomcharges = global.dbHelper.getModel('roomcharges');
    var d=new Date();
    roomcharges.find({}/*,{dormNo:1}*/,function (error,doc) {
        if (error){
            //console.log(error);
            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  getRoomcharges.js  查询数据库失败"+error)
            res.json({"errorCode":"404","errorMessage":"查询数据库失败"});
        } else if(doc) {
            //console.log(doc);
            res.json({"total":doc.length,"rows":doc});
        }
    })

});
module.exports = router;
