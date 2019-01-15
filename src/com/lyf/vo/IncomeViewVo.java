package com.lyf.vo;

public class IncomeViewVo {

    public String getBillNo() {
        return billNo;
    }

    public void setBillNo(String billNo) {
        this.billNo = billNo;
    }

    public String getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(String totalPrice) {
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

    public String getTransitFare() {
        return transitFare;
    }

    public void setTransitFare(String transitFare) {
        this.transitFare = transitFare;
    }

    public String getShipFare() {
        return shipFare;
    }

    public void setShipFare(String shipFare) {
        this.shipFare = shipFare;
    }

    public String getSpecificationName() {
        return specificationName;
    }

    public void setSpecificationName(String specificationName) {
        this.specificationName = specificationName;
    }

    public String getManufacturerName() {
        return manufacturerName;
    }

    public void setManufacturerName(String manufacturerName) {
        this.manufacturerName = manufacturerName;
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

    public String getUnitPrice() {
        return unitPrice;
    }

    public void setUnitPrice(String unitPrice) {
        this.unitPrice = unitPrice;
    }

    public String getPrice() {
        return price;
    }

    public void setPrice(String price) {
        this.price = price;
    }

    //关联的入库单单号（该表可以有多个单号，均来自入库单）
    private String billNo;
    //该单的总金额（进货成本），是各个规格进货成本总和
    private String totalPrice;
    //进货日期（唯一标识该批货，通过厂家ID,规格ID,进货日期三个字段唯一标识商品）
    private String inLibDate;
    //进货装卸方式
    private String inLibWay;
    //运费（改为字符串，存入数据库时再转换）
    private String transitFare;
    //装卸费（模板——叉车费，人工——搬运费）
    private String shipFare;
    //规格名称
    private String specificationName;
    //厂商名称
    private String manufacturerName;
    //计量单位
    private String measurements;
    //该规格的数量
    private String counts;
    //该规格的单价
    private String unitPrice;
    //该规格的成本（进货成本）
    private String price;
}
