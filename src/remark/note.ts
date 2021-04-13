import { H } from "mdast-util-to-hast";
import unified from "unified";
import visit from "unist-util-visit";
import { Node, Parent } from "unist";
import { VFileCompatible } from "vfile";

import all from "./all";

function isNoteParentNotation(node: Node) {
  if (!Array.isArray(node.children)) {
    return false;
  }

  const { children } = node;
  if (children.length === 0) {
    return false;
  }

  const firstChild = children[0];
  if (firstChild.type === "text" && firstChild.value[0] !== "{") {
    return false;
  }
  const lastChild = children[children.length - 1];
  if (
    lastChild.type === "text" &&
    lastChild.value[lastChild.value.length - 1] !== "}"
  ) {
    return false;
  }

  return true;
}

export const attacher: unified.Plugin = () => {
  return (tree: Node, file: VFileCompatible) => {
    visit(tree, "paragraph", visitor);

    function visitor(node: Node, index: number, parent: Parent | undefined) {
      if (parent === undefined) {
        return;
      }

      if (!isNoteParentNotation(node)) {
        return;
      }

      if (!Array.isArray(node.children)) {
        return;
      }
      const { children } = node;
      const lastIndex = children.length - 1;

      parent.children[index] = {
        type: "note",
        children: children.map((child, index) => {
          if (index !== 0 && index !== lastIndex) {
            return child;
          }

          let value = child.value as string;
          if (index === 0) {
            value = value.slice(1);
          }
          if (index === lastIndex) {
            value = value.slice(0, value.length - 1);
          }
          return {
            type: "text",
            value,
          };
        }),
      };
    }
  };
};

export function handler(h: H, node: Node) {
  return h(node, "aside", all(h, node));
}
