package com.lyf.dao.proxy;

import com.lyf.dao.IManufacturerstblDAO;
import com.lyf.dao.impl.IManufacturerstblDAOImpl;
import com.lyf.dbc.DatabaseConnection;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Manufacturerstbl;

import java.util.List;

public class IManufacturerstblDAOProxy implements IManufacturerstblDAO {

    private IManufacturerstblDAO dao = null;
    private DatabaseConnection dbc = null;
    private SqlHelperNew sqlTool = null;

    //构造方法，实例化SqlHelperNew，实例化实现类，获取到连接对象
    public IManufacturerstblDAOProxy() {
        this.sqlTool = new SqlHelperNew();//实例化工具类
        this.dao = new IManufacturerstblDAOImpl(this.sqlTool);//实例化要代理的对象
        this.dbc = this.sqlTool.getDbc();//获得连接对象dbc
    }

    @Override
    public List<Manufacturerstbl> getAllManufacturers() throws Exception {
        List<Manufacturerstbl> manufacturers = null;
        try {
            manufacturers = this.dao.getAllManufacturers();
        }catch (Exception e){
            throw e;
        }finally {
            this.dbc.close();
        }
        return manufacturers;
    }
}
