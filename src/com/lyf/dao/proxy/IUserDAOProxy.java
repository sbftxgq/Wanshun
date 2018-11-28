package com.lyf.dao.proxy;

import com.lyf.dao.IUserDAO;
import com.lyf.dao.impl.IUserDAOImpl;
import com.lyf.dbc.DatabaseConnection;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Users;
/*
 * 用户表操作代理类
 */
public class IUserDAOProxy implements IUserDAO {

	private IUserDAO dao = null;
	private DatabaseConnection dbc = null;
	private SqlHelperNew sqlTool = null;
	
	//构造方法，实例化SqlHelperNew，实例化实现类，获取到连接对象
	public IUserDAOProxy() {
		this.sqlTool = new SqlHelperNew();//实例化工具类
        this.dao = new IUserDAOImpl(this.sqlTool);//实例化要代理的对象
        this.dbc = this.sqlTool.getDbc();//获得连接对象dbc
	}
	
	@Override
	public boolean doCreate(Users user) throws Exception {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	public Users findByName(String name) throws Exception {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public boolean checkUser(Users user) throws Exception {
		
		boolean flag = false;
		try {
			flag = this.dao.checkUser(user);
		}catch(Exception e) {
			throw e;
		}finally {
			this.dbc.close();
		}
		return flag;
	}

}
