package com.lyf.vo;

/*
商品规格表映射VO
 */
public class Specificationtbl {

    //规格ID
    private String specificationId;
    //规格名称
    private String specificationName;
    //长度
    private float length;
    //截面长
    private float arealength;
    //界面宽
    private float areawidth;
    //类型ID（引用自商品类型表）
    private String categoryId;

    public String getSpecificationId() {
        return specificationId;
    }

    public void setSpecificationId(String specificationId) {
        this.specificationId = specificationId;
    }

    public String getSpecificationName() {
        return specificationName;
    }

    public void setSpecificationName(String specificationName) {
        this.specificationName = specificationName;
    }

    public float getLength() {
        return length;
    }

    public void setLength(float length) {
        this.length = length;
    }

    public float getArealength() {
        return arealength;
    }

    public void setArealength(float arealength) {
        this.arealength = arealength;
    }

    public float getAreawidth() {
        return areawidth;
    }

    public void setAreawidth(float areawidth) {
        this.areawidth = areawidth;
    }

    public String getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(String categoryId) {
        this.categoryId = categoryId;
    }
}
