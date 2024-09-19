import { hightlightsSlides } from '../constants'

function VideoCarousel() {
  return (
    <>
    <div className="flex items-center">
        {
        hightlightsSlides.map((list, i)=>(
            <div key={list.id} id='slider' className="sm:pr-20 pr-10">
                <div className="video-crousel_container">
                    <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                        <video>
                            <source src={list.video} type='video/mp4'/>
                        </video>
                    </div>
                </div>
            </div>
        ))
        }
    </div>
    </>
  )
}

export default VideoCarousel
