import * as React from "react";
import {
  useCombobox,
  useMultipleSelection,
  UseMultipleSelectionProps,
} from "downshift";
import { matchSorter } from "match-sorter";
import Highlighter from "react-highlight-words";
import useDeepCompareEffect from "react-use/lib/useDeepCompareEffect";
import { Text, Stack, Box, List, ListItem, HStack } from "@chakra-ui/layout";
import { Button } from "@chakra-ui/button";
import { Input } from "@chakra-ui/input";
import { Tag, TagCloseButton, TagLabel } from "@chakra-ui/tag";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { useColors } from "../../hooks/useColors";
import { noop } from "../../utils/noop";

export interface Item {
  label: string;
  value: string | number;
}

export interface CUIAutoCompleteProps<T extends Item>
  extends UseMultipleSelectionProps<T> {
  items: T[];
  placeholder?: string;
  onCreateItem?: (item: T) => void;
  optionFilterFunc?: (items: T[], inputValue: string) => T[];
  emptyState?: (inputValue: string) => React.ReactNode;
  disableCreateItem?: boolean;
  "data-testid"?: string;
}

function defaultOptionFilterFunc<T>(items: T[], inputValue: string) {
  return matchSorter(items, inputValue, { keys: ["value", "label"] });
}

function createItemRenderer(value: string) {
  return (
    <Text>
      <Box as="span" bg="yellow.300" fontWeight="bold">
        {value}
      </Box>
    </Text>
  );
}

export const AutoComplete = <T extends Item>(
  props: CUIAutoCompleteProps<T>
): React.ReactElement<CUIAutoCompleteProps<T>> => {
  const { borderColor, backgroundColor } = useColors();
  const {
    items,
    optionFilterFunc = defaultOptionFilterFunc,
    placeholder,
    onCreateItem,
    disableCreateItem = false,
    ...downshiftProps
  } = props;

  /* States */
  const [isCreating, setIsCreating] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [inputItems, setInputItems] = React.useState<T[]>(items);

  /* Refs */
  const disclosureRef = React.useRef(null);

  /* Downshift Props */
  const {
    getSelectedItemProps,
    getDropdownProps,
    addSelectedItem,
    removeSelectedItem,
    selectedItems,
  } = useMultipleSelection(downshiftProps);
  const selectedItemValues = selectedItems.map((item) => item.value);

  const {
    isOpen,
    getToggleButtonProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    openMenu,
    selectItem,
    setHighlightedIndex,
  } = useCombobox({
    inputValue,
    selectedItem: undefined,
    items: inputItems,
    onInputValueChange: ({ inputValue, selectedItem }) => {
      const filteredItems = optionFilterFunc(items, inputValue || "");

      if (isCreating && filteredItems.length > 0) {
        setIsCreating(false);
      }

      if (!selectedItem) {
        setInputItems(filteredItems);
      }
    },
    stateReducer: (state, actionAndChanges) => {
      const { changes, type } = actionAndChanges;
      switch (type) {
        case useCombobox.stateChangeTypes.InputBlur:
          return {
            ...changes,
            isOpen: false,
          };
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          return {
            ...changes,
            highlightedIndex: state.highlightedIndex,
            inputValue,
            isOpen: true,
          };
        case useCombobox.stateChangeTypes.FunctionSelectItem:
          return {
            ...changes,
            inputValue,
          };
        default:
          return changes;
      }
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    onStateChange: ({ inputValue, type, selectedItem }) => {
      switch (type) {
        case useCombobox.stateChangeTypes.InputChange:
          setInputValue(inputValue || "");
          break;
        case useCombobox.stateChangeTypes.InputKeyDownEnter:
        case useCombobox.stateChangeTypes.ItemClick:
          if (selectedItem) {
            if (selectedItemValues.includes(selectedItem.value)) {
              removeSelectedItem(selectedItem);
            } else {
              if (onCreateItem && isCreating) {
                onCreateItem(selectedItem);
                setIsCreating(false);
                setInputItems(items);
                setInputValue("");
              } else {
                addSelectedItem(selectedItem);
              }
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            selectItem(null);
          }
          break;
        default:
          break;
      }
    },
  });

  React.useEffect(() => {
    if (inputItems.length === 0 && !disableCreateItem) {
      setIsCreating(true);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      setInputItems([{ label: `${inputValue}`, value: inputValue }]);
      setHighlightedIndex(0);
    }
  }, [
    inputItems,
    setIsCreating,
    setHighlightedIndex,
    inputValue,
    disableCreateItem,
  ]);

  useDeepCompareEffect(() => {
    setInputItems(items);
  }, [items]);

  /* Default Items Renderer */
  function defaultItemRenderer<T extends Item>(selected: T) {
    return selected.label;
  }

  return (
    <Stack position="relative">
      {selectedItems && (
        <HStack spacing={2}>
          {selectedItems.map((selectedItem, index) => (
            <Tag
              key={`selected-item-${index}`}
              {...getSelectedItemProps({ selectedItem, index })}
            >
              <TagLabel>{selectedItem.label}</TagLabel>
              <TagCloseButton
                onClick={(e) => {
                  e.stopPropagation();
                  removeSelectedItem(selectedItem);
                }}
                aria-label="Remove menu selection badge"
              />
            </Tag>
          ))}
        </HStack>
      )}

      <Stack isInline {...getComboboxProps()}>
        <Input
          {...getInputProps(
            getDropdownProps({
              placeholder,
              onClick: isOpen ? noop : openMenu,
              onFocus: isOpen ? noop : openMenu,
              ref: disclosureRef,
            })
          )}
          data-testid={downshiftProps["data-testid"]}
        />
        <Button
          {...getToggleButtonProps()}
          aria-label="toggle menu"
          variant="outline"
        >
          <ChevronDownIcon width="15px" height="15px" />
        </Button>
      </Stack>

      <Box display={isOpen ? "block" : "none"} position="relative">
        <List
          {...getMenuProps()}
          pb={4}
          mb={4}
          position="absolute"
          height="200px"
          overflowY="scroll"
          top="5px"
          left={0}
          right={0}
          backgroundColor={backgroundColor}
          borderColor={borderColor}
          borderRadius="md"
          borderWidth="thin"
          zIndex={1000}
        >
          {isOpen &&
            inputItems.map((item, index) => (
              <ListItem
                px={2}
                py={1}
                bg={highlightedIndex === index ? "gray.900" : "inherit"}
                key={`${item.value}${index}`}
                {...getItemProps({ item, index })}
              >
                {isCreating ? (
                  createItemRenderer(item.label)
                ) : (
                  <Box display="inline-flex" alignItems="center">
                    <Highlighter
                      autoEscape
                      searchWords={[inputValue || ""]}
                      textToHighlight={defaultItemRenderer(item)}
                    />
                    {selectedItemValues.includes(item.value) && (
                      <Box color="green.500" aria-label="Selected" ml={2}>
                        <CheckIcon width="15px" height="15px" />
                      </Box>
                    )}
                  </Box>
                )}
              </ListItem>
            ))}
        </List>
      </Box>
    </Stack>
  );
};
