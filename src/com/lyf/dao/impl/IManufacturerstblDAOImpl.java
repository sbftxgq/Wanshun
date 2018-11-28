package com.lyf.dao.impl;

import com.lyf.dao.IManufacturerstblDAO;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Manufacturerstbl;
import com.lyf.vo.Specificationtbl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class IManufacturerstblDAOImpl implements IManufacturerstblDAO {

    private SqlHelperNew sqlTool = null;//数据库连接工具类

    //构造方法
    public IManufacturerstblDAOImpl(SqlHelperNew sqlTool) {

        this.sqlTool = sqlTool;
    }


    private void getListResult(List<Manufacturerstbl> manufacturers, ResultSet rs) throws SQLException {
        Manufacturerstbl manu;
        while (rs.next()){
            manu = new Manufacturerstbl();
            manu.setManufacturerId(rs.getString(1));
            manu.setManufacturerName(rs.getString(2));
            manufacturers.add(manu);
        }
    }

    @Override
    public List<Manufacturerstbl> getAllManufacturers() throws Exception {

        List<Manufacturerstbl> manufacturers = null;
        //Specificationtbl spec = null;
        String sql = "SELECT manufacturerId,manufacturerName FROM manufacturerstbl";

        ResultSet rs = null;

        try {
            manufacturers = new ArrayList<Manufacturerstbl>();
            rs = this.sqlTool.executeQuerySQL(sql,null);
            getListResult(manufacturers, rs);
        }catch(Exception e){
            manufacturers = null;
            throw e;
        }finally {
            if(null!=rs) {
                rs.close();
                rs = null;
            }
        }
        return manufacturers;
    }
}
