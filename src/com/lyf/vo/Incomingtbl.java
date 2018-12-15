package com.lyf.vo;

/*
    进货单表，代表入库，数据库incomingtbl表映射VO类
 */
public class Incomingtbl {

    //入库单单号，单号唯一
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
}