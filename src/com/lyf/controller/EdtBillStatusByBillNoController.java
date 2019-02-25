package com.lyf.controller;

import com.lyf.factory.DAOFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "EdtBillStatusByBillNoController",urlPatterns = {"/EdtBillStatusController"})
public class EdtBillStatusByBillNoController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // 响应头的字符集
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();
        //浏览器不缓存数据
        response.setDateHeader("Expires", -1);
        response.setHeader("cache-control", "no-cache");
        response.setHeader("pragma", "no-cache");

        //取得参数
        //--该出库单要修改的参数--
        //送货单号
        String billNo = request.getParameter("billNo");
        //实收总额
        String actualTotalPrice = request.getParameter("actualTotalPrice");
        //修改操作
        try {
            boolean flag = DAOFactory.getIOutcomingtblDAOInstance().edtOutBillStatusByBillNo(billNo,actualTotalPrice);
            if (flag) {
                //修改成功
                out.print("{\"edtResult\":\"true\"}");
            } else {
                //修改失败
                out.print("{\"edtResult\":\"false\"}");
            }
        } catch (Exception e) {
            //修改失败
            out.print("{\"edtResult\":\"false\"}");
            e.printStackTrace();
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
