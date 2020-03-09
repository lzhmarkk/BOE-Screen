import React from "react";
import {FormComponentProps} from "antd/lib/form";
import {Button, Form, Icon, Upload, DatePicker, Input, Radio} from "antd";

import styles from './index.module.scss'
//导入css，不管

const {RangePicker} = DatePicker;

//这个表单的返回值Payload（也就是填写的数据）的接口，相当于返回值
export interface IFormPayload {
    image: any,//头像
    prod_line_id: string,
}

//表单属性Properties的接口，相当于参数
//必须继承FormComponentProps
export interface IFormProps extends FormComponentProps {
    //注释掉了
    //onSubmit: (payload: IFormPayload) => void,//一个函数，用来提交表单给后台，点击提交表单按钮时，调用该函数
}

const IForm = (props: IFormProps) => {

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
            //console.log()可以打印到控制台，浏览器打开开发者工具，选择console栏就可以看到控制台的输出
            //thumbUrl即为我们上传的文件的base64格式
            console.log("表单数据", value);
            //props.onSubmit(value);
            const rangeValue = value['range-picker'];
            const values = {
                ...value,
                'date-picker': value['date-picker'].format('YYYY-MM-DD'),
                'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')]
            };
            console.log('Received values of form: ', values);
        });
    };
    const {getFieldDecorator} = props.form;

    const rangeConfig = {
        rules: [{type: 'array', required: true, message: 'Please select time!'}],
    };

    const formItemLayout =
        {
            labelCol: {span: 8, offset: 0},
            wrapperCol: {span: 16, offset: 0},
        };

    return (
        <div>
            <div className={styles.root}>
                <Form layout="inline" style={{background: "white"}}>
                    <Form.Item label="流水线名称" {...formItemLayout}>
                        {getFieldDecorator('prod_line_id', {
                            rules: [{required: true, message: "请输入流水线名称"}],
                        })(
                            <Input style={{width: "80%"}}/>)}
                    </Form.Item>
                    <Form.Item label="日期" {...formItemLayout}>
                        {getFieldDecorator('range-picker', rangeConfig)(<RangePicker style={{width: "80%"}}/>)}
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handleSubmit} icon={"plus-circle"} type={"primary"}>确认上传</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

const ILineForm = Form.create<IFormProps>()(IForm);

export default ILineForm;