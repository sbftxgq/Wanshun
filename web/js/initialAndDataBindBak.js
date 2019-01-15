//初始化部分UI控件的值和显示/隐藏
//初始化进货管理的商品规格下拉列表，调用Ajax，取得模板类型下的数据更新到下拉列表
//getSpecListByCategoryID("00");//2018-12-05取消
//为送货日期填写默认值为当前系统时间
$("#outLibDate").val(getNowFormatDate());
//进货日期填写默认值为当前系统时间
$("#inLibDate").val(getNowFormatDate());
$("#transitItem").hide();
$("#shipItem").hide();
$("#actualTotalItem").hide();//默认隐藏实付总额
$("#mufunitdesc").hide();//默认隐藏单位说明
$("#inmufunitdesc").hide();//默认隐藏单位说明
//运输方式下拉列表change事件，自送模式下，隐藏显示运输和装卸费
$("#outLibWay").on("change", function () {
    //alert(this.selectedIndex);//0-自送,1-他送,2-自提
    switch (this.selectedIndex) {
        // 他送，显示运费和装卸费
        case 1:
            $("#transitItem").show();
            $("#shipItem").show();
            break;
        //自提,隐藏运费和装卸费,case穿透
        case 2:
        //缺省为0-自送，隐藏运费和装卸费
        default:
            $("#transitItem").hide();
            $("#shipItem").hide();
            break;
    }
});
//是否已付按钮切换事件
$("#isPayed").on("click", function () {
    if (this.checked) {
        //alert("checked。。")
        $("#actualTotalItem").show();
    } else {
        //alert("dsds")
        $("#actualTotalItem").hide();
    }
});

//销售管理添加商品明细的按钮事件注册
$("#outAddRowBtn").on("click", function () {
    addRow(".del", "#firstcolumn", "#goodstbl", "#specrow", "#detailrow",
        "specrow", "#firstcolumnbody", "detailrow", "#goodstblbody",
        "#speclst", "#unit", "#mufunitdesc");
});

//进货管理添加商品明细的按钮事件注册，在原出库id名称前加上“in”
$("#inAddRowBtn").on("click", function () {
    addRow(".inDel", "#infirstcolumn", "#ingoodstbl", "#inspecrow", "#indetailrow",
        "inspecrow", "#infirstcolumnbody", "indetailrow", "#ingoodstblbody",
        "#inspeclst", "#inunit", "#inmufunitdesc");
});

//页面加载后注册按钮监听
onload = function () {
    //doOperator();
    //出库：执行删除操作注册监听,参数1：删除按钮的class名，参数2：左表ID，参数3：右表ID，参数4：木方单位说明ID
    doOperator(".del", "#firstcolumn", "#goodstbl", "#speclst", "#unit", "#mufunitdesc");
    //入库
    doOperator(".inDel", "#infirstcolumn", "#ingoodstbl", "#inspeclst", "#inunit", "#inmufunitdesc");
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
/*
//进货管理页，取得所有商品类型列表00,01,02。2018-12-05合并到表格中，取消获取类别
$.ajax({
    url: "GetCategoryList",    //请求的url地址
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
            optionStr = optionStr + "<option value='" + data[i].categoryId + "'>" + data[i].categoryName + "</option>"
        }
        //进货管理中的商品类型列表
        $("#incategorysel").append(optionStr);
    }
});
*/
/*
//2018-12-05取消联动
function getSpecListByCategoryID(categoryID) {
    $.ajax({
        url: "GetSpecListByCategoryID",
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data: {"categoryId": categoryID},    //请求参数值,默认是模板
        type: "GET",   //请求方式
        success: function (data) {
            var optionStr = "";
            //请求成功时处理
            if (null != data) {
                var len = data.length;
                //动态生成<select>下面的Option
                for (var i = 0; i < len; i++) {
                    optionStr = optionStr + "<option value='" + data[i].specificationId + "' >" + data[i].specificationName + "</option>"
                }
                //数据追加到下拉列表（追加前要清空原列表）
                $("#inspeclst").empty();//先清空所有孩子
                $("#inspeclst").append(optionStr);
            } else {
                optionStr = "<option>--没有该商品类型的数据--</option>"
                $("#inspeclst").empty();//先清空所有孩子
                $("#inspeclst").append(optionStr);
            }
        }
    });
}
*/
/*
//2018-12-05取消
//进货入库商品类型下拉列表改变事件，改变一次，Ajax获取一次商品规格列表
$("#incategorysel").on("change", function () {
    //取得当前选中项的value值，以此值为查询关键字发送Ajax查询请求
    //console.log(this.value);//00、01、02、...
    //更新进货入库商品规格下拉列表
    getSpecListByCategoryID(this.value);
});
*/
//销售管理商品规格下拉列表事件（改变类型，自动改变计量单位）
$("#speclst").on("change", function () {
    regProductChangeEvent.call(this,"#unit","#mufunitdesc","");
});
//销售管理单位下拉列表选择事件（改变类型时，判断单位是否合法，符合规格类型）
$("#unit").on("change", function () {
    regUnitChangeEvent.call(this,"#speclst","#mufunitdesc","");
});
//进货管理商品规格下拉列表事件（改变类型，自动改变计量单位）
$("#inspeclst").on("change", function () {
    regProductChangeEvent.call(this,"#inunit","#inmufunitdesc","");
});
//进货管理单位下拉列表选择事件（改变类型时，判断单位是否合法，符合规格类型）
$("#inunit").on("change", function () {
    regUnitChangeEvent.call(this,"#inspeclst","#inmufunitdesc","");
});

//注册产品改变change事件
function regProductChangeEvent(unitIdStr,mufUnitdescIdStr,eleIndex) {
    var currentSelect = this;//选中的商品下拉列表
    console.log(currentSelect.id);
    //找到选中的项option
    var checkedOption = $(currentSelect).find("option:checked");
    //查找选中项的属性
    var productType = checkedOption.attr("ptype");//商品类型：00或01
    var mufangLength = checkedOption.attr("palength");//木方规格：0.06或0.07,单位：米
    console.log("单位ID选择器："+unitIdStr+eleIndex);
    var $unitSelectedObj = $(unitIdStr + eleIndex);
    console.log($unitSelectedObj)
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
            if (isShowUnitdesc()) {
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
    $.alert($unitSelectedObj.val());
}

//注册单位选择change事件
function regUnitChangeEvent(speclstIdStr,mufUnitdescIdStr,eleIndex) {

    var $currentSelect = $(this);//单位下拉列表当前对象
    //console.log(currentSelect.id);
    //找到计量单位列表选中的项option
    var checkedOption = $currentSelect.find("option:checked");
    //查找选中项的值
    var selectedValue = checkedOption.val();//所选单位的值
    //$.alert(selectedValue);//bunch5
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
                $(mufUnitdescIdStr).show();//显示单位说明
                break;
            case "meter":
            case "stere":
                if (isShowUnitdesc()) {
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
        }
    }
}

function isShowUnitdesc() {
    //第二个表和第一个表数据行数一样，此数据用于获得索引
    //var dataTableRows = getDomObj("#goodstbl").rows.length;
    //class选择器，选择所有的select元素，构成的集合，每个select默认选中的项其属性值为
    /*$(".specSelectedFlag").each(function () {
        //每一个select标签上遍历
        //console.log($(this).find("option:checked").attr("ptype"));//00
    });*/
    var flag = false;
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
    return flag;
}