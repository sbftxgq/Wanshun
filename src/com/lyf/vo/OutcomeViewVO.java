package com.lyf.vo;

public class OutcomeViewVO {
    private String billNo;//送货单号，唯一标识一个送货单
    private String billStatus;//0——未付，1——已付
    private String guestName;//客户名称
    private String destLocation;//送货地点
    private String outLibDate;//送货日期
    private String outLibMan;//送货人
    private String outLibWay;//送货方式
    private String transitFare;//运输费，整数值，用字符串填入后存数据库时再做转换
    private String shipFare;//装卸费，整数值
    private String totalPrice;//该单的理论销售总额，包含各个规格商品销售额
    private String actualTotalPrice;//该单的已付总额，即实际销售总额
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
    //该规格的销售额
    private String price;

    public String getBillNo() {
        return billNo;
    }

    public void setBillNo(String billNo) {
        this.billNo = billNo;
    }

    public String getBillStatus() {
        return billStatus;
    }

    public void setBillStatus(String billStatus) {
        this.billStatus = billStatus;
    }

    public String getGuestName() {
        return guestName;
    }

    public void setGuestName(String guestName) {
        this.guestName = guestName;
    }

    public String getDestLocation() {
        return destLocation;
    }

    public void setDestLocation(String destLocation) {
        this.destLocation = destLocation;
    }

    public String getOutLibDate() {
        return outLibDate;
    }

    public void setOutLibDate(String outLibDate) {
        this.outLibDate = outLibDate;
    }

    public String getOutLibMan() {
        return outLibMan;
    }

    public void setOutLibMan(String outLibMan) {
        this.outLibMan = outLibMan;
    }

    public String getOutLibWay() {
        return outLibWay;
    }

    public void setOutLibWay(String outLibWay) {
        this.outLibWay = outLibWay;
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

    public String getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(String totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getActualTotalPrice() {
        return actualTotalPrice;
    }

    public void setActualTotalPrice(String actualTotalPrice) {
        this.actualTotalPrice = actualTotalPrice;
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
}
