import { Button, Card, Image, Menu, Portal, Text } from "@chakra-ui/react"
import { EllipsisVerticalIcon } from "lucide-react"
import { useNavigate } from "react-router"
type ProjectCardProps = {
  name: string;
  path: string;
};

const ProjectCard = ({ name, path }: ProjectCardProps) => {
  const navigate = useNavigate();

  return (
    <Card.Root maxW="sm" overflow="hidden" m="4">
      <Image src="https://blog.uggy.org/posts/excalidraw/image-20210819103204807.png" alt="Canva" />
      <Card.Body gap="2">
        <Card.Title display="flex" flexDir="row" justifyContent="space-between" alignItems="center">
          <Text> {name} </Text>

        </Card.Title>
      </Card.Body>
      <Card.Footer display="flex" justifyContent="space-between">
        <Button variant="surface" onClick={() => navigate('/collab-tool/board', { state: { board_uuid: path } }) }>Open</Button>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="surface" size="sm" aspectRatio="square">
              <EllipsisVerticalIcon />
            </Button>
          </Menu.Trigger>
          <Portal>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="open" onClick={() => navigate('/collab-tool/board', { state: { board_uuid: path } }) }>Open</Menu.Item>
              <Menu.Item value="export">Export</Menu.Item>
              <Menu.Item value="rename">Rename</Menu.Item>
              <Menu.Item value="delete" color="fg.error" _hover={{ bg: "bg.error", color: "fg.error" }}>Delete</Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Card.Footer>
    </Card.Root >
  )
}

export default ProjectCard
