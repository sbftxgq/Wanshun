package com.lyf.dao.proxy;

import com.lyf.dao.IincomingtblDAO;
import com.lyf.dao.impl.IincomingtblDAOImpl;
import com.lyf.dbc.DatabaseConnection;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Incomedetails;
import com.lyf.vo.Incomingtbl;

import java.util.List;

public class IincomingtblDAOProxy implements IincomingtblDAO {

    private IincomingtblDAO dao = null;
    private DatabaseConnection dbc = null;
    private SqlHelperNew sqlTool = null;

    public IincomingtblDAOProxy(){
        this.sqlTool = new SqlHelperNew();//实例化工具类
        this.dao = new IincomingtblDAOImpl(this.sqlTool);//实例化要代理的对象
        this.dbc = this.sqlTool.getDbc();//获得连接对象dbc
    }

    @Override
    public String getLatestBillNO() throws Exception {

        String billNo = null;
        try {
            billNo = this.dao.getLatestBillNO();
        }catch (Exception e){
            billNo = null;
            throw e;
        }finally {
            this.dbc.close();
        }

        return billNo;
    }

    @Override
    public boolean inLibOperation(Incomingtbl incomeData, List<Incomedetails> detailRowsData) {
        try{
            return this.dao.inLibOperation(incomeData,detailRowsData);
        }finally {
            this.dbc.close();
        }
    }
}
