import { ChakraTheme } from '@chakra-ui/react';
import { GroupBase } from 'react-select';

interface Option {
  label: string;
  value: string;
}

export type ChakraReactSelectProps = {
  theme?: (props: ChakraTheme) => ChakraTheme;
  size?: 'lg' | 'md' | 'sm';
  isDisabled?: boolean;
  isInvalid?: boolean;
  isMulti?: boolean;
  name?: string;
  placeholder?: string;
  closeMenuOnSelect?: boolean;
  options: GroupBase<Option>[];
  onChange: (value: Option[]) => void;
  value?: Option[];
};
