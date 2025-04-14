import { Box, Button, Flex, Textarea } from "@chakra-ui/react"
import Canva from "../components/Canva"
import ThemeToggle from "../components/ThemeToggle"
import { CircleIcon, PencilIcon, Square, SquareIcon, TypeIcon } from "lucide-react"

const Home = () => {
  return (
    <>
      <Box display={"flex"} flexDir={"row"} columns={3} minH={"100vh"} width={"full"} bg={"bg"} justifyContent={"center"} placeItems={"center"}>
        <Flex borderRightWidth={"1px"} h={"100vh"} flexDir={"column"} w={"5%"} display={"flex"} justifyContent={"start"} placeItems={"center"} gap="4" py="4">
          <ThemeToggle />
          <Button variant={"surface"} aspectRatio={"square"}><PencilIcon /></Button>
          <Button variant={"surface"} aspectRatio={"square"}><SquareIcon /></Button>
          <Button variant={"surface"} aspectRatio={"square"}><CircleIcon /></Button>
          <Button variant={"surface"} aspectRatio={"square"}><TypeIcon /></Button>
        </Flex>
        <Canva />
        <Flex borderLeftWidth={"1px"} h={"100vh"} w={"20%"} display={"flex"} justifyContent={"center"} placeItems={"center"} flexDir={"column"} p={"10px"}>
          <Textarea placeholder="Type here..." autoresize={true} variant={"subtle"} _focus={{ boxShadow: "none" }}/>
        </Flex>
      </Box>
    </>
  )
}

export default Home
