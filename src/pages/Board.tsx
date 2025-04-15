import { Button, Flex, Drawer, Portal, CloseButton, Tabs, Input, Group, Textarea } from "@chakra-ui/react"
import ThemeToggle from "../components/ThemeToggle"
import { CircleIcon, MenuIcon, PencilIcon, SquareIcon, TypeIcon } from "lucide-react"
import supabase from "@/lib/supabase"
import { useState } from "react"
import Chat from "@/components/Chat"

const Board = () => {
  const signOut = async () => { await supabase.auth.signOut() };
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);

  return (
    <>
      <Drawer.Root open={openDrawer} onOpenChange={(e) => setOpenDrawer(e.open)}>
        <Drawer.Trigger asChild>
          <Button position="absolute" bottom="0" right="0" margin="5" variant={"surface"} aspectRatio={"square"}><MenuIcon /></Button>
        </Drawer.Trigger>

        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content height="100vh">
              <Drawer.Header>
                Menu
              </Drawer.Header>

              <Drawer.Body>
                <Tabs.Root fitted width="full" defaultValue="chat" variant="plain" height="100%">
                  <Tabs.List bg="bg.muted" rounded="l3" p="1">
                    <Tabs.Trigger value="chat">
                      Chat
                    </Tabs.Trigger>
                    <Tabs.Trigger value="projects">
                      Calls
                    </Tabs.Trigger>
                    <Tabs.Trigger value="tasks">
                      Settings
                    </Tabs.Trigger>
                    <Tabs.Indicator rounded="l2" />
                  </Tabs.List>
                  <Tabs.Content value="chat" height="90%">
                    <Chat />
                  </Tabs.Content>
                  <Tabs.Content value="projects">Manage your projects</Tabs.Content>
                  <Tabs.Content value="tasks">
                    Manage your tasks for freelancers
                    <Button variant="surface" onClick={signOut}>Sign Out</Button>
                  </Tabs.Content>
                </Tabs.Root>
              </Drawer.Body>
              <Drawer.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Drawer.CloseTrigger>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>


      <Flex borderBottomWidth={"1px"} width={"full"} p="4" justifyContent={"space-between"}>
        <Flex flexDir="row" gap="4">
          <Button variant={"surface"} aspectRatio={"square"}><PencilIcon /></Button>
          <Button variant={"surface"} aspectRatio={"square"}><SquareIcon /></Button>
          <Button variant={"surface"} aspectRatio={"square"}><CircleIcon /></Button>
          <Button variant={"surface"} aspectRatio={"square"}><TypeIcon /></Button>
        </Flex>
        <ThemeToggle />
      </Flex>
    </>
  )
}

export default Board
