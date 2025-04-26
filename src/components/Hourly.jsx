import React, { useRef } from 'react'
import convertTemp, { datetime } from '../utils/helpers';
import { rightArrow, rightArrowBlack, leftArrow, leftArrowBlack} from '../assets';

export default function datetimely({forecast, timezone, tempUnit, theme}) {
  const containerRef = useRef(null);

  const scroll = (direction) => {
    const container = containerRef.current;
    const scrollAmount = 230;

    if (container) {
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className='flex flex-col items-center w-full'>
      <div className='text-2xl font-bold text-black dark:text-white'>Hourly Forecast</div>
      <div className='flex items-center justify-center space-x-2 w-full'>
        <button
        className='focus:outline-none hover:opacity-60'
          onClick={() => scroll("left")}
        >
          <img src={theme === "dark" ? leftArrow : leftArrowBlack} height="30" width='30' />
        </button>
        <div
          ref={containerRef}
          className='flex w-5/12 overflow-x-auto scrollbar-hide space-x-4 px-2 py-4'
          //style={{scrollSnapType: "x mandatory" }}
        >
          {forecast?.slice(0, 25).map(({dt, temp, weather}, i) => {
            return (
              <div key={i} className='flex flex-col items-center h-full min-w-[60px] border border-black dark:border-white scroll-snap-align-start'>
                <p className='font-bold text-lg text-black dark:text-white'>{datetime(dt, timezone).format('h a')}</p>
                <div className='flex items-center justify-center'>
                  <p className='text-lg text-black dark:text-white'>{convertTemp(temp, tempUnit)}&#xb0; </p>
                  <p className='text-black dark:text-white'>&nbsp;{tempUnit}</p>
                </div>
                <img src={`https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`} height="80px" width="80px"/>
                <p className='text-black dark:text-white'>{weather[0].main}</p>
              </div>
            )
          })}
        </div>
        <button
          className='focus:outline-none dark:hover:opacity-60'
          onClick={() => scroll("right")}
        >
          <img src={theme === "dark" ? rightArrow : rightArrowBlack} height="24" width='24'/>
        </button>
      </div>
    </div>
  )
}
