//入库按钮事件
function inLibOper() {
    if (inLibInputDataCheck()){
        //取得用户输入数据
        var inBillNo = $("#inBillNo").val();//进货单号
        var inLibDate = $("#inLibDate").val();//进货日期
        var inTotalPrice = $("#inTotalPrice").val();//进货总价
        var inTransitFare = $("#inTransitFare").val();//运费
        var inLibWay = $("#inLibWay").val();//装卸方式
        var inShipFare = $("#inShipFare").val();//装卸费
        //var dataLen = $("#infirstcolumn").find("tr").length;//长度包含了标题行，索引为0
        //明细表格数据
        var tableData = getTableData(inBillNo);
        var dataLen = tableData.length;
        tableData = JSON.stringify(tableData);
        //显示预加载进度条
        $.showPreloader('入库中...');
        //2秒中消失
        setTimeout(function () {
            $.hidePreloader();
        }, 2000);

        $.ajax({
            url: "InlibController",    //请求的url地址
            dataType: "json",   //返回格式为json
            async: true,//请求是否异步，默认为异步，这也是ajax重要特性
            //请求参数值
            data:{
                "inBillNo":inBillNo,
                "inLibDate":inLibDate,
                "inTotalPrice":inTotalPrice,
                "inTransitFare":inTransitFare,
                "inLibWay":inLibWay,
                "inShipFare":inShipFare,
                "tableData":tableData,
                "dataRows":dataLen
            },
            type: "POST",   //请求方式
            success: function (data) {
                //请求成功时处理
                if("true"==data.insertResult){
                    //console.log(data.insertResult);
                    setTimeout(function () {
                        $.toast("入库成功！");
                    }, 2000);
                    //入库成功完成后，更新进货单号，入库失败则不更新
                    //2秒后刷新页面（clear），刷新后自动取得最新单号
                    setTimeout(function () {
                        window.location.reload(true);
                    }, 4000);
                }else{
                    $.toast("入库失败！");
                }
            }
        });
    }
}

//获取明细表中的数据
function getTableData(billNo) {
    //返回数组格式数据：[{"name":value,...,"key":value},{},...{}]
    //例如：[{},{},{}]，{}内为表格的一行数据，即记录，除了表头首行标题行外均为数据
    //表格所有行(除去前2行：标题行和首行)，后续行ID后面自增1
    var dataRows = $("#infirstcolumn").find("tr").length-2;
    //每次提交清空数据
    var dataArray = [];
    var firstRowData = {
        "billNo":billNo,//进货单号
        "specificationId":$("#inspeclst").val(),//规格
        "manufacturerId":$("#inmanuflst").val(),//厂家
        "measurements":$("#inunit").val(),//计量单位
        "counts":$("#incounts").val(),//数量
        "unitPrice":$("#inunitprice").val(),//单价
        "price":$("#inprice").val() //进价;
    };
    dataArray.push(firstRowData);
    //后续每行数据
    var rowData = null;
    for (var rowIndex=1;rowIndex<=dataRows; rowIndex++){
        rowData = {
            "billNo":billNo,//进货单号
            "specificationId":$("#inspeclst"+rowIndex).val(),//规格
            "manufacturerId":$("#inmanuflst"+rowIndex).val(),//厂家
            "measurements":$("#inunit"+rowIndex).val(),//计量单位
            "counts":$("#incounts"+rowIndex).val(),//数量
            "unitPrice":$("#inunitprice"+rowIndex).val(),//单价
            "price":$("#inprice"+rowIndex).val() //进价;
        };
        dataArray.push(rowData);
    }
    return dataArray;
}


