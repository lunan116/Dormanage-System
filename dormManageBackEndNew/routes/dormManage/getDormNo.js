var express = require('express');
var router = express.Router();


router.get('/', function (req, res, next){
    var dormRooms = global.dbHelper.getModel('dormrooms');
    var d=new Date();
    dormRooms.find({isDelete:"false"}/*,{dormNo:1}*/,function (error,doc) {
        if (error){
            //console.log(error);
            console.log(d.toLocaleDateString()+"  "+d.toLocaleTimeString()+":  getDormNo.js  查询数据库失败"+error)
            res.json({"errorCode":"404","errorMessage":"查询数据库失败"});
        } else if(doc) {
            //console.log(doc);
            res.json({"total":doc.length,"rows":doc});
        }
    })

});
module.exports = router;
