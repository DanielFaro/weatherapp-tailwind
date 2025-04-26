// import React from 'react'
import { Accordion } from "radix-ui"
import { useState } from "react"
import moment from "moment-timezone"
import convertTemp from '../utils/helpers'
import useTheme from "../utils/useTheme"
import { motion, AnimatePresence } from "motion/react"
import { sunrise, sunset, moonPhases, dayAbv } from "../utils/helpers"
import { sun } from "../assets"

// import { ChevronDownIcon } from "radix-ui/react-icons";

export default function Current({weather, day, tempUnit}) {
  const isFuture = day.dt > weather.current.dt
  const [isOpen, setIsOpen] = useState(isFuture ? true : false);
  const [spin, setSpin] = useState(false);
  console.log("weather ==", weather)
  
  console.log("day ==", day.dt)
  console.log("wather ==", weather.current.dt);
 

  return (
    <div className={`${day.dt > weather.current.dt ? 'w-full' : 'w-5/12'} h-full rounded-3xl border border-yellow-500 flex flex-col text-black dark:text-white`}>
      {isFuture ? (
        <p className="text-md text-gray-300">{dayAbv[moment.tz(day.dt * 1000, weather.timezone).day()]}</p>
      ) :(
        <div className='h-12 p-4 flex justify-between items-center'>
          <p className="text-2xl">Current Weather</p>
          <p className="text-lg">{`${moment.tz(weather.current.dt * 1000, weather.timezone).format('M/DD/YYYY hh:mm a z')}`}</p>
        </div>
      )}
      <hr className="border-t border-gray-200 mb-3" />
 
      <div className='h-12 pr-4 flex justify-between items-center'>
        <div className='flex items-center h-12'>
          <img src={`https://openweathermap.org/img/wn/${isFuture ? day.weather[0].icon : weather.current.weather[0].icon}@2x.png`} height="80px" width="80px"/>
          {isFuture ? (
            <div className="flex items-center">
              <p className="text-3xl font-bold">{convertTemp(day.temp.max, tempUnit)}&#xb0;</p>
              <p className="text-gray-400 self-end">{tempUnit}</p>
              <p className="text-3xl ml-1">/</p>
              <p className="text-xl">{convertTemp(day.temp.min, tempUnit)}</p>
            </div>
            
          ) : (
            <div>
              <div className="flex items-end">
                <p className="text-4xl">{convertTemp(weather.current.temp, tempUnit)}&#xb0;</p>
                <p className="text-gray-400">{tempUnit}</p>
              </div>
              <p>Feels like:  {convertTemp(weather.current.feels_like, tempUnit)}</p>
            </div>
          )}

        </div>
        <p className="text-xl">Humidity: {isFuture ? day.humidity : weather.current.humidity}%</p>
      </div>
      <div className='h-12 p-4 text-xl flex justify-between items-center'>
        <p>{isFuture ? day.weather[0].main : weather.current.weather[0].main}</p>
        <p>Wind: {isFuture ? day.wind_speed : weather.current.wind_speed} mph</p>
      </div>
      <div className='h-12 p-4 text-xl flex justify-between items-center'>
        <p>Day/Night Temp (&#xb0;{tempUnit}): {convertTemp(day.temp.day, tempUnit)} / {convertTemp(day.temp.night, tempUnit)} </p>
        <p>UV Index: {Math.round(isFuture ? day.uvi : weather.current.uvi)}%</p>
      </div>
      {isFuture && <div className="text-left text-xl pl-4">{day.summary}</div>}
      {!isFuture && (
          <motion.div
            className="h-5 flex justify-end pr-4"
            onClick={() => setIsOpen(!isOpen)}
            onAnimationEnd={() => setSpin(false)}
          >
            <div className="flex gap-2">
              <p className="text-blue-400 text-sm">MORE INFO</p>
              <div 
                className={`${spin ? "transition duration-500 transform:rotate-180" : "transition duration-500 -rotate-180"} cursor-pointer`}
                onClick={() => setSpin(!spin)}
                // onAnimationEnd={() => setSpin(false)}
              >
                ^
              </div>
            </div>
          
        </motion.div>
      )}
      {isOpen&& <hr className="border-t w-11/12 self-center border-gray-400 mt-2 mb-2" />}
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
              <div className="flex justify-between p-4 text-xl">
                <div>High/Low (&#xb0;{tempUnit}): {convertTemp(day.temp.max, tempUnit)} / {convertTemp(day.temp.min, tempUnit)}  </div>
                <div>Pressure: {day.pressure} mmHg</div>
              </div>
              <div className="flex justify-between p-4 text-xl">
                <div>Dew Point (&#xb0;{tempUnit}): {convertTemp(day.dew_point, tempUnit)}</div>
                {!isFuture && <div>Visibility: {Math.round((weather.current.visibility * 0.0621371))/100} mi</div>}
              </div>
              
              <hr className="border-t w-11/12 self-center border-gray-400 mt-2 mb-2" />
              <p className="text-left text-2xl pl-4">Sun & Moon</p>
              <div className="flex justify-between p-4 items-center">
                <img src={sun} height="40px" width="40px"/>
                <div className="flex gap-2">
                  <div
                    class="inline-block h-[50px] min-h-[1em] w-[1px] self-stretch bg-gray-400 dark:bg-gray-600">
                   </div>
                   <div className="flex flex-col text-xl">
                    <p>rise: {sunrise(day.sunrise, weather.timezone)}</p>
                    <p>set {sunset(day.sunset, weather.timezone)}</p>
                   </div>
                </div>
              </div>
              <div className="flex justify-between items-center p-4">
                <img src={moonPhases(day.moon_phase)} height="40px" width="40px"/>
                <div className="flex gap-2">
                    <div
                    class="inline-block h-[50px] min-h-[1em] w-[1px] self-stretch bg-gray-400 dark:bg-gray-600">
                   </div>
                  <div className="flex flex-col text-xl">
                    <p>rise {sunrise(day.moonrise, weather.timezone)}</p>
                    <p>set {sunset(day.moonset, weather.timezone)}</p>
                  </div>
                </div>
              </div>
            </motion.section>
        )}
      </AnimatePresence>


    
    </div>
  )
}



 // Current                        Date / 5:32 pm EDT
  // --------------------------------------------------
  //ICON  -  Current temp                humidity
  //Cloudy - Feels Like                  wind
  // Sunny |                             uvi
  // Day/Night temps                     
  //                                      
   //                    Description                           
  //                     Description   
  // arrow down
  
  // ---Expanded
  // high/low
  // dew point
  // pressure
  // visibility
  // sun - rise/set
  // moon - rise/set

//   <Accordion.Root
//   className="w-full rounded-md bg-mauve6"
//   type="single"
//   collapsible
// >
//   <Accordion.Item 
//   value='item-1'
//   className="border border-yellow-300 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:z-10"
//   >
//     <Accordion.Header className="flex">
//       <Accordion.Trigger
//         className="group flex h-[45px] flex-1 cursor-default items-center justify-between px-5 text-[15px] leading-none text-violet11 outline-none"
//       >
//         <p>expand</p>
//         <p className="transition-transform duration-300 ease-[cubic-bezier(0.87,_0,_0.13,_1)] group-data-[state=open]:rotate-180">V</p>
//       </Accordion.Trigger>
//     </Accordion.Header>
  
//     <Accordion.Content
//       className="overflow-hidden text-[15px] text-mauve11 data-[state=closed]:animate-slideUp data-[state=open]:animate-slideDown"
//     >more info</Accordion.Content>
//   </Accordion.Item>
// </Accordion.Root>
