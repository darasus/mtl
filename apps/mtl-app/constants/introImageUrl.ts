import getConfig from 'next/config';

export const introImageUrl = `${
  getConfig().publicRuntimeConfig.BASE_URL
}/api/screenshot?url=${
  getConfig().publicRuntimeConfig.BASE_URL
}/home-preview-image`;
