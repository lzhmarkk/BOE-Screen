import React from 'react'
import {Form, Modal, Radio} from 'antd';
import {FormComponentProps} from 'antd/lib/form';

export interface IEditImageFormPayload {
    image_id: string
    class: number
}

interface IFormProps extends FormComponentProps {
    onSubmit: (payload: IEditImageFormPayload) => void
    modalOpen: boolean,
    setModalOpen: (a: boolean) => void
}

const IEditForm = (props: IFormProps) => {
    const handleSubmit = () => {
        props.form.validateFields((err, value: any) => {
            if (err)
                return;
            props.onSubmit(value);
        })
    };

    const {getFieldDecorator} = props.form;

    return (
        <Modal title={"修改分类"}
               visible={props.modalOpen}
               onCancel={() => props.setModalOpen(false)}
               onOk={() => {
                   handleSubmit();
                   props.setModalOpen(false);
               }}
               okText={"确认修改"}
               cancelText={"取消"}>
            <Form style={{background: "white"}}>
                <Form.Item style={{marginBottom: "0px"}}>
                    {getFieldDecorator('class', {})
                    (<Radio.Group>
                        <Radio value={1}>损坏</Radio>
                        <Radio value={2}>污点</Radio>
                        <Radio value={3}>无法确定</Radio>
                    </Radio.Group>)}
                </Form.Item>
            </Form>

        </Modal>
    );
};
const IEditImageForm = Form.create<IFormProps>()(IEditForm);

export default IEditImageForm;

export const genClass = (pred?: number) => {
    return (
        pred === 1 ? "True Bad/损坏" : pred === 2 ? "False Bad/污渍" : undefined
    )
};

export const genWeights = (weights: any) => {
    if (weights !== undefined) {
        const ipx_bad = weights["1"];
        const ipx_dirt = weights["2"];
        const ipx_count = ipx_bad + ipx_dirt;
        const poss_bad = (ipx_bad * 100 / ipx_count).toFixed(2);
        const poss_dirt = (ipx_dirt * 100 / ipx_count).toFixed(2);
        return (
            <div>
                <li>
                    损坏概率:{poss_bad}%
                    <p>({ipx_bad} / {ipx_count})</p>
                </li>
                <li>
                    污渍概率:{poss_dirt}%
                    <p>({ipx_dirt} / {ipx_count})</p>
                </li>
            </div>
        )
    } else {
        return (<React.Fragment/>)
    }
};
