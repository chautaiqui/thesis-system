import React, { useState, useEffect, useContext } from 'react';
import { User } from '@pkg/reducers';
import { getRequest } from '@pkg/api';

import { Table, Tag, Button, message } from 'antd';

const dataSource = [
    {
        email: "employee1.5@gmail.com",
        password: "1234",
        name: "employee1",
        dateOfBirth: "Wed Jul 09 1997 00:00:00 GMT+0700 (Indochina Time)",
        contactNumber: "784697240",
        address: "town123",
        skills: [
            "english",
            "japanese"
        ],
        department: "Security",
        designation: "Security guard"
    },
    {
        email: "employee2@gmail.com",
        password: "88888888",
        name: "employee1",
        dateOfBirth: "Wed Jul 09 1997 00:00:00 GMT+0700 (Indochina Time)",
        contactNumber: "784697240",
        address: "town",
        skills: [
            "english"
        ],
        department: "Security",
        designation: "Security guard"
    },
    {
        email: "employee3@gmail.com",
        password: "88888888",
        name: "employee1",
        dateOfBirth: "Wed Jul 09 1997 00:00:00 GMT+0700 (Indochina Time)",
        contactNumber: "784697240",
        address: "town",
        skills: [
            "english"
        ],
        department: "Security",
        designation: "Security guard"
    },
    {
        email: "manager2@gmail.com",
        password: "88888888",
        name: "manager2",
        dateOfBirth: "Wed Jul 09 1997 00:00:00 GMT+0700 (Indochina Time)",
        contactNumber: "784697240",
        address: "town123",
        skills: [
            "english",
            "japanese"
        ],
        department: "None",
        designation: "Hotel manager"
    }
]

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      align: 'center',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'contactNumber',
      align: 'center',
      key: 'contactNumber',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      align: 'center',
      key: 'address',
    },
    {
        title: 'Skills',
        dataIndex: 'skills',
        align: 'center',
        key: 'skills',
        render: tags => (
          <>
            {tags.map((tag,index) => {
              let color = 'geekblue';
              return (
                <Tag color={color} key={index}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
    },
    {
        title: 'Department',
        dataIndex: 'department',
        align: 'center',
        key: 'department',
    },
    {
        title: 'Designation',
        dataIndex: 'designation',
        align: 'center',
        key: 'designation',
    },
    {
        title: 'Action',
        align: 'center',
        key: 'action',
        render: v => <Button>Edit</Button>
    },
    
];

// export const EmployeeReducer = (state, action) => {
//     switch (action.type) {
//       case 'init':
//         return { ...state, searchFields: extractSearch(action.data)}
//       case 'get_employee':
//         return { ...state, searchFields: action.data };
//       default:
//         return state;
//     } 
// }

export const Employee = (props) => {
    const [ user ] = useContext(User.context);
    const [ lstemp, setLstemp ] = useState([]);
    useEffect(()=>{
        // get employee
        const getData = async () => {
            const res = await getRequest('temp', user.api_token);
            if (!res.success) {
                message.error('This is an error message'); // param = res.error
            }
            setLstemp(res.data);
        }
        // getData();
    },[])

    // columns = lstemp
    return (
        <>
            <Table 
                dataSource={dataSource} 
                columns={columns} 
            />; 
        </>
    )
}