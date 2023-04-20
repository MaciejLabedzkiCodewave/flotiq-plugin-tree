import React from 'react';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

// :: Component
import TreeItem from './TreeItem';

const TreeParent = ({
  id,
  label,
  onClick,
  children,
  levelSpace,
  selected,
  initialOpen,
  hasCounter,
}) => {
  const [currentOpen, setCurrentOpen] = React.useState(initialOpen);

  const handleOpen = () => {
    setCurrentOpen((prevState) => !prevState);
  };

  return (
    <div className={twMerge('w-full')} style={{ paddingLeft: levelSpace }}>
      {id && label && (
        <>
          <TreeItem
            id={id}
            label={label}
            onClick={onClick}
            onOpen={handleOpen}
            open={currentOpen}
            hasArrow={Boolean(children?.length)}
            selected={selected}
            counter={children?.length}
            hasCounter={children?.length && hasCounter}
          />

          {currentOpen &&
            children?.map((el) => (
              <TreeParent
                key={`${id}||${el.id}`}
                id={el.id}
                label={el.label}
                onClick={onClick}
                children={el.children}
                selected={selected}
                initialOpen={initialOpen}
                hasCounter={hasCounter}
              />
            ))}
        </>
      )}
    </div>
  );
};

export default TreeParent;

TreeParent.propTypes = {
  /**
   * TreeParent id
   */
  id: PropTypes.string,
  /**
   * TreeParent label
   */
  label: PropTypes.string,
  /**
   * TreeParent onClick
   */
  onClick: PropTypes.func,
  /**
   * Additional classes for component
   */
  additionalClasses: PropTypes.arrayOf(PropTypes.string),
  /**
   * TreeParent children
   */
  children: PropTypes.array,
  /**
   * TreeParent level space on next open item
   */
  levelSpace: PropTypes.number,
  /**
   * TreeParent list of selected item
   */
  selected: PropTypes.object,
  /**
   * TreeParent initial open
   */
  initialOpen: PropTypes.bool,
  /**
   * TreeParent has counter based on children
   */
  hasCounter: PropTypes.bool,
};

TreeParent.defaultProps = {
  id: '',
  label: '',
  onClick: undefined,
  additionalClasses: [],
  children: undefined,
  levelSpace: 60,
  selected: {},
  initialOpen: false,
  hasCounter: false,
};
