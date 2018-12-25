package com.lyf.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.lyf.factory.DAOFactory;
import com.lyf.vo.Incomedetails;
import com.lyf.vo.Incomingtbl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

/*
接收Ajax提交的数据，存入数据库，写入数据库的同时回传消息给客户端界面（true/false）
 */
@WebServlet(name = "InlibController", urlPatterns = {"/InlibController"})
public class InlibController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        // 请求头字符集
        request.setCharacterEncoding("utf-8");
        // 响应头的字符集
        //response.setCharacterEncoding("utf-8");
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();
        //浏览器不缓存数据
        response.setDateHeader("Expires", -1);
        response.setHeader("cache-control", "no-cache");
        response.setHeader("pragma", "no-cache");

        //取得参数
        //--入库单--
        //进货单号
        String billNo = request.getParameter("inBillNo");
        //入库日期
        String inLibDate = request.getParameter("inLibDate");
        //进货总额inTotalPrice
        String inTotalPrice = request.getParameter("inTotalPrice");
        //运输费用
        String inTransitFare = request.getParameter("inTransitFare");
        //装卸方式
        String inLibWay = request.getParameter("inLibWay");
        //装卸费用
        String inShipFare = request.getParameter("inShipFare");
        //--入库单明细--
        //每一行就是一个Incomedetailtbl类的实例（记录），行中的列就是该类的成员属性
        //单号同前
        /*
        //取得表格数据行数，然后遍历每行数据，插入数据库，行数决定插入次数（GSON库已经封装）
        //String len = request.getParameter("dataRows");
        //--以下是首行数据，因数据全部装入数组tableData被接收而来，故注释这段代码
        //规格ID——左表
        String specificationId = request.getParameter("inspeclst");//规格下拉列表值
        //--下面几条数据来自右表--
        //厂商ID
        String manufacturerId = request.getParameter("inmanuflst");//厂商下拉列表值
        //计量单位
        String measurements = request.getParameter("inunit");
        //数量
        String counts = request.getParameter("incounts");
        //单价
        String unitPrice = request.getParameter("inunitprice");
        //该行（规格）金额
        String price = request.getParameter("inprice");
        */
//        System.out.println("单号："+billNo+"入库日期："+inLibDate+"进货总额："+inTotalPrice+"运输费用："+inTransitFare
//        +"装卸方式："+inLibWay+"装卸费用："+inShipFare+"数据行数："+len);
        //表格数据，包含所有明细数据（首行+其它序号行，序号从1开始）
        String tableData = request.getParameter("tableData");
        //System.out.println("表格数据字符串："+tableData);
        //收到的结果示例：
        //[{"inspeclst":"007","inmanuflst":"hy","inunit":"piece","incounts":"100","inunitprice":"41","inprice":"4100"},
        // {"inspeclst":"008","inmanuflst":"hy","inunit":"piece","incounts":"100","inunitprice":"43","inprice":"4300"},
        // {"inspeclst":"464","inmanuflst":"hy","inunit":"bunch5","incounts":"200","inunitprice":"3.5","inprice":"12250"}]
        //JSON字符串转换为Java数组对象
        //Json的解析类对象
        Gson gson = new Gson();
        JsonParser parser = new JsonParser();
        //将JSON的String 转成一个JsonArray对象
        JsonArray jsonArray = parser.parse(tableData).getAsJsonArray();

        //客户端传递的JSON字符串转换为JSON数组，然后添加到链表，注意JSON字符串的name（key）应该与VO属性名一致
        List<Incomedetails> incomedetailsLst = new ArrayList<Incomedetails>();
        for (JsonElement obj : jsonArray) {
            Incomedetails rowData = gson.fromJson(obj, Incomedetails.class);
            incomedetailsLst.add(rowData);
        }
        //构建数据库传入对象，可视情况增加二次验证
        Incomingtbl curInLibData = new Incomingtbl();
        curInLibData.setBillNo(billNo);
        curInLibData.setInLibDate(inLibDate);
        curInLibData.setTotalPrice(inTotalPrice);
        curInLibData.setInLibWay(inLibWay);
        curInLibData.setTransitFare(inTransitFare);
        curInLibData.setShipFare(inShipFare);
        //int arraySize = jsonArray.size();
        //封装入库
        try {
            boolean flag = DAOFactory.getIincomingtblDAOInstance().inLibOperation(curInLibData, incomedetailsLst);
            if (flag) {
                //入库成功
                out.print("{\"insertResult\":\"true\"}");
            } else {
                //入库失败
                out.print("{\"insertResult\":\"false\"}");
            }
        } catch (Exception e) {
            //入库失败
            out.print("{\"insertResult\":\"false\"}");
            e.printStackTrace();
        }

    }
}
