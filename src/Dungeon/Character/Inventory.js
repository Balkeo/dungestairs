import React from 'react'
import PropTypes from 'prop-types'
import Colors from '../../Helper/Colors'
import styled from 'styled-components'
import DashedSeparator from '../../Guideline/DashedSeparator'
import { InventorySlot } from './InventorySlot'
import { Item } from './Item'

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 256px;
`

const Row = styled.div`
  min-height: 24px;
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;
  text-align: center;
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
        <div style={{
          boxSizing: 'border-box',
          display: 'grid',
          gridTemplate: 'repeat(2, 1fr) / repeat(4, 1fr)',
          gridGap: '7px',
          width: '256px',
          padding: '7px'
        }}>
          {renderItems()}
        </div>
      </Row>
    </Wrapper>
  )
}
Inventory.propTypes = {
  items: PropTypes.array
}
