package com.lyf.controller;

import com.google.gson.Gson;
import com.lyf.factory.DAOFactory;
import com.lyf.vo.Specificationtbl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

/*
Ajax获取该Servlet，取得规格列表，返回JSON格式数据
 */

@WebServlet(name = "GetSpecListByCategoryID",urlPatterns = {"/GetSpecListByCategoryID"})
public class GetSpecListByCategoryID extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request,response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        //返回JSON格式数据
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();
        List<Specificationtbl> specificationtbls = null;
        //System.out.println("******");
        //浏览器不缓存数据
        response.setDateHeader("Expires", -1);
        response.setHeader("cache-control", "no-cache");
        response.setHeader("pragma", "no-cache");
        String categoryID = request.getParameter("categoryId");
        //设置数据输出格式
        //response.setHeader("Content-Type", "image/jpeg");
        try {
            //拿到分类后的的商品规格数据（未分页）
            specificationtbls = DAOFactory.getISpecificationtblDAOInstance().getSpecificationListByCategoryId(categoryID);
        } catch (Exception e) {
            e.printStackTrace();
        }

        Gson gson = new Gson();
        String jsonResult = gson.toJson(specificationtbls);
        //System.out.println(jsonResult);
        //向客户端回送JSON格式数据
        if(null!=specificationtbls && specificationtbls.size() > 0) {
            out.print(jsonResult);
        }
        out.flush();
        out.close();
    }
}
