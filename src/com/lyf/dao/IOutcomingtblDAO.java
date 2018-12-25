package com.lyf.dao;

import com.lyf.vo.Outcomedetails;
import com.lyf.vo.Outcomingtbl;

import java.util.List;

/*
2018-12-17 出库表操作
 */
public interface IOutcomingtblDAO {
    //取得最新的出库单号（用于自增1）
    public String getLatestBillNO() throws Exception;
    //出库操作（出库表和出库明细表出库操作，使用事务回滚机制）
    public boolean outLibOperation(Outcomingtbl outcomeData, List<Outcomedetails> detailDataRows) throws Exception;
}
