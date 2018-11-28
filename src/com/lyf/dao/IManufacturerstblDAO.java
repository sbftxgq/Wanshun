package com.lyf.dao;


import com.lyf.vo.Manufacturerstbl;

import java.util.List;

public interface IManufacturerstblDAO {
    //获取到所有厂家列表
    public List<Manufacturerstbl> getAllManufacturers() throws Exception;
}
