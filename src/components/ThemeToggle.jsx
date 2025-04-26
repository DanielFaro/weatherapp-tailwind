import {useState} from 'react'
import { sunMode, moonMode } from '../assets'
import { Switch } from 'radix-ui'

export default function ThemeToggle({theme, toggleTheme}) {
  const [selected, setSelected] = useState()
  return (
    <div className="flex items-center">
      <Switch.Root
        checked={theme === "dark"} 
        onCheckedChange={() => toggleTheme(theme === "dark" ? "light" : "dark")}
        className="relative h-[30px] w-[60px] cursor-pointer bg-yellow-100 dark:bg-cyan-900 rounded-full outline-none data-[state=checked]:bg-orange-500 focus:outline-none"
        id="theme-mode"
      >
        <Switch.Thumb className="size-[24px] translate-x-[2px]  bg-yellow-500 dark:bg-blue-300 rounded-full transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[34px] flex justify-center">
          <img src={theme === "dark" ? moonMode : sunMode} height="20px" width="20px"/>
        </Switch.Thumb>
      </Switch.Root>
    </div>
  )
}
