import { components as selectComponents } from 'react-select';
import {
  Box,
  Center,
  CloseButton,
  Divider,
  Flex,
  Portal,
  StylesProvider,
  Tag,
  TagCloseButton,
  TagLabel,
  useMultiStyleConfig,
  useStyles,
  useTheme,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';

export const chakraComponents = {
  // Control components
  Control: ({
    children,
    innerRef,
    innerProps,
    isDisabled,
    isFocused,
    selectProps: { size, isInvalid },
  }) => {
    const inputStyles = useMultiStyleConfig('Input', {
      size,
    });

    const heights = {
      sm: 8,
      md: 10,
      lg: 12,
    };

    return (
      <StylesProvider value={inputStyles}>
        <Flex
          ref={innerRef}
          sx={{
            ...inputStyles.field,
            p: 0,
            overflow: 'hidden',
            h: 'auto',
            minH: heights[size],
            borderRadius: 'md',
          }}
          {...innerProps}
          data-focus={isFocused ? true : undefined}
          data-invalid={isInvalid ? true : undefined}
          data-disabled={isDisabled ? true : undefined}
        >
          {children}
        </Flex>
      </StylesProvider>
    );
  },
  MultiValueContainer: ({
    children,
    innerRef,
    innerProps,
    data,
    selectProps,
  }) => (
    <Tag
      ref={innerRef}
      {...innerProps}
      m="0.125rem"
      // react-select Fixed Options example: https://react-select.com/home#fixed-options
      variant={data.isFixed ? 'solid' : 'subtle'}
      // colorScheme={data.colorScheme || selectProps.colorScheme}
      backgroundColor="brand"
      size={selectProps.size}
    >
      {children}
    </Tag>
  ),
  MultiValueLabel: ({ children, innerRef, innerProps }) => (
    <TagLabel ref={innerRef} {...innerProps}>
      {children}
    </TagLabel>
  ),
  MultiValueRemove: ({ children, innerRef, innerProps, data: { isFixed } }) => {
    if (isFixed) {
      return null;
    }

    return (
      <TagCloseButton ref={innerRef} {...innerProps} tabIndex={-1}>
        {children}
      </TagCloseButton>
    );
  },
  IndicatorSeparator: ({ innerProps }) => (
    <Divider {...innerProps} orientation="vertical" opacity="1" />
  ),
  ClearIndicator: ({ innerProps, selectProps: { size } }) => (
    <CloseButton {...innerProps} size={size} mx={2} tabIndex={-1} />
  ),
  DropdownIndicator: ({ innerProps, selectProps: { size } }) => {
    const { addon } = useStyles();

    const iconSizes = {
      sm: 10,
      md: 20,
      lg: 30,
    };
    const iconSize = iconSizes[size];

    return (
      <Center
        {...innerProps}
        sx={{
          ...addon,
          h: '100%',
          borderRadius: 0,
          borderWidth: 0,
          cursor: 'pointer',
        }}
      >
        <ChevronDownIcon height={iconSize} width={iconSize} />
      </Center>
    );
  },
  // Menu components
  MenuPortal: ({ children }) => <Portal>{children}</Portal>,
  Menu: ({ children, ...props }: any) => {
    const menuStyles = useMultiStyleConfig('Menu', {});
    return (
      <selectComponents.Menu {...props}>
        <StylesProvider value={menuStyles}>{children}</StylesProvider>
      </selectComponents.Menu>
    );
  },
  MenuList: ({ innerRef, children, maxHeight, selectProps: { size } }) => {
    const { list } = useStyles();
    const chakraTheme = useTheme();

    const borderRadii = {
      sm: chakraTheme.radii.sm,
      md: chakraTheme.radii.md,
      lg: chakraTheme.radii.md,
    };

    return (
      <Box
        sx={{
          ...list,
          maxH: `${maxHeight}px`,
          overflowY: 'auto',
          borderRadius: borderRadii[size],
        }}
        ref={innerRef}
      >
        {children}
      </Box>
    );
  },
  GroupHeading: ({ innerProps, children }) => {
    const { groupTitle } = useStyles();
    return (
      <Box sx={groupTitle} {...innerProps}>
        {children}
      </Box>
    );
  },
  Option: ({
    innerRef,
    innerProps,
    children,
    isFocused,
    isDisabled,
    selectProps: { size },
  }) => {
    const { item } = useStyles();
    return (
      <Box
        role="button"
        sx={{
          ...item,
          w: '100%',
          textAlign: 'start',
          bg: isFocused ? (item as any)._focus.bg : 'transparent',
          fontSize: size,
          ...(isDisabled && (item as any)._disabled),
        }}
        ref={innerRef}
        {...innerProps}
        {...(isDisabled && { disabled: true })}
      >
        {children}
      </Box>
    );
  },
};
