import { Modal } from 'antd'
import React from 'react'

const Modals = ({ children, ...props }) => {
  return <Modal {...props}> {children} </Modal>
}

export default Modals;