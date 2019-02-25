package com.lyf.factory;

import com.lyf.dao.*;
import com.lyf.dao.proxy.*;

/*
 * DAO工厂类，造出DAO代理类的实例
 */
public class DAOFactory {
	
	//返回接口实例，用户表操作
	public static IUserDAO getIUserDAOInstance() {
		return new IUserDAOProxy();
	}

	//返回接口实例，商品规格表
	public  static ISpecificationtblDAO getISpecificationtblDAOInstance(){
		return new ISpecificationtblDAOProxy();
	}

	//返回接口表，厂商列表
	public static IManufacturerstblDAO getIManufacturerstblDAOInstance(){
		return new IManufacturerstblDAOProxy();
	}

	//返回接口实例，商品类型列表
	public static ICategorytblDAO getICategorytblDAOInstance(){
		return new ICategorytblDAOProxy();
	}

	//返回接口实例，入库表
	public static IincomingtblDAO getIincomingtblDAOInstance(){
		return new IincomingtblDAOProxy();
	}
	//返回接口实例，出库表
	public static IOutcomingtblDAO getIOutcomingtblDAOInstance(){
		return new IOutcomingtblDAOProxy();
	}


}
