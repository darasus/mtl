import React from 'react';
import { ChakraReactSelect } from './ChakraReactSelect';
import AsyncReactSelect from 'react-select/async';
import { ChakraReactSelectProps } from './types';
import Select from 'react-select/dist/declarations/src/Select';

export const AsyncSelect = React.forwardRef(function AsyncSelect(
  props: ChakraReactSelectProps,
  ref: React.Ref<Select>
) {
  return (
    <ChakraReactSelect {...props}>
      <AsyncReactSelect ref={ref} />
    </ChakraReactSelect>
  );
});
