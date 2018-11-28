package com.lyf.dao;

import com.lyf.vo.Categorytbl;

import java.util.List;

public interface ICategorytblDAO {
    //取得所有商品类型
    public List<Categorytbl> getAllCategory() throws Exception;
}
