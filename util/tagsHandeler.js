function parseTags(tags) {
  return tags ? tags.split(",").map((tag) => tag.trim()) : [];
}
module.exports = {
  parseTags,
};
