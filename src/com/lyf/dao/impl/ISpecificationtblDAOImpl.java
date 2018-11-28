package com.lyf.dao.impl;

import com.lyf.dao.ISpecificationtblDAO;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Specificationtbl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ISpecificationtblDAOImpl implements ISpecificationtblDAO {

    private SqlHelperNew sqlTool = null;//数据库连接工具类

    //构造方法
    public ISpecificationtblDAOImpl(SqlHelperNew sqlTool) {
        this.sqlTool = sqlTool;
    }

    @Override
    public List<Specificationtbl> getAllSpecification() throws Exception {

        List<Specificationtbl> specificationtbls = null;
        //Specificationtbl spec = null;
        String sql = "SELECT specificationId,specificationName,length,arealength,areawidth,categoryId FROM specificationtbl";

        ResultSet rs = null;

        try {
            specificationtbls = new ArrayList<Specificationtbl>();
            rs = this.sqlTool.executeQuerySQL(sql,null);
            getListResult(specificationtbls, rs);
        }catch(Exception e){
            specificationtbls = null;
            throw e;
        }finally {
            if(null!=rs) {
                rs.close();
                rs = null;
            }
        }
        return specificationtbls;
    }

    @Override
    public List<Specificationtbl> getSpecificationListByCategoryId(String categoryId) throws Exception {
        List<Specificationtbl> specificationtbls = null;
        //Specificationtbl spec = null;
        String sql = "SELECT specificationId,specificationName,length,arealength,areawidth,categoryId FROM specificationtbl WHERE categoryId=?";
        String[] pars = {categoryId};
        ResultSet rs = null;

        try {
            specificationtbls = new ArrayList<Specificationtbl>();
            rs = this.sqlTool.executeQuerySQL(sql,pars);
            getListResult(specificationtbls, rs);
        }catch(Exception e){
            specificationtbls = null;
            throw e;
        }finally {
            if(null!=rs) {
                rs.close();
                rs = null;
            }
        }
        return specificationtbls;
    }

    private void getListResult(List<Specificationtbl> specificationtbls, ResultSet rs) throws SQLException {
        Specificationtbl spec;
        while (rs.next()){
            spec = new Specificationtbl();
            spec.setSpecificationId(rs.getString(1));
            spec.setSpecificationName(rs.getString(2));
            spec.setLength(rs.getFloat(3));
            spec.setArealength(rs.getFloat(4));
            spec.setAreawidth(rs.getFloat(5));
            spec.setCategoryId(rs.getString(6));
            specificationtbls.add(spec);
        }
    }
}
