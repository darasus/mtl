export const chakraStyles = {
  // When disabled, react-select sets the pointer-state to none
  // which prevents the `not-allowed` cursor style from chakra
  // from getting applied to the Control
  container: (provided) => ({
    ...provided,
    pointerEvents: 'auto',
  }),
  input: (provided) => ({
    ...provided,
    color: 'inherit',
    lineHeight: 1,
  }),
  menu: (provided) => ({
    ...provided,
    boxShadow: 'none',
  }),
  valueContainer: (provided, { selectProps: { size } }) => {
    const px = {
      sm: '0.75rem',
      md: '1rem',
      lg: '1rem',
    };

    return {
      ...provided,
      padding: `0.125rem ${px[size]}`,
    };
  },
  loadingMessage: (provided, { selectProps: { size } }) => {
    const fontSizes = {
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
    };

    const paddings = {
      sm: '6px 9px',
      md: '8px 12px',
      lg: '10px 15px',
    };

    return {
      ...provided,
      fontSize: fontSizes[size],
      padding: paddings[size],
    };
  },
  // Add the chakra style for when a TagCloseButton has focus
  multiValueRemove: (
    provided,
    { isFocused, selectProps: { multiValueRemoveFocusStyle } }
  ) => (isFocused ? multiValueRemoveFocusStyle : {}),
  control: () => ({}),
  menuList: () => ({}),
  option: () => ({}),
  multiValue: () => ({}),
  multiValueLabel: () => ({}),
  group: () => ({}),
};
