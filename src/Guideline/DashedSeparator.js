import styled from 'styled-components'
import DashedBorder from './Icons/DashedBorder.svg'

const DashedSeparator = styled.div`
  height: 2px;
  width: 100%;

  background-image: url(${DashedBorder});
  background-repeat: repeat-x;
  background-size: 6px 2px;
  background-position: top center;
`

export default DashedSeparator
