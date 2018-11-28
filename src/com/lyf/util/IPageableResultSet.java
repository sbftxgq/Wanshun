package com.lyf.util;

import java.sql.ResultSet;

/**这是一个对java.sql.ResultSet进行了扩展的接口，
 * 主要是增加了对分页的支持，如设置分页大小，跳转到某一页，返回总页数等等。*/

public interface IPageableResultSet extends ResultSet {
	/**
	 *返回总页数 
	 */
	 public int getPageCount();
	 
	 
	 /**返回当前页的记录条数
	  * 
	  */
	 public int getPageRowsCount();
	 
	 
	 /**返回分页大小
	 */
	 public int getPageSize();
	 
	 
	 /**转到指定页
	 */
	 public void gotoPage(int page);
	 
	 
	 /**设置分页大小
	 */
	 public void setPageSize(int pageSize);
	 
	 
	 /**返回总记录行数
	 */
	 public int getRowsCount();
	 
	 
	 /**
	 * 转到当前页的第一条记录
	 * @exception java.sql.SQLException 异常说明。
	 */
	 public void pageFirst() throws java.sql.SQLException;
	 
	 
	 /**
	 * 转到当前页的最后一条记录
	 * @exception java.sql.SQLException 异常说明。
	 */
	 public void pageLast() throws java.sql.SQLException;
	 
	 
	 /**返回当前页号
	 */
	 public int getCurPage();

}
