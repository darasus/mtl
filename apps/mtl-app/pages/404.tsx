import { Center, Text } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../layouts/Layout";
import { Head } from "../components/Head";

const NotFound: React.FC = () => {
  return (
    <>
      <Head title="404" urlPath="" />
      <Layout>
        <Center height={100}>
          <Text>404 | Not found</Text>
        </Center>
      </Layout>
    </>
  );
};

export default NotFound;
