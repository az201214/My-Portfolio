// Static character shown whenever the live 3D model is not ready: while it
// loads, when WebGL is unavailable, or when the model fails to load.
const CharacterStill = () => (
  <div className="character-container">
    <div className="character-model" data-scene-status="still">
      <img
        className="character-still"
        src={`${import.meta.env.BASE_URL}images/character-still.webp`}
        alt=""
        decoding="async"
      />
      <div className="character-rim" />
    </div>
  </div>
);

export default CharacterStill;
