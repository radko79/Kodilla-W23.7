import React, { PropTypes } from 'react';
import styles from './Note.css';
import ItemTypes from '../Kanban/itemTypes';
import {DragSource, DropTarget} from 'react-dnd';
import {compose} from 'redux';

class Note extends React.Component {
  render() {
    const {
      connectDragSource,
      connectDropTarget,
      isDragging,
      editing,
      children,
    } = this.props;

      // jeśli edytujemy to przepuszczamy komponent (uniemożliwiamy tym samym przeciąganie komponentu edytowanego)
      const dragSource = editing ? a => a : connectDragSource;
      return dragSource(connectDropTarget(
        <li
          className={styles.Note}
          style={{
            opacity: isDragging ? 0 : 1,
          }}
        >
          {children}
        </li>
   ));
  }
}

const noteSource = {
  beginDrag(props) {
    return {
      id: props.id,
      laneId: props.laneId,
      _id: props._id,
    };
  },
  isDragging(props, monitor) {
    return props.id === monitor.getItem().id;
  },
  endDrag(props, monitor, component) {
  }
};

const noteTarget = {
  hover(targetProps, monitor) {
    const sourceProps = monitor.getItem();
    if(targetProps.id !== sourceProps.id && targetProps.laneId === sourceProps.laneId  ) {
      targetProps.moveWithinLane(targetProps.laneId, targetProps.id, sourceProps.id);
    }
  }
};

Note.propTypes = {
  children: PropTypes.any,
};

export default compose(
  DragSource(ItemTypes.NOTE, noteSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging()
  })),
  DropTarget(ItemTypes.NOTE, noteTarget, (connect) => ({
    connectDropTarget: connect.dropTarget()
  }))
)(Note);