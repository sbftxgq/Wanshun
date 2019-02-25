//执行删除操作通用函数，删除删除按钮所在的行
function doOperator(delBtnClassStr, delLftTblIdStr, delRgtTblIdStr, speclstIdStr, unitIdStr, mufUnitdescIdStr, isOut) {
    //取得删除按钮DOM对象，两个表格处于同一行上只有一个删除按钮，此按钮删除2个表格上的同一行
    var dels = getDomObj(delBtnClassStr);
    var currentIndex = 0;
    var dataTableRows = 0;
    //给每个删除按钮注册删除事件
    for (var i = 0; i < dels.length; i++) {

        dels[i].onclick = function () {

            currentIndex = this.parentNode.parentNode.rowIndex;

            if (currentIndex === 1) {
                $.alert("抱歉，首行不能删除！");
                return;
            }

            function deleteHandler() {
                //双击弹出的OK对话框会出现两次执行后面的回调函数问题，导致索引越界
                dataTableRows = getDomObj(delRgtTblIdStr).rows.length;
                //console.log("删除前的表格行数："+dataTableRows);
                if (currentIndex < dataTableRows) {
                    //左边固定表
                    getDomObj(delLftTblIdStr).deleteRow(currentIndex);
                    //右边明细表
                    getDomObj(delRgtTblIdStr).deleteRow(currentIndex);

                    //删除时，各个input根据所在行的id和name重新编号，其id和name末尾数字与行号一致，首行不能删除
                    //左表数据行
                    var $lftDataRows = $(delLftTblIdStr).find(".dataRowFstFlag");
                    //右表数据行
                    var $rgtDataRows = $(delRgtTblIdStr).find(".dataRowFstFlag");
                    //重新编号
                    //先修改其ID和name，包括其孩子中输入元素的id和name，之后id和name末尾全部是1,2,3递增
                    batchUpdateDataRowIdAndName($lftDataRows);
                    batchUpdateDataRowIdAndName($rgtDataRows);

                    //每一个规格下拉列表注册change事件，无需ID属性，区分出入库
                    //出库各个下拉列表注册事件
                    if (isOut) {
                        //商品规格下拉列表重新change事件注册
                        //这个index从0开始，首行已经排除（class未在首行出现）
                        $(".specSelectedFlag").each(function (index) {
                            //先移除所有的事件
                            $(this).off("change");
                            //console.log(this.id);//speclst1,speclst2,speclst3
                            //再注册新的事件
                            $(this).on("change", function () {
                                regProductChangeEvent.call(this, unitIdStr, mufUnitdescIdStr, (index + 1), isOut);
                            });
                        });
                        //计量单位下拉列表重新change事件注册（这个index从0开始，class在首行出现了，因此0代表首行，样本第一行）
                        $(".unitSelectedFlag").each(function (index) {
                            //先移除除首行外的所有的事件，首行已经有事件
                            //除首行外，其它行重新注册事件
                            if (0 != index) {
                                $(this).off("change");
                                //console.log(this.id);//unit1,unit2,unit3
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("change", function () {
                                    //console.log(this.id);
                                    regUnitChangeEvent.call(this, speclstIdStr, mufUnitdescIdStr, (index), isOut);
                                });
                            }
                        });

                        //数量输入框焦点失去事件重新注册（首行有class）
                        $(".countsFousFlag").each(function (index) {
                            //除首行外，其它行重新注册事件
                            if (0 != index) {
                                $(this).off("focusout");
                                //console.log(this.id);//unit1,unit2,unit3
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("focusout", function () {
                                    //console.log(this.id);
                                    updatePriceValue(index, isOut);
                                    caculateTotalPrice(isOut);//计算总额
                                });
                            }
                        });
                        //单价输入框失去焦点事件
                        $(".uPriceFousFlag").each(function (index) {
                            //除首行外，其它行重新注册事件
                            if (0 != index) {
                                $(this).off("focusout");
                                //console.log(this.id);//unit1,unit2,unit3
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("focusout", function () {
                                    //console.log(this.id);
                                    updatePriceValue(index, isOut);
                                    caculateTotalPrice(isOut);//计算总额
                                });
                            }
                        });

                    } else {
                        //入库时
                        //这个index从0开始，首行已经排除（class未在首行出现）
                        $(".inSpecSelectedFlag").each(function (index) {
                            //先移除所有的事件
                            $(this).off("change");
                            //再注册新的事件
                            $(this).on("change", function () {
                                regProductChangeEvent.call(this, unitIdStr, mufUnitdescIdStr, (index + 1), isOut);
                            })
                        });
                        //计量单位下拉列表重新change事件注册（这个index从0开始，class在首行出现了，因此0代表首行，样本第一行）
                        $(".inUnitSelectedFlag").each(function (index) {
                            //先移除除首行外的所有的事件，首行已经有事件
                            //除首行外，其它行重新注册事件
                            if (0 != index) {
                                $(this).off("change");
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("change", function () {
                                    regUnitChangeEvent.call(this, speclstIdStr, mufUnitdescIdStr, (index), isOut);
                                })
                            }
                        });

                        //入库表数量输入框焦点失去事件重新注册（首行有class）
                        $(".inCountsFousFlag").each(function (index) {
                            //除首行外，其它行重新注册事件
                            if (0 != index) {
                                $(this).off("focusout");
                                //console.log(this.id);//unit1,unit2,unit3
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("focusout", function () {
                                    //console.log(this.id);
                                    updatePriceValue(index, isOut);
                                    caculateTotalPrice(isOut);//计算总额
                                });
                            }
                        });
                        //入库明细表单价输入框失去焦点事件
                        $(".inUpriceFousFlag").each(function (index) {
                            //除首行外，其它行重新注册事件
                            if (0 != index) {
                                $(this).off("focusout");
                                //console.log(this.id);//unit1,unit2,unit3
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("focusout", function () {
                                    //console.log(this.id);
                                    updatePriceValue(index, isOut);
                                    caculateTotalPrice(isOut);//计算总额
                                });
                            }
                        });

                    }
                    //点击删除按钮后，更新总价
                    caculateTotalPrice(isOut);//计算总价
                    //更新木方单位说明显示
                    if (isShowUnitdesc(isOut)) {
                        $(mufUnitdescIdStr).show();//显示单位说明
                    } else {
                        $(mufUnitdescIdStr).hide();//隐藏单位说明
                    }
                }
            };
            //防止快速点击2次后执行两次删除
            var lazyDeleteHandler = _.debounce(deleteHandler, 280);
            //删除事件处理函数确认是否删除，如果是，则执行该function函数
            $.confirm('是否确定删除？', lazyDeleteHandler);
        }
    }
}

//添加行操作，第二表格计量单位复位为0——第一个选中索引为0,2018-12-05新增最后一个参数，单位说明id
//进货、销售各自按钮调用同一个函数，传入不同参数
function addRow(delBtnClassStr, lftTblIdStr, rgtTblIdStr, leftTblFstRowIdStr, rightTblFstRowIdStr, lftSpecrowStr,
                lftFirstColumnbodyIdStr, rgtDetailrowStr, rgtTblbodyIdStr, speclstIdStr, unitIdStr, mufUnitdescIdStr, isOut) {

    var len = getDomObj(rgtTblIdStr).rows.length; //右边表格table取到所有的行
    //console.log("新增行前的表格行数："+len);//初始为2，因为已经有表头和样本数据2行，故len=2
    if (len >= 6) {
        $.alert("最多为5个商品规格！");
        return;
    }
    //第一，克隆对象保存（第二个表的首行被复制）
    //左侧表格首行id：leftTblFstRowIdStr
    var $rowCopyLeft = $(leftTblFstRowIdStr).clone(true);//固定左侧表格首行复制
    //右侧表格首行id：rightTblFstRowIdStr
    var $rowCopyRight = $(rightTblFstRowIdStr).clone(true);//右侧表格首行复制
    //左边固定例追加,左表首行id字符串：lftspecrowStr,lftfirstcolumnbodyIdStr
    $rowCopyLeft.attr({"id": lftSpecrowStr + (len - 1), "class": "dataRowFstFlag"}).appendTo(lftFirstColumnbodyIdStr);
    //右边明细追加,右表首行id字符串：rgtdetailrowStr,rgttblbodyIdStr
    $rowCopyRight.attr({"id": rgtDetailrowStr + (len - 1), "class": "dataRowFstFlag"}).appendTo(rgtTblbodyIdStr);

    //batchEdtId($ObjCopyRight.find(":input"),len-1);zepto不支持，改用children()得到，让行下的孩子们id和name+1
    var $lftChildrens = $rowCopyLeft.children().children().children();
    //均操作左表中的商品规格下拉列表，所有复制的行下的input（select）均自动增加class属性
    //如果是出库，每个孩子（列）——商品规格下拉列表增加class属性
    if (isOut) {
        //左表这新增的行
        $rowCopyLeft.find(speclstIdStr).attr({"class": "specSelectedFlag"});
        //入库
    } else {
        $rowCopyLeft.find(speclstIdStr).attr({"class": "inSpecSelectedFlag"});
    }
    var $rgtChildrens = $rowCopyRight.children().children().children();
    //false标识是新增操作，在表格最后添加一行，
    //更新该行下各个列内input元素的id和name值，与行的id和name值末尾数字一致，均为len-1
    //左边表格
    batchEdtInputIdAndNameAttr($lftChildrens, len - 1, false);
    //右边表格
    batchEdtInputIdAndNameAttr($rgtChildrens, len - 1, false);

    //注册删除监听事件，确保每增加的行上的删除按钮均有事件
    doOperator(delBtnClassStr, lftTblIdStr, rgtTblIdStr, speclstIdStr, unitIdStr, mufUnitdescIdStr, isOut);

    //注册该新增行中商品下拉change事件,此处this代表了商品speclst下拉列表select
    $(speclstIdStr + (len - 1)).on("change", function () {
        //2018-12-05新增2个参数
        regProductChangeEvent.call(this, unitIdStr, mufUnitdescIdStr, (len - 1), isOut);
    });
    //注册该新增行中计量单位下拉列表选择change事件
    $(unitIdStr + (len - 1)).on("change", function () {
        regUnitChangeEvent.call(this, speclstIdStr, mufUnitdescIdStr, (len - 1), isOut);
    });

    //注册出/入库单价、数量下拉列表失去焦点事件20181211,OK
    $("#inunitprice" + (len - 1) + "," + "#incounts" + (len - 1)).on("focusout", function () {
        updatePriceValue((len - 1), isOut);
        caculateTotalPrice(isOut);//计算总额
    });
    $("#unitprice" + (len - 1) + "," + "#counts" + (len - 1)).on("focusout", function () {
        updatePriceValue((len - 1), isOut);
        caculateTotalPrice(isOut);//计算总额事件注册
    });
    //新增按钮后，清零各输入框，更新总价
    clearPrice((len - 1), isOut);
    caculateTotalPrice(isOut);//计算总价
}

//某一行上的所有列Cols集合（td）内的input元素遍历操作，此处不区分左右表
// $obj标识该行列元素的集合，例如右边表格列索引：0——第1列（厂家），1——第2列（单位）
//在所选对象上使用each方法，把id和name属性重新编号，用于新增行和删除行时更新
//假定找到了所有包含id属性的jquery对象jq.find(":input"),所有input元素
//$obj是所有某行下所有的列td下的input元素构成的集合,tableIndex是所在行索引
//tableIndex表格行索引，传入表格行索引号
//isDelOper布尔值，标识是否是删除操作，否则就是新增操作
function batchEdtInputIdAndNameAttr($obj, tableIndex, isDelOper) {
    $obj.each(function (index) {
        //每一个id属性要修改，逐个遍历
        //找到原来的id值和name值
        var id_old = $(this).attr("id");
        var name_old = $(this).attr("name");
        //如果是删除操作（点击删除按钮时），isDelOper传入true值
        if (isDelOper) {
            var idLen = id_old.length;
            var nameLen = name_old.length;
            //截取除最后一个数字之外的字符串，然后拼接新的数字得到新编号ID
            id_old = id_old.substr(0, idLen - 1);
            name_old = name_old.substr(0, nameLen - 1);
            $(this).attr({"id": id_old + tableIndex, "name": name_old + tableIndex});
        } else {
            //否则就是新增操作（点击添加规格按钮时）
            //更新为新的id和name
            $(this).attr({"id": id_old + tableIndex, "name": name_old + tableIndex});
            //左边表格仅此1列，索引为0
            //右边表格计量单位那个this行的option属性设置默认为片，计量单位索引为1(第2列)
            if (1 == index) {
                $(this).find("option").removeAttr("selected");
                $(this).find("option[value='piece']").attr("selected", "selected");
            }
        }
    });
}

//某一表格内所有数据行（class选择器选中）集合$obj的遍历
//批量更新表格数据行row元素的ID和name值，用于删除按钮删除行后更新
//$obj是某个表格所有数据行的集合构成的jQuery对象
function batchUpdateDataRowIdAndName($obj) {

    //此index编号从0开始，$obj是数据行Row集合
    $obj.each(function (index) {
        //每一个id属性要修改，逐个遍历
        //找到原来的id值和name值，字符串
        var id_old = $(this).attr("id");
        var idLen = id_old.length;
        var name_old = $(this).attr("name");
        var nameLen = 0;
        //去除最后一个数字
        id_old = id_old.substr(0, idLen - 1);
        if (name_old != null) {
            nameLen = name_old.length;
            name_old = name_old.substr(0, nameLen - 1);
        }
        //更新为新的id和name，末尾从1开始自增编号
        $(this).attr({"id": id_old + (index + 1), "name": name_old + (index + 1)});

        //更新当前这一行下面的子元素（表单输入控件input）的ID和name，
        // 此处不分左右表，因为$obj已经确定是左还是右
        var inputChildrens = $(this).children().children().children();
        //删除按钮执行时，更新该行下子输入元素的id和name值，true标识为是删除操作，false则为新增操作
        //该行下的所有列inputChildrens元素的id和name值末尾也从1开始编号，保证列中的末尾数字和该行末尾
        //数字均为同一个数。
        batchEdtInputIdAndNameAttr(inputChildrens, (index + 1), true);
    });
}

//以下代码用于原生JS获取DOM对象
function getDomObj(eleStr) {
    switch (eleStr.substr(0, 1)) {
        case "#":
            return document.getElementById(eleStr.substr(1));
            break;
        case ".":
            return document.getElementsByClassName(eleStr.substr(1));
            break;
        case "_":
            return document.getElementsByName(eleStr.substr(1));
            break;
        default:
            return document.getElementsByTagName(eleStr);
            break;
    }
}

//送货日期和进货日期界面上自动填写当前日期
//获取当前日期，格式YYYY-MM-DD
function getNowFormatDate(seperator) {
    var date = new Date();
    //var seperator = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator + month + seperator + strDate;
    return currentdate;
}

//解析后前导补0函数，参数1：数字，参数2：数字个数
function prefixInteger(num, length) {
    return (Array(length).join('0') + num).slice(-length);
}

//价格计算（木方和模板价格计算均使用此函数）
// unit——计量单位，
// counts——数量，
// unitPrice——单价
// var dLen = new Decimal(length)
//length——木方长度（2.5/3/3.5/4）或者是模板厚度（7/8/9，但不参与计算）；
function caculatePrice(unit, counts, unitPrice, length) {
    //非空判断，数据合法性判断
    var isCountsInputPassed = REGEXPR_DBDECIMAL_NUM.test(counts) || REGEXPR_INTEGER.test(counts);
    var isUnitPriceInputPassed = REGEXPR_DBDECIMAL_NUM.test(unitPrice) || REGEXPR_INTEGER.test(unitPrice);
    //if(""!=counts && ""!=unitPrice){
    if (isCountsInputPassed && isUnitPriceInputPassed) {
        var x = new Decimal(counts);
        switch (unit) {
            //5根每把：length*5得到1把的米数*把数counts，从而得到总米数
            //单价仍按米填入
            case "bunch5":
                return (x.times(unitPrice).times(5).times(length)).toString();
            //4根每把：length*4得到1把的米数*把数counts=总米数
            //单价仍按米填入
            case "bunch4":
                return (x.times(unitPrice).times(4).times(length)).toString();
            //其它情况（计量单位直接输入的是米数或者立方米数）
            default:
                //x是数量（米数/立方数），unitPrice是每米/每立方米的单价
                return (x.times(unitPrice)).toString();
        }
    } else {
        //$.alert("数量和单价输入必须是数字！")
        return 0;
    }
}

/*
//计算未付订单未付总销售金额
function caculateTotalNoPayMoney(array) {
    var sum = new Decimal(0.00);
    array.forEach(function (element) {
        if ("0" == element.billStatus) {
            sum = sum.plus(element.totalPrice)
        }
    });
    return sum.toString();
}
*/

//查询按钮事件函数，并且被滚动事件监听函数调用
//修改为按照分页查询LIMIT M,N，参数M为起始索引，从0开始，参数N为一次取得数据行数
function queryInLibBill(qryWay, pageNow, pageSize) {
    var startDate = $("#inQryLibDateStrt").val();
    var endDate = $("#inQryLibDateEnd").val();
    var specID = $("#inQrySpecId").val();
    var ajaxConfig = {
        url: "QryInLibBillController",    //请求的url地址
        timeout: 5000,//请求时间
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        /*beforeSend: function () {
            //显示预加载进度条（可以不显示）
            $.showPreloader('查询中...');
            //500毫秒后消失
            setTimeout(function () {
                $.hidePreloader();
            }, 1000);
        },*/
        //请求参数值（发送的数据位于请求对象request中，这些值就是请求参数值，即发送的数据）
        data: {
            "inQueryWay": qryWay,
            "pageNow": pageNow,
            "pageSize": pageSize,
            "inQryLibDateStrt": startDate,
            "inQryLibDateEnd": endDate,
            "inQrySpecId": specID
        },
        type: "POST",   //发送数据的请求方式（POST提交数据）
        success: function (dataFromServer) {
            //请求成功时处理，返回的recvData是JSON格式数组，要显示在表格内
            /*
            * [{"billNo":"20180000001",
            * "totalPrice":"17950.00",
            * "inLibDate":"2018-12-17",
            * "inLibWay":"叉车",
            * "transitFare":"1500",
            * "shipFare":"400"},{...},{...},{...}]
            * */
            //console.log(dataFromServer);//JSON
            //console.log(dataFromServer.total);//总数据量
            //一次分页查询的数据量，limit M,N得到的数据行，该数量<=CURRENT_TOTAL
            //console.log(dataFromServer.data.length);//无数据无length属性undefined
            //当前查询出的总数据数，加载完成后阻止（不再添加行）
            CURRENT_TOTAL = dataFromServer.total;
            //console.log("总数据量："+CURRENT_TOTAL);//总数据量：SELECT count(*)
            //这是一次加载的行数（动态添加行，更新索引）
            //var recvData = dataFromServer.data;
            //封装了addTableRows方法，pageNow——lastIndex，pageSize——number
            addTableRows(pageNow, dataFromServer, false);
        },
        error: function () {
            $.alert("服务器未响应，查询失败！");
            //复位代码视情况添加
            CURRENT_PAGE = 1;//复位
            PAGE_NOW = 0;//复位
            CURRENT_TOTAL = 0;//复位
            $("#inQryIncometblbody").empty();
            //标签复位显示数据总量
            $("#inQryBilltotaNum").html("&nbsp;0&nbsp;");
            //移除监听，注销无限加载事件，以防不必要的加载
            $.detachInfiniteScroll($("#inQryScrollContainer"));//$("#inQryScrollContainer")，原$('.infinite-scroll')
            $("#inQryPreloader").hide();
        }
    };
    $.ajax(ajaxConfig);
}

//滚动事件，必须保留原来的行，递增，如果换了查询方式，就要清空表格行
//点击查询按钮后，以及滚动后的监听函数中调用此函数，添加表格行，此后依靠滚动事件翻页（加载行）
//参数1：pageNow——lastIndex,代表这一次加载行的索引，i默认传输0，起始
// 参数2：number代表一次添加多少行，pageSize,对应参数值：ITEMS_PER_LOAD
//参数3：加载的数据，来自服务器回传的数据JSON
//pageNow, pageSize决定pageData数据量和不同页的数据，改变pageNow即可翻页
function addTableRows(pageNow, pageData, isOut) {
    //console.log(recvData[0].billNo);
    //pageData是服务器端回传的JSON对象
    //pageSize前端固定值，例如为5，SQL查询数据返回的len<=pageSize（N）
    var recvData = pageData.data;
    //一次查询SQL语句（已经分页）得到的记录数，用于分页显示，该数据<=pageData.total，
    //由于使用了LIMIT M,N，N就是pageSize，返回的数据数组长度就是len<=N，len可以为0,1,2，...不超过N
    var len = recvData.length;
    //console.log("该页数据条数：" + len);//该len长度的数据需要分页（SQL分页查询得到的实际条数）
    //如果是出库单
    if (isOut) {

        if (len) {

            //console.log();
            //OUT_CURRENT_NOPAY_TOTAL += caculateTotalNoPayMoney(recvData);
            //console.log(OUT_CURRENT_NOPAY_TOTAL);
            //debugger;
            //console.log(typeof recvData[0].billStatus);//string
            var html = "";
            var trRow = "";
            //首页显示表头billStatusMapping
            if (0 == OUT_PAGE_NOW) {
                //查所有和按日期查，style='display:none;'
                html = "<tr><th width='17%'>单号</th><th width='15%'>状态</th><th width='23%'>客户</th><th width='20%'>日期</th><th>销售额(扣除运卸费)</th></tr>";
                //按规格查
                if (OUT_QUERY_WAY == "SID") {
                    html = "<tr><th width='17%'>单号</th><th width='15%'>状态</th><th width='23%'>客户</th><th width='20%'>日期</th><th>该规格销售额</th></tr>";
                }
            }
            //实际显示的行数，每一次均显示SQL查询得到的数据，每次i置零
            for (var i = 0; i < len; i++) {
                //html += '<li class="item-content"><div class="item-inner"><div class="item-title">Item ' + i + '</div></div></li>';
                if ("0" == recvData[i].billStatus) {
                    trRow = "<tr onclick='queryOutDetail(this)'><td>" + recvData[i].billNo + "</td><td style='color: red;'>" + billStatusMapping(recvData[i].billStatus) + "</td><td>" + recvData[i].guestName + "</td><td>" + recvData[i].outLibDate + "</td><td>" + recvData[i].totalPrice + "</td></tr>";
                } else {
                    trRow = "<tr onclick='queryOutDetail(this)'><td>" + recvData[i].billNo + "</td><td>" + billStatusMapping(recvData[i].billStatus) + "</td><td>" + recvData[i].guestName + "</td><td>" + recvData[i].outLibDate + "</td><td>" + recvData[i].totalPrice + "</td></tr>";
                }
                //html += "<tr onclick='queryOutDetail(this)'><td>" + recvData[i].billNo + "</td><td>" + billStatusMapping(recvData[i].billStatus) + "</td><td>" + recvData[i].guestName + "</td><td>" + recvData[i].outLibDate + "</td><td>" + recvData[i].totalPrice + "</td></tr>";
                html += trRow;
            }
            //200毫秒后显示结果
            setTimeout(function () {
                $("#outQryOutcometblbody").append(html);
                //标签显示数据总量
                $("#outQryBilltotaNum").html("&nbsp;" + OUT_CURRENT_TOTAL + "&nbsp;");
            }, 200);

            //如果总数据量少于pageSize，则注销滚动监听并隐藏加载提示符号
            //防止只有一条记录或者只有一页数据时，显示加载符
            if (OUT_CURRENT_TOTAL <= PAGE_SIZE) {
                //移除监听，注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($("#outQryScrollContainer"));
                $("#outQryPreloader").hide();
            } else {
                // 显示加载提示符
                $("#outQryPreloader").show();
            }
            //改变PAGE_NOW
            OUT_PAGE_NOW = pageNow + len;
            //console.log("当前PAGE_NOW：" + PAGE_NOW);
        } else {
            //1秒钟后显示结果
            setTimeout(function () {
                $.toast("没有查询到数据！");
                OUT_CURRENT_PAGE = 1;//复位
                //清空表格
                $("#outQryOutcometblbody").empty();
                //由于被清空了，故加上一个表头和空行
                var noDataHTML = "<tr><th width='17%'>单号</th><th width='15%'>状态</th><th width='23%'>客户</th><th width='20%'>日期</th><th>销售额(扣除运卸费)</th></tr>" +
                    "<tr><td style='text-align: center'>没有数据</td>" +
                    "<td style='text-align: center'>没有数据</td>" +
                    "<td style='text-align: center'>没有数据</td>" +
                    "<td style='text-align: center'>没有数据</td>" +
                    "<td style='text-align: center'>没有数据</td></tr>";
                $("#outQryOutcometblbody").append(noDataHTML);
                //标签显示数据总量
                $("#outQryBilltotaNum").html("&nbsp;0&nbsp;");
                $("#noPayedMoney").html("待收款&nbsp;0&nbsp;元");
                $("#payedMoney").html("已收款&nbsp;0&nbsp;元");

                //没有数据则移除滚动监听
                // 注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($("#outQryScrollContainer"));
                // 隐藏加载提示符
                $("#outQryPreloader").hide();
            }, 1000);
        }
        //入库单
    } else {
        if (len) {
            //动态添加表格行，并把数据展示出来
            //预先加载20条数据，起始索引为0
            //debugger;
            /*
            * <tr><th>进货单号</th><th>进货日期</th><th>成本(含运卸费)</th></tr>
            * */
            var html = "";
            //首页显示表头
            if (0 == PAGE_NOW) {
                //查所有和按日期查
                html = "<tr><th>进货单号</th><th>进货日期</th><th>成本(含运卸费)</th></tr>";
                //按规格查
                if (IN_QUERY_WAY == "SID") {
                    html = "<tr><th>进货单号</th><th>进货日期</th><th>该规格成本</th></tr>";
                }
            }
            //实际显示的行数，每一次均显示SQL查询得到的数据，每次i置零
            for (var i = 0; i < len; i++) {
                //html += '<li class="item-content"><div class="item-inner"><div class="item-title">Item ' + i + '</div></div></li>';
                html += "<tr onclick='queryDetail(this)'><td>" + recvData[i].billNo + "</td><td>" + recvData[i].inLibDate + "</td><td>" + recvData[i].totalPrice + "</td></tr>";
            }
            //200毫秒后显示结果
            setTimeout(function () {
                $("#inQryIncometblbody").append(html);
                //标签显示数据总量
                $("#inQryBilltotaNum").html("&nbsp;" + CURRENT_TOTAL + "&nbsp;");
            }, 200);

            //如果总数据量少于pageSize，则注销滚动监听并隐藏加载提示符号
            //防止只有一条记录或者只有一页数据时，显示加载符
            if (CURRENT_TOTAL <= PAGE_SIZE) {
                //移除监听，注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($("#inQryScrollContainer"));
                $("#inQryPreloader").hide();
            } else {
                // 显示加载提示符
                $("#inQryPreloader").show();
            }
            //改变PAGE_NOW
            PAGE_NOW = pageNow + len;
            //console.log("当前PAGE_NOW：" + PAGE_NOW);
        } else {
            //1秒钟后显示结果
            setTimeout(function () {
                $.toast("没有查询到数据！");
                CURRENT_PAGE = 1;//复位
                //清空表格
                $("#inQryIncometblbody").empty();
                //由于被清空了，故加上一个表头和空行
                var noDataHTML = "<tr><th>进货单号</th><th>进货日期</th><th>成本(含运卸费)</th></tr>" +
                    "<tr><td style='text-align: center'>没有数据</td>" +
                    "<td style='text-align: center'>没有数据</td>" +
                    "<td style='text-align: center'>没有数据</td></tr>";
                $("#inQryIncometblbody").append(noDataHTML);
                //标签显示数据总量
                $("#inQryBilltotaNum").html("&nbsp;0&nbsp;");
                //没有数据则移除滚动监听
                // 注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($("#inQryScrollContainer"));
                // 隐藏加载提示符
                $("#inQryPreloader").hide();
            }, 1000);
        }
    }
}

function queryOutLibBill(qryWay, pageNow, pageSize) {
    var startDate = $("#outQryLibDateStrt").val();
    var endDate = $("#outQryLibDateEnd").val();
    var specID = $("#outQrySpecId").val();//商品规格
    var guestName = $("#outGuestName").val();//客户名称
    //var billStatus = "0";//字符串“0”表示未付，“1”表示已付，无需传递，SQL语句写死
    //计算总价的Ajax配置对象
    var sendCacualteTotalPriceConfig = {
        url: "CaculateTotalPriceController",    //请求的url地址
        timeout: 5000,//请求时间
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        //请求参数值（发送的数据位于请求对象request中，这些值就是请求参数值，即发送的数据）
        data: {
            "outQueryWay": qryWay,
            "outQryLibDateStrt": startDate,
            "outQryLibDateEnd": endDate,
            "outQrySpecId": specID,
            "guestName": guestName
        },
        type: "POST",   //发送数据的请求方式（POST提交数据）
        success: function (totalPriceFromServer) {
            //请求成功时处理，返回的recvData是JSON格式数组，要显示在指定的SPAN内，收到的如果是null,转换为0显示
            //console.log("已付金额："+totalPriceFromServer[0]+"，未付金额："+totalPriceFromServer[1]);
            $("#noPayedMoney").html("待收款&nbsp;" + totalPriceDataFormat(totalPriceFromServer[1]) + "&nbsp;元");
            $("#payedMoney").html("已收款&nbsp;" + totalPriceDataFormat(totalPriceFromServer[0]) + "&nbsp;元");
            if (qryWay == "DNPY" || qryWay == "GNPY" || qryWay == "DGNPY" || qryWay == "NPY") {
                $("#payedMoney").hide();
            } else {
                $("#payedMoney").show();
            }
        },
        error: function () {
            $.alert("服务器未响应，计算总价失败！");
            $("#noPayedMoney").html("待收款&nbsp;0&nbsp;元");
            $("#payedMoney").html("已收款&nbsp;0&nbsp;元");
        }
    };
    var ajaxConfig = {
        url: "QryOutLibBillController",    //请求的url地址
        timeout: 5000,//请求时间
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        //请求参数值（发送的数据位于请求对象request中，这些值就是请求参数值，即发送的数据）
        data: {
            "outQueryWay": qryWay,
            "pageNow": pageNow,
            "pageSize": pageSize,
            "outQryLibDateStrt": startDate,
            "outQryLibDateEnd": endDate,
            "outQrySpecId": specID,
            "guestName": guestName
            //"destName": destName
            //"billStatus": billStatus
        },
        type: "POST",   //发送数据的请求方式（POST提交数据）
        success: function (dataFromServer) {
            //请求成功时处理，返回的recvData是JSON格式数组，要显示在表格内
            //当前查询出的总数据数，加载完成后阻止（不再添加行）
            OUT_CURRENT_TOTAL = dataFromServer.total;
            //封装了addTableRows方法，pageNow——lastIndex，pageSize——number
            addTableRows(pageNow, dataFromServer, true);

            //如果OUT_CURRENT_TOTAL的值不为0，则发送Ajax请求，计算总价，只发送一次Ajax请求
            if ("0" != OUT_CURRENT_TOTAL && IS_CACULATED_PRICE) {

                IS_CACULATED_PRICE = false;
                //成功后发送计算请求
                $.ajax(sendCacualteTotalPriceConfig);
            }
        },
        error: function () {
            $.alert("服务器未响应，查询失败！");
            //复位代码视情况添加
            OUT_CURRENT_PAGE = 1;//复位
            OUT_PAGE_NOW = 0;//复位
            OUT_CURRENT_TOTAL = 0;//复位
            $("#outQryOutcometblbody").empty();
            //标签复位显示数据总量
            $("#outQryBilltotaNum").html("&nbsp;0&nbsp;");
            //移除监听，注销无限加载事件，以防不必要的加载
            $.detachInfiniteScroll($("#outQryScrollContainer"));//$("#inQryScrollContainer")，原$('.infinite-scroll')
            $("#outQryPreloader").hide();
        }
    };
    $.ajax(ajaxConfig);
}

function totalPriceDataFormat(price) {
    return null == price ? "0" : price
}

//入库单结果滚动事件监听函数（调用按钮触发函数，查询数据库分页）
function infiniteHandler() {

    //标签ID为intab2时，才执行里面的函数
    if ($(this).find(".tab.active").attr('id') == "intab2") {
        // 如果正在加载，则退出
        if (IN_QUERY_LOADING) {
            return;
        }
        // 设置flag
        IN_QUERY_LOADING = true;
        // 模拟100毫秒的加载过程，一秒后执行function函数
        setTimeout(function () {
            // 重置加载flag
            IN_QUERY_LOADING = false;
            //console.log("滚动加载事件中的PAGE_NOW值：" + PAGE_NOW);
            //当前页最后索引大于等于总记录数，不再加载（移除滚动监听事件）同时移除动画
            //加载完成
            if (PAGE_NOW >= CURRENT_TOTAL) {
                CURRENT_PAGE = 1;//复位
                $.toast("所有数据已经加载完成！");
                // 加载完毕，则注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($("#inQryScrollContainer"));
                // 隐藏加载提示符
                $("#inQryPreloader").hide();
                return;
            }
            $.toast("当前加载第" + (++CURRENT_PAGE) +
                "页，共" + Math.ceil(parseInt(CURRENT_TOTAL) / PAGE_SIZE) + "页"
            );
            // 添加新条目（该函数调用移动到queryInLibBill方法中）
            //Ajax查询数据，参数1：查询方式，参数2：当前第几页；参数3：每页数据量
            queryInLibBill(IN_QUERY_WAY, PAGE_NOW, PAGE_SIZE);
            // 更新最后加载的序号PAGE_NOW即lastIndex（挪到方法addTableRows中）
            //lastIndex = $('.list-container li').length;
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        }, 100);
    }
}

//出库单
//出库单结果滚动事件监听函数（调用按钮触发函数，查询数据库分页）
function outInfiniteHandler() {

    //标签ID为intab2时，才执行里面的函数
    if ($(this).find(".tab.active").attr('id') == "outtab2") {
        //$.alert("出库单滚动事件...");
        // 如果正在加载，则退出
        if (OUT_QUERY_LOADING) {
            return;
        }
        // 设置flag
        OUT_QUERY_LOADING = true;
        // 模拟100毫秒的加载过程，一秒后执行function函数
        setTimeout(function () {

            // 重置加载flag
            OUT_QUERY_LOADING = false;

            //console.log("滚动加载事件中的PAGE_NOW值：" + PAGE_NOW);
            //当前页最后索引大于等于总记录数，不再加载（移除滚动监听事件）同时移除动画
            //加载完成
            if (OUT_PAGE_NOW >= OUT_CURRENT_TOTAL) {

                OUT_CURRENT_PAGE = 1;//复位

                $.toast("所有数据已经加载完成！");

                // 加载完毕，则注销无限加载事件，以防不必要的加载
                $.detachInfiniteScroll($("#outQryScrollContainer"));
                // 隐藏加载提示符
                $("#outQryPreloader").hide();
                return;
            }
            $.toast("当前加载第" + (++OUT_CURRENT_PAGE) +
                "页，共" + Math.ceil(parseInt(OUT_CURRENT_TOTAL) / PAGE_SIZE) + "页"
            );

            // 添加新条目（该函数调用移动到queryOutLibBill方法中）
            //Ajax查询数据，参数1：查询方式，参数2：当前第几页；参数3：每页数据量
            queryOutLibBill(OUT_QUERY_WAY, OUT_PAGE_NOW, PAGE_SIZE);
            // 更新最后加载的序号PAGE_NOW即lastIndex（挪到方法addTableRows中）
            //lastIndex = $('.list-container li').length;
            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        }, 100);
    }
}

function updatePriceValue(eleIndex, isOut) {
    if (isOut) {
        $("#price" + eleIndex).val(caculatePrice($("#unit" + eleIndex).val(), $("#counts" + eleIndex).val(), $("#unitprice" + eleIndex).val(), $("#speclst" + eleIndex).find("option:checked").attr("plength")));
    } else {
        $("#inprice" + eleIndex).val(caculatePrice($("#inunit" + eleIndex).val(), $("#incounts" + eleIndex).val(), $("#inunitprice" + eleIndex).val(), $("#inspeclst" + eleIndex).find("option:checked").attr("plength")));
    }
}

function caculateTotalPrice(isOut) {
    var totalPrice = 0;
    //出库
    if (isOut) {
        //遍历表格中所有的销售金额列
        $(".caculateTotalPriceFlag").each(function () {
            totalPrice += parseFloat($(this).val());
        });
        $("#totalPrice").val(totalPrice);
    } else {
        //入库
        //遍历表格中所有的进货金额列
        $(".inCaculateTotalPriceFlag").each(function () {
            totalPrice += parseFloat($(this).val());
        });
        $("#inTotalPrice").val(totalPrice);
    }
}

//布尔值用来标识是入库还是出库
function isShowUnitdesc(isOut) {
    var flag = false;
    //如果是出库
    if (isOut) {
        //遍历所有选中的单位，只要有一个是bunch5或bunch4就表示是木方单位，不隐藏单位说明
        $(".unitSelectedFlag").each(function () {
            //每一个select标签上遍历
            //console.log($(this).find("option:checked").val());//bunch5,bunch4
            switch ($(this).find("option:checked").val()) {
                case "bunch5":
                case "bunch4":
                    flag = true;
                    return false;//终止迭代
                    break;
                default:
                    flag = false;
                    return true;//继续迭代
            }
        });
        //入库时
    } else {
        //遍历所有选中的单位，只要有一个是bunch5或bunch4就表示是木方单位，不隐藏单位说明
        $(".inUnitSelectedFlag").each(function () {
            //每一个select标签上遍历
            //console.log($(this).find("option:checked").val());//bunch5,bunch4
            switch ($(this).find("option:checked").val()) {
                case "bunch5":
                case "bunch4":
                    flag = true;
                    return false;//终止迭代
                    break;
                default:
                    flag = false;
                    return true;//继续迭代
            }
        });
    }
    return flag;
}

//console.log(caculatePrice(937.5,3.8));
//console.log(caculatePrice("meter",85,41,null));
//清空价格相关的输入
function clearPrice(eleIndex, isOut) {
    //销售管理页
    if (isOut) {
        $("#counts" + eleIndex).val("");//清空数量
        $("#unitprice" + eleIndex).val("");//清空单价
        $("#price" + eleIndex).val("0");//清0计算的价格
    } else {
        //进货管理页
        $("#incounts" + eleIndex).val("");//清空数量
        $("#inunitprice" + eleIndex).val("");//清空单价
        $("#inprice" + eleIndex).val("0");//清0价格
    }
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

function billStatusMapping(billStatus) {
    switch (billStatus) {
        case "0":
            return "未付";
        case "1":
            return "已付";
    }
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

//起始结束日期顺序验证,isOut参数是布尔值，true表示出库单管理，false表示入库单
function dateSequenceCheck(isOut) {

    //日期字符串中的“-”替换成“/”目的是为了兼容IE11
    var startDate = null;//$("#inQryLibDateStrt").val();
    var endDate = null;//$("#inQryLibDateEnd").val();
    //出库单
    if (isOut) {
        //日期字符串中的“-”替换成“/”目的是为了兼容IE11
        startDate = $("#outQryLibDateStrt").val();
        endDate = $("#outQryLibDateEnd").val();
        //入库单查询
    } else {
        //日期字符串中的“-”替换成“/”目的是为了兼容IE11
        startDate = $("#inQryLibDateStrt").val();
        endDate = $("#inQryLibDateEnd").val();
    }
    startDate = startDate.replace("-", "/").replace("-", "/");
    endDate = endDate.replace("-", "/").replace("-", "/");
    //$.alert(startDate+"--"+endDate);
    if (Date.parse(startDate) > Date.parse(endDate)) {
        $.toast("起始日期不能在结束日期后面！");
        if (isOut) {
            $("#outQryLibDateStrt").focus();
        } else {
            $("#inQryLibDateStrt").focus();
        }
        return false;
    }
    //日期顺序校验通过
    return true;
}

//出库单查询验证
function qryInputCheck(qryWay, isOut) {

    switch (qryWay) {
        case "DNPY"://送货日期+未付订单
        case "DSID"://送货日期+商品规格，仅校验日期顺序即可
        case "DTR"://送货日期
            return dateSequenceCheck(isOut);
        //break;
        case "GNPY"://客户名称+未付订单，仅校验客户名称即可
        case "GNM"://客户名称
            //客户名称必须输入，否则校验不通过
            if (!REGEXPR_NEEDINPUT.test($("#outGuestName").val())) {
                $.toast("客户名称必须输入！");
                $("#outGuestName").focus();
                return false;
            }
            return true;
        //送货地点
        // case "DST":
        //     //送货地点必须输入，否则校验不通过
        //     if (!REGEXPR_NEEDINPUT.test($("#outDestName").val())){
        //         $.toast("送货地点必须输入！");
        //         $("#outDestName").focus();
        //         return false;
        //     }
        //     return true;
        case "DGNPY"://日期+客户+未付订单
        case "DGNM": //送货日期+客户名称
            //日期顺序通过后，验证客户姓名
            if (dateSequenceCheck(isOut)) {
                //客户名称必须输入，否则校验不通过
                if (!REGEXPR_NEEDINPUT.test($("#outGuestName").val())) {
                    $.toast("客户名称必须输入！");
                    $("#outGuestName").focus();
                    return false;
                }
                return true;
            } else {
                return false;
            }
        //其它情况：SID，NPY，ALL，无需校验直接返回true
        default:
            return true;
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

//取得进货单编号最新值（该方法在页面加载完成后执行一次，然后入库成功后执行一次，更新显示单号）
function getLatestBillNo(url, billNoIdStr) {
    //取得客户端当前年号
    var currentYearNo = new Date().getFullYear();//2018/2019/2020等
    var ajaxGettings = {
        url: url,    //请求的url地址
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data: {"year": currentYearNo},    //请求参数值，当前年号
        type: "POST",   //请求方式
        //无论有无billNO，有则为实际数据，无则为null
        success: function (data) {
            //console.log(data);//{billNo: "null"}
            //console.log(typeof currentYearNo);//number
            //当年为空，重新编号
            if ("null" == data.billNo) {
                //第一次请求，数据库中billNo为null，进货单号自动填写为年月日+001
                //进货单号默认日期+3位自增数字,首先读取数据库得到单号，然后最后三位数自增1填入该输入框
                //例如进货单号：20181208001，前8位为日期2018-12-08，后3位流水号001，流水号自增1，每入库一单增1
                //20181217修改为“年+7位数字流水”，一共11位
                $(billNoIdStr).val(currentYearNo + "0000001");
            } else {
                //表明有billNo数据，且是数据库中最新的，进货单号为年月日+billNo+1
                //取得数据库billNo
                var billNo = data.billNo;
                //截取前4个字符串，得到数据库最近的年号，如2018/2019等字符串形式后转换为整数
                //var dataBaseYearNo = parseInt(billNo.substr(0, 4));
                billNo = billNo.substr(4, 7);//一共11位数字字符串，截取索引为4开始的后面7个字符串
                //转换为整数然后自增1，之后再前补零
                var newBillNo = parseInt(billNo, 10) + 1;//转换为10进制整数，再加1
                //prefixInteger函数参数1为待补零数字，参数2为数字位数，即3位流水号
                $(billNoIdStr).val(currentYearNo + prefixInteger(newBillNo, 7));
            }
        }
    };
    //ajax取得进货单号并自增1
    $.ajax(ajaxGettings);
}

//注册产品改变change事件，参数1：单位id字符串、参数2：木方单位描述ID，参数3：行索引，参数4：是否是出库
function regProductChangeEvent(unitIdStr, mufUnitdescIdStr, eleIndex, isOut) {
    var currentSelect = this;//选中的商品规格下拉列表
    //console.log(currentSelect.id);
    //找到选中的项option
    var checkedOption = $(currentSelect).find("option:checked");
    //查找选中项的属性
    var productType = checkedOption.attr("ptype");//商品类型：00或01
    var mufangLength = checkedOption.attr("palength");//木方规格：0.06或0.07,单位：米
    //console.log("单位ID选择器：" + unitIdStr + eleIndex);
    var $unitSelectedObj = $(unitIdStr + eleIndex);
    //console.log($unitSelectedObj)
    //先移除所有的selected属性
    $unitSelectedObj.find("option").removeAttr("selected");
    //后设置指定的selected属性
    switch (productType) {
        //模板
        case "00":
            //设置单位自动为片,attr修改为prop方法更适合
            $unitSelectedObj.find("option[value='piece']").prop("selected", "selected");
            //附加条件：如果单位列表有任何一行出现了bunch5或bunch4且
            // 该行规格列表出现了ptype值为01（木方）的，就不再隐藏单位说明
            //console.log(isShowUnitdesc());//true、false
            if (isShowUnitdesc(isOut)) {
                $(mufUnitdescIdStr).show();//显示单位说明
            } else {
                $(mufUnitdescIdStr).hide();//隐藏单位说明
            }
            break;
        //木方
        case "01":
            //设置单位自动为相应的5,4,根/把
            if ("0.07" == mufangLength) {
                //5*7方——4根每把
                $unitSelectedObj.find("option[value='bunch4']").prop("selected", "selected");
            } else if ("0.06" == mufangLength) {
                //4*6方——5根每把
                $unitSelectedObj.find("option[value='bunch5']").prop("selected", "selected");
            }
            //显示单位说明
            $(mufUnitdescIdStr).show();//显示单位说明
    }
    //不论模板还是木方，改变就清空价格（要传递index索引）
    clearPrice(eleIndex, isOut);
    caculateTotalPrice(isOut);//计算总价
    //$.alert($unitSelectedObj.val());
}

//注册单位选择change事件
function regUnitChangeEvent(speclstIdStr, mufUnitdescIdStr, eleIndex, isOut) {

    var $currentSelect = $(this);//单位下拉列表当前对象
    //console.log($currentSelect.attr("id"));
    //找到计量单位列表选中的项option
    var checkedOption = $currentSelect.find("option:checked");
    //查找选中项的值
    var selectedValue = checkedOption.val();//所选单位的值
    //console.log("选中的值："+selectedValue);//bunch5
    //如果此时选中的商品规格的type是00——模板，只能是单位片，不能是其它单位
    //找到商品规格select选择的type值
    var $productSelectObj = $(speclstIdStr + eleIndex);
    var $productSelectedOption = $productSelectObj.find("option:checked");
    var currentSelectedPtypeValue = $productSelectedOption.attr("ptype");
    var currentSelectedAlen = $productSelectedOption.attr("palength");
    //console.log(currentSelectePtype);//00
    //区分模板和木方单位即可
    //类型为模板
    if ("00" == currentSelectedPtypeValue) {
        switch (selectedValue) {
            //单位是片，利用case穿透，这些选择均提示单位不正确
            case "bunch5":
            case "bunch4":
            case "meter":
            case "stere":
                $.alert("选择无效，模板计量单位只能选‘片’，系统自动选择‘片’！");
                //无论如何都选择“片”为单位
                $currentSelect.find("option[value='piece']").prop("selected", "selected");
                break;
            default:
        }
        //规格为木方时
    } else {
        switch (selectedValue) {
            //单位是木方计量单位，利用case穿透，这些选择均正确
            case "bunch5":
            case "bunch4":
                //更新价格
                updatePriceValue(eleIndex, isOut);
                caculateTotalPrice(isOut);
                $(mufUnitdescIdStr).show();//显示单位说明
                break;
            case "meter":
            case "stere":
                //更新价格
                updatePriceValue(eleIndex, isOut);
                caculateTotalPrice(isOut);
                if (isShowUnitdesc(isOut)) {
                    $(mufUnitdescIdStr).show();//显示单位说明
                } else {
                    $(mufUnitdescIdStr).hide();//隐藏单位说明
                }
                break;
            default:
                $.alert("选择无效，木方计量单位不能选‘片’，请选择正确的单位！");
                //木方具体规格5*7-0.07和4*6-0.06方，最佳匹配
                if ("0.07" == currentSelectedAlen) {
                    $currentSelect.find("option[value='bunch4']").prop("selected", "selected");
                    $(mufUnitdescIdStr).show();//显示单位说明
                } else {
                    //4*6方——5根每把
                    $currentSelect.find("option[value='bunch5']").prop("selected", "selected");
                    $(mufUnitdescIdStr).show();//显示单位说明
                }
                //更新价格
                updatePriceValue(eleIndex, isOut);
                caculateTotalPrice(isOut);
        }
    }
};


