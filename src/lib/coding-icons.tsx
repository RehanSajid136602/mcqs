"use client";
import { Layers, Hash, Table2, ListOrdered } from "lucide-react";
import type { ReactNode } from "react";
export type { TopicData, CodeExample, PracticeQuestion } from "./coding-data";
export { CODING_TOPICS, TOPIC_SLUGS, getTopicById } from "./coding-data";

const ICON_MAP: Record<string, ReactNode> = {
  list: <ListOrdered size={24} />,
  lists: <ListOrdered size={24} />,
  tuple: <Layers size={24} />,
  tuples: <Layers size={24} />,
  dict: <Hash size={24} />,
  dictionaries: <Hash size={24} />,
  sql: <Table2 size={24} />,
};

export function getTopicIcon(iconName: string): ReactNode {
  return ICON_MAP[iconName] || <ListOrdered size={24} />;
}
