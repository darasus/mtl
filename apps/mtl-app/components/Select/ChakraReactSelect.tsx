import React from 'react';
import {
  useTheme,
  useColorModeValue,
  useFormControl,
  ChakraTheme,
} from '@chakra-ui/react';
import { chakraComponents } from './chakraComponents';
import { chakraStyles } from './chakraStyles';
import { ChakraReactSelectProps } from './types';

type Props = ChakraReactSelectProps & { children: React.ReactElement };

export const ChakraReactSelect: React.FC<Props> = ({
  children,
  theme = (props) => props,
  size = 'md',
  isDisabled,
  isInvalid,
  ...props
}) => {
  const chakraTheme = useTheme();

  // Combine the props passed into the component with the props
  // that can be set on a surrounding form control to get
  // the values of isDisabled and isInvalid
  const inputProps = useFormControl({ isDisabled, isInvalid });

  // The chakra theme styles for TagCloseButton when focused
  const closeButtonFocus =
    chakraTheme.components.Tag.baseStyle.closeButton._focus;

  const multiValueRemoveFocusStyle = {
    background: closeButtonFocus.bg,
    boxShadow: chakraTheme.shadows[closeButtonFocus.boxShadow],
  };

  // Ensure that the size used is one of the options, either `sm`, `md`, or `lg`
  let realSize = size;

  const sizeOptions = ['sm', 'md', 'lg'];

  if (!sizeOptions.includes(size)) {
    realSize = 'md';
  }

  const select = React.cloneElement(children, {
    components: {
      ...chakraComponents,
    },
    styles: {
      ...chakraStyles,
    },
    theme: (baseTheme: ChakraTheme) => {
      const propTheme = theme(baseTheme);

      return {
        ...baseTheme,
        ...propTheme,
      };
    },
    size: realSize,
    multiValueRemoveFocusStyle,
    isDisabled: inputProps.disabled,
    isInvalid: !!inputProps['aria-invalid'],
    ...props,
  });

  return select;
};
