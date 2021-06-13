import React, { useState, useContext, useEffect } from 'react';
import { Row, Col, Form, Table } from 'antd';

export const FormResquest = props => {

  return <>
    <Row gutter={[16,16]}>
      <Col xs={24} xs={8}>
        Form Resquest
      </Col>
      <Col xs={24} xs={16}>
        Table Form
      </Col>
    </Row>
  </>
}