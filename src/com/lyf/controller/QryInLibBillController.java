package com.lyf.controller;

import com.google.gson.Gson;
import com.lyf.factory.DAOFactory;
import com.lyf.vo.Incomingtbl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "QryInLibBillController", urlPatterns = {"/QryInLibBillController"})
public class QryInLibBillController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //回传JSON数据给main.html页面
        response.setContentType("application/json;charset=utf-8");
        PrintWriter out = response.getWriter();
        //浏览器不缓存数据
        response.setDateHeader("Expires", -1);
        response.setHeader("cache-control", "no-cache");
        response.setHeader("pragma", "no-cache");

        //取得客户端发送过来的数据
        String qryWay = request.getParameter("inQueryWay");
        String pageNow = request.getParameter("pageNow");
        String pageSize = request.getParameter("pageSize");
        String startDate = request.getParameter("inQryLibDateStrt");
        String endDate = request.getParameter("inQryLibDateEnd");
        String specID = request.getParameter("inQrySpecId");
        String[] paramValues = {startDate, endDate, specID};
        //取得数据库数据并转换为JSON
        List<Incomingtbl> results = null;
        String counts = null;
        try {
            counts = DAOFactory.getIincomingtblDAOInstance().getCountsByField(qryWay, paramValues);
            //有了数量，才继续往下查
            System.out.println("记录数：" + counts);
            System.out.println("当前页："+pageNow+"，每页条数："+pageSize);
            if (null != counts && !("0".equals(counts))) {
                try {
                    //拿到所有的商品规格数据（未分页）
                    //System.out.println(qryWay);
                    results = DAOFactory.getIincomingtblDAOInstance().getBillsByField(qryWay, paramValues, Integer.parseInt(pageNow), Integer.parseInt(pageSize));
                    Gson gson = new Gson();
                    String jsonResult = gson.toJson(results);
                    //返回的字符串格式：
                    jsonResult = "{\"total\":" + counts + ",\"data\":" + jsonResult + "}";
                    System.out.println(jsonResult);
                    //向客户端回送JSON格式数据
                    if (null != results && results.size() > 0) {
                        out.print(jsonResult);
                    } else {
                        out.print("{\"total\":" + counts + ",\"data\":[]}");
                    }
//            out.flush();
//            out.close();
                } catch (Exception e) {
                    out.print("{\"total\":error,\"data\":[]}");
                    e.printStackTrace();
                }
            } else {
                out.print("{\"total\":0,\"data\":[]}");
            }
        } catch (Exception e) {
            out.print("{\"total\":error,\"data\":[]}");
            e.printStackTrace();
        } finally {
            out.flush();
            out.close();
        }
    }
}
