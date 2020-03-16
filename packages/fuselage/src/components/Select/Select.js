import React, { useState, useLayoutEffect, useRef, useCallback, useEffect } from 'react';

import { PositionAnimated, Box, Flex, Margins, AnimatedVisibility } from '../Box';
import { Icon } from '../Icon';
import { InputBox } from '../InputBox';
import { Options, useCursor } from '../Options';

const Container = Box.extend('rcx-select', 'div');

export const Addon = Box.extend('rcx-select__addon', 'div');

const Wrapper = Box.extend('rcx-select__wrapper', 'div'); // ({ children, ...props }) => <InnerWrapper children={React.Children.map(children, (c, i) => <Margins key={i} inline='x4'>{c}</Margins>)} {...props} />;

export const Focus = React.forwardRef((props, ref) => <Box ref={ref} textStyle='p2' textColor='hint' componentClassName='rcx-select__focus' is='button' type='button' {...props}/>);

export const Select = ({
  value,
  filter,
  setFilter,
  error,
  disabled,
  options = [],
  anchor: Anchor = Focus,
  onChange = () => {},
  getValue = ([value] = []) => value,
  getLabel = ([, label] = []) => label,
  placeholder,
  renderOptions: _Options = Options,
}) => {
  const [internalValue, setInternalValue] = useState(value);


  const currentValue = value !== undefined ? value : internalValue;
  const option = options.find((option) => getValue(option) === currentValue);
  const index = options.indexOf(option);

  const isFirstRun = useRef(true);

  const internalChanged = ([value]) => {
    setInternalValue(value);
    onChange(value);
    setFilter('');
  };

  const mapOptions = ([value, label]) => {
    if (currentValue === value) {
      return [value, label, true];
    }
    return [value, label];
  };

  const applyFilter = ([, option]) => !filter || ~option.toLowerCase().indexOf(filter.toLowerCase());
  const filteredOptions = options.filter(applyFilter).map(mapOptions);
  const [cursor, handleKeyDown, handleKeyUp, reset, [visible, hide, show]] = useCursor(index, options, internalChanged);

  const ref = useRef();

  const containerRef = useRef();

  useLayoutEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    hide();
    ref.current.focus();
  }, [internalValue]);

  useEffect(reset, [filter]);

  const valueLabel = getLabel(option);

  const visibleText = (filter === undefined || visible === AnimatedVisibility.HIDDEN) && (valueLabel ? <Box textStyle='p1' textColor='default'>{valueLabel}</Box> : placeholder);
  return (
    <Container disabled={disabled} ref={containerRef} onClick={() => ref.current.focus() & show()} className={
      [

        error && 'invalid',
        disabled && 'disabled',

      ].filter(Boolean).join(' ')
    }>
      <Flex.Item>
        <Flex.Container>
          <Margins inline='neg-x4'>
            <Wrapper mod-hidden={!!visibleText}>
              { visibleText && <Flex.Item grow={1}>
                <Margins inline='x4'><Box is='span' textStyle='p2' textColor='hint' className='rcx-select__placeholder'>{visibleText}</Box></Margins>
              </Flex.Item>}
              <Anchor disabled={disabled} mod-undecorated={true} filter={filter} ref={ref} aria-haspopup='listbox' onClick={show} onBlur={hide} onKeyUp={handleKeyUp} onKeyDown={handleKeyDown} />
              <Margins inline='x4'><Addon children={<Icon name={ visible === AnimatedVisibility.VISIBLE ? 'cross' : 'arrow-down'} size='20' />}/></Margins>
            </Wrapper>
          </Margins>
        </Flex.Container>
      </Flex.Item>
      <PositionAnimated visible={visible} anchor={containerRef}><_Options role='listbox' filter={filter} options={filteredOptions} onSelect={internalChanged} cursor={cursor} /></PositionAnimated>
    </Container>);
};

export const SelectFiltered = ({
  options,
  placeholder,
  ...props
}) => {
  const [filter, setFilter] = useState('');
  const anchor = useCallback(React.forwardRef(({ children, filter, ...props }, ref) => <Margins inline='x4'><Flex.Item grow={1}><InputBox.Input className='rcx-select__focus' ref={ref} placeholder={placeholder} value={filter} onChange={() => {}} onInput={(e) => setFilter(e.currentTarget.value)} {...props} mod-undecorated={true}/></Flex.Item></Margins>), []);
  return <Select setFilter={setFilter} filter={filter} options={options} {...props} anchor={anchor}/>;
};
