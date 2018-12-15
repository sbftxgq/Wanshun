package com.lyf.dao.impl;

import com.lyf.dao.IincomingtblDAO;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Incomedetails;
import com.lyf.vo.Incomingtbl;

import java.sql.ResultSet;
import java.util.List;

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

    //入库操作
    @Override
    public boolean inLibOperation(Incomingtbl incomeData, List<Incomedetails> detailDataRows) {

        boolean flag = false;
        int len = detailDataRows.size();//获取到链表中的数据数量
        //使用事务插入2个表，要么同时成功，要么回滚
        //这个incomingtbl表插入只执行一次
        String insertIncomingtblSQL = "INSERT INTO incomingtbl(billNo,totalPrice,inLibDate,inLibWay,transitFare,shipFare) VALUES(?,?,?,?,?,?)";
        String[] inComeingtblPars = {
                incomeData.getBillNo(), incomeData.getTotalPrice(),
                incomeData.getInLibDate(), incomeData.getInLibWay(),
                incomeData.getTransitFare(), incomeData.getShipFare()};

        //明细表插入执行根据前端明细表格行数决定执行多少次
        String insertIncomedetailsSQL = "INSERT INTO incomedetails(billNo,specificationId,manufacturerId,measurements,counts,unitPrice,price) VALUES";
        String firstParamSQLStr = "(?,?,?,?,?,?,?),";
        String lastParamSQLStr = "(?,?,?,?,?,?,?)";

        //字符串拼接，多个数据就有多个(?,?,?,?,?,?,?)
        for (int i=0; i<len; i++){
            //不是最后一个
            if (i!=len-1){
                insertIncomedetailsSQL = insertIncomedetailsSQL+firstParamSQLStr;
            }else{
                //最后一个字符串
                insertIncomedetailsSQL = insertIncomedetailsSQL+lastParamSQLStr;
            }
        }
        //假定2行，链表长度为2，即len=2，2条记录，SQL语句?参数个数为2*7=14个，7个?为一组
        /*
        in[0]--in[6]：链表下标0，对应第一组(?,?,?,?,?,?,?)
        in[7]--in[13]：链表下标1，对应第二组(?,?,?,?,?,?,?)
        ...，依次类推
         */
        String[] incomedetailtblPars = new String[len*7];
        int arrayIndex = 0;
        //参数数组数据初始化，一组7个值，可对7取余
        for (int j=0; j<len; j++){
            for(int k=0; k<1; k++){
                incomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getBillNo();
                incomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getSpecificationId();
                incomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getManufacturerId();
                incomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getMeasurements();
                incomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getCounts();
                incomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getUnitPrice();
                incomedetailtblPars[arrayIndex++] = detailDataRows.get(j).getPrice();
                //arrayIndex++;
            }
        }
        //一个slqs顺序对应一个pars
        String[] sqls = {insertIncomingtblSQL,insertIncomedetailsSQL};
        String[][] pars = {inComeingtblPars,incomedetailtblPars};

        //原来的情况，pars是一个数组
        flag = this.sqlTool.executeUpdateSQLs(sqls,pars);
        return flag;
    }
}
