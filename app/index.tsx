import { useAuth } from "@/context/AuthContext";
import { Redirect } from "expo-router";


export default function Index() {
  const { isAuthenticated } = useAuth();
  
  // If user is authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Redirect href="/auth/business-list" />;
  } else {
    return <Redirect href="/auth/welcome" />;
  }
}
