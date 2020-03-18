import React from 'react'
import {Form, Modal, Radio} from 'antd';
import {FormComponentProps} from 'antd/lib/form';

export interface IEditImageFormPayload {
    image_id: string
    class: string
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
                        <Radio value={'1'}>污点</Radio>
                        <Radio value={'2'}>损坏</Radio>
                        <Radio value={'3'}>无法确定</Radio>
                    </Radio.Group>)}
                </Form.Item>
            </Form>

        </Modal>
    );
};
const IEditImageForm = Form.create<IFormProps>()(IEditForm);

export default IEditImageForm;
