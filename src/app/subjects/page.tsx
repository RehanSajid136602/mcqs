import { getAllSubjects } from "@/lib/data.server";
import { redirect } from "next/navigation";

export default function SubjectsPage() {
  const subjects = getAllSubjects();
  redirect(`/subject/${subjects[0]?.id ?? "physics"}`);
}
