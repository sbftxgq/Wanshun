package com.lyf.controller;

import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.lyf.factory.DAOFactory;
import com.lyf.vo.Outcomedetails;
import com.lyf.vo.Outcomingtbl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

@WebServlet(name = "OutLibController",urlPatterns = {"/OutLibController"})
public class OutLibController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 请求头字符集
        request.setCharacterEncoding("utf-8");
        // 响应头的字符集
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();
        //浏览器不缓存数据
        response.setDateHeader("Expires", -1);
        response.setHeader("cache-control", "no-cache");
        response.setHeader("pragma", "no-cache");

        //取得参数
        //--出库单--
        //送货单号
        String billNo = request.getParameter("billNo");
        //客户姓名
        String guestName = request.getParameter("guestName");
        //送货地点
        String destLocation = request.getParameter("destLocation");
        //出库日期（送货日期）
        String outLibDate = request.getParameter("outLibDate");
        //送货人
        String outLibMan = request.getParameter("outLibMan");
        //送货方式
        String outLibWay = request.getParameter("outLibWay");
        //运输费用
        String transitFare = request.getParameter("transitFare");
        //装卸费用
        String shipFare = request.getParameter("shipFare");
        //理论销售总额totalPrice
        String totalPrice = request.getParameter("totalPrice");
        //是否已付
        String isPayed = request.getParameter("isPayed");
        //实际收款
        String actualTotalPrice = request.getParameter("actualTotalPrice");

        //--入库单明细--
        //取得表格数据行数，然后遍历每行数据，插入数据库，行数决定插入次数（GSON库已经封装，此处不再使用此数据）
        //String len = request.getParameter("dataRows");
        String tableData = request.getParameter("tableData");
        //JSON字符串转换为Java数组对象
        //Json的解析类对象，每请求一次，执行一次转换
        Gson gson = new Gson();
        JsonParser parser = new JsonParser();
        //将JSON的String 转成一个JsonArray对象
        JsonArray jsonArray = parser.parse(tableData).getAsJsonArray();
        List<Outcomedetails> outcomedetailsLst = new ArrayList<Outcomedetails>();
        //jsonArray数组对象封装为链表，7个字段值
        for (JsonElement obj : jsonArray){
            Outcomedetails rowData = gson.fromJson(obj,Outcomedetails.class);
            outcomedetailsLst.add(rowData);
        }
        //出库单封装（出库表11个字段值）
        Outcomingtbl curOutLibData = new Outcomingtbl();
        curOutLibData.setBillNo(billNo);
        curOutLibData.setGuestName(guestName);
        curOutLibData.setDestLocation(destLocation);
        curOutLibData.setOutLibDate(outLibDate);
        curOutLibData.setOutLibMan(outLibMan);
        curOutLibData.setOutLibWay(outLibWay);
        curOutLibData.setTransitFare(transitFare);
        curOutLibData.setShipFare(shipFare);
        curOutLibData.setTotalPrice(totalPrice);
        curOutLibData.setBillStatus(isPayed);
        curOutLibData.setActualTotalPrice(actualTotalPrice);

        //出库操作
        try {
            boolean flag = DAOFactory.getIOutcomingtblDAOInstance().outLibOperation(curOutLibData,outcomedetailsLst);
            if (flag) {
                //出库成功
                out.print("{\"insertResult\":\"true\"}");
            } else {
                //出库失败
                out.print("{\"insertResult\":\"false\"}");
            }
        } catch (Exception e) {
            //出库失败
            out.print("{\"insertResult\":\"false\"}");
            e.printStackTrace();
        }

    }
}
