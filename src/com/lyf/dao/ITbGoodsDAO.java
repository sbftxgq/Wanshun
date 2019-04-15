package com.lyf.dao;

public interface ITbGoodsDAO {
    public String getStockNumberBySpecIDAndManuID(String specID,String manuID) throws Exception;
}
