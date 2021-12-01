import React, { ElementType } from "react";
import ReactMarkdown from "react-markdown";
import {
  Text,
  Code,
  Divider,
  Link,
  Checkbox,
  ListItem,
  Heading,
  Image,
  OrderedList,
  UnorderedList,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
} from "@chakra-ui/react";

type GetCoreProps = {
  children?: React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  "data-sourcepos"?: any;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getCoreProps(props: GetCoreProps): any {
  return props["data-sourcepos"]
    ? { "data-sourcepos": props["data-sourcepos"] }
    : {};
}

const sizes = ["2xl", "xl", "lg", "md", "sm", "xs"];

const defaults: Record<string, ElementType> = {
  p: (props) => {
    const { children } = props;
    return <Text mb={2}>{children}</Text>;
  },
  em: (props) => {
    const { children } = props;
    return <Text as="em">{children}</Text>;
  },
  blockquote: (props) => {
    const { children } = props;
    return <Text as="cite">{children}</Text>;
  },
  code: (props) => {
    const { inline, children, className } = props;

    if (inline) {
      return <Code variant="subtle">{children}</Code>;
    }

    return (
      <Code
        className={className}
        whiteSpace="break-spaces"
        d="block"
        w="full"
        p={2}
        mb={2}
        variant="subtle"
      >
        {children}
      </Code>
    );
  },
  del: (props) => {
    const { children } = props;
    return <Text as="del">{children}</Text>;
  },
  hr: () => {
    return <Divider />;
  },
  a: ({ children, ...props }) => (
    <Link {...props} textDecoration="underline" target="_blank">
      {children}
    </Link>
  ),
  img: Image,
  text: (props) => {
    const { children } = props;
    return <Text as="span">{children}</Text>;
  },
  ul: (props) => {
    const { ordered, children, depth } = props;
    const attrs = getCoreProps(props);
    let Element = UnorderedList;
    let styleType = "disc";
    if (ordered) {
      Element = OrderedList;
      styleType = "decimal";
    }
    if (depth === 1) styleType = "circle";
    return (
      <Element
        spacing={2}
        as={ordered ? "ol" : "ul"}
        styleType={styleType}
        pl={4}
        {...attrs}
      >
        {children}
      </Element>
    );
  },
  ol: (props) => {
    const { ordered, children, depth } = props;
    const attrs = getCoreProps(props);
    let Element = UnorderedList;
    let styleType = "disc";
    if (ordered) {
      Element = OrderedList;
      styleType = "decimal";
    }
    if (depth === 1) styleType = "circle";
    return (
      <Element
        spacing={2}
        as={ordered ? "ol" : "ul"}
        styleType={styleType}
        pl={4}
        {...attrs}
      >
        {children}
      </Element>
    );
  },
  li: (props) => {
    const { children, checked } = props;
    let checkbox: null | JSX.Element = null;
    if (checked !== null && checked !== undefined) {
      checkbox = (
        <Checkbox isChecked={checked} isReadOnly>
          {children}
        </Checkbox>
      );
    }
    return (
      <ListItem
        {...getCoreProps(props)}
        listStyleType={checked !== null ? "none" : "inherit"}
      >
        {checkbox || children}
      </ListItem>
    );
  },
  h1: ({ level, children, ...props }) => (
    <Heading
      my={4}
      as={`h${level}`}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      size={sizes[`${level - 1}`]}
      {...getCoreProps({ level, children, ...props })}
    >
      {children}
    </Heading>
  ),
  h2: ({ level, children, ...props }) => (
    <Heading
      my={4}
      as={`h${level}`}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      size={sizes[`${level - 1}`]}
      {...getCoreProps({ level, children, ...props })}
    >
      {children}
    </Heading>
  ),
  h3: ({ level, children, ...props }) => (
    <Heading
      my={4}
      as={`h${level}`}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      size={sizes[`${level - 1}`]}
      {...getCoreProps({ level, children, ...props })}
    >
      {children}
    </Heading>
  ),
  h4: ({ level, children, ...props }) => (
    <Heading
      my={4}
      as={`h${level}`}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      size={sizes[`${level - 1}`]}
      {...getCoreProps({ level, children, ...props })}
    >
      {children}
    </Heading>
  ),
  h5: ({ level, children, ...props }) => (
    <Heading
      my={4}
      as={`h${level}`}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      size={sizes[`${level - 1}`]}
      {...getCoreProps({ level, children, ...props })}
    >
      {children}
    </Heading>
  ),
  h6: ({ level, children, ...props }) => (
    <Heading
      my={4}
      as={`h${level}`}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      size={sizes[`${level - 1}`]}
      {...getCoreProps({ level, children, ...props })}
    >
      {children}
    </Heading>
  ),
  heading: (props) => {
    const { level, children } = props;
    return (
      <Heading
        my={4}
        as={`h${level}`}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        size={sizes[`${level - 1}`]}
        {...getCoreProps(props)}
      >
        {children}
      </Heading>
    );
  },
  pre: (props) => {
    const { children } = props;
    return <pre>{children}</pre>;
  },
  table: Table,
  thead: Thead,
  tbody: Tbody,
  tr: Tr,
  td: Td,
  th: Th,
};

interface Props {
  value: string;
}

export const Markdown: React.FC<Props> = ({ value }) => {
  return (
    <Box fontFamily="Fira Code, monospaces">
      <ReactMarkdown className="markdown" components={defaults}>
        {value}
      </ReactMarkdown>
    </Box>
  );
};
