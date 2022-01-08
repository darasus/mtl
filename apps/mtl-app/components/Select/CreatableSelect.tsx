import React from 'react';
import { ChakraReactSelect } from './ChakraReactSelect';
import CreatableReactSelect from 'react-select/creatable';
import { ChakraReactSelectProps } from './types';
import Select from 'react-select/dist/declarations/src/Select';

export const CreatableSelect = React.forwardRef(function CreatableSelect(
  props: ChakraReactSelectProps,
  ref: React.Ref<Select>
) {
  return (
    <ChakraReactSelect {...props}>
      <CreatableReactSelect ref={ref} />
    </ChakraReactSelect>
  );
});
