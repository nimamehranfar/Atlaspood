import {useDraggable,Draggable} from "react-tiny-dnd";


const DraggableItem = ({
                           index,
                           context,
                           item,
                       }) => {
    const {
        listeners, // Handler listeners can be passed to Draggable component as well
        isDragging,
    } = useDraggable(context, index);
    
    return (
        <Draggable context={context} key={item.id} index={index}>
            <li {...listeners}>{item}</li>
        </Draggable>
    );
};

export default DraggableItem;