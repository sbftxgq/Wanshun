package com.lyf.dao.impl;

import com.lyf.dao.IincomingtblDAO;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.IncomeViewVo;
import com.lyf.vo.Incomedetails;
import com.lyf.vo.Incomingtbl;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class IincomingtblDAOImpl implements IincomingtblDAO {

    private SqlHelperNew sqlTool = null;// 数据库连接工具类

    public IincomingtblDAOImpl(SqlHelperNew sqlTool) {
        this.sqlTool = sqlTool;
    }

    @Override
    public String getLatestBillNO(String year) throws Exception {

        String billNo = null;
        //选择最大的billNO，降序排列，取出第一条
        String sql = "SELECT billNo FROM incomingtbl WHERE billNo LIKE ? ORDER BY billNo+0 desc LIMIT 1";
        String[] pars = {year+"%"};
        ResultSet rs = null;
        try {
            rs = this.sqlTool.executeQuerySQL(sql, pars);
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
    public boolean inLibOperation(Incomingtbl incomeData, List<Incomedetails> detailDataRows) throws Exception {

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
        for (int i = 0; i < len; i++) {
            //不是最后一个
            if (i != len - 1) {
                insertIncomedetailsSQL = insertIncomedetailsSQL + firstParamSQLStr;
            } else {
                //最后一个字符串
                insertIncomedetailsSQL = insertIncomedetailsSQL + lastParamSQLStr;
            }
        }
        //假定2行，链表长度为2，即len=2，2条记录，SQL语句?参数个数为2*7=14个，7个?为一组
        /*
        in[0]--in[6]：链表下标0，对应第一组(?,?,?,?,?,?,?)
        in[7]--in[13]：链表下标1，对应第二组(?,?,?,?,?,?,?)
        ...，依次类推
         */
        String[] incomedetailtblPars = new String[len * 7];
        int arrayIndex = 0;
        //参数数组数据初始化，一组7个值，可对7取余
        for (int j = 0; j < len; j++) {
            for (int k = 0; k < 1; k++) {
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
        String[] sqls = {insertIncomingtblSQL, insertIncomedetailsSQL};
        String[][] pars = {inComeingtblPars, incomedetailtblPars};
        //pars是一个二维数组
        try {
            flag = this.sqlTool.executeUpdateSQLs(sqls, pars);
        } catch (Exception e) {
            flag = false;
            throw e;
        }
        return flag;
    }

    @Override
    public List<Incomingtbl> getBillsByField(String qryWay, String[] fieldValues, int pageNow, int pageSize) throws Exception {

        List<Incomingtbl> results = null;
        //fieldValues字符串数组长度为1或者2，为2为日期范围，为1为规格
        //查所有分页，2个参数：pageNow/pageSize
        String qryAllByPageSQL = "SELECT A.billNo,totalPrice+transitFare+shipFare AS total,inLibDate,inLibWay," +
                "transitFare,shipFare FROM incomingtbl A INNER JOIN(SELECT zzID,billNo FROM incomingtbl" +
                " ORDER BY billNo LIMIT ?,?) B ON A.zzID=B.zzID";

        //日期范围分页，前2个日期，后2个pageNow/pageSize
        String dateRangeByPageSQL = "SELECT A.billNo,totalPrice+transitFare+shipFare AS total,inLibDate," +
                "inLibWay,transitFare,shipFare FROM incomingtbl A INNER JOIN(SELECT zzID,billNo FROM" +
                " incomingtbl WHERE inLibDate BETWEEN ? AND ? ORDER BY billNo" +
                " LIMIT ?,?) AS B ON A.zzID=B.zzID";

        //按规格查SQL语句分页：6个？，前4个为ID,同一个参数，最后2个为pageNow/pageSize
        String specIDQryByPageSQL = "SELECT C.billNo,C.price,inLibDate,inLibWay,transitFare,shipFare FROM" +
                " (select A.billNo,B.price,inLibDate,inLibWay,transitFare,shipFare from(select billNo," +
                "inLibDate,inLibWay,transitFare,shipFare from incomingtbl where billNo in(select billNo" +
                " from incomedetails where specificationId=?)) AS A JOIN (select billNo,price from" +
                " incomedetails where specificationId=?) AS B ON A.billNo = B.billNo order by billNo) C" +
                " INNER JOIN (SELECT A.billNo from(select billNo,inLibDate,inLibWay,transitFare,shipFare" +
                " from incomingtbl where billNo in(select billNo from incomedetails where specificationId=?))" +
                " AS A JOIN (select billNo,price from incomedetails where specificationId=?) AS B ON A.billNo" +
                " = B.billNo order by billNo LIMIT ?,?) AS D ON C.billNo=D.billNo";

        String qrySQL = null;
        //传递参数个数在调用时确定，调用时传递了3个参数，参数顺序：起始时间[0]、结束时间[1]、规格ID[2]
        String[] pars = null;
        //根据查询方式拼接SQL语句，并赋予参数
        switch (qryWay) {
            //日期范围，4个参数值，前2个日期，后2个pageNow/pageSize
            case "DTR":
                qrySQL = dateRangeByPageSQL;
                //参数赋值
                pars = new String[2];
                pars[0] = fieldValues[0];//起始日期
                pars[1] = fieldValues[1];//结束日期
                break;
            //规格ID，6个？，前4个为ID,同一个参数，最后2个为pageNow/pageSize
            case "SID":
                qrySQL = specIDQryByPageSQL;
                //参数赋值，此SQL语句2个？号均为规格ID
                pars = new String[4];
                pars[0] = fieldValues[2];//第三个参数为规格ID
                pars[1] = fieldValues[2];//第三个参数为规格ID
                pars[2] = fieldValues[2];//第三个参数为规格ID
                pars[3] = fieldValues[2];//第三个参数为规格ID
                break;
            //查所有
            default:
                qrySQL = qryAllByPageSQL;
        }
        //System.out.println(qrySQL);
        //System.out.println("两个参数，参数1：" + pars[0] + "参数2：" + pars[1]);
        //执行SQL语句并封装
        try {
            results = getIncomingtbls(qrySQL, pars, pageNow, pageSize);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
        return results;
    }

    //考虑分页...，参见分页的方法，见上一个方法
    @Override
    public List<Incomingtbl> getBillsByField(String qryWay, String[] fieldValues) throws Exception {

        List<Incomingtbl> results = null;
        //fieldValues字符串数组长度为1或者2，为2为日期范围，为1为规格
        //查所有
        String baseSQL = "SELECT billNo,totalPrice+transitFare+shipFare AS total,inLibDate,inLibWay,transitFare,shipFare FROM incomingtbl";

        //WHERE子句，前有空格，两个参数，日期范围
        String dateRangeClause = " WHERE inLibDate BETWEEN ? AND ?";

        //按规格查子句，前有空格，一个参数：规格ID
        //String specIDClause = " WHERE billNo IN(SELECT billNo FROM incomedetails WHERE specificationId=?)";
        String specIDQrySQL = "SELECT A.billNo,B.price,inLibDate,inLibWay,transitFare,shipFare FROM(SELECT billNo," +
                "inLibDate,inLibWay,transitFare,shipFare FROM incomingtbl WHERE billNo in(SELECT billNo FROM " +
                "incomedetails WHERE specificationId=?) ) AS A JOIN (SELECT billNo,price FROM incomedetails " +
                "WHERE specificationId=?) AS B ON A.billNo = B.billNo";

        //排序子句
        String orderClause = " ORDER BY billNo";//默认升序，前方空格

        String qrySQL = null;
        //传递参数个数在调用时确定，调用时传递了3个参数，参数顺序：起始时间[0]、结束时间[1]、规格ID[2]
        String[] pars = null;
        //根据查询方式拼接SQL语句，并赋予参数
        switch (qryWay) {
            //日期范围，2个参数值
            case "DTR":
                qrySQL = baseSQL + dateRangeClause + orderClause;
                //参数赋值
                pars = new String[2];
                pars[0] = fieldValues[0];//起始日期
                pars[1] = fieldValues[1];//结束日期
                break;
            //规格ID
            case "SID":
                qrySQL = specIDQrySQL + orderClause;
                //参数赋值，此SQL语句2个？号均为规格ID
                pars = new String[2];
                pars[0] = fieldValues[2];//第三个参数为规格ID
                pars[1] = fieldValues[2];//仍为规格ID
                break;
            //查所有,pars为null
            default:
                qrySQL = baseSQL + orderClause;
        }
        //执行SQL语句并封装
        ResultSet rs = null;
        Incomingtbl curRecord = null;
        try {
            rs = this.sqlTool.executeQuerySQL(qrySQL, pars);
            results = new ArrayList<Incomingtbl>();
            while (rs.next()) {
                //?表示数据库类型与getString类型不一致，看是否需要转换
                curRecord = new Incomingtbl();
                curRecord.setBillNo(rs.getString(1));//单号
                //总价?(此时已经完成了总成本计算，包含了运费和装卸费)，如果是规格查则为该规格成本，不含其它费用
                curRecord.setTotalPrice(rs.getString(2));
                curRecord.setInLibDate(rs.getString(3));//入库日期?
                curRecord.setInLibWay(rs.getString(4));//入库方式
                curRecord.setTransitFare(rs.getString(5));//运费?
                curRecord.setShipFare(rs.getString(6));//装卸费?
                results.add(curRecord);
            }
        } catch (Exception e) {
            results = null;
            throw e;
        } finally {
            if (null != rs) {
                rs.close();
                rs = null;
            }
        }
        return results;
    }

    @Override
    public List<IncomeViewVo> getBillDetailsByBillNo(String billNo) throws Exception {

        List<IncomeViewVo> results = null;
        ResultSet rs = null;
        IncomeViewVo curRecord = null;

        String qrySQL = "SELECT billNo,totalPrice,inLibDate,inLibWay,transitFare,shipFare,specificationName,manufacturerName," +
                "measurements,counts,unitPrice,price FROM incomedetailsView WHERE billNo=?";

        String[] pars = {billNo};

        try {
            rs = this.sqlTool.executeQuerySQL(qrySQL,pars);
            results = new ArrayList<IncomeViewVo>();
            while (rs.next()){
                curRecord = new IncomeViewVo();
                curRecord.setBillNo(rs.getString(1));//订单
                curRecord.setTotalPrice(rs.getString(2));//该订单商品总价（不含装卸和运费）
                curRecord.setInLibDate(rs.getString(3));//入库日期
                curRecord.setInLibWay(rs.getString(4));//装卸方式
                curRecord.setTransitFare(rs.getString(5));//运费
                curRecord.setShipFare(rs.getString(6));//装卸费
                curRecord.setSpecificationName(rs.getString(7));//规格名
                curRecord.setManufacturerName(rs.getString(8));//厂家名
                curRecord.setMeasurements(rs.getString(9));//计量单位
                curRecord.setCounts(rs.getString(10));//该规格数量
                curRecord.setUnitPrice(rs.getString(11));//该规格单价
                curRecord.setPrice(rs.getString(12));//该规格成本
                results.add(curRecord);
            }
        }catch (Exception e){
            results = null;
            throw e;
        }finally {
            if (null != rs) {
                rs.close();
                rs = null;
            }
        }
        return results;
    }

    private List<Incomingtbl> getIncomingtbls(String qrySQL, String[] pars, int pageNow, int pageSize) throws Exception {
        List<Incomingtbl> results;//执行SQL语句并封装
        ResultSet rs = null;
        Incomingtbl curRecord = null;
        try {
            rs = this.sqlTool.executeQuerySQL(qrySQL, pars, pageNow, pageSize);
            results = new ArrayList<Incomingtbl>();
            while (rs.next()) {
                //?表示数据库类型与getString类型不一致，看是否需要转换
                curRecord = new Incomingtbl();
                curRecord.setBillNo(rs.getString(1));//单号
                //总价?(此时已经完成了总成本计算，包含了运费和装卸费)，如果是规格查则为该规格成本，不含其它费用
                curRecord.setTotalPrice(rs.getString(2));
                curRecord.setInLibDate(rs.getString(3));//入库日期?
                curRecord.setInLibWay(rs.getString(4));//入库方式
                curRecord.setTransitFare(rs.getString(5));//运费?
                curRecord.setShipFare(rs.getString(6));//装卸费?
                results.add(curRecord);
            }
        } catch (Exception e) {
            results = null;
            throw e;
        } finally {
            if (null != rs) {
                rs.close();
                rs = null;
            }
        }
        return results;
    }

    @Override
    public String getCountsByField(String qryWay, String[] fieldValues) throws Exception {

        String counts = null;

        String allCounts = "SELECT count(*) FROM incomingtbl";
        String dateRangeClause = " WHERE inLibDate BETWEEN ? AND ?";
        String specIDCounts = "SELECT count(*) FROM (SELECT billNo FROM incomingtbl WHERE billNo IN(SELECT billNo FROM incomedetails WHERE specificationId=?)) A";

        String qrySQL = null;
        //传递参数个数在调用时确定，调用时传递了3个参数，参数顺序：起始时间[0]、结束时间[1]、规格ID[2]
        String[] pars = null;
        //根据查询方式拼接SQL语句，并赋予参数
        switch (qryWay) {
            //日期范围，2个参数值
            case "DTR":
                qrySQL = allCounts + dateRangeClause;
                //参数赋值
                pars = new String[2];
                pars[0] = fieldValues[0];//起始日期
                pars[1] = fieldValues[1];//结束日期
                break;
            //规格ID
            case "SID":
                qrySQL = specIDCounts;
                //参数赋值，此SQL语句1个？为规格ID
                pars = new String[1];
                pars[0] = fieldValues[2];//第三个参数为规格ID
                break;
            //查所有,pars为null
            default:
                qrySQL = allCounts;
        }
        //执行SQL语句并封装
        ResultSet rs = null;
        try {
            rs = this.sqlTool.executeQuerySQL(qrySQL, pars);
            if (rs.next()) {
                counts = rs.getString(1);//取得数量
            }
        } catch (Exception e) {
            counts = null;
            throw e;
        } finally {
            if (null != rs) {
                rs.close();
                rs = null;
            }
        }
        return counts;
    }
}
