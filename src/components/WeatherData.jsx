import { useState } from "react"
import convertTemp, { datetime, moonPhases } from '../utils/helpers'
import { motion, AnimatePresence } from "motion/react"
import { sun, upArrow, upArrowBlack, windArrowBlack, windArrowWhite, rain} from "../assets"

export default function WeatherData({weather, day, tempUnit, header, isCurrent, theme}) {
  const [isOpen, setIsOpen] = useState(isCurrent ? false : true);
  const [spin, setSpin] = useState(false);

  const currWindDeg = weather.current.wind_deg.toString();
  const dayWindDeg = day?.wind_deg.toString();

  return (
    <div className={`${isCurrent ?  'w-5/12' : 'w-full'} h-full flex flex-col gap-3 rounded-3xl border-2 border-black  text-black dark:text-white dark:border-white ${!isCurrent && 'hover:border-fuchsia-300'} hover:opacity-90 pb-2`}>
      <header>{header}</header>
      <hr className="border-t border-gray-400 mb-3 w-11/12 self-center" />
      <div className='h-12 pr-4 flex justify-between items-center mb-4'>
        <div className='flex items-center h-12'>
          <div className="flex flex-col items-center">
            <img src={`https://openweathermap.org/img/wn/${isCurrent ? weather.current.weather[0].icon : day.weather[0].icon }@2x.png`} height="80px" width="80px"/>
            <p className="font-bold">{isCurrent ? weather.current.weather[0].main : day.weather[0].main}</p>
          </div>

          {isCurrent ? (
             <div>
             <div className="flex items-end">
               <p className="text-4xl">{convertTemp(weather.current.temp, tempUnit)}&#xb0;</p>
               <p className="text-black dark:text-white">{tempUnit}</p>
             </div>
             <p>Feels like:  {convertTemp(weather.current.feels_like, tempUnit)}</p>
           </div>
          ) : (
            <div className="flex items-center">
              <p className="text-3xl font-bold">{convertTemp(day.temp.max, tempUnit)}&#xb0;</p>
              <p className="text-black dark:text-white self-end">{tempUnit}</p>
              <p className="text-3xl ml-1">/</p>
              <p className="text-xl text-black dark:text-white">{convertTemp(day.temp.min, tempUnit)}</p>
            </div>
          )}

        </div>
        <div className="flex gap-2">
          <img src={rain} height="24px" width="24px"/>
          <p>{day.rain ? day.rain : '0'} in</p>
        </div>
      </div>
      <div className={`h-12 pl-4 pr-2 ${isCurrent ? 'text-xl py-4' : 'text-lg py-2'} flex justify-between items-center`}>
        <p className={`${isCurrent ? 'text-xl' : 'text-lg'}`}>Humidity: {isCurrent ? weather.current.humidity : day.humidity}%</p>
        <div className="flex gap-2">
          <p>Wind: {isCurrent ? weather.current.wind_speed : day.wind_speed} mph</p>
          <div style={{display: "inline-block", rotate: `${isCurrent ? currWindDeg : dayWindDeg}deg`}}>
            <img src={theme === "dark" ? windArrowWhite : windArrowBlack } height="24px" width="24px"/>
          </div>
        </div>
      </div>
      <div className={`h-12 px-4 ${isCurrent ? 'text-xl py-4' : 'text-lg py-2'} flex justify-between items-center`}>
        <p>Day/Night Temp (&#xb0;{tempUnit}): {convertTemp(day.temp.day, tempUnit)} / {convertTemp(day.temp.night, tempUnit)} </p>
        <p>UV Index: {Math.round(isCurrent ? weather.current.uvi : day.uvi)}%</p>
      </div>
      <div className={`text-left px-4 ${isCurrent ? 'text-xl' : 'text-lg'}`}>{day.summary}</div>
      {isCurrent && (
          <motion.div
            className="h-5 flex justify-end pr-4"
            onClick={() => setIsOpen(!isOpen)}
            onAnimationEnd={() => setSpin(false)}
          >
            <div className="flex gap-2">
              <p className="text-blue-400 text-sm hover:cursor-pointer">MORE INFO</p>
              <div 
                className={`${spin ? "transition duration-500 transform:rotate-180" : "transition duration-500 -rotate-180"} cursor-pointer`}
                onClick={() => setSpin(!spin)}
                // onAnimationEnd={() => setSpin(false)}
              >
                <img src={theme === "dark" ? upArrow : upArrowBlack} height="18px" width="18px"/>
              </div>
            </div>
          
        </motion.div>
      )}
      {isOpen && <hr className="border-t w-11/12 self-center border-gray-400 mt-2" />}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.section
            className="w-full h-auto flex flex-col"
            key="content"
            initial="collapsed"
            animate="open"
            variants={{
              open: { opacity: 1, height: "auto"},
              collapsed: { opacity: 0, height: 0}
            }}
            transition={{duration: 0.1, ease: [.17,.67,.83,.67] }}
            >
              <div className={`flex justify-between px-4 ${isCurrent ? 'text-xl pb-4' : 'text-lg pb-3'}`}>
                <div>High/Low (&#xb0;{tempUnit}): {convertTemp(day.temp.max, tempUnit)} / {convertTemp(day.temp.min, tempUnit)}  </div>
                <div>Pressure: {day.pressure} mmHg</div>
              </div>
              {isCurrent && (
                <div className="flex justify-between p-4 text-xl">
                  <div>Dew Point (&#xb0;{tempUnit}): {convertTemp(day.dew_point, tempUnit)}</div>
                  <div>Visibility: {Math.round((weather.current.visibility * 0.0621371))/100} mi</div>
                </div>
              )}
              <hr className="border-t w-11/12 self-center border-gray-400 mb-2" />
              <p className={`text-left ${isCurrent ? 'text-2xl' : 'text-xl'} pl-4`}>Sun & Moon</p>
              <div className="flex justify-between px-4 py-2 items-center">
                <img src={sun} height="40px" width="40px"/>
                <div className="flex gap-2">
                  <div
                    className="inline-block h-[60px] min-h-[1em] w-[1px] self-stretch bg-gray-400 dark:bg-gray-600">
                   </div>
                   <div className={`flex flex-col ${isCurrent ? 'text-xl' : 'text-lg'}`}>
                    <p>rise: {datetime(day.sunrise, weather.timezone).format('h:mm a z')}</p>
                    <p>set: {datetime(day.sunset, weather.timezone).format('h:mm a z')}</p>
                   </div>
                </div>
              </div>
              <div className="flex justify-between items-center px-4 py-2">
                <img src={moonPhases(day.moon_phase)} height="40px" width="40px"/>
                <div className="flex gap-2">
                    <div
                    className="inline-block h-[60px] min-h-[1em] w-[1px] self-stretch bg-gray-400 dark:bg-gray-600">
                   </div>
                   <div className={`flex flex-col ${isCurrent ? 'text-xl' : 'text-lg'}`}>
                    <p>rise: {datetime(day.moonrise, weather.timezone).format('h:mm a z')}</p>
                    <p>set: {datetime(day.moonset, weather.timezone).format('h:mm a z')}</p>
                  </div>
                </div>
              </div>
            </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}
