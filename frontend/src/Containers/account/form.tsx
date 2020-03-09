import React from "react";
import {FormComponentProps} from "antd/lib/form";
import {Button, Form, Select, Icon, Input, Upload, Radio} from "antd";

import styles from './index.module.scss'

const { Option } = Select;

export interface IFormPayload {
    admin_id: string,//用户id
    name: string,//用户名
    password: string,//密码
    admin_icon: any,//头像
    admin_description: string,//自我描述
    phone: string
}

export interface IFormProps extends FormComponentProps {
    //注释掉了
    //onSubmit: (payload: IFormPayload) => void,//一个函数，用来提交表单给后台，点击提交表单按钮时，调用该函数
}

const IForm = (props: IFormProps) => {
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

    const normFile = (e: any) => {
        //console.log('文件如下:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        props.form.validateFields((err, value: any) => {
            if (err)
                return;
            console.log("表单数据", value);
            //props.onSubmit(value);
        });
    };
    const {getFieldDecorator} = props.form;

    const prefixSelector = getFieldDecorator('prefix', {
        initialValue: '86',
    })(
        <Select style={{width: 70}}>
            <Option value="86">+86</Option>
            <Option value="87">+87</Option>
        </Select>,
    );


    return (
        <div>
            <div className={styles.root}>
                <Form style={{background: "white"}} className={styles.hbox}>
                    <h1><strong>个人资料修改</strong></h1>
                    <Form.Item label="用户id" hasFeedback>
                        {getFieldDecorator('admin_id', {
                            rules: [{message: "请输入用户id"}],
                        })(
                            <Input style={{width: "90%"}}/>)}
                    </Form.Item>
                    <Form.Item label="用户名">
                        {getFieldDecorator('name', {
                            rules: [{type: "string", message: "请输入用户名"}],
                        })(
                            <Input placeholder={"请输入用户名"} style={{width: "90%"}} disabled={false}/>)}
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
                    <Form.Item label="自我描述" hasFeedback>
                        {getFieldDecorator('admin_description', {
                            rules: [{type: "string", message: "请输入自我描述"}],
                        })(<Input placeholder={"请输入自我描述"} style={{width: "90%"}}/>)}
                    </Form.Item>
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
                    <Form.Item label="电话号码">
                        {getFieldDecorator('phone', {
                            rules: [{pattern: /1[0-9]{10}/, message: 'Please input valid phone number!'}],
                        })(<Input addonBefore={prefixSelector} style={{width: '100%'}}/>)}
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