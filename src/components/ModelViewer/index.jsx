import '@google/model-viewer/lib/model-viewer'

const Scene = (props) => {
  const { src } = props

  return (
    <model-viewer
      auto-rotate="true"
      autoplay="true"
      camera-controls="true"
      type="gtlf"
      src={src}
      style={{ width: '100%', height: '100%' }}
    />
  )
}

export default Scene
