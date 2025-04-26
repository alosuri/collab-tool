import { Flex, Heading, Button, Menu, Avatar, Popover, Float, Circle, Portal, Text } from "@chakra-ui/react"
import { useAuth } from "@/context/AuthContext"
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import supabase from "@/lib/supabase";
import CreateNewBoard from "./CreateNewBoard";

const NavBar = ({onProjectCreated}: {onProjectCreated: () => void }) => {
  const { session } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { from } = location.state || {};

  const signOut = async () => { await supabase.auth.signOut() };

  useEffect(() => {
    if (from === "login") {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [from]);

  return (
    <Flex borderBottomWidth={"1px"} width={"full"} p="4" justifyContent={"space-between"} alignItems="center">
      <Heading>Dashboard</Heading>
      <Flex flexDir="row" gap="4">
        <CreateNewBoard onCreated={onProjectCreated}/>
        <Popover.Root open={open} onOpenChange={({ open }) => setOpen(open)} positioning={{ placement: "bottom-end" }}>
          <Menu.Root>
            <Menu.Trigger>
              <Popover.Anchor>
                <Avatar.Root colorPalette="green" variant="subtle">
                  <Avatar.Fallback name={session?.user.user_metadata.name} />
                      <Avatar.Image src={session?.user?.user_metadata?.profile?.data?.publicUrl ?? null} />
                  <Float placement="bottom-end" offsetX="1" offsetY="1">
                    <Circle
                      bg="green.500"
                      size="8px"
                      outline="0.2em solid"
                      outlineColor="bg"
                    />
                  </Float>
                </Avatar.Root>
              </Popover.Anchor>
            </Menu.Trigger>
            <Portal>
              <Menu.Positioner>
                <Menu.Content>
                  <Flex p="4" gap="4">
                    <Avatar.Root colorPalette="green" variant="subtle" size="2xl">
                      <Avatar.Fallback name={session?.user.user_metadata.name} />
                      <Avatar.Image src={session?.user?.user_metadata?.profile?.data?.publicUrl ?? null} />
                      <Float placement="bottom-end" offsetX="1" offsetY="1">
                        <Circle
                          bg="green.500"
                          size="12px"
                          outline="0.2em solid"
                          outlineColor="bg"
                        />
                      </Float>
                    </Avatar.Root>
                    <Flex flexDir="column">
                      <Heading>{session?.user.user_metadata.name}</Heading>
                      <Text>{session?.user.user_metadata.email}</Text>
                    </Flex>
                  </Flex>

                  <Menu.Item value="settings" onClick={() => navigate('/collab-tool/settings')}>Settings</Menu.Item>
                  <Menu.Item value="logout" color="fg.error" _hover={{ bg: "bg.error", color: "fg.error" }} onClick={signOut}>Logout</Menu.Item>
                </Menu.Content>
              </Menu.Positioner>
            </Portal>
          </Menu.Root>
          <Portal>
            <Popover.Positioner>
              <Popover.Content>
                <Popover.Header>✨ Welcome to your new account ✨</Popover.Header>
                <Popover.Arrow />
                <Popover.Body>
                  You can customize your profile and update your profile picture by clicking here.
                </Popover.Body>
              </Popover.Content>
            </Popover.Positioner>
          </Portal>
        </Popover.Root>
      </Flex>
    </Flex>
  )
}

export default NavBar
