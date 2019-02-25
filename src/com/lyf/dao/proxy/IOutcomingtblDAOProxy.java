package com.lyf.dao.proxy;

import com.lyf.dao.IOutcomingtblDAO;
import com.lyf.dao.impl.IOutcomingtblDAOImpl;
import com.lyf.dbc.DatabaseConnection;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.OutcomeViewVO;
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

    @Override
    public String getOutCountsByField(String qryWay, String[] fieldValues) throws Exception {
        String counts = null;
        try {
            counts = this.dao.getOutCountsByField(qryWay,fieldValues);
        } catch (Exception e) {
            counts = null;
            throw e;
        } finally {
            this.dbc.close();
        }
        return counts;
    }

    @Override
    public List<Outcomingtbl> getOutBillsByField(String qryWay, String[] fieldValues, int pageNow, int pageSize) throws Exception {
        List<Outcomingtbl> results;
        try {
            results = this.dao.getOutBillsByField(qryWay,fieldValues,pageNow,pageSize);
        } catch (Exception e) {
            throw e;
        } finally {
            this.dbc.close();
        }
        return results;
    }

    @Override
    public String[] getTotalPriceByField(String qryWay, String[] fieldValues) throws Exception {
        String[] results = null;
        try {
            results = this.dao.getTotalPriceByField(qryWay,fieldValues);
        }catch (Exception e) {
            throw e;
        } finally {
            this.dbc.close();
        }
        return results;
    }

    @Override
    public List<OutcomeViewVO> getOutBillDetailsByBillNo(String billNo) throws Exception {
        List<OutcomeViewVO> results = null;
        try {
            results = this.dao.getOutBillDetailsByBillNo(billNo);
        }catch (Exception e) {
            throw e;
        } finally {
            this.dbc.close();
        }
        return results;
    }

    @Override
    public boolean edtOutBillStatusByBillNo(String billNo, String actualTotalPrice) throws Exception {
        boolean flag = false;
        try {
            flag = this.dao.edtOutBillStatusByBillNo(billNo, actualTotalPrice);
        } catch (Exception e) {
//            flag = false;
            throw e;
        } finally {
            this.dbc.close();
        }
        return flag;
    }

}
