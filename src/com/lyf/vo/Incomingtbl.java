package com.lyf.vo;

/*
    进货单表，代表入库，数据库incomingtbl表映射VO类
 */
public class Incomingtbl {

    //厂家ID
    private String manufacturerId;
    //规格ID
    private String specificationId;
    //该单数量
    private String counts;
    //该单单价
    private float unitPrice;
    //该单总金额（进货成本）
    private float totalPrice;
    //进货日期（唯一标识该批货，通过厂家ID,规格ID,进货日期三个字段唯一标识商品）
    private String inLibDate;
    //进货装卸方式
    private String inLibWay;
    //运费
    private float transitFare;
    //装卸费（模板——叉车费，人工——搬运费）
    private float shipFare;

    public String getManufacturerId() {
        return manufacturerId;
    }

    public void setManufacturerId(String manufacturerId) {
        this.manufacturerId = manufacturerId;
    }

    public String getSpecificationId() {
        return specificationId;
    }

    public void setSpecificationId(String specificationId) {
        this.specificationId = specificationId;
    }

    public String getCounts() {
        return counts;
    }

    public void setCounts(String counts) {
        this.counts = counts;
    }

    public float getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(float unitPrice) {
        this.unitPrice = unitPrice;
    }

    public float getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(float totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getInLibDate() {
        return inLibDate;
    }

    public void setInLibDate(String inLibDate) {
        this.inLibDate = inLibDate;
    }

    public String getInLibWay() {
        return inLibWay;
    }

    public void setInLibWay(String inLibWay) {
        this.inLibWay = inLibWay;
    }

    public float getTransitFare() {
        return transitFare;
    }

    public void setTransitFare(float transitFare) {
        this.transitFare = transitFare;
    }

    public float getShipFare() {
        return shipFare;
    }

    public void setShipFare(float shipFare) {
        this.shipFare = shipFare;
    }
}
