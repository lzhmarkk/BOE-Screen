import React from "react";
import {FormComponentProps} from "antd/lib/form";
import {Button, Form, DatePicker, Input} from "antd";
import styles from './index.module.scss'

const {RangePicker} = DatePicker;

export interface IFormPayload {
    content: string
}

export interface IFormProps extends FormComponentProps {
    onSearch: (payload: IFormPayload) => void
    onClear: () => void
}

const SearchForm = (props: IFormProps) => {
    const handleSubmit = (e: any) => {
        e.preventDefault();
        props.form.validateFields((err, value: IFormPayload) => {
            if (err)
                return;
            props.onSearch(value);
        })
    };
    const {getFieldDecorator} = props.form;
    const handleClear = () => {
        props.onClear();
    };

    const formItemLayout =
        {
            labelCol: {span: 8, offset: 0},
            wrapperCol: {span: 16, offset: 0},
        };

    return (
        <div className={styles.root}>
            <Form layout="inline" style={{background: "white"}}>
                <Form.Item label="流水线名称" {...formItemLayout}>
                    {getFieldDecorator('content', {
                        rules: [{required: false, message: "请输入流水线名称"}],
                    })(<Input style={{width: "80%"}}/>)}
                </Form.Item>
                <Form.Item>
                    <Button onClick={handleSubmit} icon={"search"} type={"primary"}>筛选</Button>
                    <Button onClick={handleClear} icon={"redo"}>重置</Button>
                </Form.Item>
            </Form>
        </div>
    )
};

const ISearchPanel = Form.create<IFormProps>()(SearchForm);

export default ISearchPanel;

/*
<Form.Item label="日期" {...formItemLayout}>
                    {getFieldDecorator('range-picker', {
                        rules: [{type: 'array', required: false, message: 'Please select time!'}],
                    })
                    (<RangePicker style={{width: "80%"}}/>)}
                </Form.Item>
 */
