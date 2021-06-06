import { AppBar, Box, Button, Tab, Tabs } from '@material-ui/core';
import React from 'react';

const Navbar = () => {
  return (
    <AppBar
      position="static"
      style={{
        backgroundColor: 'unset',
        color: 'unset',
        boxShadow: 'none',
      }}
    >
      <h2>Ecma.Inc</h2>
    </AppBar>
  );
};
export default Navbar;
