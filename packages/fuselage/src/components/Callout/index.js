import PropTypes from 'prop-types';
import React from 'react';

import { Box } from '../Box';
import { Icon } from '../Icon';

const Container = Box.extend('rcx-callout', 'section');
const Wrapper = Box.extend('rcx-callout__wrapper');
const Title = Box.extend('rcx-callout__title', 'h1');
const ChildrenWrapper = Box.extend('rcx-callout__children');

export function Callout({
  children,
  title,
  type = 'info',
  ...props
}) {
  const iconName = (type === 'info' && 'info-circled')
    || (type === 'success' && 'checkmark-circled')
    || (type === 'warning' && 'warning')
    || (type === 'danger' && 'ban');

  return <Container mod-type={type} {...props}>
    <Icon name={iconName} size='20' />
    <Wrapper>
      {title && <Title>{title}</Title>}
      <ChildrenWrapper>
        {children}
      </ChildrenWrapper>
    </Wrapper>
  </Container>;
}

Callout.defaultProps = {
  type: 'info',
};

Callout.displayName = 'Callout';

Callout.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
  type: PropTypes.oneOf(['info', 'success', 'warning', 'danger']).isRequired,
};
