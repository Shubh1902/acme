import { Box, Container, TextField } from '@material-ui/core';
import React from 'react';
import Navbar from 'src/components/Navbar';
import TableComponent from 'src/components/Table';
const testObject = {
  columns: [
    {
      id: '1',
      label: 'Name',
    },
    {
      id: '2',
      label: 'Age',
    },
    {
      id: '3',
      label: 'Caste',
    },
    {
      id: '4',
      label: 'Sex',
    },
    {
      id: '5',
      label: 'Country',
    },
  ],
  rows: [
    {
      id: '1',
      name: 'Shubhanshu',
      age: 26,
      caste: 'None',
    },
    {
      id: '2',
      name: 'Shanku',
      age: 27,
      caste: 'None',
    },
    {
      id: '3',
      name: 'Shubhanshu',
      age: 26,
      caste: 'None',
    },
    {
      id: '4',
      name: 'Shanku',
      age: 27,
      caste: 'None',
    },
    {
      id: '5',
      name: 'Shubhanshu',
      age: 26,
    },
    {
      id: '6',
      name: 'Shanku',
      age: 27,
    },
  ],
};
const Home = () => {
  return (
    <Container className="container">
      <Navbar />
      <TextField id="search" label="Search Products" fullWidth />
      <TableComponent
        rows={testObject.rows}
        columns={testObject.columns}
        onRowClick={() => {}}
        onSelectionChange={() => {}}
      />
    </Container>
  );
};
export default Home;
