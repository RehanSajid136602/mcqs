import { getTopicById } from "@/lib/coding-data";
import TopicPage from "@/components/coding/TopicPage";
import { Metadata } from "next";
import Link from "next/link";

interface Props {
  params: Promise<{ topicId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topicId } = await params;
  const topic = getTopicById(topicId);
  return {
    title: topic ? `${topic.title} — Coding Lab` : "Topic Not Found",
    description: topic?.description,
  };
}

export default async function TopicPageRoute({ params }: Props) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);

  if (!topic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[--text] mb-4">Topic Not Found</h1>
          <p className="text-[--text]/60 mb-6">The topic you are looking for does not exist.</p>
          <Link href="/coding" className="text-blue-400 hover:text-blue-300">
            Back to Coding Lab
          </Link>
        </div>
      </div>
    );
  }

  const { iconName, ...rest } = topic;
  return <TopicPage iconName={iconName} {...rest} />;
}