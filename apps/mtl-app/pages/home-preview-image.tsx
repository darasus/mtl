import { Center } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import React from "react";
import { Intro } from "../components/Intro";

const HomePreviewImage: React.FC = () => {
  return (
    <Center height="100vh">
      <Intro />
    </Center>
  );
};

export default HomePreviewImage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
};
