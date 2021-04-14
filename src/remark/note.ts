import { H } from "mdast-util-to-hast";
import unified from "unified";
import visit from "unist-util-visit";
import { Node, Parent } from "unist";
import { VFileCompatible } from "vfile";

import { isParent, isText } from "./util";

import all from "./all";

function isNoteParentNotation(node: Node) {
  if (!isParent(node)) {
    return false;
  }

  const { children } = node;
  if (children.length === 0) {
    return false;
  }

  const firstChild = children[0];
  if (!isText(firstChild) || firstChild.value[0] !== "{") {
    return false;
  }

  const lastChild = children[children.length - 1];
  if (
    !isText(lastChild) ||
    lastChild.value[lastChild.value.length - 1] !== "}"
  ) {
    return false;
  }

  return true;
}

export const attacher: unified.Plugin = () => {
  return (tree: Node, _file: VFileCompatible) => {
    visit(tree, "paragraph", visitor);

    function visitor(node: Node, index: number, parent: Parent | undefined) {
      if (parent === undefined) {
        return;
      }
      if (!isNoteParentNotation(node)) {
        return;
      }
      if (!isParent(node)) {
        return;
      }

      const lastIndex = node.children.length - 1;

      const children = [...node.children];
      children[0] = {
        ...children[0],
        value: (children[0].value as string).slice(1),
      };
      children[lastIndex] = {
        ...children[lastIndex],
        value: (children[lastIndex].value as string).slice(
          0,
          (children[lastIndex].value as string).length - 1
        ),
      };

      parent.children[index] = {
        type: "note",
        children,
      };
    }
  };
};

export function handler(h: H, node: Node) {
  return h(node, "aside", all(h, node));
}
