import { FC } from 'react';
import { Variant } from '@mui/material/styles/createTypography';
import Tooltip from '@mui/material/Tooltip';
import {Typography} from '@mui/material';
import truncate from 'lodash/truncate';

interface IProps {
  title?: string;
  variant?: Variant;
  size?: number;
  className?: string;
}

export const Truncated: FC<IProps> = ({
  title,
  className,
  variant = 'body1',
  size = 50
}) => {
  if (!title) return null;

  if (title.length > size) {
    return (
      <Tooltip title={title}>
        <Typography className={className} variant={variant}>
          {truncate(title, { length: size, omission: '...' })}
        </Typography>
      </Tooltip>
    );
  } else {
    return (
      <Typography className={className} variant={variant}>
        {title}
      </Typography>
    );
  }
};
