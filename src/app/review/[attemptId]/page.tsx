import ReviewClient from "./ReviewClient";

interface Props {
  params: Promise<{ attemptId: string }>;
}

export default async function ReviewPage({ params }: Props) {
  const { attemptId } = await params;
  return <ReviewClient attemptId={attemptId} />;
}
