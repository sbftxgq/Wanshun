package com.lyf.vo;

public class Incomedetails {

    //关联的入库单单号（该表可以有多个单号，均来自入库单）
    private String billNo;
    //厂家ID
    private String manufacturerId;
    //规格ID
    private String specificationId;
    //计量单位
    private String measurements;
    //该规格的数量
    private String counts;
    //该规格的单价
    private float unitPrice;
    //该规格的成本（进货成本）
    private float price;

    //getters And setters
    public String getBillNo() {
        return billNo;
    }

    public void setBillNo(String billNo) {
        this.billNo = billNo;
    }

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

    public String getMeasurements() {
        return measurements;
    }

    public void setMeasurements(String measurements) {
        this.measurements = measurements;
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

    public float getPrice() {
        return price;
    }

    public void setPrice(float price) {
        this.price = price;
    }
}
