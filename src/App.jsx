import { useState, useEffect, useRef, cache } from 'react'
import { usePlacesWidget } from "react-google-autocomplete"
import useTheme from './utils/useTheme'
import TempToggle from './components/TempToggle'
import convertTemp, { dayAbv, datetime } from './utils/helpers'
import WeatherData from './components/WeatherData'
import Hourly from './components/Hourly'
import ThemeToggle from './components/ThemeToggle'
import { FaroLogo } from './assets'

function App() {
  const [weather, setWeather] = useState();
  const [latlong, setLatLong] = useState(null)
  const [tempUnit, setTempUnit] = useState("F");
  const [dayIndex, setDayIndex] = useState();
  const [location, setLocation] = useState();
  const [city, setCity] = useState();
  const [searchTerm, setSearchTerm] = useState();
  const [theme, setTheme] = useTheme();

  const [address, setAddress] = useState('');
  const autoCompleteRef = useRef(null);
  const [autocomplete, setAutocomplete] = useState(null);

  useEffect(() => {
    const loadAutocomplete = () => {
      if (!window.google || !window.google.maps || !autoCompleteRef.current) return;
      const newAutocomplete = new window.google.maps.places.Autocomplete(
        autoCompleteRef.current,
        {
          fields: ['address_components', 'formatted_address', 'geometry', 'name'],
          types: ['(cities)'],
        }
      );
      newAutocomplete.addListener('place_changed', () =>
        handlePlaceSelect(newAutocomplete)
      );
      setAutocomplete(newAutocomplete);
    };

    if (!autocomplete) {
      loadAutocomplete();
    }
  }, [autocomplete]);

  console.log("location ==", location);
  //console.log("city ==", city)

  const handlePlaceSelect = (autocompleteInstance) => {
    const place = autocompleteInstance.getPlace();
    if (!place.geometry) {
      console.error('No details available for input: \'', place.name, '\'');
      return;
    }

    //console.log("Place ==", place);
    setLocation(place.formatted_address);
    setLatLong({ lat: place.geometry.location.lat(), long: place.geometry.location.lng()});
    //onSelect(place); // Pass the selected place data to the parent component
  };

  const handleThemeChange = (theme) => {
    setTheme(theme)
  }

  // const { ref } = usePlacesWidget({
  //   apiKey: import.meta.env.VITE_GOOGLE_PLACES_API_KEY,
  //   onPlaceSelected: (place) => {
  //     setLatLong({ lat: place.geometry.location.lat(), long: place.geometry.location.lng()});
  //     setLocation(place.formatted_address);
  //   },
  //   options: {
  //     types: ["(cities)"],
  //   }
  // });
 
  const searchCity = async () => {
    // for first load
    console.log("first search")
    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlong.lat},${latlong.long}&result_type=locality&key=${import.meta.env.VITE_GOOGLE_PLACES_API_KEY}`)
      const data = await res.json();
      setCity(data.results[0].formatted_address);
    } catch (error) {
      console.error(error)
    }
  };
  const searchWeather = async () => {

    try {
      const res = await fetch(`https://api.openweathermap.org/data/3.0/onecall?lat=${latlong.lat}&lon=${latlong.long}&appid=${import.meta.env.VITE_APP_ID}`)
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      console.error(error)
    }
  };

  const toggleDegree = () => setTempUnit(tempUnit === "F" ? "C" : "F");

  const findMe = () => {
    var options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const success = (pos) => setLatLong({lat: pos.coords.latitude, long: pos.coords.longitude})
    const error = (err) => console.warn(`ERROR(${err.code}): ${err.message}`)
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error, options)
     } else {
       alert("Geolocation is not supported by your browser")
     }
  }

useEffect(() => {
  findMe()
}, [])

  useEffect(() => {
    if (latlong) searchWeather();
    if (!location && latlong) searchCity();
  }, [latlong])

  const currentHeader = (
    <div className='h-12 p-4 flex justify-between items-center'>
      <p className="text-2xl">Current Weather</p>
      <p className="text-lg">{`${datetime(weather?.current.dt, weather?.timezone).format('M/DD/YYYY hh:mm a z')}`}</p>
    </div>
  );

  return (
    <div className='grid grid-cols-1 gap-5 justify-items-center h-screen w-screen font-body'>
       <header className='grid grid-cols-[2fr_5fr_2fr] h-24 mb-12 place-content-center bg-gray-400 dark:bg-black text-black w-full top-0'>
          <div className='w-full h-auto pl-4 hover:cursor-pointer'>
            <a
              id="site-logo"
              href="https://www.DanFaro.com"
              target="_blank"
              rel="noreferrer"
            >
              <img src={FaroLogo} height="40px" width="40px" />
            </a>
          </div>
          <div className='flex items-center gap-2'>
            <div className='flex'>
              <p className='text-3xl font-bold text-red-600'>Faro</p>
              <p className='text-white text-3xl'>Cast</p>
            </div>
            <div className='flex gap-2 w-3/4 justify-between items-center'>
              <div className="flex items-end text-md text-black dark:text-white">
                <p className='mr-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-[180px]'>{location ? location : city}</p>
               <p>{convertTemp(weather?.current.temp, tempUnit)}&#xb0;</p>
               <p>{tempUnit}</p>
             </div>
              <input
                className='w-1/2 p-2'
                ref={autoCompleteRef} 
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Enter a city'
              />
            </div>
          </div>
          <div className='flex justify-end pr-4'>
            <ThemeToggle toggleTheme={handleThemeChange} theme={theme}/>
          </div>
       </header>
    
      <div className='text-3xl font-bold text-black dark:text-white'>{location? location : city}</div>
      <TempToggle tempUnit={tempUnit} toggleDegree={toggleDegree}/>
      {weather && <WeatherData weather={weather} day={weather?.daily[0]} tempUnit={tempUnit} header={currentHeader} isCurrent={true} theme={theme}/>}
      {weather && <Hourly forecast={weather?.hourly} timezone={weather?.timezone} tempUnit={tempUnit} theme={theme}/>}
      
      {weather && (<div className='flex flex-col gap-2 items-center text-black dark:text-white w-4/12'>
        {weather && <div className='text-2xl font-bold mb-4'>Weekly Forecast</div>}

        {/* ------------------------------ WEEKLY FORECAST --------------------------------- */}
        {weather?.daily && weather?.daily?.slice(1, -1).map((day, i) => {
          const daytime = (seconds) => datetime(seconds, weather.timezone);

          const forecastHeader = (
          <div className="text-lg text-left pl-4 pt-4 flex items-center gap-1">
            <p className='text-black dark:text-white'>{dayAbv[daytime(day.dt).day()]}</p>
            <p>{daytime(day.dt).format('M/DD')}</p>
          </div>
          );

          return (
            <div key={i} className={`flex justify-center rounded-2xl ${dayIndex === i ? 'h-auto' : 'h-22'} w-full`}>
              {dayIndex !== i && (
                <div onClick={() => setDayIndex(i)} className='flex items-center justify-evenly w-8/12 border border-black dark:border-white rounded-xl hover:cursor-pointer hover:opacity-70 hover:border-fuchsia-300 hover:border-2 dark:hover:border-fuchsia-500'>
                  <div>
                    <p className="text-md text-black dark:text-white">{dayAbv[datetime(day.dt, weather.timezone).day()]}</p>
                    <p className="text-lg">{`${datetime(day.dt, weather.timezone).format('M/DD')}`}</p>
                  </div>
                  <div className="flex items-center">
                    <p className="text-3xl font-bold">{convertTemp(day.temp.max, tempUnit)}&#xb0;</p>
                    <p className="text-gray-700 self-end dark:text-gray-300">{tempUnit}</p>
                    <p className="text-3xl ml-1">/</p>
                    <p className="text-xl text-black dark:text-white">{convertTemp(day.temp.min, tempUnit)}</p>
                  </div>
                  <img src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`} height="80px" width="80px"/>
                </div>
              )}
               {dayIndex === i && (
                <div onClick={() => setDayIndex(null)} className="w-full h-auto flex flex-col hover:cursor-pointer">
                  <WeatherData 
                        day={day}
                       
                        weather={weather} 
                        tempUnit={tempUnit}
                        header={forecastHeader} 
                        isCurrent={false}
                        theme={theme}
                      />
                </div>
                )}
            </div>)
          })}
      </div>
    )}
      <footer className='flex items-center justify-center h-12 mt-12 bg-gray-400 dark:bg-black text-black dark:text-white w-full bottom-0'>Built by Dan Faro 2025</footer>
    </div>
  )
}

export default App

      {/* {dayIndex === i && (<AnimatePresence initial={false}>
               
                  <motion.section
                    className="w-full h-auto flex flex-col hover:cursor-pointer"
                    key="content"
                    initial="collapsed"
                    animate="open"
                    onClick={() => setDayIndex(null)}
                    variants={{
                      open: { opacity: 1, height: "auto"},
                      collapsed: { opacity: 0, height: 0},
                    }}
                    transition={{duration: 0.2, ease: [.17,.67,.83,.67] }}
                    >
                      <WeatherData 
                        day={weather.daily[i]} 
                        weather={weather} 
                        tempUnit={tempUnit}
                        header={forecastHeader} 
                        isCurrent={false}
                        theme={theme}
                      />
                  </motion.section>
               
              </AnimatePresence>)} */}