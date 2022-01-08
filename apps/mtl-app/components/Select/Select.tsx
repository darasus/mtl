import React from 'react';
import { ChakraReactSelect } from './ChakraReactSelect';
import ReactSelect from 'react-select';
import { ChakraReactSelectProps } from './types';
import SelectAttr from 'react-select/dist/declarations/src/Select';

export const Select = React.forwardRef(function Select(
  props: ChakraReactSelectProps,
  ref: React.Ref<SelectAttr>
) {
  return (
    <ChakraReactSelect {...props}>
      <ReactSelect ref={ref} />
    </ChakraReactSelect>
  );
});
