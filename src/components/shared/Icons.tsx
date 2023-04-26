import { GestureResponderEvent, TouchableOpacity } from "react-native"
import Svg, { G, Path } from "react-native-svg"

// export const HomeIcon = ({color, size}: {color: string, size: number}) => {
//   return (
//     <Svg viewBox="0 0 20 20" width={size} height={size}>
//       <Path d="M18 7.261V17.5c0 .841-.672 1.5-1.5 1.5h-2c-.828 0-1.5-.659-1.5-1.5V13H7v4.477C7 18.318 6.328 19 5.5 19h-2c-.828 0-1.5-.682-1.5-1.523V7.261a1.5 1.5 0 01.615-1.21l6.59-4.82a1.481 1.481 0 011.59 0l6.59 4.82A1.5 1.5 0 0118 7.26z" fill={color}/>
//     </Svg>
//   )
// }

export const SearchIcon = ({color, size}: {color: string, size: number}) => {
  return (
    <Svg viewBox="0 0 20 20" width={size} height={size}>
      <Path d="M2 8c0-3.309 2.691-6 6-6s6 2.691 6 6-2.691 6-6 6-6-2.691-6-6zm17.707 10.293l-5.395-5.396A7.946 7.946 0 0016 8c0-4.411-3.589-8-8-8S0 3.589 0 8s3.589 8 8 8a7.954 7.954 0 004.897-1.688l5.396 5.395A.998.998 0 0020 19a1 1 0 00-.293-.707z" fill={color}/>
    </Svg>
  )
}

export const CartIcon = ({color, size}: {color: string, size: number}) => {
  return (
    <Svg viewBox="0 0 20 20" width={size} height={size}>
      <Path fill-rule="evenodd" d="M1 1c0-.552.45-1 1.004-1h1.505c.831 0 1.505.672 1.505 1.5v.56l12.574.908c.877.055 1.52.843 1.397 1.71l-.866 6.034A1.504 1.504 0 0116.63 12H5.014v2h10.043a3.005 3.005 0 013.011 3c0 1.657-1.348 3-3.01 3a3.005 3.005 0 01-2.84-4H6.85a3.005 3.005 0 01-2.84 4A3.005 3.005 0 011 17c0-1.306.838-2.418 2.007-2.83V3.01 2H2.004A1.002 1.002 0 011 1zm13.054 16c0-.552.449-1 1.003-1 .554 0 1.004.448 1.004 1s-.45 1-1.004 1a1.002 1.002 0 01-1.003-1zM3.007 17c0-.552.45-1 1.004-1s1.003.448 1.003 1-.449 1-1.003 1a1.002 1.002 0 01-1.004-1z" fill={color}/>
    </Svg>
  )
}

// export const ProfileIcon = ({color, size}: {color: string, size: number}) => {
//   return (
//     <Svg viewBox="0 0 20 20" width={size} height={size}>
//       <Path d="M14.363 5.22a4.22 4.22 0 11-8.439 0 4.22 4.22 0 018.439 0zM2.67 14.469c1.385-1.09 4.141-2.853 7.474-2.853 3.332 0 6.089 1.764 7.474 2.853.618.486.81 1.308.567 2.056l-.333 1.02A2.11 2.11 0 0115.846 19H4.441a2.11 2.11 0 01-2.005-1.455l-.333-1.02c-.245-.748-.052-1.57.567-2.056z" fill={color}/>
//     </Svg>
//   )
// }

export const HangerIcon = ({color, size}: {color: string, size: number}) => {
  return (
    <Svg viewBox="0 0 20 20" width={size} height={size}>
	    <Path fill={color} d="M13,10V9c0-1.8,1.6-3.3,3.5-3c1.2,0.2,2.2,1.2,2.4,2.4c0.2,1.4-0.4,2.6-1.5,3.2c-0.9,0.5-1.4,1.6-1.4,2.6v0c0,1.1,0.6,2.1,1.5,2.7l10.6,5.2c1,0.5,0.6,1.9-0.4,1.9H4.2c-1.1,0-1.4-1.4-0.4-1.9L16,16"/>
    </Svg>
  )
}

export const BackArrowIcon = ({color, size, onPress}: 
  {
    color: string, 
    size: number, 
    onPress: (event: GestureResponderEvent) => void 
  }) => {

  return (
    <TouchableOpacity onPress={onPress} hitSlop={{bottom:5, top:5, left:5, right:5}}>
      <Svg viewBox="0 0 20 20" width={size} height={size}>
        <Path d="M19 9H3.661l5.997-5.246a1 1 0 00-1.316-1.506l-8 7c-.008.007-.011.018-.019.025a.975.975 0 00-.177.24c-.018.03-.045.054-.059.087a.975.975 0 000 .802c.014.033.041.057.059.088.05.087.104.17.177.239.008.007.011.018.019.025l8 7a.996.996 0 001.411-.095 1 1 0 00-.095-1.411L3.661 11H19a1 1 0 000-2z" fill={color}/>
      </Svg>
    </TouchableOpacity>
  )
}

export const HomeIcon = ({color, size}: {color: string, size: number}) => {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path fill={color} d="M21,21V8.4a1,1,0,0,0-.44-.829l-8-5.4a1,1,0,0,0-1.12,0l-8,5.4A1,1,0,0,0,3,8.4V21a1,1,0,0,0,1,1H20A1,1,0,0,0,21,21Zm-2-1H5V8.932l7-4.725,7,4.725Z"/>
    </Svg>
  )
}

export const StoreIcon = ({color, size}: {color: string, size: number}) => {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path d="M20 11.6211V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V11.6211M7.5 9.75C7.5 10.9926 6.49264 12 5.25 12C4.09397 12 3.14157 11.1282 3.01442 10.0062C2.99524 9.83688 3.02176 9.66657 3.06477 9.50173L4.10996 5.49516C4.3397 4.6145 5.13506 4 6.04519 4H17.9548C18.8649 4 19.6603 4.6145 19.89 5.49516L20.9352 9.50173C20.9782 9.66657 21.0048 9.83688 20.9856 10.0062C20.8584 11.1282 19.906 12 18.75 12C17.5074 12 16.5 10.9926 16.5 9.75M7.5 9.75C7.5 10.9926 8.50736 12 9.75 12C10.9926 12 12 10.9926 12 9.75M7.5 9.75L8 4M12 9.75C12 10.9926 13.0074 12 14.25 12C15.4926 12 16.5 10.9926 16.5 9.75M12 9.75V4M16.5 9.75L16 4" stroke={color} strokeWidth={1.5} stroke-linecap="round" stroke-linejoin="round"/>
    </Svg>
  )
}



export const BagIcon = ({color, size}: {color: string, size: number}) => {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      <Path fill={color} d="M3,22H21a1,1,0,0,0,1-1.077l-1-13A1,1,0,0,0,20,7H17A5,5,0,0,0,7,7H4a1,1,0,0,0-1,.923l-1,13A1,1,0,0,0,3,22ZM12,4a3,3,0,0,1,3,3H9A3,3,0,0,1,12,4ZM4.926,9H7v2a1,1,0,0,0,2,0V9h6v2a1,1,0,0,0,2,0V9h2.074l.846,11H4.08Z"/>
    </Svg>
  )
}

export const ProfileIcon = ({color, size}: {color: string, size: number}) => {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size} strokeWidth={2} >
      {/* <G id="style=linear">
        <G id="profile"> */}
          <Path d="M12 11C14.4853 11 16.5 8.98528 16.5 6.5C16.5 4.01472 14.4853 2 12 2C9.51472 2 7.5 4.01472 7.5 6.5C7.5 8.98528 9.51472 11 12 11Z" stroke={color} stroke-linecap="round" stroke-linejoin="round"/>
          <Path d="M5 18.5714C5 16.0467 7.0467 14 9.57143 14H14.4286C16.9533 14 19 16.0467 19 18.5714C19 20.465 17.465 22 15.5714 22H8.42857C6.53502 22 5 20.465 5 18.5714Z" stroke={color} />
        {/* </G>
      </G> */}
    </Svg>
  )
}