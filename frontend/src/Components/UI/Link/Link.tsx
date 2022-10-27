import {Link as RouterLink, LinkProps} from 'react-router-dom';
import {FC} from 'react';
import * as React from 'react';

interface IProps extends LinkProps {

}

export const Link: FC<IProps> = ({ children, to, ...props}) => {
  return <RouterLink
    {...props}
    to={to}
    style={{ color: 'inherit', textDecoration: 'inherit'}}
  >
    { children }
  </RouterLink>
}