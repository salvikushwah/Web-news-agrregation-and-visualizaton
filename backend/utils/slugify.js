const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')   // remove non-word characters
    .replace(/[\s_-]+/g, '-')   // collapse spaces/underscores into a single dash
    .replace(/^-+|-+$/g, '');   // trim leading/trailing dashes
};

module.exports = slugify;