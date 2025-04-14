import { Button } from "@chakra-ui/react";
import { useColorMode } from "./ui/color-mode";
import { MoonIcon, SunIcon } from "lucide-react";

const ThemeToggle = () => {
    const { toggleColorMode, colorMode } = useColorMode();

    return (
        <Button onClick={toggleColorMode} aspectRatio={"square"}> {colorMode == 'light' ? <SunIcon fill="true"/> : <MoonIcon /> } </Button>
    )
}

export default ThemeToggle
