import React from "react";
import { useRouter } from "next/router";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FullscreenLayout } from "../../layouts/FullscreenLayout";
import { GetServerSideProps } from "next";
import { useCreatePostMutation } from "../../hooks/mutation/useCreatePostMutation";
import { PostForm, postSchema } from "../../features/PostForm";
import invariant from "invariant";
import { CodeLanguage } from ".prisma/client";
import { Head } from "../../components/Head";
import { getSession } from "@auth0/nextjs-auth0";

const CreatePostPage: React.FC = () => {
  const router = useRouter();
  const createPostMutation = useCreatePostMutation();
  const form = useForm<PostForm>({
    defaultValues: {
      codeLanguage: CodeLanguage.JAVASCRIPT,
    },
    resolver: yupResolver(postSchema),
  });

  const handlePublish = form.handleSubmit(
    async ({ tagId, codeLanguage, content, description, title }) => {
      invariant(typeof tagId === "string", "tagId is required");
      const post = await createPostMutation.mutateAsync({
        tagId,
        codeLanguage,
        content,
        description,
        title,
        isPublished: true,
      });
      await router.push(`/p/${post.id}`);
    }
  );

  const handleSave = form.handleSubmit(
    async ({ tagId, codeLanguage, content, description, title }) => {
      invariant(typeof tagId === "string", "tagId is required");
      const post = await createPostMutation.mutateAsync({
        tagId,
        codeLanguage,
        content,
        description,
        title,
        isPublished: false,
      });
      await router.push(`/p/${post.id}`);
    }
  );

  return (
    <>
      <Head title="Create tiny library" urlPath="/create" />
      <FullscreenLayout>
        <FormProvider {...form}>
          <PostForm
            handlePublish={handlePublish}
            isPublishing={createPostMutation.isLoading}
            handleSave={handleSave}
            isSaving={createPostMutation.isLoading}
          />
        </FormProvider>
      </FullscreenLayout>
    </>
  );
};

export default CreatePostPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession(req, res);
  return {
    props: {
      cookies: req.headers.cookie ?? "",
      user: session?.user || null,
    },
  };
};
