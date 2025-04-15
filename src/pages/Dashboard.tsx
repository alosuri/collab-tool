import { Flex, Button, Heading, Tabs, Avatar, Circle, Float } from "@chakra-ui/react";
import { MenuIcon } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import ProjectCard from "@/components/ProjectCard";

const Dashboard = () => {
  return (
    <Flex flexDir="column" justifyContent="center" alignItems="center">
      <Flex borderBottomWidth={"1px"} width={"full"} p="4" justifyContent={"space-between"} alignItems="center">
        <Flex flexDir="row" gap="4">
          <Button variant={"surface"} aspectRatio={"square"}><MenuIcon /></Button>
        </Flex>
        <Heading>Dashboard</Heading>
        <Avatar.Root colorPalette="green" variant="subtle">
          <Avatar.Fallback name="Dari Ann" />
          <Avatar.Image src={"https://i.pinimg.com/236x/47/e1/94/47e194a733ae7930124a488d54999aab.jpg"} />
          <Float placement="bottom-end" offsetX="1" offsetY="1">
            <Circle
              bg="green.500"
              size="8px"
              outline="0.2em solid"
              outlineColor="bg"
            />
          </Float>
        </Avatar.Root>
      </Flex>

      <Tabs.Root defaultValue="all" variant="plain" height="100%" display="flex" flexDir="column" m="2" alignItems="center" width="100%">
        <Tabs.List bg="bg.muted" rounded="l3" p="1">
          <Tabs.Trigger value="all">
            All Boards
          </Tabs.Trigger>
          <Tabs.Trigger value="my">
            My Boards
          </Tabs.Trigger>
          <Tabs.Trigger value="shared">
            Shared
          </Tabs.Trigger>
          <Tabs.Indicator rounded="l2" />
        </Tabs.List>
        <Tabs.Content value="all" height="90%">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </Tabs.Content>
        <Tabs.Content value="my">Mine</Tabs.Content>
        <Tabs.Content value="shared">
          Shared
        </Tabs.Content>
      </Tabs.Root>
    </Flex>
  )
}

export default Dashboard
