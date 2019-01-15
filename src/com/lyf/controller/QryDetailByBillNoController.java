package com.lyf.controller;

import com.google.gson.Gson;
import com.lyf.factory.DAOFactory;
import com.lyf.vo.IncomeViewVo;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "QryDetailByBillNoController", urlPatterns = {"/QryDetailController"})
public class QryDetailByBillNoController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //回传JSON数据给main.html页面
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();
        //浏览器不缓存数据
        response.setDateHeader("Expires", -1);
        response.setHeader("cache-control", "no-cache");
        response.setHeader("pragma", "no-cache");

        //取得订单号
        String billNo = request.getParameter("billNo");
        //取得数据库数据并转换为JSON
        List<IncomeViewVo> results = null;
        try {
            results = DAOFactory.getIincomingtblDAOInstance().getBillDetailsByBillNo(billNo);
            if (null != results && results.size() > 0) {
                //转换为JSON写出到客户端
                Gson gson = new Gson();
                String jsonResult = gson.toJson(results);
                System.out.println(jsonResult);
                out.print(jsonResult);//写出到客户端浏览器
            } else {
                out.print("[]");
            }
        } catch (Exception e) {
            out.print("[]");
            e.printStackTrace();
        } finally {
            out.flush();
            out.close();
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request, response);
    }
}
