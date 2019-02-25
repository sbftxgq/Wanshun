package com.lyf.controller;

import com.google.gson.Gson;
import com.lyf.factory.DAOFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "CaculateTotalPriceController", urlPatterns = {"/CaculateTotalPriceController"})
public class CaculateTotalPriceController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        //请求参数字符集设置
        request.setCharacterEncoding("utf-8");
        //回传JSON数据给main.html页面
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();
        //浏览器不缓存数据
        response.setDateHeader("Expires", -1);
        response.setHeader("cache-control", "no-cache");
        response.setHeader("pragma", "no-cache");

        //取得客户端发送过来的数据
        String qryWay = request.getParameter("outQueryWay");//查询方式
        String startDate = request.getParameter("outQryLibDateStrt");
        String endDate = request.getParameter("outQryLibDateEnd");
        String specID = request.getParameter("outQrySpecId");
        String guestName = request.getParameter("guestName");
        //参数顺序：起始、结束日期、商品规格、客户姓名
        String[] paramValues = {startDate, endDate, specID, guestName};
        //取得数据库数据并转换为JSON
        //查询方式
        //System.out.println(qryWay);
        String[] results = null;
        try {
            results = DAOFactory.getIOutcomingtblDAOInstance().getTotalPriceByField(qryWay,paramValues);
            Gson gson = new Gson();
            String jsonResult = gson.toJson(results);//第一个值为已付金额，第二个值为未付金额
            //System.out.println(jsonResult);
            //字符串格式JSON输出到客户端浏览器：
            out.print(jsonResult);
        } catch (Exception e) {
            out.print("[0,0]");
            e.printStackTrace();
        }finally {
            out.flush();
            out.close();
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
