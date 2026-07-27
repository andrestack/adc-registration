import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["drive.google.com"], // Allow images from Google Drive
  },
};

export default withNextIntl(nextConfig);
