package com.lyf.dao.proxy;

import com.lyf.dao.ICategorytblDAO;
import com.lyf.dao.impl.ICategorytblDAOImpl;
import com.lyf.dbc.DatabaseConnection;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Categorytbl;

import java.util.List;

public class ICategorytblDAOProxy implements ICategorytblDAO {

    private ICategorytblDAO dao = null;
    private DatabaseConnection dbc = null;
    private SqlHelperNew sqlTool = null;

    //构造方法，实例化SqlHelperNew，实例化实现类，获取到连接对象
    public ICategorytblDAOProxy() {
        this.sqlTool = new SqlHelperNew();//实例化工具类
        this.dao = new ICategorytblDAOImpl(this.sqlTool);//实例化要代理的对象
        this.dbc = this.sqlTool.getDbc();//获得连接对象dbc
    }

    @Override
    public List<Categorytbl> getAllCategory() throws Exception {
        List<Categorytbl> categorylst = null;
        try {
            categorylst = this.dao.getAllCategory();
        }catch (Exception e){
            throw e;
        }finally {
            this.dbc.close();
        }
        return categorylst;
    }
}
