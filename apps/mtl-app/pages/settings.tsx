import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Box, Flex, Grid, GridItem, Text } from "@chakra-ui/layout";
import React from "react";
import { useForm, useWatch } from "react-hook-form";
import { Head } from "../components/Head";
import { Heading } from "../components/Heading";
import { useUpdateUserSettingsMutation } from "../hooks/mutation/useUpdateUserSettingsMutation";
import { useMe } from "../hooks/useMe";
import { Layout } from "../layouts/Layout";
import { yupResolver } from "@hookform/resolvers/yup";
import { FormItem } from "../features/PostForm";
import { yup } from "../lib/yup";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";
import { Image } from "@chakra-ui/react";
import { GetServerSideProps } from "next";

type SettingsForm = {
  name: string;
  nickname: string;
  email: string;
  newPassword?: string;
  repeatNewPassword?: string;
  file?: File[];
};

export const userSettingsValidationSchema = yup.object().shape({
  name: yup.string().required("Please fill in your name"),
  nickname: yup.string().required("Please fill in your nickname"),
  email: yup.string().required("Please fill in your email"),
  newPassword: yup.string(),
  repeatNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null], "Passwords don't match")
    .when("newPassword", {
      is: (val: string) => !!val && typeof val === "string",
      then: yup.string().required("Please fill in password"),
    }),
});

const SettingsPage = () => {
  const updateUserSettingsMutation = useUpdateUserSettingsMutation();
  const [show, setShow] = React.useState(false);
  const handleClick = () => setShow(!show);
  const me = useMe();
  const form = useForm<SettingsForm>({
    mode: "all",
    resolver: yupResolver(userSettingsValidationSchema),
  });
  const {
    reset,
    control,
    formState: { dirtyFields, errors },
  } = form;
  const [createObjectURL, setCreateObjectURL] = React.useState<URL | null>(
    null
  );

  const file = useWatch({ control, name: "file" });

  React.useEffect(() => {
    if (file?.[0]) {
      const url = new URL(URL.createObjectURL(file[0]));
      setCreateObjectURL(url);
    } else if (me?.user?.picture) {
      setCreateObjectURL(new URL(me?.user?.picture));
    }
  }, [me?.user?.picture, file]);

  React.useEffect(() => {
    reset({
      name: me?.user?.name || "",
      nickname: me?.user?.nickname || "",
      email: me?.user?.email || "",
    });
  }, [reset, me]);

  const submit = form.handleSubmit(async (data) => {
    const password =
      data.newPassword && data.repeatNewPassword ? data.newPassword : undefined;
    updateUserSettingsMutation.mutate({
      nickname: data.nickname,
      name: data.name,
      file: dirtyFields.file && data.file?.[0] ? data.file?.[0] : undefined,
      password,
    });
  });

  const handleFileUploadClick = React.useCallback(() => {
    document.querySelector<HTMLInputElement>('[name="file"]')?.click();
  }, []);

  return (
    <>
      <Head title={"Settings"} urlPath={"/settings"} />
      <Layout>
        <Heading title="Settings" />
        <form onSubmit={submit}>
          <Grid templateColumns="repeat(12, 1fr)" gap={4}>
            <GridItem colSpan={12}>
              <Text fontSize="3xl" fontWeight="bold">
                General settings
              </Text>
            </GridItem>
            <GridItem colSpan={6}>
              <FormItem title="Name" errorMessage={errors.name?.message}>
                <Input {...form.register("name")} />
              </FormItem>
            </GridItem>
            <GridItem colSpan={6}>
              <FormItem
                title="Nickname"
                errorMessage={errors.nickname?.message}
              >
                <Input {...form.register("nickname")} />
              </FormItem>
            </GridItem>
            <GridItem colSpan={6}>
              <FormItem title="Email" errorMessage={errors.email?.message}>
                <Input {...form.register("email")} isDisabled />
              </FormItem>
            </GridItem>
            <GridItem colSpan={12}>
              <Text fontSize="3xl" fontWeight="bold">
                Password
              </Text>
            </GridItem>
            <GridItem colSpan={6}>
              <FormItem
                title="New password"
                errorMessage={errors.newPassword?.message}
              >
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    {...form.register("newPassword")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormItem>
            </GridItem>
            <GridItem colSpan={6}>
              <FormItem
                title="Repeat new password"
                errorMessage={errors.repeatNewPassword?.message}
              >
                <InputGroup size="md">
                  <Input
                    pr="4.5rem"
                    type={show ? "text" : "password"}
                    {...form.register("repeatNewPassword")}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                      {show ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormItem>
            </GridItem>
            <GridItem colSpan={12}>
              <Text fontSize="3xl" fontWeight="bold">
                Profile picture
              </Text>
            </GridItem>
            <GridItem colSpan={6}>
              <Flex alignItems="center">
                <Input
                  {...form.register("file")}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
                {createObjectURL?.href && (
                  <Box borderRadius="full" overflow="hidden" mr={4}>
                    <Image
                      src={createObjectURL?.href}
                      alt="Profile picture"
                      width="100px"
                      height="100px"
                    />
                  </Box>
                )}
                <Button onClick={handleFileUploadClick} size="sm">
                  Select file
                </Button>
              </Flex>
            </GridItem>
            <GridItem colSpan={12} mt={2}>
              <Button
                type="submit"
                isLoading={updateUserSettingsMutation.isLoading}
                disabled={!form.formState.isDirty}
              >
                Save
              </Button>
            </GridItem>
          </Grid>
        </form>
      </Layout>
    </>
  );
};

export default withPageAuthRequired(SettingsPage);

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return {
    props: {
      cookies: req.headers.cookie ?? "",
    },
  };
};
