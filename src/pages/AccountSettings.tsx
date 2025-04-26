import { useAuth } from "@/context/AuthContext";
import { Button, InputGroup, Input, Field, Stack, FileUpload } from "@chakra-ui/react"
import supabase from "@/lib/supabase";
import { ImageIcon, LockKeyholeIcon, MailIcon, UserIcon } from "lucide-react";
import { useState, ChangeEvent, useEffect } from "react";
import NavBar from "@/components/NavBar";

const AccountSettings = () => {
  const { session } = useAuth();

  const [file, setFile] = useState<File | null>(null)
  const [projects, setProjects] = useState<any[]>([]);  // State to store projects

  // Event handler to handle file selection
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    // To delete this console.log
    console.log(session?.user)
    const selectedFile = e.target.files ? e.target.files[0] : null
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const fetchProjects = async () => {
    if (!session?.user.id) return;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", session.user.id);

    console.log(projects)

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [session?.user.id]);


  const uploadFileToSupabase = async (file: File) => {
    const fileName = `public/${session?.user.id}_${Date.now()}.png`;
    let oldFilePath = "";
    const publicUrl = session?.user?.user_metadata?.profile?.data?.publicUrl;

    if (publicUrl != undefined) {
      oldFilePath = publicUrl;
    }

    try {
      const { data, error } = await supabase.storage
        .from('profiles')
        .upload(fileName, file, {
          cacheControl: '3600',
        })

      if (error) {
        console.error("Error uploading file:", error.message)
      } else {
        console.log("File uploaded successfully:", data)
        const fileUrl = supabase.storage.from('profiles').getPublicUrl(fileName)
        console.log("File URL:", fileUrl)

        // TODO: CHECK IF FILE IS ACTUALLY DELETED, BECAUSE IT'S STILL SHOWING IN SUPABASE
        // FIX: NVM, IT'S FIXED, 👍👍👍 

        if (oldFilePath != "") {
          const { error: deleteError } = await supabase.storage
            .from('profiles')
            .remove([`public/${oldFilePath.split('/')[oldFilePath.split('/').length - 1]}`]);

          if (deleteError) {
            console.error("Error deleting old avatar:", deleteError.message);
          } else {
            console.log("Old avatar deleted:", oldFilePath);
          }
        }

        await supabase.auth.updateUser({
          data: {
            profile: fileUrl,
          },
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error instanceof Error ? error.message : error)
    }
  }

  return (
    <>
      <NavBar onProjectCreated={fetchProjects}/>
      <Stack gap="4" h="100vh" alignItems="center" mx="4">
        <FileUpload.Root capture="environment">
          <FileUpload.HiddenInput onChange={handleFileChange} />
          <FileUpload.Trigger asChild>
            <Button variant="outline" size="sm">
              <ImageIcon /> Open Camera
            </Button>
          </FileUpload.Trigger>

          {/* Display the upload button after a file is selected */}
          {file && (
            <Button onClick={() => file && uploadFileToSupabase(file)} colorScheme="teal" size="sm">
              Upload to Supabase
            </Button>
          )}

          <FileUpload.List />
        </FileUpload.Root>
        <Field.Root>
          <Field.Label>Name</Field.Label>
          <InputGroup startElement={<UserIcon />}>
            <Input placeholder="Change your name" value={session?.user.user_metadata.name} />
          </InputGroup>
        </Field.Root>
        <Field.Root>
          <Field.Label>Email</Field.Label>
          <InputGroup startElement={<MailIcon />}>
            <Input placeholder="Change your name" value={session?.user.user_metadata.email} />
          </InputGroup>
        </Field.Root>
        <Field.Root>
          <Field.Label>Change password</Field.Label>
          <InputGroup startElement={<LockKeyholeIcon />}>
            <Input placeholder="Do zrobienia" />
          </InputGroup>
        </Field.Root>
      </Stack>
    </>
  )
}

export default AccountSettings
