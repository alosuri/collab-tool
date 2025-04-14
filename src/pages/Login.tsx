import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { Spinner, VStack, Text } from "@chakra-ui/react";
import supabase from "@/lib/supabase";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";

const Login = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) {
      navigate('/');
    }
  }, [loading, session, navigate]);

  if (loading) {
    return (
      <VStack colorPalette="teal">
        <Spinner color="colorPalette.600" />
        <Text color="colorPalette.600">Loading...</Text>
      </VStack>
    );
  }

  return (
    <Auth
      supabaseClient={supabase}
      appearance={{ theme: ThemeSupa }}
    />
  );
};

export default Login;
