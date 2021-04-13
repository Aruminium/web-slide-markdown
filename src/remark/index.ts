import unified from "unified";
import parse from "remark-parse";
import remark2react from "remark-react";
import gh from "hast-util-sanitize/lib/github.json";
import deepmerge from "deepmerge";

import * as note from "./note";

const sanitize = deepmerge(gh, {
  tagNames: ["aside"],
});

const processor = unified()
  .use(parse)
  .use(note.attacher)
  .use(remark2react, {
    toHast: {
      handlers: {
        note: note.handler,
      },
    },
    sanitize: false,
  });

export default processor;
