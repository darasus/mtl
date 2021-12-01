import React from "react";
import sdk from "@stackblitz/sdk";
import { CodeLanguage } from ".prisma/client";
import { Project } from "@stackblitz/sdk/typings/interfaces";

const codeLanguageToExtensionMap = {
  [CodeLanguage.JAVASCRIPT]: "js",
  [CodeLanguage.TYPESCRIPT]: "ts",
};

const codeLanguageToLanguageMap = {
  [CodeLanguage.JAVASCRIPT]: "javascript",
  [CodeLanguage.TYPESCRIPT]: "typescript",
};

export const useOpenInRemoveCodeEditor = ({
  content,
  codeLanguage,
  title,
  description,
  tags,
}: {
  title: string;
  content: string;
  codeLanguage: CodeLanguage;
  description: string;
  tags: string[];
}) => {
  const file = `index.${codeLanguageToExtensionMap[codeLanguage]}`;
  const project: Project = React.useMemo(
    () => ({
      files: {
        [file]: content,
        "index.html": `<h1>This post was created using My Tiny Library</h1>`,
      },
      title,
      description,
      template: codeLanguageToLanguageMap[codeLanguage],
      tags,
      dependencies: {},
    }),
    [file, content, title, description, codeLanguage, tags]
  );

  return React.useCallback(() => sdk.openProject(project), [project]);
};
