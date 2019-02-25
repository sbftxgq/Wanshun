package com.lyf.controller;

import com.google.gson.Gson;
import com.lyf.factory.DAOFactory;
import com.lyf.vo.Outcomingtbl;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@WebServlet(name = "QryOutLibBillController", urlPatterns = {"/QryOutLibBillController"})
public class QryOutLibBillController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doGet(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

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
        String pageNow = request.getParameter("pageNow");
        String pageSize = request.getParameter("pageSize");
        String startDate = request.getParameter("outQryLibDateStrt");
        String endDate = request.getParameter("outQryLibDateEnd");
        String specID = request.getParameter("outQrySpecId");
        String guestName = request.getParameter("guestName");
        //String destName = request.getParameter("destName");
        //String billStatus = request.getParameter("billStatus");//SQL语句中，参数写死为0
        //参数顺序：起始、结束日期、商品规格、客户姓名
        String[] paramValues = {startDate, endDate, specID, guestName};
        //取得数据库数据并转换为JSON
        List<Outcomingtbl> results = null;
        String counts = null;
        try {
            counts = DAOFactory.getIOutcomingtblDAOInstance().getOutCountsByField(qryWay, paramValues);
            //查询方式
            //System.out.println(qryWay);
            //有了数量，才继续往下查
            //System.out.println("出库记录数：" + counts);
            //System.out.println("当前页：" + pageNow + "，每页条数：" + pageSize);
            if (null != counts && !("0".equals(counts))) {
                try {
                    results = DAOFactory.getIOutcomingtblDAOInstance().getOutBillsByField(qryWay, paramValues, Integer.parseInt(pageNow), Integer.parseInt(pageSize));
                    Gson gson = new Gson();
                    String jsonResult = gson.toJson(results);
                    //返回的字符串格式：
                    jsonResult = "{\"total\":" + counts + ",\"data\":" + jsonResult + "}";
                    //System.out.println(jsonResult);
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
