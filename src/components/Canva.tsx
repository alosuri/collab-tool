import { Stage, Layer, Rect, Circle, Text } from "react-konva"
import '../App.css'

const Canva = () => {
  return (
    <Stage width={window.innerWidth * 0.75} height={window.innerHeight} draggable>
      <Layer>
        <Text text="Siemanko" fontSize={15} fill={"red"} draggable />
        <Rect fill="green" x={50} y={50} width={100} height={100} draggable />
        <Circle fill="blue" x={150} y={150} radius={100} draggable />
      </Layer>
    </Stage>
  )
}

export default Canva
