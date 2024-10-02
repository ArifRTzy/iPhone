import gsap from "gsap";
import { useState, useRef, useEffect } from "react";
import { hightlightsSlides } from "/src/constants";
import { pauseImg, playImg, replayImg } from "/src/utils";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger);

function VideoCarousel() {
  const videoRef = useRef([]); //for store every videos
  const videoSpanRef = useRef([]); //for store every dots animated
  const videoDivRef = useRef([]); //for store every dots parent

  const [video, setVideo] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const [loadedData, setLoadedData] = useState([]);
  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = video;

  useGSAP(() => {
    gsap.to("#slider", {
      transform: `translateX(${-100 * videoId}%)`, //move the video to the left
      duration: 2,
      ease: "power2.inOut", //slow then fast
    });

    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video", //trigger the video element
        toggleActions: "restart none none none", //the animation will restart when the element enter the viewport or the animation will start when it is in viewport
      },
      onComplete: () => {
        //do something when the animation is finished
        setVideo((pre) => ({
          ...pre,
          startPlay: true, //change the value of startPlay to true
          isPlaying: true, //isPlaying to true
        }));
      },
    });
  }, [isEnd, videoId]);

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current; //call the span that contain dots

    if (span[videoId]) {
      //animate the progress of the video
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          //do something when the animation is playing
          const progress = Math.ceil(anim.progress() * 100); //check the animation progress by 0 to 1 from the animUpdate function then multiply by 100 then rounded to the closest number

          if (progress != currentProgress) {
            currentProgress = progress; //mengganti value dari currentProgress

            gsap.to(videoDivRef.current[videoId], {
              //change the width of the dot when the animation started
              width:
                window.innerWidth < 760
                  ? "10vw"
                  : window.innerWidth < 1200
                  ? "10vw"
                  : "4vw",
            });

            gsap.to(span[videoId], {
              //change the width of the dot to like the video duration
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        onComplete: () => {
          //return the original width of the dot
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId == 0) {
        //restart the animation if the videoId is zero
        anim.restart();
      }

      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime / //the current playback position
            hightlightsSlides[videoId].videoDuration //the full duration of the video
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate); //add the function animUpdate to every video is started
        console.log("start animUpdate");
      } else {
        gsap.ticker.remove(animUpdate); //remove the function
        console.log("removed animUpdate");
      }
    }
  }, [videoId, startPlay, isPlaying]);

  useEffect(() => {
    if (loadedData.length > 3) {
      //check if all the videos is fully loaded
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleProcess = (type, i) => {
    switch (type) {
      case "video-end":
        setVideo((pre) => ({
          ...pre,
          isEnd: true,
          videoId: i + 1,
        }));
        break;
      case "video-last":
        setVideo((pre) => ({
          ...pre,
          isLastVideo: true,
        }));
        break;
      case "video-reset":
        setVideo((pre) => ({
          ...pre,
          isLastVideo: false,
          videoId: 0,
        }));
        break;
      case "play":
        setVideo((pre) => ({
          ...pre,
          isPlaying: !pre.isPlaying,
        }));
        break;
      case "pause":
        setVideo((pre) => ({
          ...pre,
          isPlaying: !pre.isPlaying,
        }));
        break;
      default:
        return video;
    }
  };

  const handleLoadedMetaData = (i, e) => setLoadedData((pre) => [...pre, e]);

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((list, i) => (
          <div key={list.id} id="slider" className="pr-10 sm:pr-20">
            <div className="video-carousel_container">
              <div className="w-full h-full overflow-hidden bg-black flex-center rounded-3xl">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[i] = el)}
                  onPlay={() => {
                    setVideo((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }));
                  }}
                  onLoadedMetadata={(e) => handleLoadedMetaData(i, e)}
                  onEnded={() => {
                    i !== 3
                      ? handleProcess("video-end", i)
                      : handleProcess("video-last");
                  }}
                  className={`${list.id === 2 && "translate-x-44"}
                  pointer-events-none`}
                >
                  <source src={list.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {list.textLists.map((text) => (
                  <p key={text} className="text-xl font-medium md:text-2xl">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-10 flex-center">
        <div className="py-5 bg-gray-300 rounded-full flex-center px-7 backdrop-blur">
          {videoRef.current.map((_, i) => (
            <span
              key={i}
              ref={(el) => (videoDivRef.current[i] = el)}
              className="relative w-3 h-3 mx-2 bg-gray-200 rounded-full cursor-pointer"
            >
              <span
                className="absolute w-full h-full rounded-full"
                ref={(el) => (videoSpanRef.current[i] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "replay" : !isPlaying ? "play" : "pause"}
            onClick={
              isLastVideo
                ? () => handleProcess("video-reset")
                : !isPlaying
                ? () => handleProcess("play")
                : () => handleProcess("pause")
            }
          />
        </button>
      </div>
    </>
  );
}

export default VideoCarousel;
