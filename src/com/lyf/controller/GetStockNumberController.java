package com.lyf.controller;

import com.lyf.factory.DAOFactory;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

@WebServlet(name = "GetStockNumberController",urlPatterns = {"/GetStockNumberController"})
public class GetStockNumberController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //返回JSON格式数据
        response.setContentType("application/json;charset=utf-8");
        //浏览器不缓存数据
        response.setDateHeader("Expires", -1);
        response.setHeader("cache-control", "no-cache");
        response.setHeader("pragma", "no-cache");
        PrintWriter out = response.getWriter();
        //获取客户端传递过来的参数
        String specID = request.getParameter("specificationId");
        String manuID = request.getParameter("manufacturerId");
        //System.out.println("收到的规格ID:"+specID+"，收到的厂家ID:"+manuID);
        String stockNumber = null;
        try {
            stockNumber = DAOFactory.getITbGoodsDAOInstance().getStockNumberBySpecIDAndManuID(specID,manuID);
        }catch (Exception e){
            e.printStackTrace();
        }
        out.print("{\"stockNumber\":\"" + stockNumber + "\"}");
        out.flush();
        out.close();

    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
