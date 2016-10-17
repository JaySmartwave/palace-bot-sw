import React, { PropTypes } from 'react';
import MenuIcon from 'grommet/components/icons/base/Menu';

const Logo = ({
  inverse,
}) => (
  <MenuIcon
    size="medium"
    type="logo"
    colorIndex={inverse ? 'light-2' : 'brand'}
  />
);

Logo.propTypes = {
  inverse: PropTypes.bool.isRequired,
};

export default Logo;
