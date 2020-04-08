module.exports = {
    administrators: {
        name: {type: String, required: true},
        password: {type: String, required: true}
    },
    dormrooms:{
        roomNo : {type: String, required: true},
        maxNo : {type: String, required: true},
        addTime : {type: String, required: true},
        isDelete : {type: String, required: true}
    },
    dynamicdormrooms:{
        roomId : {type: String, required: true},
        newNo : {type: String, required: true},
        isDelete:{type: String, required: true},
        isComputed:{type: String, required: true},
        userInfoList : [
        {
            userName : {type: String, required: true},
            IDNo : {type: String, required: true},
            startTime : {type: String, required: true},
            usedNo : {type: String, required: true},
            isEnd : {type: String, required: true},
            endTime : {type: String, required: true}
        }
        ]
    },
    users:{
        userName : {type: String, required: true},
        gender:{type: String, required: true},
        phoneNo:{type: String, required: false},
        belongToCompany:{type: String, required: false},
        rank:{type: String, required: false},
        IDNo : {type: String, required: true},
        startNo : {type: String, required: true},
        startTime : {type: String, required: true},
        endNo : {type: String, required: false},
        endTime : {type: String, required: false},
        isEnd : {type: String, required: false},
        roomId : {type: String, required: true},
        usedNoList:[
            {month: {type: String, required: true},
            useNo:{type: String, required: true}
            }
        ]
    },
    databackups:{
        month:{type: String, required: true},
        roomInfo:[
            {
                roomId: {type: String, required: true},
                newNo: {type: String, required: true},
                isDelete: {type: String, required: true},
                isComputed: {type: String, required: true},
                userInfoList: [
                    {
                        userName: {type: String, required: true},
                        IDNo: {type: String, required: true},
                        startTime: {type: String, required: true},
                        usedNo: {type: String, required: true},
                        isEnd: {type: String, required: true},
                        endTime: {type: String, required: false}
                    }
                ]
            }
            ]
    },
    historicalpowerconsumptions:{
        roomId : {type: String, required: true},
        isDelete:{type: String, required: true},
        powerNoList:[
            {month: {type: String, required: true},
            useNo:{type: String, required: true}
            }
        ]
    },
    dataviews:{
        month: {type: String, required: true},
        peopleNumbers:{type: String, required: true},
        roomNumbers:{type: String, required: true},
        powerTotal:{type: String, required: true},
        newPeopleNum:{type: String, required: true},
        checkOutPeopleNum:{type: String, required: true},
        occupancyRate:{type: String, required: true}
    },
    roomcharges:{
        maxNo:{type: String, required: true},
        charges:{type: String, required: true}
    },
    usersforroomcharges:{
        userName:{type: String, required: false},
        IDNo:{type: String, required: false},
        startTime:{type: String, required: false},
        monthFee:{type: String, required: false},//recharges at this month
        gender:{type: String, required: false},
        startNo : {type: String, required: false},
        phoneNo:{type: String, required: false},
        belongToCompany:{type: String, required: false},
        rank:{type: String, required: false},
        endTime:{type: String, required: false},
        isEnd:{type: String, required: false},
        roomId: {type: String, required: true},
        roomRechargesList:[
            {
                month: {type: String, required: true},
                monthlyRecharges:{type: String, required: true}
            }
        ]
    }


};
