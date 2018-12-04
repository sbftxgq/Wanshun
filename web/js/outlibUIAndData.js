//outLibDate送货日期
//获取当前日期，格式YYYY-MM-DD
function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}

//初始化部分UI控件的值和显示/隐藏
//初始化进货管理的商品规格下拉列表，调用Ajax，取得模板类型下的数据更新到下拉列表
getSpecListByCategoryID("00");
//为送货日期填写默认值为当前系统时间
$("#outLibDate").val(getNowFormatDate());
//进货日期填写默认值为当前系统时间
$("#inLibDate").val(getNowFormatDate());
$("#transitItem").hide();
$("#shipItem").hide();
$("#actualTotalItem").hide();//默认隐藏实付总额
$("#mufunitdesc").hide();//默认隐藏单位说明
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
})

$("[name='_unit']").on("click", function () {

    switch (this.value) {
        case "bunch":
            $("#perUnitItem").show();
            break;
        default:
            $("#perUnitItem").hide();
    }
});

//以下代码用于控制商品明细表格
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

//页面加载后注册按钮监听
onload = function () {
    doOperator();
}

//Ajax请求，动态构商品规格建选择列表
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

//进货管理页，取得所有商品类型列表00,01,02
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

function getSpecListByCategoryID(categoryID) {
    $.ajax({
        url : "GetSpecListByCategoryID",
        dataType: "json",   //返回格式为json
        async: true,//请求是否异步，默认为异步，这也是ajax重要特性
        data:{"categoryId":categoryID},    //请求参数值,默认是模板
        type: "GET",   //请求方式
        success: function (data) {
            var optionStr = "";
            //请求成功时处理
            if (null!=data) {
                var len = data.length;
                //动态生成<select>下面的Option
                for (var i = 0; i < len; i++) {
                    optionStr = optionStr + "<option value='" + data[i].specificationId + "' >" + data[i].specificationName + "</option>"
                }
                //数据追加到下拉列表（追加前要清空原列表）
                $("#inspeclst").empty();//先清空所有孩子
                $("#inspeclst").append(optionStr);
            }else{
                optionStr = "<option>--没有该商品类型的数据--</option>"
                $("#inspeclst").empty();//先清空所有孩子
                $("#inspeclst").append(optionStr);
            }
        }
    });
}

//执行删除操作
function doOperator() {
    //取得删除按钮DOM对象，两个表格处于同一行上只有一个删除按钮，此按钮删除2个表格上的同一行
    var dels = getDomObj(".del");
    var currentIndex = 0;
    var dataTableRows = 0;
    for (var i = 0; i < dels.length; i++) {
        dels[i].onclick = function () {
            currentIndex = this.parentNode.parentNode.rowIndex;
            if (currentIndex === 1) {
                $.alert("抱歉，首行不能删除！");
                return;
            }
            $.confirm('是否确定删除？', function () {
                //双击弹出的OK对话框会出现两次执行后面的回调函数问题，导致索引越界
                dataTableRows = getDomObj("#goodstbl").rows.length;
                if (currentIndex < dataTableRows) {
                    //左边固定表
                    getDomObj("#firstcolumn").deleteRow(currentIndex);
                    //右边明细表
                    getDomObj("#goodstbl").deleteRow(currentIndex);
                }
            });
        }
    }
}

//增加表格的行,第二表格计量单位复位为0——第一个选中索引为0
function addRow() {
    var len = getDomObj("#goodstbl").rows.length; //table取到所有的行
    if (len >= 6) {
        $.alert("最多为5个商品规格！");
        return;
    }
    //2018-11-24直接用JQuery(zepto)克隆，完成行的插入。左边固定表格id为specrow
    // 2018-11-25第二表格id值detailrow不变
    //第一，克隆对象保存（第二个表的首行被复制）
    var $ObjCopyRight = $("#detailrow").clone(true);//右侧表格首行复制
    var $ObjCopyLeft = $("#specrow").clone(true);//固定左侧表格首行复制
    //console.log($ObjCopyLeft);
    //console.log($ObjCopyLeft[0]);
    //console.log($ObjCopyRight[0]);
    //左边固定例追加
    $ObjCopyLeft.attr("id", "specrow" + (len - 1)).appendTo("#firstcolumnbody");
    //右边明细追加
    $ObjCopyRight.attr("id", "detailrow" + (len - 1)).appendTo("#goodstblbody");

    //第二，修改克隆对象的某些属性
    //查找id为speclst的元素，修改其id为递增新id，并新增name属性，用于将来表单提交
    //每克隆一行，在复制的对象中修改name属性和的id属性
    //商品列表
    $ObjCopyLeft.find("#speclst").attr({"id": "speclst" + (len - 1), "name": "speclst" + (len - 1)});
    //厂商列表
    $ObjCopyRight.find("#manuflst").attr({"id": "manuflst" + (len - 1), "name": "manuflst" + (len - 1)});
    //单位列表
    var $selectObj = $ObjCopyRight.find("#unit");//找到select这个DOM
    //修改其select对象ID属性为新的ID
    $selectObj.attr({"id": "unit" + (len - 1), "name": "unit" + (len - 1)});
    //单位列表设置第一个option为选中，清除以前任何选择的selected属性
    //先清除，后选中
    $selectObj.find("option").removeAttr("selected");
    $selectObj.find("option[value='piece']").attr("selected", "selected");
    //数量输入框
    $ObjCopyRight.find("#counts").attr({"id": "counts" + (len - 1), "name": "counts" + (len - 1)});
    //单价输入框
    $ObjCopyRight.find("#unitprice").attr({"id": "unitprice" + (len - 1), "name": "unitprice" + (len - 1)});
    //总价（该项售价输入框）
    $ObjCopyRight.find("#price").attr({"id": "price" + (len - 1), "name": "price" + (len - 1)});

    //注册删除监听事件
    doOperator();

    //注册商品下拉change事件,此处this代表了商品speclst下拉列表select
    $("#speclst" + (len - 1)).on("change", function () {
        regProductChangeEvent.call(this, (len - 1));
    });

    //注册计量单位下拉列表选择change事件
    $("#unit" + (len - 1)).on("change", function () {
        regUnitChangeEvent.call(this, (len - 1));
    });

}

//销售管理商品规格下拉列表事件（改变类型，自动改变计量单位）
$("#speclst").on("change", function () {
    regProductChangeEvent.call(this, "");
});

//销售管理单位下拉列表选择事件
$("#unit").on("change", function () {
    regUnitChangeEvent.call(this, "");
});

//进货入库商品类型下拉列表改变事件，改变一次，Ajax获取一次商品规格列表
$("#incategorysel").on("change",function () {
    //取得当前选中项的value值，以此值为查询关键字发送Ajax查询请求
    //console.log(this.value);//00、01、02、...
    //更新进货入库商品规格下拉列表
    getSpecListByCategoryID(this.value);
});


function regProductChangeEvent(eleIndex) {
    var currentSelect = this;//选中的商品下拉列表
    //console.log(currentSelect.id);
    //找到选中的项option
    var checkedOption = $(currentSelect).find("option:checked");
    //查找选中项的属性
    var productType = checkedOption.attr("ptype");//商品类型：00或01
    var mufangLength = checkedOption.attr("palength");//木方规格：0.06或0.07,单位：米
    var $unitSelectedObj = $("#unit" + eleIndex);

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
            if(isShowUnitdesc()){
                $("#mufunitdesc").show();//显示单位说明
            }else {
                $("#mufunitdesc").hide();//隐藏单位说明
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
            $("#mufunitdesc").show();//显示单位说明
    }
    //$.alert($unitSelectedObj.val());
}

function regUnitChangeEvent(eleIndex) {

    var $currentSelect = $(this);//单位下拉列表当前对象
    //console.log(currentSelect.id);
    //找到计量单位列表选中的项option
    var checkedOption = $currentSelect.find("option:checked");
    //查找选中项的值
    var selectedValue = checkedOption.val();//所选单位的值
    //$.alert(selectedValue);//bunch5
    //如果此时选中的商品规格的type是00——模板，只能是单位片，不能是其它单位
    //找到商品规格select选择的type值
    var $productSelectObj = $("#speclst" + eleIndex);
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
    }else{
        switch (selectedValue) {
            //单位是木方计量单位，利用case穿透，这些选择均正确
            case "bunch5":
            case "bunch4":
                $("#mufunitdesc").show();//显示单位说明
                break;
            case "meter":
            case "stere":
                if(isShowUnitdesc()){
                    $("#mufunitdesc").show();//显示单位说明
                }else {
                    $("#mufunitdesc").hide();//隐藏单位说明
                }
                break;
            default:
                $.alert("选择无效，木方计量单位不能选‘片’，请选择正确的单位！");
                //木方具体规格5*7-0.07和4*6-0.06方，最佳匹配
                if ("0.07" == currentSelectedAlen) {
                    $currentSelect.find("option[value='bunch4']").prop("selected", "selected");
                    $("#mufunitdesc").show();//显示单位说明
                } else {
                    //4*6方——5根每把
                    $currentSelect.find("option[value='bunch5']").prop("selected", "selected");
                    $("#mufunitdesc").show();//显示单位说明
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