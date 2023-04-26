import React from 'react'
import Portal from "./Portal";
import { Box } from '@material-ui/core';

export default function Toolbar({children}) {
  <Portal>
    <Box position='fixed' zIndex='1222' top={0} left={0} right={0} className='h-12'>
      {children}
    </Box>
  </Portal>
}