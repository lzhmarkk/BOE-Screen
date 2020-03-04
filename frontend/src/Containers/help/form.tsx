import React from "react";
import {FormComponentProps} from "antd/lib/form";
import {Button, Form, Icon, Input, Upload, Radio} from "antd";

import styles from './index.module.scss'
//导入css，不管

//这个表单的返回值Payload（也就是填写的数据）的接口，相当于返回值
export interface IFormPayload {
    admin_id: string,//用户id
    name: string,//用户名
    password: string,//密码
    admin_icon: any,//头像
    admin_description: string//自我描述
}

//表单属性Properties的接口，相当于参数
//必须继承FormComponentProps
export interface IFormProps extends FormComponentProps {
    //注释掉了
    //onSubmit: (payload: IFormPayload) => void,//一个函数，用来提交表单给后台，点击提交表单按钮时，调用该函数
}

//表单本体，参数：IFormProps，参考上面5行
const IForm = (props: IFormProps) => {
    //这compareToFirstPassword和validateToNextPassword两个函数是验证密码一致性的
    const compareToFirstPassword = (rule: any, value: any, callback: any) => {
        const form = props.form;
        if (value !== form.getFieldValue('password')) {
            if (!value) {
                callback("请确认密码");
            } else {
                callback('两次密码不一致');
            }
        } else {
            callback();
        }
    };
    const validateToNextPassword = (rule: any, value: any, callback: any) => {
        const form = props.form;
        if (value) {
            form.validateFields(['confirm'], {force: true});
        }
        callback();
    };

    //上传文件（图片）的一个处理函数，copied from antd doc
    const normFile = (e: any) => {
        //console.log('文件如下:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };
    //处理提交，这个函数是比较固定的内容，直接复制就能用
    const handleSubmit = (e: any) => {
        e.preventDefault();
        props.form.validateFields((err, value: any) => {
            if (err)
                return;
            //console.log()可以打印到控制台，浏览器打开开发者工具，选择console栏就可以看到控制台的输出
            //thumbUrl即为我们上传的文件的base64格式
            console.log("表单数据", value);
            //props.onSubmit(value);
        });
    };
    //固定内容，getFieldDecorator用于限制表单填写内容
    const {getFieldDecorator} = props.form;


    return (
        <div>
            <div className={styles.root}>
                {/*表单从这里开始*/}
                <Form style={{background: "white"}} className={styles.hbox}>
                    <h1><strong>个人资料修改的一个样例，作为表单写法的参考</strong></h1>
                    <a href={"https://3x.ant.design/components/form-cn/"}>参考antd</a>
                    {/*第一项用户id，可以尝试删除hasFeedback看看效果*/}
                    <Form.Item label="用户id" hasFeedback>
                        {getFieldDecorator('admin_id', {
                            rules: [{required: true, message: "请输入用户id"}],//必填，没填的时候提醒文字
                        })(//表单样式为为<Input 这里我为了美观限制了长度为90%>
                            <Input style={{width: "90%"}}/>)}
                    </Form.Item>
                    <Form.Item label="身份标志">
                        {getFieldDecorator('identity', {})(
                            <Radio.Group>
                                <Radio value={"dev"}>开发人员</Radio>
                                <Radio value={"test"}>测试人员</Radio>
                                <Radio value={"pm"}>项目经理</Radio>
                                <Radio value={"else"}>其他</Radio>
                            </Radio.Group>
                        )}
                    </Form.Item>
                    <Form.Item label="用户名">
                        {getFieldDecorator('name', {
                            rules: [{type: "string", required: true, message: "请输入用户名"}],
                        })(//研究下为什么我不能输入用户名
                            <Input placeholder={"请输入用户名"} style={{width: "90%"}} disabled={false}/>)}
                    </Form.Item>
                    <Form.Item label="自我描述" hasFeedback>
                        {getFieldDecorator('admin_description', {
                            rules: [{type: "string", message: "请输入自我描述"}],
                        })(<Input placeholder={"请输入自我描述"} style={{width: "90%"}}/>)}
                    </Form.Item>
                    {/*hasFeedBack参考文档，验证不通过时会有提示*/}
                    <Form.Item label="修改密码" hasFeedback>
                        {getFieldDecorator('password', {
                            rules: [
                                {pattern: /^(\S){6,15}$/, message: "密码长度不符合规范"},//正则表达式
                                {validator: validateToNextPassword},
                            ],
                        })(<Input.Password style={{width: "90%"}}/>)}
                    </Form.Item>
                    <Form.Item label="确认密码" hasFeedback>
                        {getFieldDecorator('confirm', {
                            rules: [
                                {validator: compareToFirstPassword},
                            ],
                        })(<Input.Password style={{width: "90%"}}/>)}
                    </Form.Item>
                    <Form.Item label="头像">
                        {getFieldDecorator('admin_icon', {
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile,
                        })(<Upload name="logo" listType="picture">
                            <Button>
                                <Icon type="upload"/>点击上传头像
                            </Button>
                        </Upload>)}
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handleSubmit} icon={"plus-circle"} type={"primary"}>确认修改</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

const IAccountForm = Form.create<IFormProps>()(IForm);

export default IAccountForm;