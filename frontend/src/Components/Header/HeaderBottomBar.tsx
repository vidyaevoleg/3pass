import React, {FC} from 'react';
import {AppBar, Typography, useTheme, Toolbar} from '@mui/material';
import {observer} from 'mobx-react-lite';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {useStyles} from './styles';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';


export const HeaderBottomBar: FC = observer(() => {
  const theme = useTheme();
  const styles = useStyles(theme);

  return (
    <AppBar position='static' sx={ styles.appBottomBar }>
      <Toolbar>
        <Grid container spacing={0}>
          <Grid item xs={2}>
            <Box 
              display='flex'
              justifyContent='left'
              alignItems='center'
              sx={ styles.box }>
              <GridViewRoundedIcon sx={ styles.gridIcon }></GridViewRoundedIcon>
              <Typography sx={ styles.text }>
                All Items
              </Typography>
              <ExpandMoreRoundedIcon sx={ styles.expandMoreIcon }></ExpandMoreRoundedIcon>
            </Box>
          </Grid>
          <Grid item xs={10}>
            <Box> 
              {/*
              <Button>
                Cancel
              </Button> 
              <FormikSubmit>
                Save
              </FormikSubmit> 
              */}
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  )
});