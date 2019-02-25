package com.lyf.util;
//import java.io.FileInputStream;

import java.io.*;
import java.sql.*;

import com.lyf.dbc.DatabaseConnection;
import java.util.logging.Level;
import java.util.logging.Logger;

public class SqlHelperNew {

    private DatabaseConnection dbc = null;
    private Connection ct = null;

    public SqlHelperNew() {
        this.dbc = new DatabaseConnection();
        ct = dbc.getConnection();
    }

    public DatabaseConnection getDbc() {
        return dbc;
    }

    //封装一个用于执行CRUD操作（增、删、改）的方法，此方法只能接收一条SQL语句，SQL语句中的参数?的个数没有限制
    //参数?由一个代表参数的字符串数组保存。 e.g. update emp set sal=sal+? where empno=?这就是预编译SQL语句
    public boolean executeUpdateSQL(String sql, String[] parameters) throws Exception {
        boolean flag = false;
        PreparedStatement ps = null;
        try {
            //创建PreparedStatement对象，使用Connection接口的prepareStatement()返回这个对象
            //ct = getConnection();
            ps = ct.prepareStatement(sql);

            //给预编译的SQL语句？赋值
            if (parameters != null) {
                for (int i = 0; i < parameters.length; i++) {
                    ps.setString(i + 1, parameters[i]);
                }
            }
            //执行预编译好的SQL语句,如何判断下句执行成功呢？若在catch部分有异常，说明下句没有执行成功！
            //ps.execute();//这样写，将在第一行更新一条记录
            if (ps.executeUpdate() > 0) {//这是推荐写法，在末尾追加一条更新记录
                flag = true;//至少更新了一行
            }

        } catch (Exception e) {
            e.printStackTrace();//开发阶段，打印出调试信息
            flag = false;
            throw e;//20171223添加
            //抛出运行时异常，给调用该函数的函数一个选择，可以处理，也可以放弃处理
            //throw new RuntimeException(e.getMessage());
        } finally {
            //释放资源
            if (null != ps) {
                try {
                    ps.close();
                    ps = null;
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
            /*交给外部代理类完成连接的关闭
             if(null != ct) {
             try {
                            
             ct.close();
             ct = null;
             }catch(Exception e){
             e.printStackTrace();
             }
             }*/
        }
        return flag;
    }

    //封装一个用于执行CRUD操作（增、删、改）的方法，此方法只能接收一条SQL语句，SQL语句中的参数?的个数没有限制
    //参数?由一个代表参数的字符串数组保存。 e.g. update emp set sal=sal+? where empno=?这就是预编译SQL语句
    //此重载的方法，多了一个参数conn，来自外部的一个连接
    public static boolean executeUpdateSQL(Connection conn, String sql, String[] parameters) {
        boolean flag = false;
        PreparedStatement ps = null;
        try {
            //创建PreparedStatement对象，使用Connection接口的prepareStatement()返回这个对象
            //ct = getConnection();
            ps = conn.prepareStatement(sql);

            //给预编译的SQL语句？赋值
            if (parameters != null) {
                for (int i = 0; i < parameters.length; i++) {
                    ps.setString(i + 1, parameters[i]);
                }
            }
            //执行预编译好的SQL语句,如何判断下句执行成功呢？若在catch部分有异常，说明下句没有执行成功！
            //ps.execute();//这样写，将在第一行更新一条记录
            if (ps.executeUpdate() > 0) {//这是推荐写法，在末尾追加一条更新记录
                flag = true;//至少更新了一行
            }

        } catch (Exception e) {
            e.printStackTrace();//开发阶段，打印出调试信息
            flag = false;
            //抛出运行时异常，给调用该函数的函数一个选择，可以处理，也可以放弃处理
            throw new RuntimeException(e.getMessage());
        } finally {
            //释放资源
            if (null != ps) {
                try {
                    ps.close();
                    ps = null;
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return flag;
    }

    //重载的方法，第一个参数接收外部的数据连接
    public static boolean executeUpdateSQLs(Connection conn, String[] sql, String[][] parameters) {
        boolean flag = false;
        PreparedStatement ps = null;
        try {
            conn.setAutoCommit(false);//首先禁止自动提交事务			
            for (int i = 0; i < sql.length; i++) {
                //挨着排地拿出每一条SQL语句，创建PreparedStatement对象
                ps = conn.prepareStatement(sql[i]);	//第一条SQL语句			
                //如果给出了参数，则进入参数处理，给?号赋值
                if (parameters != null) {
                    //parameters[i]代表了第i条SQL语句的参数值的集合（字符串数组），parameters[i]是个一维数组名，里面存放了j个？值（参数）
                    for (int j = 0; j < parameters[i].length; j++) {
                        ps.setString(j + 1, parameters[i][j]);//给第i条SQL语句的j个参数（如果有的话）赋值
                    }
                }
                //执行SQL语句，置于循环体内，每拿出一条SQL语句，在给？赋值之后，就执行一条SQL语句。
                //下句不能放在循环体外，否则只能执行String[] sql字符串数组中最后一条SQL语句了，设置一组，执行一组
                ps.executeUpdate();

                //故意设置的除零异常，测试事务是否有效
                //int k=9/0;//若下面的Catch语句是捕获SQLException e，则此运行时异常不被下面的Catch子句捕获，直接转到fianlly子句。				
            }
			//ps.executeUpdate();//error，放在循环体外，只执行SQL组中最后一条SQL语句

            //提交事务，放在循环体外，最后提交。也可以放在第一层循环体内最后，每次循环完毕，提交一次，但是这样效率低一些
            conn.commit();
            flag = true;
        } catch (Exception e) {//必须是任何Exception，若写上SQLException e 则上一句的int k=9/0;除零异常不被下面的语句捕获，由于是运行时异常，可以捕获，也可以不捕获，
            //此时，这个运行时异常没有被Catch到，所以conn.rollback()没有机会执行，导致回滚失败！程序照样执行，但是提交了一句SQL，另一句SQL没有被执行。			
            try {
                conn.rollback();//回滚事务，取消SQL语句组执行的操作
                flag = false;
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        } finally {
            //释放资源
            if (null != ps) {
                try {
                    ps.close();
                    ps = null;
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return flag;
    }

    //封装一个用于执行CRUD操作事务（增、删、改）的方法，此方法能接收多条SQL语句，SQL语句中的参数?的个数没有限制
    //通常多条SQL语句是为了完成一个整体操作，如事务的处理等，这个方法就是为事务处理准备的
    public boolean executeUpdateSQLs(String[] sql, String[][] parameters) throws Exception{
        boolean flag = false;
        PreparedStatement ps = null;
        try {
            ct.setAutoCommit(false);//首先禁止自动提交事务
            int sqlLen = sql.length;
            for (int i = 0; i < sqlLen; i++) {
                //挨着排地拿出每一条SQL语句，创建PreparedStatement对象
                ps = ct.prepareStatement(sql[i]);	//第一条SQL语句			
                //如果给出了参数，则进入参数处理，给?号赋值
                if (parameters != null) {
                    int len = parameters[i].length;
                    //parameters[i]代表了第i条SQL语句的参数值的集合（字符串数组），parameters[i]是个一维数组名，里面存放了j个？值（参数）
                    for (int j = 0; j < len; j++) {
                        ps.setString(j + 1, parameters[i][j]);//给第i条SQL语句的j个参数（如果有的话）赋值
                    }
                }
                //执行SQL语句，置于循环体内，每拿出一条SQL语句，在给？赋值之后，就执行一条SQL语句。
                //下句不能放在循环体外，否则只能执行String[] sql字符串数组中最后一条SQL语句了，设置一组，执行一组
                ps.executeUpdate();
                //故意设置的除零异常，测试事务是否有效
                //int k=9/0;//若下面的Catch语句是捕获SQLException e，则此运行时异常不被下面的Catch子句捕获，直接转到fianlly子句。				
            }
			//ps.executeUpdate();//error，放在循环体外，只执行SQL组中最后一条SQL语句
            //提交事务，放在循环体外，最后提交。也可以放在第一层循环体内最后，每次循环完毕，提交一次，但是这样效率低一些
            ct.commit();
            flag = true;
        } catch (Exception e) {//必须是任何Exception，若写上SQLException e 则上一句的int k=9/0;除零异常不被下面的语句捕获，由于是运行时异常，可以捕获，也可以不捕获，
            //此时，这个运行时异常没有被Catch到，所以ct.rollback()没有机会执行，导致回滚失败！程序照样执行，但是提交了一句SQL，另一句SQL没有被执行。			
            try {
                ct.rollback();//回滚事务，取消SQL语句组执行的操作
                flag = false;
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
            //e.printStackTrace();
            throw e;
        } finally {
            //释放资源
            if (null != ps) {
                try {
                    ps.close();
                    ps = null;
                    return flag;
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return flag;
    }

    //针对StudentInfo表有图片数据的第一条SQL语句，且图片参数是最后一个？(插入新纪录时)
    public boolean insertDataAndBlobDataSqls(String[] sql, String[][] parameters, InputStream in, long length) {
        boolean flag = false;
        PreparedStatement ps = null;
        try {
            ct.setAutoCommit(false);//首先禁止自动提交事务			
            for (int i = 0; i < sql.length; i++) {
                //如果是增加记录，则sql语句的第一句的最后一个“？”代表图片数据
                if (sql[i].startsWith("insert")) {
                    //挨着排地拿出每一条SQL语句，创建PreparedStatement对象
                    ps = ct.prepareStatement(sql[i]);	//i=0时为第一条SQL语句			
                    //如果给出了参数，则进入参数处理，给?号赋值
                    if (parameters != null) {
                        int len = parameters[i].length;
                        //parameters[i]代表了第i条SQL语句的参数值的集合（字符串数组），parameters[i]是个一维数组名，里面存放了j个？值（参数）
                        for (int j = 0; j < len; j++) {
                            ps.setString(j + 1, parameters[i][j]);//给第i条SQL语句的j个参数（如果有的话）赋值
                        }
                        if (0 == i) {
                            ps.setBinaryStream(parameters[0].length + 1, in, length);
                        }
                    }
                    ps.executeUpdate();
                    //如果是更新语句，图片数据由第一条SQL语句的第一个？号所代表
                } else if (sql[i].startsWith("update")) {
                    ps = ct.prepareStatement(sql[i]);	//i=0时为第一条SQL语句	
                    if (parameters != null) {
                        int len = parameters[i].length;
                        //i=0为第一个SQL语句的参数，j代表参数个数
                        for (int j = 0; j < len; j++) {

                            if (0 == i) {
                                //第一条SQL语句的第一个？为图片数据
                                ps.setBinaryStream(1, in, length);
                                ps.setString(j + 2, parameters[i][j]);//给第i条SQL语句的j个参数（如果有的话）赋值
                            } else {//非第一条SQL语句
                                ps.setString(j + 1, parameters[i][j]);
                            }
                        }
                    }
                    ps.executeUpdate();
                }

            }
            //提交事务，放在循环体外，最后提交。也可以放在第一层循环体内最后，每次循环完毕，提交一次，但是这样效率低一些
            ct.commit();
            flag = true;
        } catch (Exception e) {//必须是任何Exception，若写上SQLException e 则上一句的int k=9/0;除零异常不被下面的语句捕获，由于是运行时异常，可以捕获，也可以不捕获，
            //此时，这个运行时异常没有被Catch到，所以ct.rollback()没有机会执行，导致回滚失败！程序照样执行，但是提交了一句SQL，另一句SQL没有被执行。			
            try {
                ct.rollback();//回滚事务，取消SQL语句组执行的操作
                flag = false;
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        } finally {
            //释放资源
            if (null != ps) {
                try {
                    ps.close();
                    ps = null;
                    in.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return flag;
    }

    //针对StudentInfo表的单独处理函数
    public boolean insertDataAndBlobData(String sql, String[] parameters, InputStream in, long length) {
        boolean flag = false;
        PreparedStatement ps = null;
        try {
            //创建PreparedStatement对象，使用Connection接口的prepareStatement()返回这个对象
            ps = ct.prepareStatement(sql);

            //给预编译的SQL语句？赋值(所有的字符串参数)，16个参数一一给？赋值，最后一个参数是图片数据，序号为参数数组长度+1
            if (parameters != null) {
                for (int i = 0; i < parameters.length; i++) {
                    ps.setString(i + 1, parameters[i]);
                }
            }
            //最后一个参数是图片数据
            ps.setBinaryStream(parameters.length + 1, in, length);

            if (ps.executeUpdate() > 0) {//这是推荐写法，在末尾追加一条更新记录
                flag = true;//至少更新了一行
            }

        } catch (Exception e) {
            e.printStackTrace();//开发阶段，打印出调试信息
            flag = false;
            //抛出运行时异常，给调用该函数的函数一个选择，可以处理，也可以放弃处理
            throw new RuntimeException(e.getMessage());
        } finally {
            //释放资源
            if (null != ps) {
                try {
                    ps.close();
                    ps = null;
                    in.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return flag;
    }

    //插入图片的处理
    public boolean insertBlobData(String sql, InputStream in, long length) {
        boolean flag = false;
        PreparedStatement ps = null;
        try {
            ct.setAutoCommit(false);//首先禁止自动提交事务			
            ps = ct.prepareStatement(sql);
            ps.setBinaryStream(1, in, length);

            if (ps.executeUpdate() > 0) {//这是推荐写法，在末尾追加一条更新记录
                flag = true;//至少更新了一行
                ct.commit();//提交事务
            }

        } catch (Exception e) {
            try {
                ct.rollback();//回滚事务，取消图片插入操作
                flag = false;
            } catch (SQLException e1) {
                e1.printStackTrace();
            }
            e.printStackTrace();
        } finally {
            //释放资源
            if (null != ps) {
                try {
                    ps.close();
                    ps = null;
                    in.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return flag;
    }

    //封装一个统一的select语句，使用原生的Java库ResultSet的结果集。20171221新增throws Exception
    public ResultSet executeQuerySQL(String sql, String[] parameters) throws Exception{
        PreparedStatement ps = null;
        ResultSet rs = null;
        if (null != ct) {
            try {

                ps = ct.prepareStatement(sql, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                if (parameters != null) {
                    for (int i = 0; i < parameters.length; i++) {
                        ps.setString(i + 1, parameters[i]);
                    }
                }
                rs = ps.executeQuery();
            } catch (Exception e) {
                //e.printStackTrace();//20171221新增，往外抛异常
            	throw e;
            }
        }
        return rs;
    }

    //封装一个统一的select语句，使用原生的Java库ResultSet的结果集。20181229新增分页参数（整数），LIMIT语句最后两个参数
    //追加在SQL的LIMIT ?,?语句中两个问号为整数
    public ResultSet executeQuerySQL(String sql, String[] parameters,int pageNow,int pageSize) throws Exception{
        PreparedStatement ps = null;
        ResultSet rs = null;
        if (null != ct) {
            try {
                ps = ct.prepareStatement(sql, ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                if (parameters != null) {
                    int len = parameters.length;
                    for (int i = 0; i < len; i++) {
                        ps.setString(i + 1, parameters[i]);
                    }
                    //追加最后2个？，LIMIT ?,?
                    ps.setInt(len+1,pageNow);
                    ps.setInt(len+2,pageSize);
                }else{
                    //参数为空，则只有索引0,1两个代表分页
                    ps.setInt(1,pageNow);
                    ps.setInt(2,pageSize);
                }
                rs = ps.executeQuery();
            } catch (Exception e) {
                //e.printStackTrace();//20171221新增，往外抛异常
                throw e;
            }
        }
        return rs;
    }

    //封装一个执行多个统一的select语句，使用原生的Java库ResultSet的结果集
    public boolean executeQuerySQLs(String[] sql, String[][] parameters) {

        boolean flag = false;
        PreparedStatement ps = null;
        ResultSet rs = null;
        int sqlLen = sql.length;
        if (null != ct) {

            try {
                ct.setAutoCommit(false);//首先禁止自动提交事务
                for (int i = 0; i < sqlLen; i++) {

                    ps = ct.prepareStatement(sql[i], ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                    if (parameters != null) {
                        //parameters[i]代表了第i条SQL语句的参数值的集合（字符串数组），parameters[i]是个一维数组名，里面存放了j个？值（参数）
                        for (int j = 0; j < parameters[i].length; j++) {
                            ps.setString(j + 1, parameters[i][j]);//给第i条SQL语句的j个参数（如果有的话）赋值
                        }
                    }
                    rs = ps.executeQuery();

                }
                //提交事务，放在循环体外，最后提交。也可以放在第一层循环体内最后，每次循环完毕，提交一次，但是这样效率低一些
                ct.commit();
                flag = true;
            } catch (Exception e) {
                try {
                    ct.rollback();//回滚事务，取消SQL语句组执行的操作
                    flag = false;
                } catch (SQLException e1) {
                    e1.printStackTrace();
                }
                e.printStackTrace();
                throw new RuntimeException(e.getMessage());
            } finally {
                //释放资源
                if (null != ps) {
                    try {
                        ps.close();
                        ps = null;
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                }
               
                //释放资源，由于rs的数据保存到文件，故暂时此处关闭rs
                if (null != rs) {
                    try {
                        rs.close();
                        rs = null;
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                }
                
            }

        }
        return flag;
    }

    //封装一个执行多个统一的select语句，使用原生的Java库ResultSet的结果集，每一SQL语句取得唯一
    // 一行一列的结果存入字符串数组返回
    public String[] executeQuerySQLsForSingleResult(String[] sql, String[][] parameters) throws Exception{

        //几个SQL语句就有几个结果，一个语句返回一个结果，按顺序存入数组
        int sqlLen = sql.length;
        String[] results = new String[sqlLen];
        PreparedStatement ps = null;
        ResultSet rs = null;

        if (null != ct) {

            try {
                ct.setAutoCommit(false);//首先禁止自动提交事务
                for (int i = 0; i < sqlLen; i++) {

                    ps = ct.prepareStatement(sql[i], ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
                    if (parameters != null) {
                        //parameters[i]代表了第i条SQL语句的参数值的集合（字符串数组），parameters[i]是个一维数组名，里面存放了j个？值（参数）
                        for (int j = 0; j < parameters[i].length; j++) {
                            ps.setString(j + 1, parameters[i][j]);//给第i条SQL语句的j个参数（如果有的话）赋值
                        }
                    }
                    rs = ps.executeQuery();
                    //只取首行记录结果，第一行第一列（columnIndex从1开始，1标识第1列）
                    if(rs.next()){
                        results[i] = rs.getString(1);//
                    }
                }
                //提交事务，放在循环体外，最后提交。也可以放在第一层循环体内最后，每次循环完毕，提交一次，但是这样效率低一些
                ct.commit();
            } catch (Exception e) {
                try {
                    ct.rollback();//回滚事务，取消SQL语句组执行的操作
                } catch (SQLException e1) {
                    e1.printStackTrace();
                }
                e.printStackTrace();
                throw new RuntimeException(e.getMessage());
            } finally {
                //释放资源
                if (null != ps) {
                    try {
                        ps.close();
                        ps = null;
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                }
                //释放资源，由于rs的数据保存到文件，故暂时此处关闭rs
                if (null != rs) {
                    try {
                        rs.close();
                        rs = null;
                    } catch (SQLException e) {
                        e.printStackTrace();
                    }
                }
            }
        }
        return results;
    }

    //封装一个统一的select语句，使用自定义的继承自Java库ResultSet的带分页功能的ResultSet，即IPageableResultSetImpl
    public IPageableResultSet executePageQuerySQL(String sql, String[] parameters) {
        PreparedStatement ps = null;
        IPageableResultSet rs = null;
        try {
            ps = ct.prepareStatement(sql, ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_UPDATABLE);
            if (parameters != null) {
                for (int i = 0; i < parameters.length; i++) {
                    ps.setString(i + 1, parameters[i]);
                }
            }
            //使用自定义的带分页功能的结果集
            rs = new IPageableResultSetImpl(ps.executeQuery());
        } catch (Exception e) {
            e.printStackTrace();
        } finally {//不用关闭rs，交给外部调用者处理，例如由代理类或真实类来关闭
            //释放资源，此处，ps也不能关闭，否则程序运行报错：提示rs关闭！
			/*if(null != ps) {
             try {
             ps.close();
             ps = null;
             } catch (SQLException e) {
             e.printStackTrace();
             }
             }*/
        }
        return rs;
    }

    //封装一个可以调用存储过程（不带返回值，即没有输出参数）的方法，存储过程不带返回值
    public boolean callNoReturnProcedure(String sql, String[] parameters) {
        boolean flag = false;
        CallableStatement cs = null;
        try {
            /*
             2014.09.20加上了事务控制(2014.12.12能否使用MySqL自己的事务机制？这里获取事务的状态？)
             */
            ct.setAutoCommit(false);//首先禁止自动提交事务
            cs = ct.prepareCall(sql);//SQL语句的预编译
            //参数赋值
            if (parameters != null) {
                for (int i = 0; i < parameters.length; i++) {
                    cs.setObject(i + 1, parameters[i]);
                }
            }
            //执行存储过程的调用
            if (cs.execute()) {
                flag = true;
            }

            ct.commit();//提交更改，提交事务

        } catch (Exception e) {
            e.printStackTrace();
            flag = false;
            try {
                ct.rollback();//回滚事务，取消操作
            } catch (SQLException ex) {
                Logger.getLogger(SqlHelperNew.class.getName()).log(Level.SEVERE, null, ex);
            }

            throw new RuntimeException(e.getMessage());
        } finally {
            //释放资源
            if (null != cs) {
                try {
                    cs.close();
                    cs = null;
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
        return flag;
    }

    //封装一个可以调用存储过程（有返回值，即有输出参数）的方法，存储过程有返回值
    public CallableStatement callProcedure(String sql, String[] inParameters, Integer[] outParameters) {
        //1.取得连接
        CallableStatement cs = null;
        //存储过程的SQL转义语法"{call 过程名(?,?,...)}"，由Connection接口的prepareCall("{call 过程名(?,?,...)}")方法执行
        //此处的sql参数是符合转义语法的SQL语句，字符串类型
        try {
            //2.创建SQL语句的CallableStatement接口引用对象
            cs = ct.prepareCall(sql);

            //3.给?参数赋值，分开处理，in参数用set×××()方法；out参数用registerOutParameter()方法注册
            //先传入in参数，由于事先不知道过程中的in参数类型，所以这里用CallableStatement接口中的setObject()方法统一为in参数赋值
            if (inParameters != null) {//如果输入参数不为空
                for (int i = 0; i < inParameters.length; i++) {
                    cs.setObject(i + 1, inParameters[i]);
                }
            }

            //再给out参数注册（2015.01.17此处修改有可能影响其它程序功能.......经测试，不影响，更完善）
            if (outParameters != null) {//如果输出参数不为空，则注册输出参数
                //CallableStatement接口中的registerOutParameter()方法第二个参数
                //为int型（sqlType），在考虑参数传入时，这个参数是这么写的oracle.jdbc.OracleTypes.CURSOR，这么一大串字符串
                //本质就代表了一个int型数据，即oracle.jdbc.OracleTypes.CURSOR就是一个int数值。为此outParameters应该使用
                //Integer类型封装，而不是String类型的数组了。Integer类可以自动对int型数据封装和拆封。
//                for (int j = 0; j < outParameters.length; j++) {
//                    cs.registerOutParameter(inParameters.length + 1 + j, outParameters[j]);
//                }
//上面3行代码是原来的
//2015.1.17加入null != inParameters判断
                if (null != inParameters) {
                    for (int j = 0; j < outParameters.length; j++) {
                        cs.registerOutParameter(inParameters.length + 1 + j, outParameters[j]);
                    }

                    //输入参数为null时，只注册输出参数
                } else {
                    for (int j = 0; j < outParameters.length; j++) {
                        cs.registerOutParameter(j + 1, outParameters[j]);
                    }

                }
            }

            //4.执行存储过程
            cs.execute();

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException(e.getMessage());
        }

        return cs;//返回cs即CallableStatement接口引用，给外部调用者取出Out参数的数据
    }
}
