package com.lyf.dao;

import com.lyf.vo.Specificationtbl;

import java.util.List;

public interface ISpecificationtblDAO {
    //获取到所有商品规格列表
    public List<Specificationtbl> getAllSpecification() throws Exception;

    public List<Specificationtbl> getSpecificationListByCategoryId (String categoryId) throws Exception;
}
