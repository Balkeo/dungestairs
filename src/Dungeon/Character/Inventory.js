import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import styled from 'styled-components'
import DashedSeparator from '../../Guideline/Separator/DashedSeparator'
import { InventorySlot } from './InventorySlot'
import { Item } from './Item'

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 256px;
  order: 1;
`

const Row = styled.div`
  min-height: 24px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
  margin: auto;
`

const Name = styled.div`
  font-size: 16px;
  line-height: 18px;
  color: ${Colors.white100};
`
const Separator = styled(DashedSeparator)`
  margin-top: 15px;
  margin-bottom: 15px;
`

const Bag = styled.div`
  box-sizing: border-box;
  display: grid;
  grid-template: repeat(2, 1fr) / repeat(4, 1fr);
  grid-gap: 7px;
  width: 256px;
  padding: 7px;
  margin: auto;
`

export const Inventory = ({
  items = []
}) => {
  const renderItems = () => {
    const bag = []
    for (let index = 0; index < 8; index++) {
      bag.push(
        <InventorySlot key={index}>
          <Item item={items[index]} />
        </InventorySlot>
      )
    }

    return bag
  }

  return (
    <Wrapper>
      <Row>
        <Name>Inventory</Name>
      </Row>
      <Separator />
      <Row>
        <Bag>
          {renderItems()}
        </Bag>
      </Row>
    </Wrapper>
  )
}
Inventory.propTypes = {
  items: PropTypes.array
}
