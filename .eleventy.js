module.exports = function (eleventyConfig) {
  // human readable date filter YYYY-MM-DD
  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return dateObj.toLocaleString('en-CA', { timeZone: 'UTC' }).slice(0, 10);
  });

  // Copy Image Folder to /_site
  eleventyConfig.addPassthroughCopy({"public": "/"});

  // process .html as nunjucks
  return {
    dir: {
      input: "src",
    },
    htmlTemplateEngine: "njk",
  };
};

