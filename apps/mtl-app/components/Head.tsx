import NextHead from "next/head";
import { introImageUrl } from "../constants/introImageUrl";
import { slogan } from "../constants/slogan";

interface Props {
  title: string;
  description?: string;
  urlPath: string;
  facebookImage?: string;
  twitterImage?: string;
}

export const Head: React.FC<Props> = ({
  title,
  description = slogan,
  urlPath,
  facebookImage = introImageUrl,
  twitterImage = introImageUrl,
  children,
}) => {
  const url = `${process.env.NEXT_PUBLIC_VERCEL_URL}/${urlPath}`;
  const titleText = `${title} | My Tiny Library`;

  return (
    <NextHead>
      <title>{titleText}</title>

      {/*  meta */}
      <meta name="title" content={titleText} />
      <meta name="description" content={description} />

      {/* facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={titleText} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={facebookImage} />

      {/* twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={titleText} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={twitterImage} />

      {/* rest of the children */}
      {children}
    </NextHead>
  );
};
