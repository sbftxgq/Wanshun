package com.lyf.dao.impl;

import com.lyf.dao.IOutcomingtblDAO;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.OutcomeViewVO;
import com.lyf.vo.Outcomedetails;
import com.lyf.vo.Outcomingtbl;

import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class IOutcomingtblDAOImpl implements IOutcomingtblDAO {

    private SqlHelperNew sqlTool = null;// 数据库连接工具类
    //构造方法
    public IOutcomingtblDAOImpl(SqlHelperNew sqlTool) {
        this.sqlTool = sqlTool;
    }

    @Override
    public String getLatestBillNO(String year) throws Exception {

        String billNo = null;
        //选择最大的billNO，降序排列，取出第一条，2019.02.25修改，增加年号来查询
        String sql = "SELECT billNo FROM outcomingtbl WHERE billNo LIKE ? ORDER BY billNo+0 desc LIMIT 1";
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

    @Override
    public String getOutCountsByField(String qryWay, String[] fieldValues) throws Exception {

        String counts = null;

        //所有出库单总数
        String allCounts = "SELECT count(*) FROM outcomingtbl";
        //送货日期范围子句
        String dateRangeClause = " WHERE outLibDate BETWEEN ? AND ?";
        //按规格查询的子句
        String specIDCounts = "SELECT count(*) FROM (SELECT billNo FROM outcomingtbl WHERE billNo IN(SELECT billNo FROM outcomedetails WHERE specificationId=?)) A";
        //客户名称子句(使用模糊查)
        String guestNameClause = " WHERE guestName like ?";
        //送货地点子句(使用模糊查)
        //String destNameClause = " WHERE destLocation like ?";
        //日期+客户名称子句
        String dateRgAndGnmeClause = " WHERE guestName like ? AND outLibDate BETWEEN ? AND ?";
        //日期+规格
        String dateRgAndSpID = "SELECT count(*) FROM (SELECT billNo, outLibDate FROM outcomingtbl WHERE billNo IN(SELECT billNo FROM outcomedetails WHERE specificationId=?)) A WHERE A.outLibDate BETWEEN ? AND ?";
        //日期+未付订单
        String dateRgAndNoPayClause = " WHERE billStatus=0 AND outLibDate BETWEEN ? AND ?";
        //客户+未付订单
        String guestNameAndNoPayClause = " WHERE guestName like ? AND billStatus=0";
        //日期+客户+未付订单
        String dateRgAndGstNmeAndNoPayClause = " WHERE guestName like ? AND billStatus=0 AND outLibDate BETWEEN ? AND ?";
        //未付订单子句
        String noPayClause = " WHERE billStatus=0";

        String qrySQL = null;
        //传递参数个数在调用时确定，调用时传递了5个参数
        //参数顺序：[0]起始、[1]结束日期、[2]商品规格ID、[3]客户姓名、[4]送货地点（最后一个送货地点取消）
        String[] pars = null;
        //根据查询方式拼接SQL语句，并赋予参数
        switch (qryWay) {
            //送货日期范围，2个参数值：[0]起始、[1]结束日期
            case "DTR":
                qrySQL = allCounts + dateRangeClause;
                //参数赋值
                pars = new String[2];
                pars[0] = fieldValues[0];//起始日期
                pars[1] = fieldValues[1];//结束日期
                //System.out.println("参数："+ pars[0]+","+ pars[1]);
                break;
            //客户名称，1个参数值，[3]客户姓名
            case "GNM":
                qrySQL = allCounts + guestNameClause;
                //参数赋值
                pars = new String[1];
                pars[0] = "%"+fieldValues[3]+"%";//客户姓名
                //System.out.println("参数："+ pars[0]);
                break;
            //送货地点，1个参数值，[4]送货地点
//            case "DST":
//                qrySQL = allCounts + destNameClause;
//                //参数赋值
//                pars = new String[1];
//                pars[0] = "%"+fieldValues[4]+"%";//送货地点
//                break;
            //规格ID
            case "SID":
                qrySQL = specIDCounts;
                //参数赋值，此SQL语句1个？为规格ID，[2]商品规格
                pars = new String[1];
                pars[0] = fieldValues[2];//规格ID
                //System.out.println("参数："+ pars[0]);
                break;
            //送货日期+客户名称，共3个参数：参数1：客户名[3]；参数2：起始日期[0]；参数3：结束日期[1]
            case "DGNM":
                qrySQL = allCounts + dateRgAndGnmeClause;
                //参数赋值，此SQL语句3个？
                pars = new String[3];
                pars[0] = "%"+fieldValues[3]+"%";//客户名称
                pars[1] = fieldValues[0];//起始日期
                pars[2] = fieldValues[1];//结束日期
                //System.out.println("参数："+ pars[0]+","+ pars[1]+","+ pars[2]);
                break;
            //送货日期+商品规格
            case "DSID":
                qrySQL = dateRgAndSpID;
                //参数赋值，此SQL语句3个？为规格ID[2]，起始日期[0]，结束日期[1]
                pars = new String[3];
                pars[0] = fieldValues[2];//规格ID
                pars[1] = fieldValues[0];//起始日期
                pars[2] = fieldValues[1];//结束日期
                //System.out.println("参数："+ pars[0]+","+ pars[1]+","+ pars[2]);
                break;
            //送货日期+未付订单
            case "DNPY":
                qrySQL = allCounts + dateRgAndNoPayClause;
                //参数赋值，此SQL语句2个？为起始、结束日期
                pars = new String[2];
                pars[0] = fieldValues[0];//起始日期
                pars[1] = fieldValues[1];//结束日期
                //System.out.println("参数："+ pars[0]+","+ pars[1]);
                break;
            //客户名称+未付订单
            case "GNPY":
                qrySQL = allCounts + guestNameAndNoPayClause;
                //参数赋值，此SQL语句1个？为客户名称
                pars = new String[1];
                pars[0] = "%"+fieldValues[3]+"%";//模糊查，客户名
                //System.out.println("参数："+ pars[0]);
                break;
            //日期+客户+未付订单
            case "DGNPY":
                qrySQL = allCounts + dateRgAndGstNmeAndNoPayClause;
                //参数赋值，此SQL语句3个？，客户名、起始、结束日期
                pars = new String[3];
                pars[0] = "%"+fieldValues[3]+"%";//客户名称
                pars[1] = fieldValues[0];//起始日期
                pars[2] = fieldValues[1];//结束日期
                //System.out.println("参数："+ pars[0]+","+ pars[1]+","+ pars[2]);
                break;
            //列出所有未付订单
            case "NPY":
                qrySQL = allCounts + noPayClause;
                //参数赋值，此SQL语句没有参数，pars置空
                break;
            //查所有,case类型值"ALL"，pars为null
            default:
                qrySQL = allCounts;
        }
        //System.out.println("参数数组的值："+fieldValues[0]+","+fieldValues[1]+","+fieldValues[2]+","+fieldValues[3]);
        //System.out.println(qrySQL);
        //System.out.println("参数："+ pars[0]+","+ pars[1]+","+ pars[2]);
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

    @Override
    public List<Outcomingtbl> getOutBillsByField(String qryWay, String[] fieldValues, int pageNow, int pageSize) throws Exception {

        String qrySQL;
        String startSQL = "SELECT billNo,guestName,outLibDate,billStatus,totalPrice-transitFare-shipFare AS sales FROM" +
                " outcomingtbl A INNER JOIN ";

        //1、DTR类型查询：4参数：起始，结束，pageNow，pageSize
        String dateRangeClauseByPage = "(SELECT zzID FROM outcomingtbl WHERE outLibDate BETWEEN ? AND ? ORDER" +
                " BY zzID LIMIT ?,?) AS B ON A.zzID=B.zzID";

        //2、客户名,3参数：like "%"+?+"%",pageNow，pageSize
        String guestNameClauseByPage = "(SELECT zzID FROM outcomingtbl WHERE guestName LIKE ? ORDER BY zzID LIMIT ?,?)" +
                " AS B ON A.zzID=B.zzID";

        //3、规格ID，6个参数，参数顺序：规格ID、规格ID、规格ID、规格ID、pageNow、pageSize
        String qrySQLBySpecIDByPage = "SELECT C.billNo,guestName,outLibDate,billStatus,price FROM (SELECT A.*,B.price FROM" +
                " (SELECT billNo,guestName,outLibDate,billStatus FROM outcomingtbl WHERE billNo IN(SELECT billNo FROM" +
                " outcomedetails WHERE specificationId=?)) A JOIN (SELECT billNo,price FROM outcomedetails" +
                " WHERE specificationId=?) B ON A.billNo=B.billNo) C INNER JOIN (SELECT A.billNo from(SELECT" +
                " billNo,guestName,outLibDate,billStatus FROM outcomingtbl WHERE billNo IN(SELECT billNo FROM" +
                " outcomedetails WHERE specificationId=?)) A JOIN (SELECT billNo,price FROM outcomedetails" +
                " WHERE specificationId=?) B ON A.billNo=B.billNo ORDER BY A.billNo LIMIT ?,?) AS D" +
                " ON C.billNo =D.billNo";

        //4、日期+客户名，5参数：客户名,like "%"+?+"%"、起始、结束、pageNow、pageSiz
        String dateRgAndGnmeClauseByPage = "(SELECT zzID FROM outcomingtbl WHERE guestName LIKE ? AND outLibDate" +
                " BETWEEN ? AND ? ORDER BY zzID LIMIT ?,?) B ON A.zzID=B.zzID";

        //5、日期+规格，10个参数：起始、结束、规格、规格，起始、结束、规格、规格，pageNow、pageSize
        String dateRgAndSpIDByPage = "SELECT C.billNo,guestName,outLibDate,billStatus,price FROM (SELECT A.*,B.price" +
                " FROM (SELECT billNo,guestName,outLibDate,billStatus FROM outcomingtbl WHERE outLibDate BETWEEN ? AND ?" +
                " AND billNo IN(SELECT billNo FROM outcomedetails WHERE specificationId=?)) A JOIN (SELECT" +
                " billNo,price FROM outcomedetails WHERE specificationId=?) B ON A.billNo=B.billNo) C" +
                " INNER JOIN (SELECT A.billNo from(SELECT billNo,guestName,outLibDate,billStatus FROM outcomingtbl WHERE" +
                " outLibDate BETWEEN ? AND ? AND billNo IN(SELECT billNo FROM outcomedetails WHERE" +
                " specificationId=?)) A JOIN (SELECT billNo,price FROM outcomedetails WHERE specificationId=?)" +
                " B ON A.billNo=B.billNo ORDER BY A.billNo LIMIT ?,?) AS D ON C.billNo =D.billNo";

        //6、日期+未付订单，4个参数：起始、结束、pageNow、pageSize
        String dateRgAndNoPayClauseByPage = "(SELECT zzID FROM outcomingtbl WHERE billStatus=0 AND outLibDate" +
                " BETWEEN ? AND ? ORDER BY zzID LIMIT ?,?) B ON A.zzID=B.zzID";

        //7、客户名称+未付订单，3个参数：客户like "%?%"、pageNow、pageSize
        String guestNameAndNoPayClauseByPage = "(SELECT zzID FROM outcomingtbl WHERE billStatus=0 AND guestName LIKE ?" +
                " ORDER BY zzID LIMIT ?,?) B ON A.zzID=B.zzID";

        //8、日期+客户+未付订单，5个参数：客户like "%?%"、起始、结束、pageNow、pageSize
        String dateRgAndGstNmeAndNoPayClauseByPage = "(SELECT zzID FROM outcomingtbl WHERE billStatus=0 AND guestName LIKE ?" +
                " AND outLibDate BETWEEN ? AND ? ORDER BY zzID LIMIT ?,?) B ON A.zzID=B.zzID";

        //9、所有未付订单，2个参数：pageNow、pageSiz
        String qrySQLAllNoPayByPage = "(SELECT zzID FROM outcomingtbl WHERE billStatus=0 ORDER BY zzID LIMIT ?,? ) B" +
                " ON A.zzID=B.zzID";

        //10、所有订单，2个参数：pageNow、pageSiz
        String qrySQLAllByPage = "(SELECT zzID FROM outcomingtbl ORDER BY zzID LIMIT ?,?) B ON A.zzID=B.zzID";

        String[] pars = null;

        //根据查询方式拼接SQL语句，并赋予参数
        //fieldValues字符串数组顺序：[0]起始日期，[1]结束日期，[2]规格ID，[3]客户名称
        switch (qryWay) {
            //送货日期范围，2个参数值：[0]起始、[1]结束日期
            case "DTR":
                qrySQL = startSQL + dateRangeClauseByPage;
                //参数赋值
                pars = new String[2];
                pars[0] = fieldValues[0];//起始日期
                pars[1] = fieldValues[1];//结束日期
                break;
            //客户名称，1个参数值，[3]客户姓名；3参数：like "%"+?+"%",pageNow，pageSize
            case "GNM":
                qrySQL = startSQL + guestNameClauseByPage;
                //参数赋值
                pars = new String[1];
                pars[0] = "%"+fieldValues[3]+"%";//客户姓名
                break;
            //规格ID，6个参数，参数顺序：规格ID、规格ID、规格ID、规格ID、前4个赋值，后2个传参pageNow、pageSize
            case "SID":
                qrySQL = qrySQLBySpecIDByPage;
                //参数赋值，规格ID，[2]商品规格
                pars = new String[4];
                pars[0] = fieldValues[2];//规格ID
                pars[1] = fieldValues[2];//规格ID
                pars[2] = fieldValues[2];//规格ID
                pars[3] = fieldValues[2];//规格ID
                break;
            //送货日期+客户名称，5参数：前3参数客户名,like "%"+?+"%"、起始、结束，后2分页
            case "DGNM":
                qrySQL = startSQL + dateRgAndGnmeClauseByPage;
                //参数赋值，此SQL语句3个？
                pars = new String[3];
                pars[0] = "%"+fieldValues[3]+"%";//客户名称
                pars[1] = fieldValues[0];//起始日期
                pars[2] = fieldValues[1];//结束日期
                break;
            //送货日期+商品规格，前8个参数数组传参
            //日期+规格，10个参数：起始、结束、规格、规格，起始、结束、规格、规格，pageNow、pageSize
            case "DSID":
                qrySQL = dateRgAndSpIDByPage;
                //参数赋值，此SQL语句8个？为起始日期[0]，结束日期[1]，规格ID[2]，规格ID[2]
                pars = new String[8];
                pars[0] = fieldValues[0];//起始日期
                pars[1] = fieldValues[1];//结束日期
                pars[2] = fieldValues[2];//规格ID
                pars[3] = fieldValues[2];//规格ID
                pars[4] = fieldValues[0];//起始日期
                pars[5] = fieldValues[1];//结束日期
                pars[6] = fieldValues[2];//规格ID
                pars[7] = fieldValues[2];//规格ID
                break;
            //送货日期+未付订单，前2个数组传，后2个直接传
            //4个参数：起始、结束、pageNow、pageSize
            case "DNPY":
                qrySQL = startSQL + dateRgAndNoPayClauseByPage;
                //参数赋值，此SQL语句2个？为起始、结束日期
                pars = new String[2];
                pars[0] = fieldValues[0];//起始日期
                pars[1] = fieldValues[1];//结束日期
                break;
            //客户名称+未付订单，3个参数：客户like "%?%"、pageNow、pageSize
            case "GNPY":
                qrySQL = startSQL + guestNameAndNoPayClauseByPage;
                //参数赋值，此SQL语句1个？为客户名称
                pars = new String[1];
                pars[0] = "%"+fieldValues[3]+"%";//模糊查，客户名
                break;
            //日期+客户+未付订单，5个参数：客户like "%?%"、起始、结束、pageNow、pageSize
            case "DGNPY":
                qrySQL = startSQL + dateRgAndGstNmeAndNoPayClauseByPage;
                //参数赋值，此SQL语句3个？，客户名、起始、结束日期
                pars = new String[3];
                pars[0] = "%"+fieldValues[3]+"%";//客户名称
                pars[1] = fieldValues[0];//起始日期
                pars[2] = fieldValues[1];//结束日期
                break;
            //列出所有未付订单
            case "NPY":
                qrySQL = startSQL + qrySQLAllNoPayByPage;
                //参数赋值，此SQL语句没有参数，pars置空
                break;
            //查所有,case类型值"ALL"，pars为null
            default:
                qrySQL = startSQL + qrySQLAllByPage;
        }
        ResultSet rs = null;
        Outcomingtbl curRecord;
        List<Outcomingtbl> results = null;
        try {
            rs = this.sqlTool.executeQuerySQL(qrySQL, pars, pageNow, pageSize);
            results = new ArrayList<Outcomingtbl>();
            while (rs.next()) {
                //?表示数据库类型与getString类型不一致，看是否需要转换
                //billNo,guestName,outLibDate,销售额（规格时为规格销售额，其它为该单理论销售额）
                curRecord = new Outcomingtbl();
                curRecord.setBillNo(rs.getString(1));//单号
                //总价?(此时已经完成了总成本计算，包含了运费和装卸费)，如果是规格查则为该规格成本，不含其它费用
                curRecord.setGuestName(rs.getString(2));//客户名称
                curRecord.setOutLibDate(rs.getString(3));//出库日期
                curRecord.setBillStatus(rs.getString(4));//订单状态
                curRecord.setTotalPrice(rs.getString(5));//销售额（理论）
                results.add(curRecord);
            }
        } catch (Exception e) {
            throw e;
        } finally {
            if (null != rs) {
                rs.close();
                rs = null;
            }
        }
        return results;
    }

    //计算总的应收金额（未付）和已付金额
    @Override
    public String[] getTotalPriceByField(String qryWay, String[] fieldValues) throws Exception {

        String[] results = null;

        //已付
        String startSQLPayed = "SELECT sum(actualTotalPrice) AS payedPrice FROM outcomingtbl WHERE billstatus=1";
        //未付
        String startSQLNoPayed = "SELECT sum(totalPrice) AS noPayedPrice FROM outcomingtbl WHERE billstatus=0";

        //按规格查询SQL语句前部分：规格ID、规格ID
        String specID = "SELECT sum(price) AS guiGePayPrice FROM (SELECT billNo, billStatus FROM" +
                " outcomingtbl WHERE billNo IN(SELECT billNo FROM outcomedetails WHERE specificationId=?))" +
                " A JOIN (SELECT billNo,price FROM outcomedetails WHERE specificationId=?) B ON" +
                " A.billNo=B.billNo";
        //按日期+规格查询SQL语句前部分：规格ID、起始、结束、规格ID
        String dateRgAndSpID = "SELECT sum(price) AS guiGePayPrice FROM (SELECT billNo, billStatus FROM" +
                " outcomingtbl WHERE billNo IN(SELECT billNo FROM outcomedetails WHERE specificationId=?) AND" +
                " outLibDate BETWEEN ? AND ?) A JOIN (SELECT billNo,price FROM outcomedetails WHERE" +
                " specificationId=?) B ON A.billNo=B.billNo";

        //按规格查询SQL语句后部分：
        String specIDNoPayClause = " WHERE A.billStatus = 0";//未付
        String specIDPayedClause = " WHERE A.billStatus = 1";//已付

        //送货日期范围子句
        String dateRangeClause = " AND outLibDate BETWEEN ? AND ?";
        //客户名称子句(使用模糊查)
        String guestNameClause = " AND guestName like ?";
        //日期+客户名称子句
        String dateRgAndGnmeClause = " AND guestName like ? AND outLibDate BETWEEN ? AND ?";

        String qrySQLPay;
        String qrySQLNoPay;
        String[] pars = null;
        String[][] sqlpars = null;
        //根据查询方式拼接SQL语句，并赋予参数
        //fieldValues字符串数组顺序：[0]起始日期，[1]结束日期，[2]规格ID，[3]客户名称
        switch (qryWay) {
            //送货日期范围，2个参数值：[0]起始、[1]结束日期
            case "DTR":
            //送货日期+未付订单，同日期
            case "DNPY":
                qrySQLPay = startSQLPayed + dateRangeClause;
                qrySQLNoPay = startSQLNoPayed + dateRangeClause;
                //参数赋值
                pars = new String[2];
                pars[0] = fieldValues[0];//起始日期
                pars[1] = fieldValues[1];//结束日期
                sqlpars = new String[][]{pars,pars};
                break;
            //客户名称，1个参数值，[3]客户姓名；3参数：like "%"+?+"%"
            case "GNM":
            //客户名称+未付订单，同客户
            case "GNPY":
                qrySQLPay = startSQLPayed + guestNameClause;
                qrySQLNoPay = startSQLNoPayed + guestNameClause;
                //参数赋值
                pars = new String[1];
                pars[0] = "%"+fieldValues[3]+"%";//客户姓名
                sqlpars = new String[][]{pars,pars};
                break;
            //规格ID，参数：规格ID、规格ID
            case "SID":
                qrySQLPay = specID + specIDPayedClause;
                qrySQLNoPay = specID + specIDNoPayClause;
                //参数赋值，规格ID，[2]商品规格
                pars = new String[2];
                pars[0] = fieldValues[2];//规格ID
                pars[1] = fieldValues[2];//规格ID
                sqlpars = new String[][]{pars,pars};
                break;
            //送货日期+客户名称，
            case "DGNM":
            //日期+客户+未付订单，同日期+客户
            case "DGNPY":
                qrySQLPay = startSQLPayed + dateRgAndGnmeClause;
                qrySQLNoPay = startSQLNoPayed + dateRgAndGnmeClause;
                //参数赋值，此SQL语句3个？
                pars = new String[3];
                pars[0] = "%"+fieldValues[3]+"%";//客户名称
                pars[1] = fieldValues[0];//起始日期
                pars[2] = fieldValues[1];//结束日期
                sqlpars = new String[][]{pars,pars};
                break;
            //送货日期+商品规格，
            //日期+规格，4个参数：规格ID、起始、结束、规格ID
            case "DSID":
                qrySQLPay = dateRgAndSpID + specIDPayedClause;
                qrySQLNoPay = dateRgAndSpID + specIDNoPayClause;
                //参数赋值，此SQL语句8个？为起始日期[0]，结束日期[1]，规格ID[2]
                pars = new String[4];
                pars[0] = fieldValues[2];//规格ID
                pars[1] = fieldValues[0];//起始日期
                pars[2] = fieldValues[1];//结束日期
                pars[3] = fieldValues[2];//规格ID
                sqlpars = new String[][]{pars,pars};
                break;
            //列出所有未付订单
            case "NPY":
            default:
                qrySQLPay = startSQLPayed;
                qrySQLNoPay = startSQLNoPayed;
        }
        String[] sqls = {qrySQLPay,qrySQLNoPay};
        try {
            results = this.sqlTool.executeQuerySQLsForSingleResult(sqls,sqlpars);
        }catch (Exception e){
            throw e;
        }
        return results;
    }

    @Override
    public List<OutcomeViewVO> getOutBillDetailsByBillNo(String billNo) throws Exception {
        List<OutcomeViewVO> results = null;
        ResultSet rs = null;
        OutcomeViewVO curRecord = null;

        String qrySQL = "SELECT billNo,billStatus,guestName,destLocation,totalPrice,actualTotalPrice,outLibMan," +
                "outLibDate,outLibWay,transitFare,shipFare,specificationName,manufacturerName," +
                "measurements,counts,unitPrice,price FROM outcomedetailsView WHERE billNo=?";

        String[] pars = {billNo};

        try {
            rs = this.sqlTool.executeQuerySQL(qrySQL,pars);
            results = new ArrayList<OutcomeViewVO>();
            while (rs.next()){
                curRecord = new OutcomeViewVO();
                curRecord.setBillNo(rs.getString(1));//订单号
                curRecord.setBillStatus(rs.getString(2));//订单状态
                curRecord.setGuestName(rs.getString(3));//客户名称
                curRecord.setDestLocation(rs.getString(4));//送货地点
                curRecord.setTotalPrice(rs.getString(5));//该订单理论销售额（不含装卸和运费）
                curRecord.setActualTotalPrice(rs.getString(6));//实收总额
                curRecord.setOutLibMan(rs.getString(7));//经手人
                curRecord.setOutLibDate(rs.getString(8));//入库日期
                curRecord.setOutLibWay(rs.getString(9));//装卸方式
                curRecord.setTransitFare(rs.getString(10));//运费
                curRecord.setShipFare(rs.getString(11));//装卸费
                curRecord.setSpecificationName(rs.getString(12));//规格名
                curRecord.setManufacturerName(rs.getString(13));//厂家名
                curRecord.setMeasurements(rs.getString(14));//计量单位
                curRecord.setCounts(rs.getString(15));//该规格数量
                curRecord.setUnitPrice(rs.getString(16));//该规格单价
                curRecord.setPrice(rs.getString(17));//该规格成本
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

    @Override
    public boolean edtOutBillStatusByBillNo(String billNo, String actualTotalPrice) throws Exception {

        boolean flag = false;
        //修改语句，订单状态修改为已付，同时实收总金额更新
        String edtSql = "UPDATE outcomingtbl SET billStatus=1,actualTotalPrice=? WHERE billNo=?";
        String[] pars = {actualTotalPrice,billNo};
        //执行修改操作
        try {
            flag = this.sqlTool.executeUpdateSQL(edtSql,pars);
        }catch (Exception e){
            //flag = false;
            throw e;
        }
        return flag;
    }

}
