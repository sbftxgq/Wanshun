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
    //$.alert(obj.cells[0].innerText);
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

//查询出库单明细（表格单击事件），发送Ajax请求，获取该出库单数据明细
//obj代表当前行的DOM对象，调用时传递的this就是obj
function queryOutDetail(obj) {
    //打印出billNo的值,传递参数this代表当前行<tr>对象，此处为obj，接收实参this
    //$.alert(obj.cells[0].innerText);
    var billNo = obj.cells[0].innerText;
    //发送Ajax请求的配置
    var ajaxQryConfig = {
        url: "QryOutDetailController",    //请求的url地址
        timeout: 5000,//请求时间
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data:{"billNo":billNo},
        type: "POST",
        success: function (dataFromServer) {
            createOutLibDetailsPopup(dataFromServer);
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
        '<div class="item-after">'+dataFromServer[0].totalPrice+'&nbsp;元</div>'+
        '</div>'+
        '</li>'+
        '<li class="item-content">'+
        '<div class="item-media"><i class="icon icon-f7"></i></div>'+
        '<div class="item-inner">'+
        '<div class="item-title">运输费用</div>'+
        '<div class="item-after">'+dataFromServer[0].transitFare+'&nbsp;元</div>'+
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
        '<div class="item-after">'+dataFromServer[0].shipFare+'&nbsp;元</div>'+
        '</div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '<div class="content-block-title">商品详情（货币单位：元）</div>'+
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
        '<p><a href="#" class="close-popup button button-fill">关闭</a></p>'+
        '</div>'+
        '</li>'+
        '</ul>'+
        '</div>'+
        '</div>'+
        '</div>';
    //createTableDetails(dataFromServer);
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

function createOutLibDetailsPopup(dataFromServer) {
    var popupHTML = '<div class="popup popup-detail">' +
        '    <div class="content">' +
        '<div class="content-block-title">订单详情</div>' +
        '  <div class="list-block">' +
        '    <ul>' +
        '      <li class="item-content">' +
        '        <div class="item-media"><i class="icon icon-f7"></i></div>' +
        '        <div class="item-inner">' +
        '          <div class="item-title">送货单号</div>' +
        '          <div class="item-after">'+dataFromServer[0].billNo+'</div>' +
        '        </div>' +
        '      </li>' +
        '      <li class="item-content">' +
        '        <div class="item-media"><i class="icon icon-f7"></i></div>' +
        '        <div class="item-inner">' +
        '          <div class="item-title">送货日期</div>' +
        '          <div class="item-after">'+dataFromServer[0].outLibDate+'</div>' +
        '        </div>' +
        '      </li>' +
        '      <li class="item-content">' +
        '        <div class="item-media"><i class="icon icon-f7"></i></div>' +
        '        <div class="item-inner">' +
        '          <div class="item-title">客户名称</div>' +
        '          <div class="item-after">'+dataFromServer[0].guestName+'</div>' +
        '        </div>' +
        '      </li>' +
        '      <li class="item-content">' +
        '        <div class="item-media"><i class="icon icon-f7"></i></div>' +
        '        <div class="item-inner">' +
        '          <div class="item-title">销售地点</div>' +
        '          <div class="item-after">'+dataFromServer[0].destLocation+'</div>' +
        '        </div>' +
        '      </li>' +
        '      <li class="item-content">' +
        '        <div class="item-media"><i class="icon icon-f7"></i></div>' +
        '        <div class="item-inner">' +
        '          <div class="item-title">销售总额</div>' +
        '          <div class="item-after">'+dataFromServer[0].totalPrice+'&nbsp;元</div>' +
        '        </div>' +
        '      </li>' +
        setLiItemBackgroundColor(dataFromServer[0].billStatus)+
        // '      <li style="background-color: lightpink">' +
        '         <div class="item-content">' +
        '             <div class="item-media"></div>' +
        '             <div class="item-inner">' +
        '                 <div class="item-title label">订单状态</div>' +
        '                 <div class="item-input">' +
        '                     &nbsp;未付' +
        '                     <label class="label-switch">' +
                                      showCheckBoxIsPayedDetail(dataFromServer[0].billStatus)+
        // '                         <input id="edtIsPayed" name="edtIsPayed" type="checkbox">' +
        '                         <div class="checkbox"></div>' +
        '                     </label>' +
        '                     已付' +
        '                 </div>' +
        '             </div>' +
        '         </div>' +
        '      </li>' +
        '      <li class="item-content">' +
        '        <div class="item-media"><i class="icon icon-f7"></i></div>' +
        '        <div class="item-inner">' +
        '          <div class="item-title label">实收总额</div>' +
        '          <div class="item-input">' +
        '                 <input type="text" readonly id="edtActualTotalPrice" name="edtActualTotalPrice" value="'+dataFromServer[0].actualTotalPrice+'&nbsp;元"/>' +
        '          </div>' +
        '        </div>' +
        '      </li>' +
        '      <li class="item-content">' +
        '        <div class="item-media"><i class="icon icon-f7"></i></div>' +
        '        <div class="item-inner">' +
        '          <div class="item-title">运输费用</div>' +
        '          <div class="item-after">'+dataFromServer[0].transitFare+'&nbsp;元</div>' +
        '        </div>' +
        '      </li>' +
        '      <li class="item-content">' +
        '        <div class="item-media"><i class="icon icon-f7"></i></div>' +
        '        <div class="item-inner">' +
        '          <div class="item-title">送货方式</div>' +
        '          <div class="item-after">'+dataFromServer[0].outLibWay+'</div>' +
        '        </div>' +
        '      </li>' +
        '      <li class="item-content">' +
        '        <div class="item-media"><i class="icon icon-f7"></i></div>' +
        '        <div class="item-inner">' +
        '          <div class="item-title">装卸费用</div>' +
        '          <div class="item-after">'+dataFromServer[0].shipFare+'&nbsp;元</div>' +
        '        </div>' +
        '      </li>' +
        '      <li class="item-content">' +
        '        <div class="item-media"><i class="icon icon-f7"></i></div>' +
        '        <div class="item-inner">' +
        '          <div class="item-title">经手人</div>' +
        '          <div class="item-after">'+dataFromServer[0].outLibMan+'</div>' +
        '        </div>' +
        '      </li>' +
        '    </ul>' +
        '  </div>' +
        '<div class="content-block-title">销售详情（货币单位：元）</div>' +
        '<div class="list-block">' +
        '    <ul>' +
        '      <li>' +
        '        <div class="item-content">' +
        '<div class="singleTable">' +
        '                   <table id="outQryDetailstbl">' +
        '                              <tbody id="outQryDetailsbody">' +
        '                                          <!--后续行代码生成-->' +
        // '<tr><th>商品规格</th><th>厂家</th><th>计量单位</th><th>数量</th><th>单价</th><th>金额</th></tr>' +
        // '<tr><td>****</td><td>****</td><td>***</td><td>****</td><td>***</td><td>****</td></tr>' +
                                        createTableDetails(dataFromServer)+
        '                               </tbody>' +
        '                    </table>' +
        '                </div>' +
        '        </div>' +
        '      </li>' +
        '      <li style="padding-bottom: .5em">' +
        '        <div class="item-media"><i class="icon icon-f7"></i></div>'+
        '        <div class="row" style="padding-left: 1em;padding-right: .4em">' +
        '             <div class="col-50"><a class="button button-fill button-success" onclick="edtOutBill('+dataFromServer[0].billNo+')">修改</a></div>' +
        '             <div class="col-50"><a href="#" class="close-popup button button-fill">关闭</a></div>' +
        '         </div>' +
        '      </li>    '+
        '     </ul>' +
        '</div>' +
        '</div>' +
        '</div>';
    $.popup(popupHTML);
    regoutBillEdtEvent(dataFromServer[0].actualTotalPrice);//注册check选项事件，注册已付/未付单击事件
}

function setLiItemBackgroundColor(billStatus) {
    var  noPayStyle = '<li id="edtLiItem" style="background-color: lightpink">';
    var payStyle =  '<li id="edtLiItem">';
    if ("0" == billStatus) {
        return noPayStyle;
    }else{
        return payStyle;
    }
}

function showCheckBoxIsPayedDetail(billStatus) {
    switch (billStatus) {
        //未付
        case "0":
            return '<input id="edtIsPayed" name="edtIsPayed" type="checkbox">';
        //已付
        case "1":
            return '<input id="edtIsPayed" name="edtIsPayed" type="checkbox" checked disabled>';
    }
}

//修改出库单，出库单修改按钮事件
function edtOutBill(billNo) {
    //首先数据校验，看是否输入为数字，校验通过后再执行Ajax操作，后台修改该单状态和金额
    //console.log("billNo:"+billNo);
    var actualTotalPrice = $("#edtActualTotalPrice").val();
    var isPayedChecked = $("#edtIsPayed").attr("checked");
    //console.log(isPayedChecked);
    if (isPayedChecked) {
        if (REGEXPR_DBDECIMAL_NUM.test(actualTotalPrice)){
            //console.log("billNo:"+billNo);
            //校验通过，发送Ajax请求，触发SQL语句完成订单状态修改和实收金额输入
            doEditOper(billNo,actualTotalPrice);
        }else {
            $.toast("实收金额必须输入且只能输入数字！");
            $("#edtActualTotalPrice").focus();
        }
    }else {
        $.toast("请先将订单状态改为“已付”！");
        $("#edtIsPayed").focus();
    }

}

function doEditOper(billNo, actualTotalPrice) {
    //发送数据到服务器（Tomcat）
    $.ajax({
        url: "EdtBillStatusController",    //请求的url地址
        timeout: 5000,
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性

        beforeSend: function () {
            //显示预加载进度条
            $.showPreloader('修改中...');
            //800毫秒钟后消失
            setTimeout(function () {
                $.hidePreloader();
            }, 800);
        },
        //请求参数值（发送的数据位于请求对象request中，这些值就是请求参数值，又叫发送的数据）
        data: {
            "billNo": billNo,
            "actualTotalPrice": actualTotalPrice
        },
        type: "POST",   //发送数据的请求方式（POST提交数据）
        success: function (data) {
            //请求成功时处理
            if ("true" == data.edtResult) {
                //console.log(data.insertResult);
                setTimeout(function () {
                    $.toast("修改成功！");
                }, 1000);
                //修改成功完成后，关闭popup页
                //2秒后关闭该Popup
                //window.location.reload(true);
                setTimeout(function (){
                    $.closeModal(".popup-detail");
                },2000);

                setTimeout(function () {
                    //2秒后刷新表格
                    reDoQueryOutBill();
                },2000);

            } else {
                $.toast("服务器返回异常，修改失败！");
            }
        },
        error: function () {
            $.alert("服务器未响应，修改失败！");
        }
    });
}

function regoutBillEdtEvent(actualTotalPrice){
    //修改状态标识触发修改实收金额可用
    $("#edtIsPayed").on("click",function () {
        if (this.checked) {
            $.toast("输入实收金额后点击‘修改’按钮");
            $("#edtActualTotalPrice").removeAttr("readonly");
            $("#edtActualTotalPrice").val("");//清空
            $("#edtActualTotalPrice").focus();
            $("#edtLiItem").css("background-color","white");
        }else {
            $("#edtActualTotalPrice").attr("readonly","readonly")//将input元素设置为readonly
            $("#edtActualTotalPrice").val(actualTotalPrice + " 元");
            $("#edtLiItem").css("background-color","lightpink");
        }
    });
}


