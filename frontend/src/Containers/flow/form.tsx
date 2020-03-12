import React, {useState} from "react";
import {FormComponentProps} from "antd/lib/form";
import {Button, Form, Icon, Upload, DatePicker, Input, Radio} from "antd";

import styles from './index.module.scss'
import APIList from "../../API";

const {RangePicker} = DatePicker;

export interface IFormPayload {
    image: any,
    prodline_name: string,
}


export interface IFormProps extends FormComponentProps {
    onSubmit: (payload: IFormPayload) => void
}

const IForm = (props: IFormProps) => {
    const [picSize, setPicSize] = useState(0);
    const normFile = (e: any) => {
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
            props.onSubmit(value);
        });
    };
    //固定内容，getFieldDecorator用于限制表单填写内容
    const {getFieldDecorator} = props.form;

    const rangeConfig = {
        rules: [{type: 'array', required: true, message: 'Please select time!'}],
    };

    const formItemLayout =
        {
            labelCol: {span: 8, offset: 0},
            wrapperCol: {span: 16, offset: 0},
        };
    const beforeUpload = (file: any, files: any) => {
        const r = new FileReader();
        r.readAsDataURL(file);
        r.onload = (e: any) => {
            file.thumbUrl = e.target.result;
        };
        return false;
    };
    return (
        <div>
            <div className={styles.root}>
                <Form style={{background: "white"}} className={styles.hbox}>
                    <Form.Item label="选择图片">
                        {getFieldDecorator('image', {
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile,
                        })(<Upload name="picture" listType="picture"
                                   beforeUpload={beforeUpload}
                                   accept={".png,.jpg,.jpeg,.bmp"}
                                   onChange={(state: any) => {
                                       setPicSize(state.fileList.length);
                                   }}>
                            {picSize === 0 ?
                                <Button>
                                    <Icon type="upload"/>点击选择图片
                                </Button> : <React.Fragment/>
                            }
                        </Upload>)}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('prodline_name')(<Input/>)}
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handleSubmit} icon={"plus-circle"} type={"primary"}>确认上传</Button>
                    </Form.Item>
                    <Form.Item label="True/False">
                        {getFieldDecorator('radio-group')(
                            <Radio.Group>
                                <Radio value={0}>False</Radio>
                                <Radio value={1}>True</Radio>
                            </Radio.Group>,
                        )}
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

const IPictureForm = Form.create<IFormProps>()(IForm);

export default IPictureForm;