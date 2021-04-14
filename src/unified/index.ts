import unified from "unified";
import parse from "remark-parse";
import remark2react from "remark-react";
import gh from "hast-util-sanitize/lib/github.json";
import deepmerge from "deepmerge";

import Note from "../components/Note";

import * as note from "./plugins/note";

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
    remarkReactComponents: {
      aside: Note,
    },
  });

export default processor;
