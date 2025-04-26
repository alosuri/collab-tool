import { Flex, Tabs, Wrap } from "@chakra-ui/react";
import ProjectCard from "@/components/ProjectCard";
import NavBar from "@/components/NavBar";
import supabase from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
const Dashboard = () => {
  const [projects, setProjects] = useState<any[]>([]);  // State to store projects
  const { session } = useAuth();  // Get the user session

  // Fetch the projects for the authenticated user
  const fetchProjects = async () => {
    if (!session?.user.id) return;

    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", session.user.id);

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects(data || []);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [session?.user.id]);
  
  return (
    <Flex flexDir="column" justifyContent="center" alignItems="center">
      <NavBar onProjectCreated={fetchProjects}/>
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
          <Wrap gap="30px" w="full" justifyContent="center">
            {projects.map((project) => (
              // TODO: Zmienić key, bo to jest średnio bezpieczne
              <ProjectCard name={project.name} path={project.id} key={project.id} />
            ))}
          </Wrap>
        </Tabs.Content>
        <Tabs.Content value="my">Mine</Tabs.Content>
        <Tabs.Content value="shared">
        </Tabs.Content>
      </Tabs.Root>
    </Flex >
  )
}

export default Dashboard
