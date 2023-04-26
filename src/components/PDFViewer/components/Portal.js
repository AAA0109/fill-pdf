import { Box } from '@material-ui/core'
import React, { useRef } from 'react'

export default function Portal ({ children }) {

  const portal = useRef(null)

  return (
    <Box itemRef={portal}>
      { children }
    </Box>
  )
}