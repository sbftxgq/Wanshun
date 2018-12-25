package com.lyf.dao.proxy;

import com.lyf.dao.IOutcomingtblDAO;
import com.lyf.dao.impl.IOutcomingtblDAOImpl;
import com.lyf.dbc.DatabaseConnection;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Outcomedetails;
import com.lyf.vo.Outcomingtbl;

import java.util.List;

public class IOutcomingtblDAOProxy implements IOutcomingtblDAO {
    private IOutcomingtblDAO dao = null;
    private DatabaseConnection dbc = null;
    private SqlHelperNew sqlTool = null;

    public IOutcomingtblDAOProxy() {
        this.sqlTool = new SqlHelperNew();//实例化工具类
        this.dao = new IOutcomingtblDAOImpl(this.sqlTool);
        this.dbc = this.sqlTool.getDbc();
    }

    @Override
    public String getLatestBillNO() throws Exception {
        String billNo = null;
        try {
            billNo = this.dao.getLatestBillNO();
        } catch (Exception e) {
            billNo = null;
            throw e;
        } finally {
            this.dbc.close();
        }
        return billNo;
    }

    @Override
    public boolean outLibOperation(Outcomingtbl outcomeData, List<Outcomedetails> detailDataRows) throws Exception {
        boolean flag = false;
        try {
            flag = this.dao.outLibOperation(outcomeData, detailDataRows);
        } catch (Exception e) {
            flag = false;
            throw e;
        } finally {
            this.dbc.close();
        }
        return flag;
    }
}
