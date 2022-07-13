const util = require("util");
const parser = require("xml2js");
const parseJson = util.promisify(parser.parseString);

const xml2json = async (xml) => {
  const result = await parseJson(xml, { trim: true });

  return result;
};

const json2xml = (json) => {
  const builder = new parser.Builder();
  const xml = builder.buildObject(json);

  return xml;
};

module.exports = {
  xml2json,
  json2xml,
};
