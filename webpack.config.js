const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
var fs = require("fs");
const Dotenv = require("dotenv-webpack");
const schema = require("./schema.js");
const { DefinePlugin } = require("webpack");

const getContent = (fileName, seo) => {
  return `
    import React, { useState } from "react"
    import ${fileName}JSON from "./${fileName}.json";
    import { RSortable } from "qaftoplaygroundnew";
    import { Helmet } from 'react-helmet'
    import {staticData} from './StaticData'


    export default function ${fileName}() {
        const [data, setData] = useState({
            title: ${seo?.title ? `"${seo?.title}"` : `""`},
            description: ${seo?.description ? `"${seo?.description}"` : `""`},
            keywords: ${seo?.keywords ? `"${seo?.keywords}"` : `""`},
            canonical: window.location.href,
            metaData: {
              title: ${
                seo?.meta_data.title ? `"${seo?.meta_data.title}"` : `""`
              },
              description: ${
                seo?.meta_data.description
                  ? `"${seo?.meta_data.description}"`
                  : `""`
              },
              type: ${seo?.meta_data.type ? `"${seo?.meta_data.type}"` : `""`}
            }
        })
        
        return (
            <>
            <Helmet>
            {data?.title && data?.title.length > 0 && <title>{data?.title}</title>}
            {data?.description && data?.description.length > 0 && <meta name="description" content={data.description} />}
            {data?.keywords && data.keywords.length > 0 && <meta name="keywords" content={data.keywords} />}
            <link rel="canonical" href={window.location.href} />
            <link rel="alternate" hreflang="en" href={window.location.href} />
            {data?.meta_data?.title && data?.meta_data?.title.length > 0 && <meta property="og:type" content={data.type} />}
            {<meta property="og:url" content={window.location.href} />}
            {data?.meta_data?.title && data?.meta_data?.title.length > 0 && <meta property="og:title" content={data.title} />}
            {data?.meta_data?.description && data?.meta_data?.description.length > 0 && <meta property="og:description" content={data.description} />}
            {data?.title && data.title.length > 0 && <meta name="twitter:title" content={data?.title} />}
            {data?.description && data?.description.length > 0 && <meta name="twitter:description" content={data.description} />}
            </Helmet>
                <div className="flex max-w-[100%] min-h-full ">
                            <div className="duration-700 w-[100%]">
                                <div className="divide-y divide-gray-200   overflow-x-hidden bg-gray-500 overflow-auto rounded-sm shadow no-scrollbar" id="droparea">
                                    <div className="@container text-textColor bg-bg_color font-primary_font_family">
                                        <RSortable blocks={${fileName}JSON} staticData={staticData} />
                                    </div>
                                </div>
                            </div>
                </div>
            </>
        )
    }
    // !w-full !p-0 !m-0 !border-0 !static !shadow-none !transform-none !animate-none !bg-none !h-full !max-w-none
    `;
};

module.exports = {
  output: {
    path: path.join(__dirname, "/dist"), // the bundle output path
    filename: "[hash].bundle.js", // the name of the bundle
    publicPath: "/", // Notice this line
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "/public/index.html", // to import index.html file inside index.js
      minify: {
        collapseWhitespace: true,
        hash: true,
        inject: true,
      },
    }),
    {
      apply: (compiler) => {
        compiler.hooks.beforeRun.tap("AfterEmitPlugin", async (compilation) => {
          const pages = [];

          const staticData = [];
          function findVal(object, key) {
            var value;
            Object.keys(object).some(function (k) {
              if (k === key) {
                value = object[k];
                console.log(value);
                if (value instanceof Array) {
                  staticData.push(...value);
                } else {
                  staticData.push(value);
                }
                // return true;
              }
              if (object[k] && typeof object[k] === "object") {
                value = findVal(object[k], key);
                return value !== undefined;
              }
            });
            // return value;
          }

          // loop whole website schema
          for (let i = 0; i < schema.length - 2; i++) {
            // create .js & .json files
            const data = getContent(schema[i]?.pageName, schema[i].SitePageSEO);
            fs.writeFile(
              `./src/pages/${schema[i]?.pageName}.js`,
              data,
              (err) => {
                if (err) throw err;
                fs.writeFile(
                  `./src/pages/${schema[i]?.pageName}.json`,
                  JSON.stringify(schema[i]?.schema),
                  (err) => {
                    if (err) throw err;
                  }
                );
              }
            );

            pages.push({
              path:
                schema[i]?.pageName?.includes("Home") ||
                schema[i]?.pageName?.includes("home")
                  ? "/"
                  : `${schema[i]?.path}`,
              comp: `${schema[i]?.pageName}`,
              isPublic: `${schema[i]?.isPublic}`,
            });
            findVal(schema[i], "staticData");
          }

          fs.writeFile(
            `./src/pages/StaticData.js`,
            `export const staticData = ${JSON.stringify(staticData)}`,
            (err) => {
              if (err) throw err;
            }
          );

          // START - creating index.css file
          // for (const [key, value] of Object.entries(schema[schema.length - 1])) {
          //     if (key != "font") {
          //         cssData += `.${key}{
          //             ${key == "text" ? "color" : key == "bgColor" ? "background-color" : key == "linkColor" ? "color" : "color"} : ${value.split("[")[1]?.split("]")[0]};
          //         }`
          //     }
          // }
          let cssData = `/** @type {import('tailwindcss').Config} */
                    module.exports = {
                      content: [
                        "./node_modules/qaftoplaygroundnew/dist/*.{js, jsx, json, html,map,css}",
                        "./dist/*.{js, jsx, json, html}",
                        "./src/**/*.{js,jsx,json}"
                      ],
                      theme: {
                        extend: 


                    \n`;
          let originalObject = schema[schema.length - 1];
          const transformedObject = {
            colors: {
              primary_color: originalObject.primary_color,
              secondary_color: originalObject.secondary_color,
              bg_color: originalObject.bg_color,
              textColor: originalObject.textColor,
            },
            fontFamily: {
              primary_font_family: originalObject.primary_font_family,
              secondary_font_family: originalObject.secondary_font_family,
            },
            fontSize: {
              primary_font_size: originalObject.primary_font_size,
              secondary_font_size: originalObject.secondary_font_size,
              font_size: originalObject.font_size,
            },
            lineHeight: {
              line_height: originalObject.line_height,
            },
          };
          cssData =
            cssData +
            JSON.stringify(transformedObject) +
            `\n` +
            ` , containers: {
                        'xs': '420px',
                        'sm': '640px',
                        'md': '768px',
                        'lg': '1024px',
                        'xl': '1280px',
                        '2xl': '1536px'
                
                      }
                    },
                
                
                
                  plugins: [
                    require('@tailwindcss/container-queries'),
                  ],
                
                }`;
          console.log(cssData);
          fs.writeFile(`./tailwind.config.js`, cssData, (err) => {
            if (err) throw err;
          });
          // END - creating index.css file

          // Write index.html
          const indexPage = `<!DOCTYPE html>
                    <html lang="en">
                    
                    <head>
                      <meta charset="UTF-8" />
                      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    
                      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
                      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded" />
                      <link rel="stylesheet"
                        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL,GRAD@24,400,1,0" />
                      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@7.3.67/css/materialdesignicons.min.css" />
                      <script src="https://cdn.tailwindcss.com"></script>
                      <title>${
                        schema[schema.length - 2].title || "Webpack App"
                      }</title>
                    
                      <meta name="description" content="${
                        schema[schema.length - 2].description ||
                        "photographer portfolio"
                      }" />
                      <meta name="keywords" content="${
                        schema[schema.length - 2].keywords || ""
                      }" />
                      <meta name="author" content="${
                        schema[schema.length - 2].author || ""
                      }" />
                      <link rel="canonical" href="" id="canonical" />
                      <link rel="alternate" hreflang="en" href="" id="canonical"  />
                      <script>
                        document.getElementById('canonical').href = window.location.href;
                      </script>
                      <meta property="og:type" content="website" />
                      <meta property="og:url" content="" id="ogUrl">
                      <script>
                        document.getElementById('ogUrl').content = window.location.href;
                      </script>
                      ${
                        schema[schema.length - 2]?.meta_data?.title &&
                        schema[schema.length - 2]?.title.length > 0
                          ? `<meta property="og:title" content=${
                              schema[schema.length - 2].title
                            } />`
                          : ""
                      }
                      ${
                        schema[schema.length - 2]?.meta_data?.description &&
                        data?.description.length > 0
                          ? `<meta property="og:description" content=${
                              schema[schema.length - 2].description
                            } />`
                          : ""
                      }
                      ${
                        schema[schema.length - 2]?.title &&
                        schema[schema.length - 2].title.length > 0
                          ? `<meta name="twitter:title" content=${
                              schema[schema.length - 2]?.title
                            } />`
                          : ""
                      }
                      ${
                        schema[schema.length - 2]?.description &&
                        schema[schema.length - 2]?.description.length > 0
                          ? `<meta name="twitter:description" content=${
                              schema[schema.length - 2].description
                            } />`
                          : ""
                      }
                      ${
                        schema[schema.length - 2].logo
                          ? `<link rel="icon" href="${
                              schema[schema.length - 2].logo
                            }" type="image/x-icon" sizes="16x16" />`
                          : ""
                      }
                      ${
                        schema[schema.length - 2].favicon
                          ? `<link rel="icon" href="${
                              schema[schema.length - 2].favicon
                            }" type="image/x-icon" sizes="16x16" />`
                          : ""
                      }
                      ${
                        schema[schema.length - 2].cover_image
                          ? `<meta property="og:image" content="${
                              schema[schema.length - 2].cover_image
                            }" />`
                          : ""
                      }
                      ${
                        schema[schema.length - 2].cover_image
                          ? `<meta property="twitter:image" content="${
                              schema[schema.length - 2].cover_image
                            }" />`
                          : ""
                      }
                    </head>
                    
                    <body>
                      <div id="app"></div>
                      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                      <script type="text/javascript" crossorigin="anonymous"
                        src="https://securegw-stage.paytm.in/merchantpgpui/checkoutjs/merchants/.js"></script>
                      <script src="bundle.js"></script>
                    </body>
                    
                    </html>
                    `;
          fs.writeFile("./public/index.html", indexPage, (err) => {
            if (err) throw err;
            console.log("Done Writing index.html");
          });

          // routing file
          const pageRoutes = "export const pages = " + JSON.stringify(pages);
          fs.writeFile(`./src/Pages.js`, pageRoutes, (err) => {
            if (err) throw err;
            console.log("Done writing"); // Success
          });

          const robotsContent = `User-agent: *
Allow: /
Sitemap: https://${schema[0].siteId}/sitemap.xml`;

          fs.writeFile("./public/robots.txt", robotsContent, (err) => {
            if (err) {
              console.error("Error writing robots.txt file:", err);
            } else {
              console.log("robots.txt file has been created successfully.");
            }
          });

          // Generating sitemap XML
          const generateSitemap = (pages) => {
            let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
            sitemap +=
              '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

            for (page = 0; page < pages.length - 2; page++) {
              sitemap += "  <url>\n";
              sitemap += `    <loc>https://${schema[0].siteId}.com${pages[page]?.path}</loc>\n`;
              sitemap += `    <lastmod>${new Date().toISOString()}</lastmod>\n`;
              sitemap += "  </url>\n";
            }

            sitemap += "</urlset>";

            return sitemap;
          };

          // Writing sitemap to file
          const sitemapData = generateSitemap(schema);

          fs.writeFile("./public/sitemap.xml", sitemapData, (err) => {
            if (err) {
              console.error("Error writing sitemap file:", err);
            } else {
              console.log("Sitemap file has been created successfully.");
            }
          });
        });
      },
    },
    // new Dotenv()
    new DefinePlugin({
      "process.env": {
        SITE_ID: JSON.stringify(`${schema[0].siteId}`),
        API_URL: JSON.stringify(
          `https://backend.qafto.com/api/template/static`
        ),
      },
    }),
  ],
  devServer: {
    port: 3030, // you can change the port,
    historyApiFallback: {
      disableDotRule: true,
    },
  },
  resolve: {
    modules: [path.resolve(__dirname, "node_modules"), "node_modules"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // .js and .jsx files
        exclude: /node_modules/, // excluding the node_modules folder
        use: {
          loader: "babel-loader",
        },
      },
      // {
      //     test: /\.css$/i,
      //     include: path.resolve(__dirname, 'src'),
      //     use: ['style-loader', 'css-loader', 'postcss-loader'],
      // },
      {
        test: /\.(sass|less|css)$/,
        use: ["style-loader", "css-loader", "sass-loader", "postcss-loader"],
      },
      // {
      //     test: /\.(sa|sc|c)ss$/, // styles files
      //     use: ['style-loader', 'css-loader']
      // },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/, // to import images and fonts
        loader: "url-loader",
        options: { limit: false },
      },
    ],
  },
};
