package com.lyf.factory;

import com.lyf.dao.ICategorytblDAO;
import com.lyf.dao.IManufacturerstblDAO;
import com.lyf.dao.ISpecificationtblDAO;
import com.lyf.dao.IUserDAO;
import com.lyf.dao.proxy.ICategorytblDAOProxy;
import com.lyf.dao.proxy.IManufacturerstblDAOProxy;
import com.lyf.dao.proxy.ISpecificationtblDAOProxy;
import com.lyf.dao.proxy.IUserDAOProxy;

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


}
