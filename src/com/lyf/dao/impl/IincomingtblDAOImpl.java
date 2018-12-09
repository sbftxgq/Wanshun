package com.lyf.dao.impl;

import com.lyf.dao.IincomingtblDAO;
import com.lyf.util.SqlHelperNew;

import java.sql.ResultSet;

public class IincomingtblDAOImpl implements IincomingtblDAO {

    private SqlHelperNew sqlTool = null;// 数据库连接工具类

    public IincomingtblDAOImpl(SqlHelperNew sqlTool) {
        this.sqlTool = sqlTool;
    }

    @Override
    public String getLatestBillNO() throws Exception {

        String billNo = null;
        //选择最大的billNO，降序排列，取出第一条
        String sql = "SELECT billNo FROM incomingtbl ORDER BY billNo desc LIMIT 1";
        ResultSet rs = null;
        try {
            rs = this.sqlTool.executeQuerySQL(sql,null);
            if (rs.next()){
                billNo = rs.getString(1);
            }
        }catch(Exception e){
            billNo = null;
            throw e;
        }finally {
            if(null!=rs) {
                rs.close();
                rs = null;
            }
        }
        return billNo;
    }
}
