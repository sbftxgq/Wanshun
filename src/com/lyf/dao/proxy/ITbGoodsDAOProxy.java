package com.lyf.dao.proxy;

import com.lyf.dao.ITbGoodsDAO;
import com.lyf.dao.impl.ITbGoodsDAOImpl;
import com.lyf.dbc.DatabaseConnection;
import com.lyf.util.SqlHelperNew;

public class ITbGoodsDAOProxy implements ITbGoodsDAO {

    private DatabaseConnection dbc = null;
    private SqlHelperNew sqlTool = null;
    private ITbGoodsDAO dao = null;

    public ITbGoodsDAOProxy(){
        this.sqlTool = new SqlHelperNew();
        this.dao = new ITbGoodsDAOImpl(this.sqlTool);
        this.dbc = this.sqlTool.getDbc();
    }

    @Override
    public String getStockNumberBySpecIDAndManuID(String specID, String manuID) throws Exception {
        String number = null;
        try {
            number = this.dao.getStockNumberBySpecIDAndManuID(specID,manuID);
        }catch(Exception e) {
            throw e;
        }finally {
            this.dbc.close();
        }
        return number;
    }
}
