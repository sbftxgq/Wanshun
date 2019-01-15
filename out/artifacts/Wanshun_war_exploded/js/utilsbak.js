
//var rowIndex = 1;//复制表格行索引，用于增加行/删除行的增减

//执行删除操作通用函数，删除删除按钮所在的行
function doOperator(delBtnClassStr,delLftTblIdStr,delRgtTblIdStr,mufUnitdescIdStr) {
    //取得删除按钮DOM对象，两个表格处于同一行上只有一个删除按钮，此按钮删除2个表格上的同一行
    var dels = getDomObj(delBtnClassStr);
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
                dataTableRows = getDomObj(delRgtTblIdStr).rows.length;
                console.log("删除前的表格行数："+dataTableRows);

                if (currentIndex < dataTableRows) {
                    //左边固定表
                    getDomObj(delLftTblIdStr).deleteRow(currentIndex);
                    //右边明细表
                    getDomObj(delRgtTblIdStr).deleteRow(currentIndex);

                    //删除时，复制的表格行id及其子列id要减1，修改属性

                    //更新木方单位说明显示
                    if (isShowUnitdesc()) {
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
function addRow(delBtnClassStr,lftTblIdStr,rgtTblIdStr,leftTblFstRowIdStr,rightTblFstRowIdStr,lftspecrowStr,lftfirstcolumnbodyIdStr,
                rgtdetailrowStr, rgtTblbodyIdStr,speclstIdStr,speclstStr,manuflstIdStr,manuflstStr,unitIdStr,
                unitStr,countsIdStr,countsStr, unitpriceIdStr,unitpriceStr,priceIdStr,priceStr,mufUnitdescIdStr) {
    //delTblIdStr——tblIdStr
    var len = getDomObj(rgtTblIdStr).rows.length; //右边表格table取到所有的行
    console.log("新增行前的表格行数："+len);
    if (len >= 6) {
        $.alert("最多为5个商品规格！");
        return;
    }
    //第一，克隆对象保存（第二个表的首行被复制）
    //左侧表格首行id：leftTblFstRowIdStr
    var $ObjCopyLeft = $(leftTblFstRowIdStr).clone(true);//固定左侧表格首行复制
    //右侧表格首行id：rightTblFstRowIdStr
    var $ObjCopyRight = $(rightTblFstRowIdStr).clone(true);//右侧表格首行复制
    //左边固定例追加,左表首行id字符串：lftspecrowStr,lftfirstcolumnbodyIdStr
    $ObjCopyLeft.attr("id", lftspecrowStr + (len - 1)).appendTo(lftfirstcolumnbodyIdStr);
    //右边明细追加,右表首行id字符串：rgtdetailrowStr,rgttblbodyIdStr
    $ObjCopyRight.attr("id", rgtdetailrowStr + (len - 1)).appendTo(rgtTblbodyIdStr);

    //第二，修改克隆对象的某些属性
    //查找id为speclst的元素，修改其id为递增新id，并新增name属性，用于将来表单提交
    //每克隆一行，在复制的对象中修改name属性和的id属性
    //商品列表，speclstIdStr，speclstStr
    $ObjCopyLeft.find(speclstIdStr).attr({"id": speclstStr + (len - 1), "name": speclstStr + (len - 1)});
    //厂商列表，manuflstIdStr，manuflstStr
    $ObjCopyRight.find(manuflstIdStr).attr({"id": manuflstStr + (len - 1), "name": manuflstStr + (len - 1)});
    //单位列表，unitIdStr，unitStr
    var $selectObj = $ObjCopyRight.find(unitIdStr);//找到select这个DOM
    //修改其select对象ID属性为新的ID，unitStr
    $selectObj.attr({"id": unitStr + (len - 1), "name": unitStr + (len - 1)});
    //单位列表设置第一个option为选中，清除以前任何选择的selected属性
    //先清除，后选中
    $selectObj.find("option").removeAttr("selected");
    $selectObj.find("option[value='piece']").attr("selected", "selected");
    //数量输入框，countsIdStr,countsStr
    $ObjCopyRight.find(countsIdStr).attr({"id": countsStr + (len - 1), "name": countsStr + (len - 1)});
    //单价输入框，unitpriceIdStr，unitpriceStr
    $ObjCopyRight.find(unitpriceIdStr).attr({"id": unitpriceStr + (len - 1), "name": unitpriceStr + (len - 1)});
    //总价（该项售价输入框），priceIdStr，priceStr
    $ObjCopyRight.find(priceIdStr).attr({"id": priceStr + (len - 1), "name": priceStr + (len - 1)});

    

    //注册删除监听事件，确保每增加的行上的删除按钮均有事件
    doOperator(delBtnClassStr,lftTblIdStr,rgtTblIdStr,mufUnitdescIdStr);

    //注册商品下拉change事件,此处this代表了商品speclst下拉列表select
    $(speclstIdStr + (len - 1)).on("change", function () {
        //2018-12-05新增2个参数
        regProductChangeEvent.call(this,unitIdStr,mufUnitdescIdStr,(len - 1));
    });
    //注册计量单位下拉列表选择change事件
    $(unitIdStr + (len - 1)).on("change", function () {
        regUnitChangeEvent.call(this,speclstIdStr,mufUnitdescIdStr,(len - 1));
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

