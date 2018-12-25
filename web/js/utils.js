//正则表达式常量
//两位小数
var REGEXPR_DBDECIMAL_NUM = /^-?\d+\.?\d{0,2}$/;
//正整数
var REGEXPR_INTEGER = /^\d+$/;
//是否是他送
var IS_TASONG = false;
//是否已付
var IS_PAYED = false;

//执行删除操作通用函数，删除删除按钮所在的行
function doOperator(delBtnClassStr,delLftTblIdStr,delRgtTblIdStr,speclstIdStr,unitIdStr,mufUnitdescIdStr,isOut) {
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

            //删除事件处理函数确认是否删除，如果是，则执行该function函数
            $.confirm('是否确定删除？', function () {
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
                    if (isOut){
                        //商品规格下拉列表重新change事件注册
                        //这个index从0开始，首行已经排除（class未在首行出现）
                        $(".specSelectedFlag").each(function (index) {
                            //先移除所有的事件
                            $(this).off("change");
                            //console.log(this.id);//speclst1,speclst2,speclst3
                            //再注册新的事件
                            $(this).on("change",function () {
                                regProductChangeEvent.call(this,unitIdStr,mufUnitdescIdStr,(index+1),isOut);
                            });
                        });
                        //计量单位下拉列表重新change事件注册（这个index从0开始，class在首行出现了，因此0代表首行，样本第一行）
                        $(".unitSelectedFlag").each(function (index) {
                            //先移除除首行外的所有的事件，首行已经有事件
                            //除首行外，其它行重新注册事件
                            if(0!=index){
                                $(this).off("change");
                                //console.log(this.id);//unit1,unit2,unit3
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("change",function () {
                                    //console.log(this.id);
                                    regUnitChangeEvent.call(this,speclstIdStr,mufUnitdescIdStr,(index),isOut);
                                });
                            }
                        });

                        //数量输入框焦点失去事件重新注册（首行有class）
                        $(".countsFousFlag").each(function (index) {
                            //除首行外，其它行重新注册事件
                            if(0!=index){
                                $(this).off("focusout");
                                //console.log(this.id);//unit1,unit2,unit3
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("focusout",function () {
                                    //console.log(this.id);
                                    updatePriceValue(index,isOut);
                                    caculateTotalPrice(isOut);//计算总额
                                });
                            }
                        });
                        //单价输入框失去焦点事件
                        $(".uPriceFousFlag").each(function (index) {
                            //除首行外，其它行重新注册事件
                            if(0!=index){
                                $(this).off("focusout");
                                //console.log(this.id);//unit1,unit2,unit3
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("focusout",function () {
                                    //console.log(this.id);
                                    updatePriceValue(index,isOut);
                                    caculateTotalPrice(isOut);//计算总额
                                });
                            }
                        });

                    }else{
                        //入库时
                        //这个index从0开始，首行已经排除（class未在首行出现）
                        $(".inSpecSelectedFlag").each(function (index) {
                            //先移除所有的事件
                            $(this).off("change");
                            //再注册新的事件
                            $(this).on("change",function () {
                                regProductChangeEvent.call(this,unitIdStr,mufUnitdescIdStr,(index+1),isOut);
                            })
                        });
                        //计量单位下拉列表重新change事件注册（这个index从0开始，class在首行出现了，因此0代表首行，样本第一行）
                        $(".inUnitSelectedFlag").each(function (index) {
                            //先移除除首行外的所有的事件，首行已经有事件
                            //除首行外，其它行重新注册事件
                            if(0!=index){
                                $(this).off("change");
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("change",function () {
                                    regUnitChangeEvent.call(this,speclstIdStr,mufUnitdescIdStr,(index),isOut);
                                })
                            }
                        });

                        //入库表数量输入框焦点失去事件重新注册（首行有class）
                        $(".inCountsFousFlag").each(function (index) {
                            //除首行外，其它行重新注册事件
                            if(0!=index){
                                $(this).off("focusout");
                                //console.log(this.id);//unit1,unit2,unit3
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("focusout",function () {
                                    //console.log(this.id);
                                    updatePriceValue(index,isOut);
                                    caculateTotalPrice(isOut);//计算总额
                                });
                            }
                        });
                        //入库明细表单价输入框失去焦点事件
                        $(".inUpriceFousFlag").each(function (index) {
                            //除首行外，其它行重新注册事件
                            if(0!=index){
                                $(this).off("focusout");
                                //console.log(this.id);//unit1,unit2,unit3
                                //再注册新的事件，此时不需要index+1，因为排除了首行
                                $(this).on("focusout",function () {
                                    //console.log(this.id);
                                    updatePriceValue(index,isOut);
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
            });
        }
    }
}

//添加行操作，第二表格计量单位复位为0——第一个选中索引为0,2018-12-05新增最后一个参数，单位说明id
//进货、销售各自按钮调用同一个函数，传入不同参数
function addRow(delBtnClassStr,lftTblIdStr,rgtTblIdStr,leftTblFstRowIdStr,rightTblFstRowIdStr,lftSpecrowStr,
                lftFirstColumnbodyIdStr,rgtDetailrowStr, rgtTblbodyIdStr,speclstIdStr,unitIdStr,mufUnitdescIdStr,isOut) {

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
    $rowCopyLeft.attr({"id": lftSpecrowStr + (len-1),"class":"dataRowFstFlag"}).appendTo(lftFirstColumnbodyIdStr);
    //右边明细追加,右表首行id字符串：rgtdetailrowStr,rgttblbodyIdStr
    $rowCopyRight.attr({"id": rgtDetailrowStr + (len-1),"class":"dataRowFstFlag"}).appendTo(rgtTblbodyIdStr);

    //batchEdtId($ObjCopyRight.find(":input"),len-1);zepto不支持，改用children()得到，让行下的孩子们id和name+1
    var $lftChildrens = $rowCopyLeft.children().children().children();
    //均操作左表中的商品规格下拉列表，所有复制的行下的input（select）均自动增加class属性
    //如果是出库，每个孩子（列）——商品规格下拉列表增加class属性
    if (isOut){
        //左表这新增的行
        $rowCopyLeft.find(speclstIdStr).attr({"class":"specSelectedFlag"});
        //入库
    } else{
        $rowCopyLeft.find(speclstIdStr).attr({"class":"inSpecSelectedFlag"});
    }
    var $rgtChildrens = $rowCopyRight.children().children().children();
    //false标识是新增操作，在表格最后添加一行，
    //更新该行下各个列内input元素的id和name值，与行的id和name值末尾数字一致，均为len-1
    //左边表格
    batchEdtInputIdAndNameAttr($lftChildrens,len-1,false);
    //右边表格
    batchEdtInputIdAndNameAttr($rgtChildrens,len-1,false);

    //注册删除监听事件，确保每增加的行上的删除按钮均有事件
    doOperator(delBtnClassStr,lftTblIdStr,rgtTblIdStr,speclstIdStr,unitIdStr,mufUnitdescIdStr,isOut);

    //注册该新增行中商品下拉change事件,此处this代表了商品speclst下拉列表select
    $(speclstIdStr + (len-1)).on("change", function () {
        //2018-12-05新增2个参数
        regProductChangeEvent.call(this,unitIdStr,mufUnitdescIdStr,(len-1),isOut);
    });
    //注册该新增行中计量单位下拉列表选择change事件
    $(unitIdStr + (len-1)).on("change", function () {
        regUnitChangeEvent.call(this,speclstIdStr,mufUnitdescIdStr,(len-1),isOut);
    });

    //注册出/入库单价、数量下拉列表失去焦点事件20181211,OK
    $("#inunitprice"+(len-1)+","+"#incounts"+(len-1)).on("focusout",function () {
        updatePriceValue((len-1),isOut);
        caculateTotalPrice(isOut);//计算总额
    });
    $("#unitprice"+(len-1)+","+"#counts"+(len-1)).on("focusout",function () {
        updatePriceValue((len-1),isOut);
        caculateTotalPrice(isOut);//计算总额事件注册
    });
    //新增按钮后，清零各输入框，更新总价
    clearPrice((len-1), isOut);
    caculateTotalPrice(isOut);//计算总价
}

//某一行上的所有列Cols集合（td）内的input元素遍历操作，此处不区分左右表
// $obj标识该行列元素的集合，例如右边表格列索引：0——第1列（厂家），1——第2列（单位）
//在所选对象上使用each方法，把id和name属性重新编号，用于新增行和删除行时更新
//假定找到了所有包含id属性的jquery对象jq.find(":input"),所有input元素
//$obj是所有某行下所有的列td下的input元素构成的集合,tableIndex是所在行索引
//tableIndex表格行索引，传入表格行索引号
//isDelOper布尔值，标识是否是删除操作，否则就是新增操作
function batchEdtInputIdAndNameAttr($obj, tableIndex, isDelOper){
    $obj.each(function (index) {
        //每一个id属性要修改，逐个遍历
        //找到原来的id值和name值
        var id_old = $(this).attr("id");
        var name_old = $(this).attr("name");
        //如果是删除操作（点击删除按钮时），isDelOper传入true值
        if(isDelOper){
            var idLen = id_old.length;
            var nameLen = name_old.length;
            //截取除最后一个数字之外的字符串，然后拼接新的数字得到新编号ID
            id_old = id_old.substr(0,idLen-1);
            name_old = name_old.substr(0,nameLen-1);
            $(this).attr({"id":id_old+tableIndex,"name":name_old+tableIndex});
        }else{
            //否则就是新增操作（点击添加规格按钮时）
            //更新为新的id和name
            $(this).attr({"id":id_old+tableIndex,"name":name_old+tableIndex});
            //左边表格仅此1列，索引为0
            //右边表格计量单位那个this行的option属性设置默认为片，计量单位索引为1(第2列)
            if(1==index){
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
        id_old = id_old.substr(0,idLen-1);
        if(name_old!=null){
            nameLen = name_old.length;
            name_old = name_old.substr(0,nameLen-1);
        }
        //更新为新的id和name，末尾从1开始自增编号
        $(this).attr({"id":id_old+(index+1),"name":name_old+(index+1)});

        //更新当前这一行下面的子元素（表单输入控件input）的ID和name，
        // 此处不分左右表，因为$obj已经确定是左还是右
        var inputChildrens = $(this).children().children().children();
        //删除按钮执行时，更新该行下子输入元素的id和name值，true标识为是删除操作，false则为新增操作
        //该行下的所有列inputChildrens元素的id和name值末尾也从1开始编号，保证列中的末尾数字和该行末尾
        //数字均为同一个数。
        batchEdtInputIdAndNameAttr(inputChildrens,(index+1),true);
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
function caculatePrice(unit,counts,unitPrice,length) {
    //非空判断，数据合法性判断
    var isCountsInputPassed = REGEXPR_DBDECIMAL_NUM.test(counts) || REGEXPR_INTEGER.test(counts);
    var isUnitPriceInputPassed = REGEXPR_DBDECIMAL_NUM.test(unitPrice) || REGEXPR_INTEGER.test(unitPrice);
    //if(""!=counts && ""!=unitPrice){
    if(isCountsInputPassed && isUnitPriceInputPassed){
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
    }else {
        //$.alert("数量和单价输入必须是数字！")
        return 0;
    }
}
