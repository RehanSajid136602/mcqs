import { getAllSubjects } from "@/lib/data.server";
import HomeClient from "@/components/HomeClient";

export default function HomePage() {
  const subjects = getAllSubjects();
  return <HomeClient subjects={subjects} />;
}