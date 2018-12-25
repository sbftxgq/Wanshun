//初始化部分UI控件的值和显示/隐藏
//初始化进货管理的商品规格下拉列表，调用Ajax，取得模板类型下的数据更新到下拉列表
//getSpecListByCategoryID("00");//2018-12-05取消
//为送货日期填写默认值为当前系统时间
$("#outLibDate").val(getNowFormatDate("-"));
//进货日期填写默认值为当前系统时间
$("#inLibDate").val(getNowFormatDate("-"));
$("#transitItem").hide();
$("#shipItem").hide();
$("#transitFare").val("0");//出库运费默认填写为0
$("#shipFare").val("0");//出库装卸费默认填写为0
$("#actualTotalItem").hide();//默认隐藏实付总额
$("#actualTotalPrice").val("0");//实收总额默认为0
$("#mufunitdesc").hide();//默认隐藏单位说明
$("#inmufunitdesc").hide();//默认隐藏单位说明
//运输方式下拉列表change事件，自送模式下，隐藏显示运输和装卸费
$("#outLibWay").on("change", function () {
    //alert(this.selectedIndex);//0-自送,1-他送,2-自提
    switch (this.selectedIndex) {
        // 他送，显示运费和装卸费，要求用户输入，清空默认0
        case 1:
            $("#transitItem").show();
            $("#transitFare").val("");//运费清空
            $("#shipItem").show();
            $("#shipFare").val("");//装卸费清空
            IS_TASONG = true;//标识他送为true
            break;
        //自提,隐藏运费和装卸费,case穿透
        case 2:
        //缺省为0-自送，隐藏运费和装卸费，且值默认填入0
        default:
            $("#transitItem").hide();
            $("#transitFare").val("0");//运费默认填写为0
            $("#shipItem").hide();
            $("#shipFare").val("0");//装卸费默认填写为0
            IS_TASONG = false;//标识他送为false
            break;
    }
});
//是否已付按钮切换事件
$("#isPayed").on("click", function () {
    //已付，则打开显示，要求输入已付金额
    if (this.checked) {
        //alert("checked。。")
        $("#actualTotalItem").show();
        //清空默认的0
        $("#actualTotalPrice").val("");//实收总额清空
        IS_PAYED = true;
    } else {
        //alert("dsds")未付，默认填入0
        $("#actualTotalItem").hide();
        $("#actualTotalPrice").val("0");//实收总额默认为0
        IS_PAYED = false;
    }
});

//销售管理添加商品明细的按钮事件注册,true标识是出库操作，最后一个参数isOut传入参数值为true
$("#outAddRowBtn").on("click", function () {
    addRow(".del", "#firstcolumn", "#goodstbl", "#specrow", "#detailrow",
        "specrow", "#firstcolumnbody", "detailrow", "#goodstblbody",
        "#speclst", "#unit", "#mufunitdesc",true);
});

//进货管理添加商品明细的按钮事件注册，在原出库id名称前加上“in”，false标识为入库操作，传入isOut参数值为false
$("#inAddRowBtn").on("click", function () {
    addRow(".inDel", "#infirstcolumn", "#ingoodstbl", "#inspecrow", "#indetailrow",
        "inspecrow", "#infirstcolumnbody", "indetailrow", "#ingoodstblbody",
        "#inspeclst", "#inunit", "#inmufunitdesc",false);
});

//页面加载后注册按钮监听
onload = function () {
    //取得最新的入库单号和出库单号
    //参数1：请求的URL地址，参数2：界面显示控件的ID字符串
    getLatestBillNo("GetLatestInLibBillNo","#inBillNo");//入库
    getLatestBillNo("GetLatestOutLibBillNo","#billNo");//出库
    //doOperator();
    //出库：执行删除操作注册监听,
    // 参数1：删除按钮的class名，参数2：左表ID，参数3：右表ID，
    // 参数4：规格下拉列表ID,参数5：单位下拉列表ID,参数6：木方单位说明ID,参数7：出/入库标志，出库为true
    doOperator(".del", "#firstcolumn", "#goodstbl", "#speclst", "#unit", "#mufunitdesc",true);
    //入库
    doOperator(".inDel", "#infirstcolumn", "#ingoodstbl", "#inspeclst", "#inunit", "#inmufunitdesc",false);
}

//Ajax请求，动态构商品规格建选择列表，进货和销售的规格列表均使用此函数获取
$.ajax({
    url: "GetSpecList",    //请求的url地址
    dataType: "json",   //返回格式为json
    async: true,//请求是否异步，默认为异步，这也是ajax重要特性
    //data:{"id":"value"},    //请求参数值
    type: "GET",   //请求方式
    success: function (data) {
        //请求成功时处理
        var len = data.length;
        var optionStr = "";
        //$.alert("Ajax请求成功：" + data[0].specificationName);
        //$.alert("Ajax请求成功：" + len);//17
        //动态生成<select>下面的Option
        for (var i = 0; i < len; i++) {
            optionStr = optionStr + "<option value='" + data[i].specificationId + "' ptype='" + data[i].categoryId + "'plength='" + data[i].length + "' palength='" + data[i].arealength + "'>" + data[i].specificationName + "</option>"
        }
        $("#speclst").append(optionStr);
        //2018-12-05新增，进货中的规格列表
        $("#inspeclst").append(optionStr);
    }
});

//取得厂商列表
$.ajax({
    url: "GetManufactureLst",    //请求的url地址
    dataType: "json",   //返回格式为json
    async: true,//请求是否异步，默认为异步，这也是ajax重要特性
    //data:{"id":"value"},    //请求参数值
    type: "GET",   //请求方式
    success: function (data) {
        //请求成功时处理
        var len = data.length;
        var optionStr = "";
        //动态生成<select>下面的Option
        for (var i = 0; i < len; i++) {
            optionStr = optionStr + "<option value='" + data[i].manufacturerId + "'>" + data[i].manufacturerName + "</option>"
        }
        //进货管理中的厂商列表
        $("#inmanuflst").append(optionStr);
        //销售管理表格中的option
        $("#manuflst").append(optionStr);
    }
});

//取得进货单编号最新值（该方法在页面加载完成后执行一次，然后入库成功后执行一次，更新显示单号）
function getLatestBillNo(url,billNoIdStr){
    var gettings = {
        url: url,    //请求的url地址
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        //data:{"id":"value"},    //请求参数值
        type: "GET",   //请求方式
        //无论有无billNO，有则为实际数据，无则为null
        success: function (data) {
            //console.log(data);//{billNo: "null"}
            if("null"==data.billNo){
                //第一次请求，数据库中billNo为null，进货单号自动填写为年月日+001
                //进货单号默认日期+3位自增数字,首先读取数据库得到单号，然后最后三位数自增1填入该输入框
                //例如进货单号：20181208001，前8位为日期2018-12-08，后3位流水号001，流水号自增1，每入库一单增1
                //20181217修改为“年+7位数字流水”，一共11位
                $(billNoIdStr).val(new Date().getFullYear()+"0000001");
            }else {
                //表明有billNo数据，且是数据库中最新的，进货单号为年月日+billNo+1
                //取得数据库billNo
                var billNo = data.billNo;
                //截取后7个字符串
                billNo = billNo.substr(4,7);//一共11位数字字符串，截取索引为4开始的后面7个字符串
                //转换为整数然后自增1，之后再前补零
                var newBillNo = parseInt(billNo,10)+1;//转换为10进制整数，再加1
                //prefixInteger函数参数1为待补零数字，参数2为数字位数，即3位流水号
                $(billNoIdStr).val(new Date().getFullYear()+prefixInteger(newBillNo,7));
            }
        }
    };
    //ajax取得进货单号并自增1
    $.ajax(gettings);
};
//console.log(prefixInteger(4,4));//string
//首行事件注册
//销售管理商品规格下拉列表事件（改变类型，自动改变计量单位），true标识出库
$("#speclst").on("change", function () {
    regProductChangeEvent.call(this, "#unit", "#mufunitdesc", "",true);
});
//销售管理单位下拉列表选择事件（改变类型时，判断单位是否合法，符合规格类型）
$("#unit").on("change", function () {
    //单位下拉列表改变事件，this代表了regUnitChangeEvent方法当前调用者，此处就是$("#unit")的子集元素；
    // 参数1：当前行的规格下拉列表字符串ID，参数2：木方单位说明字符串ID；
    // 参数3：行索引号（首行为空串），参数4：出/入库标志，出库为true
    regUnitChangeEvent.call(this, "#speclst", "#mufunitdesc", "",true);
});
//进货管理商品规格下拉列表事件（改变类型，自动改变计量单位），false标识入库
$("#inspeclst").on("change", function () {
    regProductChangeEvent.call(this, "#inunit", "#inmufunitdesc", "",false);
});
//进货管理单位下拉列表选择事件（改变类型时，判断单位是否合法，符合规格类型）
$("#inunit").on("change", function () {
    regUnitChangeEvent.call(this, "#inspeclst", "#inmufunitdesc", "",false);
});

//入库单价、数量输入失去焦点后触发事件，false标识入库
$("#inunitprice,#incounts").on("focusout",function () {
    updatePriceValue("",false);
    caculateTotalPrice(false);//计算总额
});

//出库单价、数量输入失去焦点后触发事件，true表示出库
$("#unitprice,#counts").on("focusout",function () {
    updatePriceValue("",true);
    caculateTotalPrice(true);//计算总额
});

function updatePriceValue(eleIndex,isOut) {
    if(isOut){
        $("#price"+eleIndex).val(caculatePrice($("#unit"+eleIndex).val(),$("#counts"+eleIndex).val(),$("#unitprice"+eleIndex).val(),$("#speclst"+eleIndex).find("option:checked").attr("plength")));
    }else {
        $("#inprice"+eleIndex).val(caculatePrice($("#inunit"+eleIndex).val(),$("#incounts"+eleIndex).val(),$("#inunitprice"+eleIndex).val(),$("#inspeclst"+eleIndex).find("option:checked").attr("plength")));
    }
}

function caculateTotalPrice(isOut) {
    var totalPrice = 0;
    //出库
    if (isOut){
        //遍历表格中所有的销售金额列
        $(".caculateTotalPriceFlag").each(function () {
            totalPrice+=parseFloat($(this).val());
        });
        $("#totalPrice").val(totalPrice);
    } else{
        //入库
        //遍历表格中所有的进货金额列
        $(".inCaculateTotalPriceFlag").each(function () {
            totalPrice+=parseFloat($(this).val());
        });
        $("#inTotalPrice").val(totalPrice);
    }
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
function regUnitChangeEvent(speclstIdStr, mufUnitdescIdStr, eleIndex,isOut) {

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
                updatePriceValue(eleIndex,isOut);
                caculateTotalPrice(isOut);
                $(mufUnitdescIdStr).show();//显示单位说明
                break;
            case "meter":
            case "stere":
                //更新价格
                updatePriceValue(eleIndex,isOut);
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
                updatePriceValue(eleIndex,isOut);
                caculateTotalPrice(isOut);
        }
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
    }else{
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
    if(isOut){
        $("#counts"+eleIndex).val("");//清空数量
        $("#unitprice"+eleIndex).val("");//清空单价
        $("#price"+eleIndex).val("0");//清0计算的价格
    }else {
        //进货管理页
        $("#incounts"+eleIndex).val("");//清空数量
        $("#inunitprice"+eleIndex).val("");//清空单价
        $("#inprice"+eleIndex).val("0");//清0价格
    }
}