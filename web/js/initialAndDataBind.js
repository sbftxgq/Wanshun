//正则表达式常量
//两位小数
var REGEXPR_DBDECIMAL_NUM = /^-?\d+\.?\d{0,2}$/;

//必须输入
var REGEXPR_NEEDINPUT = /^\S+$/;

//正整数
var REGEXPR_INTEGER = /^\d+$/;
//是否是他送
var IS_TASONG = false;
//是否已付
var IS_PAYED = false;

//入库单查询方式
var IN_QUERY_WAY = "ALL";//默认检索全部入库单,单击查询按钮首次加载时为日期范围“DTR”

//出库单查询方式
var OUT_QUERY_WAY = "ALL";//默认检索全部出库单,单击查询按钮首次加载时为日期范围“DTR”

// 入库单加载flag
var IN_QUERY_LOADING = false;
//出库单加载flag
var OUT_QUERY_LOADING = false;

// 每次加载添加多少条目
var PAGE_SIZE = 5;//itemsPerLoad

//入库单检索结果当前页
var PAGE_NOW = 0;
//出库单检索结果当前页
var OUT_PAGE_NOW = 0;
// 最多可加载的条目（取决于数据库一次查询的数据条数，已经封装到接收对象的total属性中）
var CURRENT_TOTAL = 0;//var maxItems = 100;
//出库单该单条件一次查询总结果
var OUT_CURRENT_TOTAL = 0;

var CURRENT_PAGE = 1;//当前页码，从第1页开始
//出库单当前页
var OUT_CURRENT_PAGE = 1;

var IS_CACULATED_PRICE = true;

//初始化部分UI控件的值和显示/隐藏
//初始化进货管理的商品规格下拉列表，调用Ajax，取得模板类型下的数据更新到下拉列表
//getSpecListByCategoryID("00");//2018-12-05取消
//为送货日期填写默认值为当前系统时间
$("#outLibDate").val(getNowFormatDate("-"));
//进货日期填写默认值为当前系统时间
$("#inLibDate").val(getNowFormatDate("-"));
//入库单查询日期控件初始填写
$("#inQryLibDateStrt").val(getNowFormatDate("-"));
$("#inQryLibDateEnd").val(getNowFormatDate("-"));
//出库单查询日期控件初始填写
$("#outQryLibDateStrt").val(getNowFormatDate("-"));
$("#outQryLibDateEnd").val(getNowFormatDate("-"));

$("#transitItem").hide();
$("#shipItem").hide();
$("#transitFare").val("0");//出库运费默认填写为0
$("#shipFare").val("0");//出库装卸费默认填写为0
$("#actualTotalItem").hide();//默认隐藏实付总额
$("#actualTotalPrice").val("0");//实收总额默认为0
$("#mufunitdesc").hide();//默认隐藏单位说明
$("#inmufunitdesc").hide();//默认隐藏单位说明
$("#inQrySpecItem").hide();//默认隐藏商品规格查询字段（下拉列表）
//出库单管理页默认隐藏客户名称、送货地点、商品规格查询字段
$("#outGstnameForHide").hide();
$("#outDstForHide").hide();
$("#outQrySpecItem").hide();

//使用debounce防止重复加载
var lazyOutInfiniteHandler = _.debounce(outInfiniteHandler, 300);
// 注册'infinite'事件处理函数
$("#outcomediv").on('infinite', lazyOutInfiniteHandler);

//使用debounce防止重复加载
var lazyInfiniteHandler = _.debounce(infiniteHandler, 300);
// 注册'infinite'事件处理函数
$("#incomediv").on('infinite', lazyInfiniteHandler);

//入库查询起始、结束日期改变、规格下拉列表规格改变change事件(有3个对象)
//移动到点击查询按钮事件中统一置零
$(".forChange").on("change", function () {
    //查询字段值改变
    //$.alert("change事件后的值："+$(this).val());//OK
    //PAGE_NOW置零
    //PAGE_NOW = 0;
    // 注销无限加载事件，以防别的选项监听还在发生不必要的加载，原'.infinite-scroll'
    $.detachInfiniteScroll($("#inQryScrollContainer"));
    // 隐藏加载提示符
    $("#inQryPreloader").hide();
});

$(".forPageInit").on("click", function (e) {

    //如果是苹果设备，需要刷新浏览器，其它则不需要刷新
    //$.alert($.device.android+","+$.device.ipad+","+$.device.ios);
    if ($.device.ipad || $.device.ios) {
        //$.toast(e.currentTarget);
        window.open(e.currentTarget, "_self");
        window.location.reload(e.currentTarget);
    }
});

//入库单据查询字段下拉列表事件
$("#inQueryWay").on("change", function () {
    //改变查询方式时，PAGE_NOW置零
    //PAGE_NOW = 0;//移动到点击查询按钮后统一置零
    //重新注册滚动事件加载监听(规格改变也要注册)，统一移动到点击查询按钮事件中注册
    //$.attachInfiniteScroll($('.infinite-scroll'));
    switch (this.selectedIndex) {
        //进货日期
        case 0:
            //$.alert(this.value);
            IN_QUERY_WAY = this.value;//默认DTR(DaTe Range)
            //隐藏规格
            $("#inQrySpecItem").hide();
            //显示日期
            $(".forHide").show();
            $("#btnForHide").show();
            // 注销无限加载事件，以防别的选项监听还在发生不必要的加载
            $.detachInfiniteScroll($("#inQryScrollContainer"));
            // 隐藏加载提示符
            $("#inQryPreloader").hide();
            break;
        //商品规格
        case 1:
            //$.alert(this.value);
            IN_QUERY_WAY = this.value;//SID
            //显示商品规格
            $("#inQrySpecItem").show();
            //隐藏起始、结束日期
            $(".forHide").hide();
            $("#btnForHide").show();
            // 注销无限加载事件，以防别的选项监听还在发生不必要的加载
            $.detachInfiniteScroll($("#inQryScrollContainer"));
            // 隐藏加载提示符
            $("#inQryPreloader").hide();
            break;
        //所有，全部隐藏
        default:
            //$.alert(this.value);
            IN_QUERY_WAY = this.value;//ALL
            //隐藏
            $("#inQrySpecItem").hide();
            //隐藏
            $(".forHide").hide();
            $("#btnForHide").hide();
            //发起检索所有（发送Ajax）
            //查询前清空表格行（除了首行）
            $("#inQryIncometblbody").empty();

            PAGE_NOW = 0;//这样发起了查询，置零
            CURRENT_PAGE = 1;//复位
            //重新注册监听
            $.attachInfiniteScroll($("#inQryScrollContainer"));//原$('.infinite-scroll')
            // 显示加载提示符,原：'.infinite-scroll-preloader'
            $("#inQryPreloader").show();
            queryInLibBill(IN_QUERY_WAY, PAGE_NOW, PAGE_SIZE);
    }
});

//出库单据查询字段选择依据下拉列表change事件
$("#outQueryWay").on("change", function () {

    //设置出库单查询方式
    OUT_QUERY_WAY = this.value;//DTR
    IS_CACULATED_PRICE = true;//改变出库方式查询时，重置是否计算总价布尔量
    switch (this.selectedIndex) {
        //送货日期value="DTR"
        case 0:
            //只显示送货起始、结束日期，隐藏其它
            $(".outDateForHide").show();
            //隐藏其它
            $("#outGstnameForHide").hide();
            $("#outDstForHide").hide();
            $("#outQrySpecItem").hide();
            //按钮显示
            $("#outBtnForHide").show();
            // 注销无限加载事件，以防别的选项监听还在发生不必要的加载
            $.detachInfiniteScroll($("#outQryScrollContainer"));
            // 隐藏加载提示符
            $("#outQryPreloader").hide();
            break;
        //客户名称value="GNM"
        case 1:
            $(".outDateForHide").hide();
            $("#outGstnameForHide").show();
            $("#outDstForHide").hide();
            $("#outQrySpecItem").hide();
            //按钮显示
            $("#outBtnForHide").show();
            // 注销无限加载事件，以防别的选项监听还在发生不必要的加载
            $.detachInfiniteScroll($("#outQryScrollContainer"));
            // 隐藏加载提示符
            $("#outQryPreloader").hide();
            break;

        //商品规格value="SID"
        case 2:
            $(".outDateForHide").hide();
            $("#outGstnameForHide").hide();
            $("#outDstForHide").hide();
            $("#outQrySpecItem").show();
            //按钮显示
            $("#outBtnForHide").show();
            // 注销无限加载事件，以防别的选项监听还在发生不必要的加载
            $.detachInfiniteScroll($("#outQryScrollContainer"));
            // 隐藏加载提示符
            $("#outQryPreloader").hide();
            break;
        //送货日期+客户名称value="DGNM"
        case 3:
            $(".outDateForHide").show();
            $("#outGstnameForHide").show();
            $("#outDstForHide").hide();
            $("#outQrySpecItem").hide();
            //按钮显示
            $("#outBtnForHide").show();

            // 注销无限加载事件，以防别的选项监听还在发生不必要的加载
            $.detachInfiniteScroll($("#outQryScrollContainer"));
            // 隐藏加载提示符
            $("#outQryPreloader").hide();
            break;
        //送货日期+商品规格value="DSID"
        case 4:
            $(".outDateForHide").show();
            $("#outGstnameForHide").hide();
            $("#outDstForHide").hide();
            $("#outQrySpecItem").show();
            //按钮显示
            $("#outBtnForHide").show();
            // 注销无限加载事件，以防别的选项监听还在发生不必要的加载
            $.detachInfiniteScroll($("#outQryScrollContainer"));
            // 隐藏加载提示符
            $("#outQryPreloader").hide();

            break;
        //送货日期+未付订单value="DNPY"
        case 5:
            $(".outDateForHide").show();
            $("#outGstnameForHide").hide();
            $("#outDstForHide").hide();
            $("#outQrySpecItem").hide();
            //按钮显示
            $("#outBtnForHide").show();
            // 注销无限加载事件，以防别的选项监听还在发生不必要的加载
            $.detachInfiniteScroll($("#outQryScrollContainer"));
            // 隐藏加载提示符
            $("#outQryPreloader").hide();

            break;
        //客户名称+未付订单value="GNPY"
        case 6:
            $(".outDateForHide").hide();
            $("#outGstnameForHide").show();
            $("#outDstForHide").hide();
            $("#outQrySpecItem").hide();
            //按钮显示
            $("#outBtnForHide").show();

            // 注销无限加载事件，以防别的选项监听还在发生不必要的加载
            $.detachInfiniteScroll($("#outQryScrollContainer"));
            // 隐藏加载提示符
            $("#outQryPreloader").hide();
            break;
        //日期+客户+未付订单value="DGNPY"
        case 7:
            $(".outDateForHide").show();
            $("#outGstnameForHide").show();
            $("#outDstForHide").hide();
            $("#outQrySpecItem").hide();
            //按钮显示
            $("#outBtnForHide").show();

            // 注销无限加载事件，以防别的选项监听还在发生不必要的加载
            $.detachInfiniteScroll($("#outQryScrollContainer"));
            // 隐藏加载提示符
            $("#outQryPreloader").hide();
            break;
        //未付订单value="NPY"
        case 8:
            $(".outDateForHide").hide();
            $("#outGstnameForHide").hide();
            $("#outDstForHide").hide();
            $("#outQrySpecItem").hide();
            //按钮隐藏
            $("#outBtnForHide").hide();

            //发起检索所有未付订单（发送Ajax）
            //查询前清空表格行
            $("#outQryOutcometblbody").empty();
            OUT_PAGE_NOW = 0;//这样发起了查询，置零
            OUT_CURRENT_PAGE = 1;//复位
            //重新注册监听
            $.attachInfiniteScroll($("#outQryScrollContainer"));//原$('.infinite-scroll')
            // 显示加载提示符,原：'.infinite-scroll-preloader'
            $("#outQryPreloader").show();
            queryOutLibBill(OUT_QUERY_WAY, OUT_PAGE_NOW, PAGE_SIZE);
            break;
        //列出所有value="ALL"
        default:
            $(".outDateForHide").hide();
            $("#outGstnameForHide").hide();
            $("#outDstForHide").hide();
            $("#outQrySpecItem").hide();
            //按钮隐藏
            $("#outBtnForHide").hide();

            //发起检索所有（发送Ajax）
            //查询前清空表格行
            $("#outQryOutcometblbody").empty();
            OUT_PAGE_NOW = 0;//这样发起了查询，置零
            OUT_CURRENT_PAGE = 1;//复位
            //重新注册监听
            $.attachInfiniteScroll($("#outQryScrollContainer"));//原$('.infinite-scroll')
            // 显示加载提示符,原：'.infinite-scroll-preloader'
            $("#outQryPreloader").show();
            queryOutLibBill(OUT_QUERY_WAY, OUT_PAGE_NOW, PAGE_SIZE);
    }
    //$.alert(OUT_QUERY_WAY);//ok
});

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
        "#speclst", "#unit", "#mufunitdesc", true);
});

//进货管理添加商品明细的按钮事件注册，在原出库id名称前加上“in”，false标识为入库操作，传入isOut参数值为false
$("#inAddRowBtn").on("click", function () {
    addRow(".inDel", "#infirstcolumn", "#ingoodstbl", "#inspecrow", "#indetailrow",
        "inspecrow", "#infirstcolumnbody", "indetailrow", "#ingoodstblbody",
        "#inspeclst", "#inunit", "#inmufunitdesc", false);
});

//发起入库单查询按钮事件
$("#inQryBtn").on("click", function () {
    //console.log("单击查询按钮事件前的PAGE_NOW值："+PAGE_NOW);
    //可在点击事件中将PAGE_NOW置零，这样就不用在输入改变事件中置零了
    PAGE_NOW = 0;//复位
    CURRENT_PAGE = 1;//复位
    //取得IN_QUERY_WAY 的值(IN_QUERY_WAY默认为ALL,而实际默认显示日期范围，)
    //inQueryWay这个下拉列表默认是日期范围，因此需要更新IN_QUERY_WAY的值
    //防止未点击下拉列表更改IN_QUERY_WAY而直接滚动更新
    IN_QUERY_WAY = $("#inQueryWay").val();
    //console.log("IN_QUERY_WAY的值："+IN_QUERY_WAY);
    //如果是日期范围，则校验日期顺序，初始为ALL了
    if (IN_QUERY_WAY == "DTR") {
        //日期顺序校验成功才能查询
        if (dateSequenceCheck(false)) {
            //console.log("单击查询按钮事件中PAGE_NOW置零：PAGE_NOW="+PAGE_NOW);
            //重新注册滚动事件加载监听(规格改变也要注册)
            $.attachInfiniteScroll($("#inQryScrollContainer"));//原$('.infinite-scroll')
            // 显示加载提示符
            $("#inQryPreloader").show();
            //查询前清空表格行
            $("#inQryIncometblbody").empty();
            queryInLibBill(IN_QUERY_WAY, PAGE_NOW, PAGE_SIZE);
        }
    } else {
        //console.log("单击查询按钮事件中PAGE_NOW置零：PAGE_NOW="+PAGE_NOW);
        //重新注册滚动事件加载监听(规格改变也要注册)
        $.attachInfiniteScroll($("#inQryScrollContainer"));//原$('.infinite-scroll')，现：
        // 显示加载提示符，原：'.infinite-scroll-preloader'
        $("#inQryPreloader").show();
        $("#inQryIncometblbody").empty();
        queryInLibBill(IN_QUERY_WAY, PAGE_NOW, PAGE_SIZE);
    }
});

//出库单检索按钮单击事件
$("#outQryBtn").on("click", function () {
    OUT_PAGE_NOW = 0;//复位
    OUT_CURRENT_PAGE = 1;//复位
    IS_CACULATED_PRICE = true;//改变出库字段值时，重置是否计算总价布尔量
    OUT_QUERY_WAY = $("#outQueryWay").val();
    //console.log("OUT_QUERY_WAY的值：" + OUT_QUERY_WAY);
    //$.alert("单击事件...")
    //输入关键字验证通过
    if (qryInputCheck(OUT_QUERY_WAY, true)) {
        //debugger;
        //重新注册滚动事件加载监听(规格改变也要注册),稍后取消注释
        $.attachInfiniteScroll($("#outQryScrollContainer"));//原$('.infinite-scroll')
        // 显示加载提示符
        $("#outQryPreloader").show();
        //查询前清空表格行
        $("#outQryOutcometblbody").empty();
        queryOutLibBill(OUT_QUERY_WAY, OUT_PAGE_NOW, PAGE_SIZE);
    }
});

//再次发起出库单检索操作，用于修改订单后刷新
function reDoQueryOutBill() {
    OUT_PAGE_NOW = 0;//复位
    OUT_CURRENT_PAGE = 1;//复位
    IS_CACULATED_PRICE = true;//改变出库字段值时，重置是否计算总价布尔量
    //重新注册滚动事件加载监听(规格改变也要注册),稍后取消注释
    $.attachInfiniteScroll($("#outQryScrollContainer"));//原$('.infinite-scroll')
    // 显示加载提示符
    $("#outQryPreloader").show();
    //查询前清空表格行
    $("#outQryOutcometblbody").empty();
    queryOutLibBill(OUT_QUERY_WAY, OUT_PAGE_NOW, PAGE_SIZE);
}

//页面加载后注册按钮监听
onload = function () {
    //取得最新的入库单号和出库单号
    //参数1：请求的URL地址，参数2：界面显示控件的ID字符串
    getLatestBillNo("GetLatestInLibBillNo", "#inBillNo");//入库
    getLatestBillNo("GetLatestOutLibBillNo", "#billNo");//出库
    //doOperator();
    //出库：执行删除操作注册监听,
    // 参数1：删除按钮的class名，参数2：左表ID，参数3：右表ID，
    // 参数4：规格下拉列表ID,参数5：单位下拉列表ID,参数6：木方单位说明ID,参数7：出/入库标志，出库为true
    doOperator(".del", "#firstcolumn", "#goodstbl", "#speclst", "#unit", "#mufunitdesc", true);
    //入库：执行删除操作注册监听
    doOperator(".inDel", "#infirstcolumn", "#ingoodstbl", "#inspeclst", "#inunit", "#inmufunitdesc", false);

    //入库单列表，参数1：查询方式，参数2：PAGENOW，初始为0（SQL语句LIMIT 0,PAGE_SIZE）参数3：PAGE_SIZE
    queryInLibBill(IN_QUERY_WAY, 0, PAGE_SIZE);//初始加载所有ALL，前PAGE_SIZE页,PAGE_SIZE决定初始显示项数

    //出库单列表，参数1：查询方式，参数2：PAGENOW，初始为0（SQL语句LIMIT 0,PAGE_SIZE）参数3：PAGE_SIZE
    queryOutLibBill(OUT_QUERY_WAY, 0, PAGE_SIZE);

    //重新初始化页面，取得当前页，注册滚动事件加载监听
    //$.initPage();//$.init()中调用了$.initPage()方法，使用$.init()更全面
    //$.toast("page init...");
    $.init();//用于首次页面加载完成或者F5刷新时，重新初始化当前页信息
    //debugger;
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
        //2018-12-26新增，进货单管理页的规格列表
        $("#inQrySpecId").append(optionStr);
        //2019-01-15新增，送货单管理页的规格列表
        $("#outQrySpecId").append(optionStr);
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

//console.log(prefixInteger(4,4));//string
//销售管理商品规格下拉列表事件（改变类型，自动改变计量单位），true标识出库
$("#speclst").on("change", function () {
    regProductChangeEvent.call(this, "#unit", "#mufunitdesc", "", true);
});
//销售管理单位下拉列表选择事件（改变类型时，判断单位是否合法，符合规格类型）
$("#unit").on("change", function () {
    //单位下拉列表改变事件，this代表了regUnitChangeEvent方法当前调用者，此处就是$("#unit")的子集元素；
    // 参数1：当前行的规格下拉列表字符串ID，参数2：木方单位说明字符串ID；
    // 参数3：行索引号（首行为空串），参数4：出/入库标志，出库为true
    regUnitChangeEvent.call(this, "#speclst", "#mufunitdesc", "", true);
});
//进货管理商品规格下拉列表事件（改变类型，自动改变计量单位），false标识入库
$("#inspeclst").on("change", function () {
    regProductChangeEvent.call(this, "#inunit", "#inmufunitdesc", "", false);
});
//进货管理单位下拉列表选择事件（改变类型时，判断单位是否合法，符合规格类型）
$("#inunit").on("change", function () {
    regUnitChangeEvent.call(this, "#inspeclst", "#inmufunitdesc", "", false);
});

//入库单价、数量输入失去焦点后触发事件，false标识入库
$("#inunitprice,#incounts").on("focusout", function () {
    updatePriceValue("", false);
    caculateTotalPrice(false);//计算总额
});

//出库单价、数量输入失去焦点后触发事件，true表示出库
$("#unitprice,#counts").on("focusout", function () {
    updatePriceValue("", true);
    caculateTotalPrice(true);//计算总额
});