package com.lyf.dao;

import com.lyf.vo.IncomeViewVo;
import com.lyf.vo.Incomedetails;
import com.lyf.vo.Incomingtbl;

import java.util.List;

/*
incomingtbl 表操作接口
 */
public interface IincomingtblDAO {

    //获取最新的进货单号（用于自增1）
    public String getLatestBillNO(String year) throws Exception;

    //入库操作（入库表和入库明细表入库操作，使用事务操作）
    public boolean inLibOperation(Incomingtbl incomeData, List<Incomedetails> detailDataRows) throws Exception;

    //查询操作（根据进货起止日期查，根据商品规格ID查），返回链表结构数据，分页
    public List<Incomingtbl> getBillsByField(String qryWay, String[] fieldValues, int pageNow, int pageSize) throws Exception;

    //查询操作，未分页
    public List<Incomingtbl> getBillsByField(String qryWay, String[] fieldValues) throws Exception;

    //查询操作，根据订单号查明细
    public List<IncomeViewVo> getBillDetailsByBillNo(String billNo) throws Exception;

    //查询操作，查询某个方式下的总记录数
    public String getCountsByField(String qryWay, String[] fieldValues) throws Exception;

}
