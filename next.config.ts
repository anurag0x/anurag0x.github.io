import type { NextConfig } from "next";

// Built as a fully static site (plain HTML/CSS/JS in out/) so it can be served by GitHub Pages.
const config: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default config;
