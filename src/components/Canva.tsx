import { Stage, Layer, Rect, Circle, Text } from "react-konva"
import '../App.css'
import { useRef, useState } from "react"

const ACTIONS = {
  SELECT: "SELECT",
  RECTANGLE: "RECTANGLE",
  CIRCLE: "CIRCLE",
  DRAW: "DRAW",
  TEXT: "TEXT",
}

const Canva = () => {
  const stageRef = useRef(null);
  const [action, setAction] = useState(ACTIONS.SELECT);

  const onPointerDown = () => {

  }
  const onPointerMove = () => {

  }
  const onPointerUp = () => {

  }

  return (
    <Stage ref={stageRef} width={window.innerWidth} height={window.innerHeight}
      onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <Layer>
        <Text text="Siemanko" fontSize={15} fill={"red"} draggable />
        <Rect fill="green" x={50} y={50} width={100} height={100} draggable />
        <Circle fill="blue" x={150} y={150} radius={100} draggable />
      </Layer>
    </Stage>
  )
}

export default Canva
