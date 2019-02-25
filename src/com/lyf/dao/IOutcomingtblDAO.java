package com.lyf.dao;

import com.lyf.vo.OutcomeViewVO;
import com.lyf.vo.Outcomedetails;
import com.lyf.vo.Outcomingtbl;

import java.util.List;

/*
2018-12-17 出库表操作
 */
public interface IOutcomingtblDAO {
    //取得最新的出库单号（用于自增1）
    public String getLatestBillNO(String year) throws Exception;
    //出库操作（出库表和出库明细表出库操作，使用事务回滚机制）
    public boolean outLibOperation(Outcomingtbl outcomeData, List<Outcomedetails> detailDataRows) throws Exception;

    //2019-01-27
    //出库单查询总数
    public String getOutCountsByField(String qryWay, String[] fieldValues) throws Exception;

    //查询操作（根据送货起止日期查，根据商品规格ID查等多个字段组合），返回链表结构数据，分页
    public List<Outcomingtbl> getOutBillsByField(String qryWay, String[] fieldValues, int pageNow, int pageSize) throws Exception;

    //计算总价格（未付的）
    public String[] getTotalPriceByField(String qryWay, String[] fieldValues) throws Exception;

    //查询出库单明细
    //查询操作，根据订单号查明细
    public List<OutcomeViewVO> getOutBillDetailsByBillNo(String billNo) throws Exception;

    //修改出库单状态，根据单号修改该单状态和实收总金额
    public boolean edtOutBillStatusByBillNo(String billNo,String actualTotalPrice) throws Exception;

}
