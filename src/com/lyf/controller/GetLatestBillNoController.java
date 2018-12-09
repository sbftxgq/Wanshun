package com.lyf.controller;

import com.lyf.factory.DAOFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "GetLatestBillNoController",urlPatterns = {"/GetLatestBillNo"})
public class GetLatestBillNoController extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//回传JSON数据给FileGenPage.html页面
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();
        //浏览器不缓存数据
        response.setDateHeader("Expires", -1);
        response.setHeader("cache-control", "no-cache");
        response.setHeader("pragma", "no-cache");
        //拿到最大年号，卷案号数据
        String billNo = null;
        try {
            billNo = DAOFactory.getIincomingtblDAOInstance().getLatestBillNO();
        } catch (Exception e) {
            e.printStackTrace();
        }
        if(null!=billNo) {
            out.print("{\"billNo\":\""+billNo+"\"}");
        }else {
            //没有查询到数据，回传empty字符串
            out.print("{\"billNo\":\"null\"}");
            //System.out.println("empty");
        }
        out.flush();
        out.close();
    }
}
