import {Link as RouterLink, LinkProps} from 'react-router-dom';
import {FC} from 'react';
import * as React from 'react';
import {useStyles} from './styles';

interface IProps extends LinkProps {

}

export const Link: FC<IProps> = ({ children, to, ...props}) => {
  const styles = useStyles();
  return <RouterLink
    {...props}
    to={to}
    style={styles.root}
  >
    { children }
  </RouterLink>
}