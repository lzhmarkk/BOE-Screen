import React, {useState} from "react";
import {FormComponentProps} from "antd/lib/form";
import {Button, Form, Icon, Upload, Input} from "antd";

import styles from './index.module.scss'

export interface IFormPayload {
    image: any,
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
            <div className={styles.form}>
                <Form style={{background: "white"}}>
                    <Form.Item>
                        {getFieldDecorator('image', {
                            valuePropName: 'fileList',
                            getValueFromEvent: normFile,
                        })(<Upload name="picture" listType="picture"
                                   beforeUpload={beforeUpload}
                                   accept={".png,.jpg,.jpeg,.bmp"}
                                   onChange={(state: any) => {
                                       setPicSize(state.fileList.length);
                                   }}>
                            <Button disabled={picSize !== 0}>
                                <Icon type="folder-open"/>选择一张图片
                            </Button>
                        </Upload>)}
                    </Form.Item>
                    <Form.Item>
                        <Button onClick={handleSubmit} icon={"upload"} type={"primary"}>确认上传</Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
};

const IPictureForm = Form.create<IFormProps>()(IForm);

export default IPictureForm;

/*
<Form.Item>
                        {getFieldDecorator('texture_name', {
                            rules: [{required: true, message: "请输入生产线名称"}],
                        })(<Input/>)}
                    </Form.Item>
 */
