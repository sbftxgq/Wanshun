package com.lyf.dao;

import com.lyf.vo.Users;

/*
 * 对用户表Users的操作接口
 */
public interface IUserDAO {
	
	//增——注册用户
	public boolean doCreate(Users user) throws Exception;
	
	//查——根据输入的用户名，查此用户是否存在，注册时用于判断用户是否存在
	public Users findByName(String name) throws Exception;
	
	//查，校验用户名和密码是否存在
	public boolean checkUser(Users user) throws Exception;
	
	
	
}
