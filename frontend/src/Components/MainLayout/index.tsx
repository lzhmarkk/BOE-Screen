import React, {ReactElement, useState} from "react";
import {Layout, Menu, Breadcrumb, Icon, Button, Dropdown, Avatar} from 'antd';
import style from "./index.module.scss";
import {Link} from "react-router-dom";

const {Header, Content, Sider, Footer} = Layout;
const {SubMenu} = Menu;
const logout_menu = (
    <Menu>
        <Menu.Item>
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                阿里
            </a>
        </Menu.Item>
    </Menu>
);

const MainLayout = (props: { children: ReactElement }) => {
    const [collapsed, setCollapsed] = useState(false);
    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider collapsible collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)}>
                <div className={style.logo}/>
                <Menu theme="dark" mode="inline">
                    <Menu.Item key="1">
                        <Link to={"/flow"}/>
                        <Icon type={'home'}/>
                        <span>主页</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to={"/texture"}/>
                        <Icon type={'build'}/>
                        <span>纹理</span>
                    </Menu.Item>
                    {
                        <Menu.Item key="3">
                            <Link to={"/stats"}/>
                            <Icon type={'area-chart'}/>
                            <span>统计和报表</span>
                        </Menu.Item>
                    }
                    {/*
                        <Menu.Item key="4">
                            <Link to={"/account"}/>
                            <Icon type={'user'}/>
                            <span>个人账户</span>
                        </Menu.Item>
                    */}
                    <Menu.Item key="5">
                        <Link to={"/help"}/>
                        <Icon type={'compass'}/>
                        <span>帮助</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Header className={style.header}>
                    <div className={style.title}>
                        屏幕缺陷检测系统
                    </div>
                    <div className={style.loginControl}>
                        {/*}
                        <Dropdown overlay={logout_menu}>
                            <Button shape="circle">
                                <Avatar style={{backgroundColor: '#87d068'}} icon={"user"}/>
                            </Button>
                        </Dropdown>
                        */}
                    </div>
                </Header>
                <Content className={style.content} style={{margin: '0 16px'}}>
                    {props.children}
                </Content>
                <Footer style={{textAlign: 'center'}}>屏幕缺陷检测系统 Create by Lzh, Gld, Dly, Hxj</Footer>
            </Layout>
        </Layout>
    );
};
export default MainLayout;
