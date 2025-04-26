import { useNavigate } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { Spinner, VStack, Text, Stack, Field, Input, Button, Image, Box } from "@chakra-ui/react";
import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { PasswordInput } from "@/components/ui/password-input";
import { AuthError } from "@supabase/supabase-js";
import ThemeToggle from "@/components/ThemeToggle";

interface FormValues {
  name: string,
  email: string,
  password: string,
  access_pass: string,
}

const Login = () => {
  const { session, loading } = useAuth();
  const { register, handleSubmit, formState: { errors }, } = useForm<FormValues>();

  const [error, setError] = useState<AuthError | null>(null);
  const [login, setLogin] = useState<boolean>(true);

  const navigate = useNavigate();

  const onSubmitLogin = handleSubmit((data) => signIn(data));
  const onSubmitRegister = handleSubmit((data) => registerNewAccount(data));

  useEffect(() => {
    if (!loading && session) {
      if (login) {
        navigate('/collab-tool/', { state: { from: "login" } });
      }
      else {
        navigate('/collab-tool/', { state: { from: "register" } });
      }
    }
  }, [loading, session, navigate]);

  const registerNewAccount = async (data: any) => {
    if (data.access_pass == import.meta.env.VITE_ACCESS_PASS) {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
          }
        }
      });

      setError(error);
    }
  }

  const signIn = async (data: any) => {
    if (data.access_pass == import.meta.env.VITE_ACCESS_PASS) {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      setError(error);
    }
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
    <>
      <Box position="absolute" top="5" right="5">
        <ThemeToggle />
      </Box>
      {login ? <form onSubmit={onSubmitLogin}> <Stack gap="4" h="100vh" alignItems="center" justifyContent="center" mx="4">
        <Image src="https://www.trafongroup.com/wp-content/uploads/2019/04/logo-placeholder.png" w="150px" />
        <Field.Root invalid={!!errors.email} w={{ base: "100%", sm: "sm" }}>
          <Field.Label>Email</Field.Label>
          <Input {...register("email")} />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password} w={{ base: "100%", sm: "sm" }}>
          <Field.Label>Password</Field.Label>
          <PasswordInput {...register("password")} />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.access_pass} w={{ base: "100%", sm: "sm" }}>
          <Field.Label>Access Password</Field.Label>
          <PasswordInput {...register("access_pass")} />
          <Field.ErrorText>{errors.access_pass?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit" variant="surface">Submit</Button>
        <Text color="fg.error">{error?.message}</Text>
      </Stack></form > : <form onSubmit={onSubmitRegister}> <Stack gap="4" h="100vh" alignItems="center" justifyContent="center" mx="4">
        <Image src="https://www.trafongroup.com/wp-content/uploads/2019/04/logo-placeholder.png" w="150px" />

        <Field.Root invalid={!!errors.name} w={{ base: "100%", sm: "sm" }}>
          <Field.Label>Name</Field.Label>
          <Input {...register("name")} />
          <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.email} w={{ base: "100%", sm: "sm" }}>
          <Field.Label>Email</Field.Label>
          <Input {...register("email")} />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password} w={{ base: "100%", sm: "sm" }}>
          <Field.Label>Password</Field.Label>
          <PasswordInput {...register("password")} />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.access_pass} w={{ base: "100%", sm: "sm" }}>
          <Field.Label>Access Password</Field.Label>
          <PasswordInput {...register("access_pass")} />
          <Field.ErrorText>{errors.access_pass?.message}</Field.ErrorText>
        </Field.Root>

        <Button type="submit" variant="surface">Submit</Button>
        <Text color="fg.error">{error?.message}</Text>
      </Stack> </form>}
    </>
  );
};

export default Login;
