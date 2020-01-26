import React, {ReactElement} from "react";
import {Layout} from 'antd';

const {Header, Content, Sider} = Layout;


const MainLayout = (props: { children: ReactElement }) => {
    return (
        <Layout style={{minHeight: '100vh'}}>
            this is main layout
            <Content>
                {props.children}
            </Content>
        </Layout>
    );
};
export default MainLayout;