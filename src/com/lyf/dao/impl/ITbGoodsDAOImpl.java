package com.lyf.dao.impl;

import com.lyf.dao.ITbGoodsDAO;
import com.lyf.util.SqlHelperNew;

import java.sql.ResultSet;

public class ITbGoodsDAOImpl implements ITbGoodsDAO {

    private SqlHelperNew sqlTool = null;//数据库连接工具类

    public ITbGoodsDAOImpl(SqlHelperNew sqlTool){
        this.sqlTool = sqlTool;
    }


    @Override
    public String getStockNumberBySpecIDAndManuID(String specID, String manuID) throws Exception {

        String number = null;
        String sql = "SELECT goods_number FROM tb_goods WHERE specificationId=? AND manufacturerId=?";
        String[] pars = {specID,manuID};
        //String manuIDSql = " AND manufacturerId=?";
        ResultSet rs = null;
        try {
            rs = this.sqlTool.executeQuerySQL(sql, pars);
            if (rs.next()) {
                number = rs.getString(1);//取得库存数量
            }
        }catch(Exception e){
            //number = "0";
            throw e;
        }finally {
            if(null!=rs) {
                rs.close();
                rs = null;
            }
        }
        return number;
    }
}
