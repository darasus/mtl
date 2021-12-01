import Link from "next/link";
import React from "react";
import { Link as ChakraLink } from "@chakra-ui/react";

interface Props extends React.ComponentProps<typeof Link> {
  href: string;
  chakraLinkProps?: React.ComponentProps<typeof ChakraLink>;
}

export const RouterLink: React.FC<Props> = ({
  children,
  href,
  chakraLinkProps,
  ...props
}) => {
  return (
    <Link href={href} {...props} passHref>
      <ChakraLink textDecoration="underline" {...chakraLinkProps}>
        {children}
      </ChakraLink>
    </Link>
  );
};
