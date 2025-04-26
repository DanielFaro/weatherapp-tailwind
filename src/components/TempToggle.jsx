import { Switch } from 'radix-ui'

export default function TempToggle({tempUnit, toggleDegree}) {
  return (
    <div className="flex items-center">
    <label
      className={`pr-[15px] text-[15px] text-lg leading-none text-black dark:text-white ${tempUnit === "F" ? 'font-bold' : 'font-normal'}`}
      htmlFor="airplane-mode"
    >
      &#xb0;F
    </label>
    <Switch.Root
      className="relative h-[26px] w-[46px] cursor-pointer rounded-full bg-blue-600 shadow-[0_2px_10px] shadow-blackA4 dark:shadow-white outline-none data-[state=checked]:bg-orange-500"
      id="airplane-mode"
    onCheckedChange={toggleDegree}
    >
      <Switch.Thumb className="block size-[21px] translate-x-[2px] rounded-full bg-white shadow-[0_2px_2px] shadow-black transition-transform duration-100 will-change-transform data-[state=checked]:translate-x-[22px]" />
    </Switch.Root>
    <label
      className={`pl-[15px] text-[15px] text-lg leading-none text-black dark:text-white ${tempUnit === "C" ? 'font-bold' : 'font-normal'}`}
      htmlFor="airplane-mode"
    >
      &#xb0;C
    </label>
</div>
  )
}
