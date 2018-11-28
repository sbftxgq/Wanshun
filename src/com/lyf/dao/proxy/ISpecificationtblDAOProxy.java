package com.lyf.dao.proxy;

import com.lyf.dao.ISpecificationtblDAO;
import com.lyf.dao.impl.ISpecificationtblDAOImpl;
import com.lyf.dbc.DatabaseConnection;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Specificationtbl;

import java.util.List;

public class ISpecificationtblDAOProxy implements ISpecificationtblDAO {

    private ISpecificationtblDAO dao = null;
    private DatabaseConnection dbc = null;
    private SqlHelperNew sqlTool = null;

    //构造方法，实例化SqlHelperNew，实例化实现类，获取到连接对象
    public ISpecificationtblDAOProxy() {
        this.sqlTool = new SqlHelperNew();//实例化工具类
        this.dao = new ISpecificationtblDAOImpl(this.sqlTool);//实例化要代理的对象
        this.dbc = this.sqlTool.getDbc();//获得连接对象dbc
    }

    @Override
    public List<Specificationtbl> getAllSpecification() throws Exception {

        List<Specificationtbl> specificationtbls = null;
        try {
            specificationtbls = this.dao.getAllSpecification();
        }catch (Exception e){
            throw e;
        }finally {
            this.dbc.close();
        }
        return specificationtbls;
    }

    @Override
    public List<Specificationtbl> getSpecificationListByCategoryId(String categoryId) throws Exception {
        List<Specificationtbl> specificationtbls = null;
        try {
            specificationtbls = this.dao.getSpecificationListByCategoryId(categoryId);
        }catch (Exception e){
            throw e;
        }finally {
            this.dbc.close();
        }
        return specificationtbls;
    }
}
