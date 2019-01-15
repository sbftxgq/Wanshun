//入库按钮事件
function inLibOper() {
    if (inLibInputDataCheck()) {
        //取得用户输入数据
        var inBillNo = $("#inBillNo").val();//进货单号
        var inLibDate = $("#inLibDate").val();//进货日期
        var inTotalPrice = $("#inTotalPrice").val();//进货总价
        var inTransitFare = $("#inTransitFare").val();//运费
        var inLibWay = $("#inLibWay").val();//装卸方式：人工、叉车
        var inShipFare = $("#inShipFare").val();//装卸费
        //入库明细表格数据，参数1：进货单号，参数2：进货明细表格ID，参数3：出库标志，false标识入库
        var tableData = getTableData(inBillNo, "#infirstcolumn", false);
        var dataLen = tableData.length;
        tableData = JSON.stringify(tableData);
        //发送数据到服务器（Tomcat）
        $.ajax({
            url: "InlibController",    //请求的url地址
            timeout: 5000,
            dataType: "json",   //返回格式为json
            async: true,//请求是否异步，默认为异步，这也是ajax重要特性
            beforeSend: function () {
                //显示预加载进度条
                $.showPreloader('入库中...');
                //2秒钟后消失
                setTimeout(function () {
                    $.hidePreloader();
                }, 2000);
            },
            //请求参数值（发送的数据位于请求对象request中，这些值就是请求参数值，又叫发送的数据）
            data: {
                "inBillNo": inBillNo,
                "inLibDate": inLibDate,
                "inTotalPrice": inTotalPrice,
                "inTransitFare": inTransitFare,
                "inLibWay": inLibWay,
                "inShipFare": inShipFare,
                "tableData": tableData,
                "dataRows": dataLen
            },
            type: "POST",   //发送数据的请求方式（POST提交数据）
            success: function (data) {
                //请求成功时处理
                if ("true" == data.insertResult) {
                    //console.log(data.insertResult);
                    setTimeout(function () {
                        $.toast("入库成功！");
                    }, 2000);
                    //入库成功完成后，更新进货单号，入库失败则不更新
                    //2秒后刷新页面（clear），刷新后自动取得最新单号
                    setTimeout(function () {
                        //4秒后刷新页面（相当于按下键盘F5键）
                        window.location.reload(true);
                    }, 4000);
                } else {
                    $.toast("服务器返回异常，入库失败！");
                }
            },
            error: function () {
                $.alert("服务器未响应，入库失败！");
            }
        });
    }
}

//出库按钮事件
function outLibOper() {
    if (outLibInputDataCheck()) {
        //取得用户输入数据
        var billNo = $("#billNo").val();//送货单号
        var guestName = $("#guestName").val();//客户名称
        var destLocation = $("#destLocation").val();//销售地点
        var outLibDate = $("#outLibDate").val();//送货日期
        var outLibMan = $("#outLibMan").val();//送货人
        var outLibWay = $("#outLibWay").val();//送货方式：自送（默认）、他送、自提
        var transitFare = $("#transitFare").val();//运费，默认为0
        var shipFare = $("#shipFare").val();//装卸费，默认为0
        var totalPrice = $("#totalPrice").val();//理论销售总额
        var isPayed = "0"//是否已付，debug查看或console.log查看，始终为on，修改默认值为0
        if (IS_PAYED) {
            isPayed = "1";//1标识已付
        }
        var actualTotalPrice = $("#actualTotalPrice").val();//实付总额
        //出库明细表格数据，参数1：进货单号，参数2：进货明细表格ID，参数3：出库标志，true标识出库
        var tableData = getTableData(billNo, "#firstcolumn", true);
        var dataLen = tableData.length;
        tableData = JSON.stringify(tableData);
        //测试OK
        //console.log(isPayed+"运费："+transitFare+"装卸费："+shipFare+"实收总额："+actualTotalPrice);
        //console.log(tableData);
        //发送数据到服务器（Tomcat）
        $.ajax({
            url: "OutLibController",    //请求的url地址
            timeout: 5000,//请求时间
            dataType: "json",   //返回格式为json
            async: true,//请求是否异步，默认为异步，这也是ajax重要特性
            beforeSend: function () {
                //显示预加载进度条
                $.showPreloader('出库中...');
                //2秒钟后消失
                setTimeout(function () {
                    $.hidePreloader();
                }, 2000);
            },
            //请求参数值（发送的数据位于请求对象request中，这些值就是请求参数值，又叫发送的数据）
            data: {
                "billNo": billNo,
                "guestName": guestName,
                "destLocation": destLocation,
                "outLibDate": outLibDate,
                "outLibMan": outLibMan,
                "outLibWay": outLibWay,
                "transitFare": transitFare,
                "shipFare": shipFare,
                "totalPrice": totalPrice,
                "isPayed": isPayed,
                "actualTotalPrice": actualTotalPrice,
                "tableData": tableData,
                "dataRows": dataLen
            },
            type: "POST",   //发送数据的请求方式（POST提交数据）
            success: function (data) {
                //请求成功时处理
                if ("true" == data.insertResult) {
                    //console.log(data.insertResult);
                    setTimeout(function () {
                        $.toast("出库成功！");
                    }, 2000);
                    //入库成功完成后，更新进货单号，入库失败则不更新
                    //2秒后刷新页面（clear），刷新后自动取得最新单号
                    setTimeout(function () {
                        //4秒后刷新页面（相当于按下键盘F5键）
                        window.location.reload(true);
                    }, 4000);
                } else {
                    $.toast("服务器返回异常，出库失败！");
                }
            },
            error: function () {
                $.alert("服务器未响应，出库失败！");
            }
        });

    }
}

//查询结果表格项单击事件,发送Ajax请求，获取该单数据明细
function queryDetail(obj) {
    //打印出billNo的值,传递参数this代表当前行<tr>对象，此处为obj，接收实参this
    $.alert(obj.cells[0].innerText);
    //取得当前行订单号
    var billNo = obj.cells[0].innerText;
    //发送Ajax请求的配置
    var ajaxQryConfig = {
        url: "QryDetailController",    //请求的url地址
        timeout: 5000,//请求时间
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data:{"billNo":billNo},
        type: "POST",
        success: function (dataFromServer) {
            createInLibDetailsPopup(dataFromServer);
        },
        error: function () {
            $.alert("服务器未响应，查询明细失败！");
        }
    };
    //发送请求
    $.ajax(ajaxQryConfig);
}

function createInLibDetailsPopup(dataFromServer) {

    var popupHTML = '<div class="popup">'+
        '<div class="content">'+
        '<div class="content-block-title">订单详情</div>'+
        '<div class="list-block">'+
        '<ul>'+
        '<li class="item-content">'+
        '<div class="item-media"><i class="icon icon-f7"></i></div>'+
        '<div class="item-inner">'+
        '<div class="item-title">进货单号</div>'+
        '<div class="item-after">'+dataFromServer[0].billNo+'</div>'+
        '</div>'+
        '</li>'+
        '<li class="item-content">'+
        '<div class="item-media"><i class="icon icon-f7"></i></div>'+
        '<div class="item-inner">'+
        '<div class="item-title">进货日期</div>'+
        '<div class="item-after">'+dataFromServer[0].inLibDate+'</div>'+
        '</div>'+
        '</li>'+
        '<li class="item-content">'+
        '<div class="item-media"><i class="icon icon-f7"></i></div>'+
        '<div class="item-inner">'+
        '<div class="item-title">进货总额</div>'+
        '<div class="item-after">'+dataFromServer[0].totalPrice+'</div>'+
        '</div>'+
        '</li>'+
        '<li class="item-content">'+
        '<div class="item-media"><i class="icon icon-f7"></i></div>'+
        '<div class="item-inner">'+
        '<div class="item-title">运输费用</div>'+
        '<div class="item-after">'+dataFromServer[0].transitFare+'</div>'+
        '</div>'+
        '</li>'+
        '<li class="item-content">'+
        '<div class="item-media"><i class="icon icon-f7"></i></div>'+
        '<div class="item-inner">'+
        '<div class="item-title">装卸方式</div>'+
        '<div class="item-after">'+dataFromServer[0].inLibWay+'</div>'+
        '</div>'+
        '</li>'+
        '<li class="item-content">'+
        '<div class="item-media"><i class="icon icon-f7"></i></div>'+
        '<div class="item-inner">'+
        '<div class="item-title">装卸费用</div>'+
        '<div class="item-after">'+dataFromServer[0].shipFare+'</div>'+
        '</div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div class="content-block-title">商品详情</div>'+
        '<div class="list-block">'+
        '<ul>'+
        '<li>'+
        '<div class="item-content">'+
        '<div class="singleTable">'+
        '<table id="inQryDetailstbl">'+
        '<tbody id="inQryDetailsbody">'+
    //     '<!--后续行代码生成-->'+
    //     '<tr><th>商品规格</th><th>厂家</th><th>计量单位</th><th>数量</th><th>单价</th><th>金额</th></tr>'+
    // '<tr><td>****</td><td>****</td><td>***</td><td>****</td><td>***</td><td>****</td></tr>'+
        createTableDetails(dataFromServer)+
    '</tbody>'+
    '</table>'+
    '</div>'+
    '</div>'+
    '</li>'+
        '<li class="item-content">'+
        '<div class="item-media"><i class="icon icon-f7"></i></div>'+
        '<div class="item-inner">'+
        '<p><a href="#" class="close-popup">关闭</a></p>'+
        '</div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '</div>'+
        '</div>';

    createTableDetails(dataFromServer);

    $.popup(popupHTML);
}

function createTableDetails(data) {
    var tbl_row = "<tr><th>商品规格</th><th>厂家</th><th width='20%'>计量单位</th><th width='15%'>数量</th><th width='13%'>单价</th><th width='23%'>金额</th></tr>";
    var len = data.length;
    for (var i=0; i<len; i++){
        tbl_row+="<tr><td>"+data[i].specificationName+"</td><td>"+data[i].manufacturerName+"</td><td>"+
            measurementsMapping(data[i].measurements)+"</td><td>"+data[i].counts+"</td><td>"+data[i].unitPrice+"</td><td>"+data[i].price+"</td></tr>";
    }
    //$("#inQryDetailsbody").append(tbl_row);
    return tbl_row;
}

function measurementsMapping(measurements) {
    switch (measurements) {
        case "piece":
            return "片";
        case "bunch5":
            return "把(5根)";
        case "bunch4":
            return "把(4根)";
        case "meter":
            return "米";
        case "stere":
            return "立方米";
    }
}

//获取明细表中的数据，参数1：单号，参数2：明细表格ID，参数3：出/入库标志，false标识入库
function getTableData(billNo, tableIDStr, isOut) {
    //返回数组格式数据：[{"name":value,...,"key":value},{},...{}]
    //例如：[{},{},{}]，{}内为表格的一行数据，即记录，除了表头首行标题行外均为数据
    //表格所有行(除去前2行：标题行和首行)，后续行ID后面自增1，例如入库
    var dataRows = $(tableIDStr).find("tr").length - 2;
    //每次提交清空数据
    var dataArray = [];
    //如果是出库
    if (isOut) {
        //首行数据
        var outFirstRowData = {
            "billNo": billNo,//送货单号
            "specificationId": $("#speclst").val(),//规格
            "manufacturerId": $("#manuflst").val(),//厂家
            "measurements": $("#unit").val(),//计量单位
            "counts": $("#counts").val(),//数量
            "unitPrice": $("#unitprice").val(),//单价
            "price": $("#price").val() //进价;
        };
        dataArray.push(outFirstRowData);
        //后续每行数据
        var outRowData = null;
        for (var outRowIndex = 1; outRowIndex <= dataRows; outRowIndex++) {
            outRowData = {
                "billNo": billNo,//送货单号
                "specificationId": $("#speclst" + outRowIndex).val(),//规格
                "manufacturerId": $("#manuflst" + outRowIndex).val(),//厂家
                "measurements": $("#unit" + outRowIndex).val(),//计量单位
                "counts": $("#counts" + outRowIndex).val(),//数量
                "unitPrice": $("#unitprice" + outRowIndex).val(),//单价
                "price": $("#price" + outRowIndex).val() //进价;
            };
            dataArray.push(outRowData);
        }
    } else {
        //否则是入库，首行数据
        var inFirstRowData = {
            "billNo": billNo,//进货单号
            "specificationId": $("#inspeclst").val(),//规格
            "manufacturerId": $("#inmanuflst").val(),//厂家
            "measurements": $("#inunit").val(),//计量单位
            "counts": $("#incounts").val(),//数量
            "unitPrice": $("#inunitprice").val(),//单价
            "price": $("#inprice").val() //进价;
        };
        dataArray.push(inFirstRowData);
        //后续每行数据
        var inRowData = null;
        for (var inRowIndex = 1; inRowIndex <= dataRows; inRowIndex++) {
            inRowData = {
                "billNo": billNo,//进货单号
                "specificationId": $("#inspeclst" + inRowIndex).val(),//规格
                "manufacturerId": $("#inmanuflst" + inRowIndex).val(),//厂家
                "measurements": $("#inunit" + inRowIndex).val(),//计量单位
                "counts": $("#incounts" + inRowIndex).val(),//数量
                "unitPrice": $("#inunitprice" + inRowIndex).val(),//单价
                "price": $("#inprice" + inRowIndex).val() //进价;
            };
            dataArray.push(inRowData);
        }
    }
    return dataArray;
}

//入库数据输入正则验证
function inLibInputDataCheck() {
    //var isPassed = false;
    //表格所有行(除去前2行：标题行和首行)，后续行ID后面自增1
    var dataRows = $("#infirstcolumn").find("tr").length - 2;
    var counts = $("#incounts").val();
    var unitPrice = $("#inunitprice").val();
    var isCountsInputPassed = REGEXPR_DBDECIMAL_NUM.test(counts) || REGEXPR_INTEGER.test(counts);
    var isUnitPriceInputPassed = REGEXPR_DBDECIMAL_NUM.test(unitPrice) || REGEXPR_INTEGER.test(unitPrice);
    if (!isCountsInputPassed) {
        $.toast("数量必须输入且只能输入数字！");
        $("#incounts").focus();//获得焦点
        return false;
    }

    if (!isUnitPriceInputPassed) {
        $.toast("单价必须输入且只能输入数字！")
        $("#inunitprice").focus();//获得焦点
        return false;
    }

    for (var index = 1; index <= dataRows; index++) {
        counts = $("#incounts" + index).val();
        unitPrice = $("#inunitprice" + index).val();
        isCountsInputPassed = REGEXPR_DBDECIMAL_NUM.test(counts) || REGEXPR_INTEGER.test(counts);
        isUnitPriceInputPassed = REGEXPR_DBDECIMAL_NUM.test(unitPrice) || REGEXPR_INTEGER.test(unitPrice);
        if (!isCountsInputPassed) {
            $.toast("数量必须输入且只能输入数字！");
            $("#incounts" + index).focus();//获得焦点
            return false;
        }
        if (!isUnitPriceInputPassed) {
            $.toast("单价必须输入且只能输入数字！");
            $("#inunitprice" + index).focus();//获得焦点
            return false;
        }
    }

    //运费验证
    var inTransitFare = $("#inTransitFare").val();
    if (!REGEXPR_INTEGER.test(inTransitFare)) {
        $.toast("运费必须输入且只能输入数字！");
        $("#inTransitFare").focus();
        return false;
    }

    //装卸费验证
    var inShipFare = $("#inShipFare").val();
    if (!REGEXPR_INTEGER.test(inShipFare)) {
        $.toast("装卸费必须输入且只能输入数字！");
        $("#inShipFare").focus();
        return false;
    }
    return true;
}

//出库数据输入正则验证
function outLibInputDataCheck() {
    var guestName = $("#guestName").val();//客户名称
    var destLocation = $("#destLocation").val();//销售地点
    var outLibMan = $("#outLibMan").val();//送货人
    //表格所有行(除去前2行：标题行和首行)，后续行ID后面自增1
    var dataRows = $("#firstcolumn").find("tr").length - 2;
    var counts = $("#counts").val();
    var unitPrice = $("#unitprice").val();
    var isCountsInputPassed = REGEXPR_DBDECIMAL_NUM.test(counts) || REGEXPR_INTEGER.test(counts);
    var isUnitPriceInputPassed = REGEXPR_DBDECIMAL_NUM.test(unitPrice) || REGEXPR_INTEGER.test(unitPrice);
    //客户名称正则验证
    if ("" == guestName) {
        $.toast("客户名称必须输入！");
        $("#guestName").focus();//获得焦点
        return false;
    }
    //送货地点正则验证
    if ("" == destLocation) {
        $.toast("送货地点必须输入！");
        $("#destLocation").focus();//获得焦点
        return false;
    }
    //送货人验证
    if ("" == outLibMan) {
        $.toast("送货人必须输入！");
        $("#outLibMan").focus();//获得焦点
        return false;
    }
    //数据首行数量输入验证
    if (!isCountsInputPassed) {
        $.toast("数量必须输入且只能输入数字！");
        $("#counts").focus();//获得焦点
        return false;
    }
    //数据首行单价输入验证
    if (!isUnitPriceInputPassed) {
        $.toast("单价必须输入且只能输入数字！")
        $("#unitprice").focus();//获得焦点
        return false;
    }
    //表格数据其它行的数量和单价输入验证
    for (var index = 1; index <= dataRows; index++) {
        counts = $("#counts" + index).val();
        unitPrice = $("#unitprice" + index).val();
        isCountsInputPassed = REGEXPR_DBDECIMAL_NUM.test(counts) || REGEXPR_INTEGER.test(counts);
        isUnitPriceInputPassed = REGEXPR_DBDECIMAL_NUM.test(unitPrice) || REGEXPR_INTEGER.test(unitPrice);
        if (!isCountsInputPassed) {
            $.toast("数量必须输入且只能输入数字！");
            $("#counts" + index).focus();//获得焦点
            return false;
        }
        if (!isUnitPriceInputPassed) {
            $.toast("单价必须输入且只能输入数字！");
            $("#unitprice" + index).focus();//获得焦点
            return false;
        }
    }
    //这两项费用验证前提是“送货方式选择了‘他送’”
    if (IS_TASONG) {
        //运费验证
        var transitFare = $("#transitFare").val();
        if (!REGEXPR_INTEGER.test(transitFare)) {
            $.toast("运费必须输入且只能输入数字！");
            $("#transitFare").focus();
            return false;
        }
        //装卸费验证
        var shipFare = $("#shipFare").val();
        if (!REGEXPR_INTEGER.test(shipFare)) {
            $.toast("装卸费必须输入且只能输入数字！");
            $("#shipFare").focus();
            return false;
        }
    }
    //如果已付，则还需要对实付金额进行验证
    if (IS_PAYED) {
        //获取实收总额
        var actualTotalPrice = $("#actualTotalPrice").val();
        if (!(REGEXPR_DBDECIMAL_NUM.test(actualTotalPrice) || REGEXPR_INTEGER.test(actualTotalPrice))) {
            $.toast("实付总额必须输入且只能输入数字！");
            $("#actualTotalPrice").focus();
            return false;
        }
    }
    //所有数据输入验证通过，返回true
    return true;
}

//起始结束日期顺序验证
function dateSequenceCheck() {
    //日期字符串中的“-”替换成“/”目的是为了兼容IE11
    var startDate = $("#inQryLibDateStrt").val();
    var endDate = $("#inQryLibDateEnd").val();
    //$.alert(startDate+"--"+endDate);
    startDate = startDate.replace("-", "/").replace("-", "/");
    endDate = endDate.replace("-", "/").replace("-", "/");
    //$.alert(startDate+"--"+endDate);
    if (Date.parse(startDate) > Date.parse(endDate)) {
        $.toast("起始日期不能在结束日期后面！");
        $("#inQryLibDateStrt").focus();
        return false;
    }
    //日期顺序校验通过
    return true;
}


//页面初始化执行，在main.html最后执行了一句$.init()，下面的滚动代码才生效！
//即以下自定义的代码必须都放在$.init()前面执行滚动才有效，监听滚动的容器是page
$.toast("pageInit");//页面加载一次（刷新一次），就执行一次