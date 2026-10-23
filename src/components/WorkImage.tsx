import { useEffect, useState } from "react";
import { MdArrowOutward } from "react-icons/md";

interface Props {
  image: string;
  alt?: string;
  video?: string;
  link?: string;
  linkLabel?: string;
}
const WorkImage = ({ image, alt, video: videoAsset, link, linkLabel }: Props) => {
  const [isVideo, setIsVideo] = useState(false);
  const [video, setVideo] = useState("");
  useEffect(
    () => () => {
      if (video) URL.revokeObjectURL(video);
    },
    [video],
  );
  const handleMouseEnter = async () => {
    if (
      !videoAsset ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const response = await fetch(
      `${import.meta.env.BASE_URL}assets/${videoAsset}`,
    );
    if (!response.ok) return;
    const blobUrl = URL.createObjectURL(await response.blob());
    setVideo(blobUrl);
    setIsVideo(true);
  };
  const content = (
    <>
      {link && (
        <div className="work-link" aria-hidden="true">
          <MdArrowOutward />
        </div>
      )}
      {image ? (
        <img src={image} alt={alt ?? "Project preview"} />
      ) : (
        <div
          className="work-placeholder"
          role="img"
          aria-label={`${alt ?? "Project"} preview is not available`}
        >
          Preview unavailable
        </div>
      )}
      {isVideo && (
        <video src={video} autoPlay muted playsInline loop aria-hidden="true" />
      )}
    </>
  );
  return (
    <div className="work-image">
      {link ? (
        <a
          className="work-image-in"
          href={link}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={() => setIsVideo(false)}
          target="_blank"
          rel="noreferrer"
          data-cursor="disable"
          aria-label={linkLabel ?? `View ${alt ?? "project"} on GitHub`}
        >
          {content}
        </a>
      ) : (
        <div
          className="work-image-in work-image-unavailable"
          aria-label={`${alt ?? "Project"} link is not available`}
        >
          {content}
        </div>
      )}
    </div>
  );
};
export default WorkImage;
