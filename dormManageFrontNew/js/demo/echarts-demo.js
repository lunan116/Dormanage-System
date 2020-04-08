$(function () {
    $.ajax({
                    url:"http://10.11.18.222:5002/getDataView",
                    method:"post",
                    beforeSend:function(){
                    $("#loading").fadeIn(200);
                    },
                    success:function(result){
                        $("#loading").fadeOut(200);
                        if (result.errorCode != "200") {
                            $('.contentbb').html('')
                            fail_prompt(result.errorMessage)
                        }else{
                            if (result.errorMessage.monthArr.length == 0) {
                                //console.log(46468854)
                                $('.contentbox').html('')
                            }else{
                                var lineChart = echarts.init(document.getElementById("echarts-line-chart"));
                            var lineoption = {
                                title : {
                                    text: '新增与退房人数趋势'
                                },
                                tooltip : {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data:['新增','退房']
                                },
                                grid:{
                                    x:40,
                                    x2:40,
                                    y2:24
                                },
                                calculable : true,
                                xAxis : [
                                    {
                                        type : 'category',
                                        boundaryGap : false,
                                        data : result.errorMessage.monthArr
                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value',
                                        axisLabel : {
                                            formatter: '{value} 人'
                                        }
                                    }
                                ],
                                series : [
                                    {
                                        name:'新增',
                                        type:'line',
                                        data:result.errorMessage.newPeopleNumArr,
                                        markPoint : {
                                            data : [
                                                {type : 'max', name: '最大值'},
                                                {type : 'min', name: '最小值'}
                                            ]
                                        },
                                        markLine : {
                                            data : [
                                                {type : 'average', name: '平均值'}
                                            ]
                                        }
                                    },
                                    {
                                        name:'退房',
                                        type:'line',
                                        data:result.errorMessage.checkOutPeopleNumArr,
                                        markPoint : {
                                            data : [
                                                {type : 'max', name: '最大值'},
                                                {type : 'min', name: '最小值'}
                                            ]
                                        },
                                        markLine : {
                                            data : [
                                                {type : 'average', name : '平均值'}
                                            ]
                                        }
                                    }
                                ]
                            };
                            lineChart.setOption(lineoption);
                            $(window).resize(lineChart.resize);

                            var barChart = echarts.init(document.getElementById("echarts-bar-chart"));
                            var baroption = {
                                title : {
                                    text: '各个房间用电量总和'
                                },
                                tooltip : {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data:['用电量（度）'/*,'降水量'*/]
                                },
                                grid:{
                                    x:30,
                                    x2:40,
                                    y2:24
                                },
                                calculable : true,
                                xAxis : [
                                    {
                                        type : 'category',
                                        data :result.errorMessage.monthArr /*['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']*/
                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value'
                                    }
                                ],
                                series : [
                                    {
                                        name:'用电量（度）',
                                        type:'bar',
                                        data:result.errorMessage.powerTotalArr/*[2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]*/,
                                        markPoint : {
                                            data : [
                                                {type : 'max', name: '最大值'},
                                                {type : 'min', name: '最小值'}
                                            ]
                                        },
                                        markLine : {
                                            data : [
                                                {type : 'average', name: '平均值'}
                                            ]
                                        }
                                    }/*,
                                    {
                                        name:'降水量',
                                        type:'bar',
                                        data:[2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
                                        markPoint : {
                                            data : [
                                                {name : '年最高', value : 182.2, xAxis: 7, yAxis: 183, symbolSize:18},
                                                {name : '年最低', value : 2.3, xAxis: 11, yAxis: 3}
                                            ]
                                        },
                                        markLine : {
                                            data : [
                                                {type : 'average', name : '平均值'}
                                            ]
                                        }
                                    }*/
                                ]
                            };
                            barChart.setOption(baroption);

                            window.onresize = barChart.resize;

                            
                            var lineChart = echarts.init(document.getElementById("echarts-line-chart1"));
                            var lineoption = {
                                title : {
                                    text: '每月入住率变化趋势'
                                },
                                tooltip : {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data:['入住率']
                                },
                                grid:{
                                    x:40,
                                    x2:40,
                                    y2:24
                                },
                                calculable : true,
                                xAxis : [
                                    {
                                        type : 'category',
                                        boundaryGap : false,
                                        data : result.errorMessage.monthArr
                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value',
                                        axisLabel : {
                                            formatter: '{value} %'
                                        }
                                    }
                                ],
                                series : [
                                    {
                                        name:'入住率',
                                        type:'line',
                                        data:result.errorMessage.occupancyRateArr,
                                        markPoint : {
                                            data : [
                                                {type : 'max', name: '最大值'},
                                                {type : 'min', name: '最小值'}
                                            ]
                                        },
                                        markLine : {
                                            data : [
                                                {type : 'average', name: '平均值'}
                                            ]
                                        }
                                    }
                                ]
                            };
                            lineChart.setOption(lineoption);
                            $(window).resize(lineChart.resize);

                            var lineChart = echarts.init(document.getElementById("echarts-line-chart2"));
                            var lineoption = {
                                title : {
                                    text: '每月入住总人数变化趋势'
                                },
                                tooltip : {
                                    trigger: 'axis'
                                },
                                legend: {
                                    data:['入住人数']
                                },
                                grid:{
                                    x:40,
                                    x2:40,
                                    y2:24
                                },
                                calculable : true,
                                xAxis : [
                                    {
                                        type : 'category',
                                        boundaryGap : false,
                                        data : result.errorMessage.monthArr
                                    }
                                ],
                                yAxis : [
                                    {
                                        type : 'value',
                                        axisLabel : {
                                            formatter: '{value} 人'
                                        }
                                    }
                                ],
                                series : [
                                    {
                                        name:'入住人数',
                                        type:'line',
                                        data:result.errorMessage.peopleNumbersArr,
                                        markPoint : {
                                            data : [
                                                {type : 'max', name: '最大值'},
                                                {type : 'min', name: '最小值'}
                                            ]
                                        },
                                        markLine : {
                                            data : [
                                                {type : 'average', name: '平均值'}
                                            ]
                                        }
                                    }
                                ]
                            };
                            lineChart.setOption(lineoption);
                            $(window).resize(lineChart.resize);

                            /*var pieChart = echarts.init(document.getElementById("echarts-pie-chart"));
                            var pieoption = {
                                title : {
                                    text: '某站点用户访问来源',
                                    subtext: '纯属虚构',
                                    x:'center'
                                },
                                tooltip : {
                                    trigger: 'item',
                                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                                },
                                legend: {
                                    orient : 'vertical',
                                    x : 'left',
                                    data:['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                                },
                                calculable : true,
                                series : [
                                    {
                                        name:'访问来源',
                                        type:'pie',
                                        radius : '55%',
                                        center: ['50%', '60%'],
                                        data:[
                                            {value:335, name:'直接访问'},
                                            {value:310, name:'邮件营销'},
                                            {value:234, name:'联盟广告'},
                                            {value:135, name:'视频广告'},
                                            {value:1548, name:'搜索引擎'}
                                        ]
                                    }
                                ]
                            };
                            pieChart.setOption(pieoption);
                            $(window).resize(pieChart.resize);*/
                            }
                            

                            

                            
                                                }
                                            }
                                        })
    

});






