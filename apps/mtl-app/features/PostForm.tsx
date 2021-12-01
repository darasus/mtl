import React from "react";
import * as yup from "yup";
import {
  Textarea,
  Input,
  Box,
  Button,
  Flex,
  Text,
  Select,
  useBreakpoint,
} from "@chakra-ui/react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CodeLanguage } from ".prisma/client";
import { useColors } from "../hooks/useColors";
import { CodeEditor } from "../components/CodeEditor";
import { useTagsQuery } from "../hooks/query/useTagsQuery";
import { GridItem, Grid } from "@chakra-ui/layout";
import { AutoComplete } from "../components/Autocomplete";
import { Heading } from "../components/Heading";

interface Props {
  handlePublish?: React.FormEventHandler;
  isPublishing?: boolean;
  handleSave?: React.FormEventHandler;
  isSaving?: boolean;
  handleUpdate?: React.FormEventHandler;
  isUpdating?: boolean;
}

export interface PostForm {
  title: string;
  description: string;
  content: string;
  codeLanguage: CodeLanguage;
  tagId: string | null;
}

export const postSchema = yup.object().shape({
  title: yup.string().required("Please fill in your title here"),
  description: yup.string(),
  content: yup.string().min(3).required("Please write your library here"),
  codeLanguage: yup
    .string()
    .test(
      "has-code-language",
      "Please select language",
      (value) => !!value && value !== "none"
    )
    .typeError("Please select tag")
    .required("Please select tag"),
  tagId: yup
    .string()
    .test("has-tag", "Please select tag", (value) => typeof value === "string")
    .typeError("Please select tag")
    .required("Please select tag"),
});

export const FormItem: React.FC<{ title: string; errorMessage?: string }> = ({
  title,
  errorMessage,
  children,
}) => {
  const { secondaryTextColor } = useColors();
  return (
    <Flex flexDirection="column" mb={6}>
      <Flex>
        <Text color={secondaryTextColor} mb={2}>
          {title}
        </Text>
        <Box mr={2} />
        {errorMessage && (
          <Text color="red.300" mb={2}>
            {errorMessage}
          </Text>
        )}
      </Flex>
      {children}
    </Flex>
  );
};

export const PostForm: React.FC<Props> = ({
  handlePublish,
  isPublishing,
  handleSave,
  isSaving,
  handleUpdate,
  isUpdating,
}) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<PostForm>();
  const tags = useTagsQuery();
  const codeLanguage = useWatch({ control, name: "codeLanguage" });
  const breakpoint = useBreakpoint();
  const isSmall = breakpoint === "base" || breakpoint === "sm";

  const actions = (
    <Flex>
      {handlePublish && (
        <Button
          marginRight="size-200"
          disabled={isPublishing}
          variant="outline"
          isLoading={isPublishing}
          loadingText="Publish"
          mr={2}
          color="brand"
          borderColor="brand"
          onClick={handlePublish}
          data-testid="publish-button"
        >
          Publish
        </Button>
      )}
      {handleSave && (
        <Button
          marginRight="size-200"
          disabled={isSaving}
          variant="outline"
          isLoading={isSaving}
          loadingText="Saving"
          mr={2}
          onClick={handleSave}
          data-testid="save-button"
        >
          Save as draft
        </Button>
      )}
      {handleUpdate && (
        <Button
          marginRight="size-200"
          disabled={isUpdating}
          variant="outline"
          isLoading={isUpdating}
          loadingText="Update"
          mr={2}
          color="brand"
          borderColor="brand"
          onClick={handleUpdate}
        >
          Update
        </Button>
      )}
    </Flex>
  );

  return (
    <>
      <Heading title="Create new javascript library" />
      <Grid templateColumns="repeat(12, 1fr)" gap={4}>
        <GridItem colSpan={[12, 12, 3, 3]}>
          <form>
            <FormItem title="Title" errorMessage={errors.title?.message}>
              <Input
                {...register("title")}
                isInvalid={!!errors.title?.message}
                data-testid="title"
              />
            </FormItem>
            <FormItem
              title="Description"
              errorMessage={errors.description?.message}
            >
              <Textarea
                {...register("description")}
                isInvalid={!!errors.description?.message}
                data-testid="description"
              />
            </FormItem>
            <FormItem
              title="Language"
              errorMessage={errors.codeLanguage?.message}
            >
              <Select
                {...register("codeLanguage")}
                isInvalid={!!errors.codeLanguage?.message}
                data-testid="codeLanguage"
              >
                <option key={"none"} value="none">
                  -
                </option>
                <option value={CodeLanguage.JAVASCRIPT}>JavaScript</option>
                <option value={CodeLanguage.TYPESCRIPT}>TypeScript</option>
              </Select>
            </FormItem>
            <FormItem title="Tag" errorMessage={errors.tagId?.message}>
              <Controller
                name="tagId"
                control={control}
                render={({ field: { onChange, value } }) => {
                  const items =
                    tags.data?.map((item) => ({
                      value: item.id,
                      label: item.name as string,
                    })) || [];
                  const selectedItems = items.filter(
                    (item) => item.value === value
                  );

                  return (
                    <AutoComplete
                      selectedItems={selectedItems}
                      items={items}
                      placeholder="E.g. React..."
                      disableCreateItem={true}
                      data-testid="tag"
                      onStateChange={(item) => {
                        onChange(
                          item?.selectedItems?.[item?.selectedItems.length - 1]
                            ?.value || null
                        );
                      }}
                    />
                  );
                }}
              />
            </FormItem>

            {!isSmall && actions}
          </form>
        </GridItem>
        <GridItem colSpan={[12, 12, 9, 9]}>
          <FormItem
            title={`Tiny ${codeLanguage?.toLowerCase()} library`}
            errorMessage={errors.content?.message}
          >
            <Controller
              name="content"
              control={control}
              render={({ field: { onChange, value } }) => (
                <CodeEditor
                  value={value}
                  onChange={onChange}
                  codeLanguage={codeLanguage}
                  isInvalid={!!errors.content?.message}
                  data-testid="content"
                />
              )}
            />
          </FormItem>
        </GridItem>
      </Grid>
      {isSmall && actions}
    </>
  );
};
