package com.lyf.dao;

import com.lyf.vo.Incomedetails;
import com.lyf.vo.Incomingtbl;

import java.util.List;

/*
incomingtbl 表操作接口
 */
public interface IincomingtblDAO {

    //获取最新的进货单号（用于自增1）
    public String getLatestBillNO() throws Exception;

    //入库操作（入库表和入库明细表入库操作，使用事务操作）
    public boolean inLibOperation(Incomingtbl incomeData, List<Incomedetails> detailDataRows) throws Exception;

}
