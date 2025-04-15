import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { Spinner, VStack, Text, Stack, Field, Input, Button, Image, Flex, Box } from "@chakra-ui/react";
import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthError } from "@supabase/supabase-js";
import ThemeToggle from "@/components/ThemeToggle";

interface FormValues {
  email: string,
  password: string,
  photo: string,
}

const Login = () => {
  const { session, loading } = useAuth();
  const [error, setError] = useState<AuthError | null>(null);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, } = useForm<FormValues>();
  const onSubmit = handleSubmit((data) => signIn(data));

  useEffect(() => {
    if (!loading && session) {
      navigate('/');
    }
  }, [loading, session, navigate]);

  const signIn = async (data: any) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    setError(error);
  }

  if (loading) {
    return (
      <VStack colorPalette="teal">
        <Spinner color="colorPalette.600" />
        <Text color="colorPalette.600">Loading...</Text>
      </VStack>
    );
  }

  return (
    <form onSubmit={onSubmit}>
      <Box position="absolute" top="5" right="5">
        <ThemeToggle />
      </Box>
      <Stack gap="4" h="100vh" alignItems="center" justifyContent="center" mx="4">
        <Image src="https://www.trafongroup.com/wp-content/uploads/2019/04/logo-placeholder.png" w="150px" />
        <Field.Root invalid={!!errors.email} w={{ base: "100%", sm: "sm" }}>
          <Field.Label>Username</Field.Label>
          <Input {...register("email")} />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password} w={{ base: "100%", sm: "sm" }}>
          <Field.Label>Password</Field.Label>
          <PasswordInput {...register("password")} />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit" variant="surface">Submit</Button>
        <Text color="fg.error">{error?.message}</Text>
      </Stack>
    </form>
  );
};

export default Login;
