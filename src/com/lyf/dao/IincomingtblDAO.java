package com.lyf.dao;

/*
incomingtbl 表操作接口
 */
public interface IincomingtblDAO {

    //获取最新的进货单号（用于自增1）
    public String getLatestBillNO() throws Exception;

}
