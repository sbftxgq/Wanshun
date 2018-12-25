package com.lyf.dao.impl;

import com.lyf.dao.IOutcomingtblDAO;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Outcomedetails;
import com.lyf.vo.Outcomingtbl;

import java.sql.ResultSet;
import java.util.List;

public class IOutcomingtblDAOImpl implements IOutcomingtblDAO {

    private SqlHelperNew sqlTool = null;// 数据库连接工具类

    //构造方法
    public IOutcomingtblDAOImpl(SqlHelperNew sqlTool) {
        this.sqlTool = sqlTool;
    }

    @Override
    public String getLatestBillNO() throws Exception {

        String billNo = null;
        //选择最大的billNO，降序排列，取出第一条
        String sql = "SELECT billNo FROM outcomingtbl ORDER BY billNo+0 desc LIMIT 1";
        ResultSet rs = null;
        try {
            rs = this.sqlTool.executeQuerySQL(sql, null);
            if (rs.next()) {
                billNo = rs.getString(1);
            }
        } catch (Exception e) {
            billNo = null;
            throw e;
        } finally {
            if (null != rs) {
                rs.close();
                rs = null;
            }
        }
        return billNo;
    }

    @Override
    public boolean outLibOperation(Outcomingtbl outcomeData, List<Outcomedetails> detailDataRows) throws Exception {
        boolean flag = false;
        int len = detailDataRows.size();//获取到链表中的数据数量
        //使用事务插入2个表，要么同时成功，要么回滚
        //outcomingtbl表插入语句,11个字段值
        String insertOutcomingtblSQL = "INSERT INTO outcomingtbl(billNo,billStatus,guestName,destLocation,totalPrice,actualTotalPrice,outLibMan,outLibDate,outLibWay,transitFare,shipFare) VALUES(?,?,?,?,?,?,?,?,?,?,?)";
        String[] outComeingtblPars = {
                outcomeData.getBillNo(), outcomeData.getBillStatus(), outcomeData.getGuestName(),
                outcomeData.getDestLocation(), outcomeData.getTotalPrice(), outcomeData.getActualTotalPrice(),
                outcomeData.getOutLibMan(), outcomeData.getOutLibDate(), outcomeData.getOutLibWay(),
                outcomeData.getTransitFare(), outcomeData.getShipFare()};

        //明细表插入执行根据前端明细表格行数决定执行多少次
        String insertOutcomedetailsSQL = "INSERT INTO outcomedetails(billNo,specificationId,manufacturerId,measurements,counts,unitPrice,price) VALUES";
        String firstParamSQLStr = "(?,?,?,?,?,?,?),";
        String lastParamSQLStr = "(?,?,?,?,?,?,?)";

        //字符串拼接，多个数据就有多个(?,?,?,?,?,?,?)
        for (int i = 0; i < len; i++) {
            //不是最后一个
            if (i != len - 1) {
                insertOutcomedetailsSQL = insertOutcomedetailsSQL + firstParamSQLStr;
            } else {
                //最后一个字符串
                insertOutcomedetailsSQL = insertOutcomedetailsSQL + lastParamSQLStr;
            }
        }
        String[] outcomedetailtblPars = new String[len * 7];
        int arrayIndex = 0;
        //参数数组数据初始化，一组7个值，可对7取余
        for (int j = 0; j < len; j++) {
            for (int k = 0; k < 1; k++) {
                outcomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getBillNo();
                outcomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getSpecificationId();
                outcomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getManufacturerId();
                outcomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getMeasurements();
                outcomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getCounts();
                outcomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getUnitPrice();
                outcomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getPrice();
                //arrayIndex++;
            }
        }
        //一个slqs顺序对应一个pars
        String[] sqls = {insertOutcomingtblSQL, insertOutcomedetailsSQL};
        String[][] pars = {outComeingtblPars, outcomedetailtblPars};

        //执行插入操作
        try {
            flag = this.sqlTool.executeUpdateSQLs(sqls,pars);
        }catch (Exception e){
            flag = false;
            throw e;
        }
        return flag;
    }
}
