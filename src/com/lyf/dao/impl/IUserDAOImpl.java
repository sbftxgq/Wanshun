package com.lyf.dao.impl;

import java.sql.ResultSet;

/*
 * 数据库users表DAO操作实现类
 */
import com.lyf.dao.IUserDAO;
import com.lyf.util.SqlHelperNew;
import com.lyf.vo.Users;

public class IUserDAOImpl implements IUserDAO {

	private SqlHelperNew sqlTool = null;//数据库连接工具类
	
	//构造方法
	public IUserDAOImpl(SqlHelperNew sqlTool) {
		this.sqlTool = sqlTool;
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
		// TODO Auto-generated method stub
		boolean flag = false;
		String sql = "SELECT userID FROM users WHERE userName=? AND userPasswd=?";
		String[] pars = {user.getUserName(),user.getUserPasswd()};
		ResultSet rs = null;
		try {
			rs = this.sqlTool.executeQuerySQL(sql, pars);
			while(rs.next()) {
				flag = true;
			}
		}catch(Exception e){
			throw e;
		}finally {
			if(null!=rs) {
				rs.close();
				rs = null;
			}
		}
		return flag;
	}

}
