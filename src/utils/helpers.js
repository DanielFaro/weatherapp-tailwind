import { useMemo } from "react";
import moment from 'moment-timezone'
import { newmoon,
  waxingcrescent,
  firstquarter,
  waxinggibbous,
  fullmoon,
  waninggibbous,
  lastquarter,
  waningcrescent
} from '../assets'

const convertTemp = (temp, tempUnit) => {
  if (tempUnit === "F") {
    return Math.round((temp - 273.15)*(9/5) + 32)
  }
  return Math.round(temp - 273.15)
};

export default convertTemp;

export const datetime = (ms, timezone) => moment.tz(ms * 1000, timezone);

export const moonPhases = (phase) => {
  if (phase === 0 || phase === 1) return newmoon;
  if (phase > 0 && phase < 0.25) return waxingcrescent;
  if (phase === 0.25) return firstquarter;
  if (phase > 0.25 && phase < 0.5) return waxinggibbous;
  if (phase === 0.5) return fullmoon;
  if (phase > 0.5 && phase < 0.75) return waninggibbous;
  if (phase === 0.75) return lastquarter;
  else return waningcrescent
}

export const dayAbv = {
  0: "SUN",
  1: "MON",
  2: "TUE",
  3: "WED",
  4: "THU",
  5: "FRI",
  6: "SAT",
  7: "SUN"
}
