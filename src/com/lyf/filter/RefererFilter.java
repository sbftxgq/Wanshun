package com.lyf.filter;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/*
防盗链过滤
 */
public class RefererFilter implements Filter {
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {

    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        // 必须的
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        // 禁止缓存
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Pragrma", "no-cache");
        response.setDateHeader("Expires", 0);

        // 链接来源地址，通过获取请求头 referer 得到
        String referer = request.getHeader("referer");
        //System.out.println("获取的来源--->： " + referer);

        if (referer == null || !referer.contains(request.getServerName())) {//本站点访问，则有效

            /**
             * 如果链接地址来自其他网站，则返回错误图片
             */
            request.getRequestDispatcher("/img/error.gif").forward(request, response);

        } else {

            /**
             * 正常显示
             */
            filterChain.doFilter(request, response);
        }
    }

    @Override
    public void destroy() {

    }
}
