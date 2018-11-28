package com.lyf.controller;

import com.lyf.factory.DAOFactory;
import com.lyf.vo.Users;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * Created by YuFeng Lee on 2018/11/7 0007.
 */
@WebServlet(name = "CheckUserController",urlPatterns = {"/CheckUser"})
public class CheckUserController extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        //System.out.println("cje...");
        //拿到View层的数据，index.jsp表单提交过来的数据
        String userName = request.getParameter("userName");
        String pwd = request.getParameter("pwd");

        System.out.println("用户名："+userName+"，密码："+pwd);
        //构造Users对象
        Users user = new Users();
        user.setUserName(userName);
        user.setUserPasswd(pwd);

        try {
            if(DAOFactory.getIUserDAOInstance().checkUser(user)) {
                request.getRequestDispatcher("main.html").forward(request, response);
            }else {
                //跳转到注册页面
                response.sendRedirect("register.html");
            }

        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            //跳转到错误页
        }
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.doPost(request,response);
    }
}
