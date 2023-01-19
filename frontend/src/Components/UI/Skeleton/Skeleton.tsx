import {FC} from 'react';
import { Skeleton as MuiSkeleton } from '@mui/material';
import Box from '@mui/material/Box';

export const Skeleton: FC = () => {
  return (
    <Box sx={{height: '100%'}}>
      <MuiSkeleton sx={{height: '100%'}}/>
    </Box>
  )
}