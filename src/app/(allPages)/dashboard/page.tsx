import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UserInfo from "./UserInfo";

const Dashboard = async () => {
  const serSession = await getServerSession();

  console.log("session:", serSession);

  if (!serSession) {
    redirect("/login");
  }

  return <UserInfo />;
};

export default Dashboard;
