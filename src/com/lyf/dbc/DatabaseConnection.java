package com.lyf.dbc;

import sun.net.www.content.image.x_xbitmap;

import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

public class DatabaseConnection {

    //private static final String DSNAME = "java:comp/env/jdbc/jiaocailib";
    private Connection connection;
    private static String DRIVER;
    private static String URL;
    
    //供外部类（例如JavaBackupMysql类）获取
    public static String USERNAME;
    public static String PASSWD;
    
    //公共的数据成员（供外部访问，例如JavaBackupMysql类）
    //public static String DATABASENAME;//数据库名
    
    //静态代码块，读取属性文件，获得数据库连接信息
    static {
        Properties pp = new Properties();
        try {
            //获得输入流is 
            InputStream is = DatabaseConnection.class.getClassLoader().getResourceAsStream("jdbcConnConfig.propertites");
            pp.load(is);
            //从配置文件中读取数据，获得数据连接信息
            DRIVER = pp.getProperty("driver");
            URL = pp.getProperty("url");
            USERNAME = pp.getProperty("username");
            PASSWD = pp.getProperty("password");
            //加载驱动
            Class.forName(DRIVER);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /*
     //该构造方法适用于Tomcat配置了数据库连接池使用
     public DatabaseConnection(){
     Context ct=null;
     try {
     ct = new InitialContext();
     //这就是连接池ds，从连接池ds中使用getConnection()方法获得一个连接
     DataSource ds = (DataSource)ct.lookup(DSNAME);
     //ds = (DataSource)ct.lookup(DSNAME);
     this.connection = ds.getConnection();
     } catch (NamingException e) {
     e.printStackTrace();
     } catch (SQLException e) {
     e.printStackTrace();
     }
     }
     */
    //构造方法：从自定义的连接池中获得连接
    public DatabaseConnection() {
        //Context ct=null;
        try {
            /* 这里是用到了自定义数据库连接池
             IDataBase db = new Mysql("//localhost", "jiaocailib", "root","jcjys78143");
             DBConnectPool pool = new DBConnectPool(db);
             DBConnector connect = pool.getConnection();
             this.connection = connect.getConnection();*/
            //修改为读取属性文件，获得连接
            this.connection = DriverManager.getConnection(URL, USERNAME, PASSWD);
        } catch (Exception e) {
            //JOptionPane.showMessageDialog(null, "数据库连接失败！\n\t检查是否安装MySQL数据库，安装后是否启动数据库服务。\n请先设置数据库后再启动本程序！", "错误", JOptionPane.OK_OPTION);
            e.printStackTrace();
        }
    }

    public Connection getConnection() {
        return connection;
    }
    
    public void close() {
        if (null != connection) {
            try {
                connection.close();
                connection = null;
            } catch (SQLException e) {
                e.printStackTrace();
            }
        }
    }
/*
    public static void main(String[] args) {
        System.out.println(new DatabaseConnection().getConnection()+"---object");
    }
 */
}
