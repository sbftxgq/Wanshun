package com.lyf.dao.impl;

import com.lyf.dao.ICategorytblDAO;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Categorytbl;
import com.lyf.vo.Specificationtbl;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ICategorytblDAOImpl implements ICategorytblDAO {

    private SqlHelperNew sqlTool = null;//数据库连接工具类

    //构造方法
    public ICategorytblDAOImpl(SqlHelperNew sqlTool) {
        this.sqlTool = sqlTool;
    }

    @Override
    public List<Categorytbl> getAllCategory() throws Exception {

        List<Categorytbl> categorylst = null;
        //Specificationtbl spec = null;
        String sql = "SELECT categoryId,categoryName FROM categorytbl";

        ResultSet rs = null;

        try {
            categorylst = new ArrayList<Categorytbl>();
            rs = this.sqlTool.executeQuerySQL(sql,null);
            getListResult(categorylst, rs);
        }catch(Exception e){
            categorylst = null;
            throw e;
        }finally {
            if(null!=rs) {
                rs.close();
                rs = null;
            }
        }
        return categorylst;
    }

    private void getListResult(List<Categorytbl> categorylst, ResultSet rs) throws SQLException {
        Categorytbl ctgry;
        while (rs.next()){
            ctgry = new Categorytbl();
            ctgry.setCategoryId(rs.getString(1));
            ctgry.setCategoryName(rs.getString(2));
            categorylst.add(ctgry);
        }
    }
}
