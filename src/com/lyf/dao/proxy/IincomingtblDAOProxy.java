package com.lyf.dao.proxy;

import com.lyf.dao.IincomingtblDAO;
import com.lyf.dao.impl.IincomingtblDAOImpl;
import com.lyf.dbc.DatabaseConnection;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.IncomeViewVo;
import com.lyf.vo.Incomedetails;
import com.lyf.vo.Incomingtbl;

import java.util.List;

public class IincomingtblDAOProxy implements IincomingtblDAO {

    private IincomingtblDAO dao = null;
    private DatabaseConnection dbc = null;
    private SqlHelperNew sqlTool = null;

    public IincomingtblDAOProxy() {
        this.sqlTool = new SqlHelperNew();//实例化工具类
        this.dao = new IincomingtblDAOImpl(this.sqlTool);//实例化要代理的对象
        this.dbc = this.sqlTool.getDbc();//获得连接对象dbc
    }

    @Override
    public String getLatestBillNO(String year) throws Exception {

        String billNo = null;
        try {
            billNo = this.dao.getLatestBillNO(year);
        } catch (Exception e) {
            billNo = null;
            throw e;
        } finally {
            this.dbc.close();
        }
        return billNo;
    }

    @Override
    public boolean inLibOperation(Incomingtbl incomeData, List<Incomedetails> detailDataRows) throws Exception {
        boolean flag = false;
        try {
            flag = this.dao.inLibOperation(incomeData, detailDataRows);
        } catch (Exception e) {
            flag = false;
            throw e;
        } finally {
            this.dbc.close();
        }
        return flag;
    }

    @Override
    public List<Incomingtbl> getBillsByField(String qryWay, String[] fieldValues, int pageNow, int pageSize) throws Exception {
        List<Incomingtbl> results = null;
        try {
            results = this.dao.getBillsByField(qryWay,fieldValues,pageNow,pageSize);
        } catch (Exception e) {
            results = null;
            throw e;
        } finally {
            this.dbc.close();
        }
        return results;
    }

    @Override
    public List<Incomingtbl> getBillsByField(String qryWay, String[] fieldValues) throws Exception {
        List<Incomingtbl> results = null;
        try {
            results = this.dao.getBillsByField(qryWay,fieldValues);
        } catch (Exception e) {
            results = null;
            throw e;
        } finally {
            this.dbc.close();
        }
        return results;
    }

    @Override
    public List<IncomeViewVo> getBillDetailsByBillNo(String billNo) throws Exception {
        List<IncomeViewVo> results = null;
        try {
            results = this.dao.getBillDetailsByBillNo(billNo);
        } catch (Exception e) {
            results = null;
            throw e;
        } finally {
            this.dbc.close();
        }
        return results;
    }

    @Override
    public String getCountsByField(String qryWay, String[] fieldValues) throws Exception {
        String counts = null;
        try {
            counts = this.dao.getCountsByField(qryWay,fieldValues);
        } catch (Exception e) {
            counts = null;
            throw e;
        } finally {
            this.dbc.close();
        }
        return counts;
    }
}
