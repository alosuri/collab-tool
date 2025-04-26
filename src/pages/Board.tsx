import {
  Button, Flex, Drawer, Portal, CloseButton, Tabs,
  Separator, HStack, ColorPicker, parseColor
} from "@chakra-ui/react";
import ThemeToggle from "../components/ThemeToggle";
import {
  CircleIcon, MenuIcon, MousePointer2, PencilIcon,
  SquareIcon, TypeIcon
} from "lucide-react";
import supabase from "@/lib/supabase";
import { useEffect, useRef, useState } from "react";
import Chat from "@/components/Chat";
import { useLocation } from "react-router";
import { Circle, Layer, Line, Rect, Stage } from "react-konva";
import Konva from "konva";
import { v4 as uuidv4 } from "uuid";
import { compressToUTF16, decompressFromUTF16 } from "lz-string";
import { throttle } from "lodash";

const ACTIONS = {
  SELECT: "SELECT",
  RECTANGLE: "RECTANGLE",
  CIRCLE: "CIRCLE",
  DRAW: "DRAW",
  TEXT: "TEXT",
};

type ShapeType = {
  id: string;
  x?: number;
  y?: number;
  points?: number[];
  height?: number;
  width?: number;
  radius?: number;
  fillColor: string;
};

const Board = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const location = useLocation();
  const { board_uuid } = location.state || {};
  const [canvaElements, setCanvaElements] = useState<ShapeType[][]>([]);
  const [fillColor, setFillColor] = useState("#eb5e41");
  const stageRef = useRef<Konva.Stage>(null);
  const [action, setAction] = useState<typeof ACTIONS[keyof typeof ACTIONS]>(ACTIONS.SELECT);
  const isPainting = useRef(false);
  const currentShapeId = useRef<string>("");

  const lastUpdateRef = useRef(Date.now());

  const throttledSave = useRef(
    throttle(async (elements: ShapeType[][]) => {
      if (!board_uuid) return;
      try {
        const compressed = compressToUTF16(JSON.stringify(elements));
        await supabase
          .from("projects")
          .update({ canvas_state: compressed })
          .eq("id", board_uuid);

        lastUpdateRef.current = Date.now();
      } catch (err) {
        console.error("Failed to save canvas state:", err);
      }
    }, 1000)
  ).current;

  useEffect(() => {
    if (canvaElements.length > 0) {
      throttledSave(canvaElements);
    }
  }, [canvaElements]);

  useEffect(() => {
    const fetchCanvasState = async () => {
      if (!board_uuid) return;
      const { data } = await supabase
        .from("projects")
        .select("canvas_state")
        .eq("id", board_uuid)
        .single();

      if (data?.canvas_state) {
        const decompressed = JSON.parse(decompressFromUTF16(data.canvas_state));
        setCanvaElements(decompressed);
      }
    };

    fetchCanvasState();
  }, [board_uuid]);

  useEffect(() => {
    if (!board_uuid) return;
    const sub = supabase
      .channel("realtime:projects")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "projects",
          filter: `id=eq.${board_uuid}`,
        },
        (payload) => {
          const now = Date.now();
          if (now - lastUpdateRef.current < 500) return;
          const decompressed = JSON.parse(decompressFromUTF16(payload.new.canvas_state));
          setCanvaElements(decompressed);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sub);
    };
  }, [board_uuid]);

  const signOut = async () => await supabase.auth.signOut();

  const addToCanvas = (shape: ShapeType) => {
    setCanvaElements((prev) => [...prev, [shape]]);
  };

  useEffect(() => {
    const handleResize = () => {
      const stage = stageRef.current;
      if (stage) {
        stage.width(window.innerWidth);
        stage.height(window.innerHeight);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onPointerDown = () => {
    if (action === ACTIONS.SELECT) return;

    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    const { x, y } = pointerPos;
    const id = uuidv4();

    currentShapeId.current = id;
    isPainting.current = true;

    switch (action) {
      case ACTIONS.RECTANGLE:
        addToCanvas({ id, x, y, height: 20, width: 20, fillColor });
        break;
      case ACTIONS.CIRCLE:
        addToCanvas({ id, x, y, radius: 20, fillColor });
        break;
      case ACTIONS.DRAW:
        addToCanvas({ id, points: [x, y], fillColor });
        break;
    }
  };

  const onPointerMove = () => {
    if (action === ACTIONS.SELECT || !isPainting.current) return;

    const stage = stageRef.current;
    const pointerPos = stage?.getPointerPosition();
    if (!pointerPos) return;

    const { x, y } = pointerPos;

    setCanvaElements((prev) => {
      const updated = [...prev];
      const lastGroup = [...updated[updated.length - 1]];
      const shape = { ...lastGroup[lastGroup.length - 1] };

      switch (action) {
        case ACTIONS.RECTANGLE:
          shape.width = x - (shape.x ?? 0);
          shape.height = y - (shape.y ?? 0);
          break;
        case ACTIONS.CIRCLE:
          shape.radius = Math.hypot(x - (shape.x ?? 0), y - (shape.y ?? 0));
          break;
        case ACTIONS.DRAW:
          shape.points = [...(shape.points ?? []), x, y];
          break;
      }

      lastGroup[lastGroup.length - 1] = shape;
      updated[updated.length - 1] = lastGroup;
      return updated;
    });
  };

  const onPointerUp = () => {
    isPainting.current = false;
  };

  const isDraggable = action === ACTIONS.SELECT;

  return (
    <>
      <Flex gap="2" position="absolute" zIndex={10} top="10px" left="10px">
        <Button>Undo</Button>
        <Button>Redo</Button>
      </Flex>

      <Drawer.Root open={openDrawer} onOpenChange={(e) => setOpenDrawer(e.open)}>
        <Drawer.Trigger asChild>
          <Button position="absolute" zIndex="10" top="0" right="0" margin="5" variant="surface" aspectRatio="square"><MenuIcon /></Button>
        </Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content height="100vh">
              <Drawer.Header>Menu</Drawer.Header>
              <Drawer.Body>
                <Tabs.Root fitted width="full" defaultValue="chat" variant="plain" height="100%">
                  <Tabs.List bg="bg.muted" rounded="l3" p="1">
                    <Tabs.Trigger value="chat">Chat</Tabs.Trigger>
                    <Tabs.Trigger value="projects">Calls</Tabs.Trigger>
                    <Tabs.Trigger value="tasks">Settings</Tabs.Trigger>
                    <Tabs.Indicator rounded="l2" />
                  </Tabs.List>
                  <Tabs.Content value="chat" height="90%"><Chat /></Tabs.Content>
                  <Tabs.Content value="projects">Manage your projects</Tabs.Content>
                  <Tabs.Content value="tasks">
                    Manage your tasks for freelancers
                    <Button variant="surface" onClick={signOut}>Sign Out</Button>
                    <ThemeToggle />
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

      <Flex width="full" p="4" justifyContent="center" position="absolute" flexDir="row" gap="4">
        <Button variant={action == ACTIONS.SELECT ? "solid" : "surface"} onClick={() => setAction(ACTIONS.SELECT)} aspectRatio="square" zIndex="10"><MousePointer2 /></Button>
        <Separator orientation="vertical" height="10" />
        <Button variant={action == ACTIONS.DRAW ? "solid" : "surface"} onClick={() => setAction(ACTIONS.DRAW)} aspectRatio="square" zIndex="10"><PencilIcon /></Button>
        <Button variant={action == ACTIONS.RECTANGLE ? "solid" : "surface"} onClick={() => setAction(ACTIONS.RECTANGLE)} aspectRatio="square" zIndex="10"><SquareIcon /></Button>
        <Button variant={action == ACTIONS.CIRCLE ? "solid" : "surface"} onClick={() => setAction(ACTIONS.CIRCLE)} aspectRatio="square" zIndex="10"><CircleIcon /></Button>
        <Button variant={action == ACTIONS.TEXT ? "solid" : "surface"} onClick={() => setAction(ACTIONS.TEXT)} aspectRatio="square" zIndex="10"><TypeIcon /></Button>
        <Separator orientation="vertical" height="10" />
        <ColorPicker.Root defaultValue={parseColor("#eb5e41")} variant="subtle" value={parseColor(fillColor)}
          onValueChange={(details) => setFillColor(details.value.toString("hex"))} maxW="200px" zIndex="10">
          <ColorPicker.HiddenInput />
          <ColorPicker.Control>
            <ColorPicker.Trigger />
          </ColorPicker.Control>
          <Portal>
            <ColorPicker.Positioner>
              <ColorPicker.Content>
                <ColorPicker.Area />
                <HStack>
                  <ColorPicker.EyeDropper size="xs" variant="outline" />
                  <ColorPicker.Sliders />
                </HStack>
              </ColorPicker.Content>
            </ColorPicker.Positioner>
          </Portal>
        </ColorPicker.Root>
      </Flex>

      <Stage
        ref={stageRef}
        width={window.innerWidth}
        height={window.innerHeight}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{ touchAction: "none" }}>
        <Layer>
          {canvaElements.flat().map((shape) => {
            if (shape.radius !== undefined) {
              return <Circle key={shape.id} x={shape.x} y={shape.y} fill={shape.fillColor} radius={shape.radius} draggable={isDraggable} />;
            } else if (shape.points !== undefined) {
              return <Line key={shape.id} points={shape.points} stroke={shape.fillColor} strokeWidth={2} lineCap="round" lineJoin="round" draggable={isDraggable} />;
            } else {
              return <Rect key={shape.id} x={shape.x} y={shape.y} fill={shape.fillColor} width={shape.width} height={shape.height} draggable={isDraggable} />;
            }
          })}
        </Layer>
      </Stage>
    </>
  );
};

export default Board;
