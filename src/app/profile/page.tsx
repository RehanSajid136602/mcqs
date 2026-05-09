import { getAllSubjects } from "@/lib/data.server";
import ProfileClient from "@/components/ProfileClient";

export default function ProfilePage() {
  const subjects = getAllSubjects();
  return <ProfileClient subjects={subjects} />;
}
