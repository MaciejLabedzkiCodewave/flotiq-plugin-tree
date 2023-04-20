import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

// :: Component
import TreeParent from './TreeParent';

const Tree = forwardRef(
  (
    {
      data,
      maxHeight,
      additionalClasses,
      disabled,
      initialOpen,
      onSelected,
      selected,
      hasCounter,
    },
    ref,
  ) => {
    const initialRender = useRef(true);
    const [dataTree, setDataTree] = React.useState(data);
    const [currentSelected, setCurrentSelected] = React.useState(selected);

    // Case: clear method from parent on ref.current.clearSelected();
    useImperativeHandle(ref, () => ({
      clearSelected() {
        setCurrentSelected({});
      },
    }));

    useEffect(() => {
      setDataTree(data);
    }, [data]);

    const handleOnSelected = useCallback(() => {
      const res = [];
      for (let key in currentSelected) {
        if (currentSelected[key].checked) {
          res.push({
            org_unit: { id: key },
            aggregate: currentSelected[key]?.aggregate,
          });
        }
      }
      onSelected?.(res);
    }, [currentSelected, onSelected]);

    useEffect(() => {
      if (initialRender.current) {
        initialRender.current = false;
      } else {
        handleOnSelected();
      }
    }, [handleOnSelected]);

    const handleSelected = (id, field, checked) => {
      setCurrentSelected((prevState) => {
        const nextState = {
          ...prevState,
          [id]: {
            aggregate: 0,
            ...prevState[id],
            [field]: Number(checked),
          },
        };

        if (field === 'checked' && !checked) {
          delete nextState[id];
        }

        return nextState;
      });
    };

    return (
      <div
        className={twMerge(
          'flex flex-col overflow-auto scrollbar my-2',
          disabled && 'opacity-40 pointer-events-none',
          ...additionalClasses,
        )}
        style={{ maxHeight: maxHeight }}
        disabled={disabled}
      >
        {dataTree?.map((el) => (
          <TreeParent
            key={el.id}
            id={el.id}
            label={el.label}
            onClick={handleSelected}
            children={el.children}
            selected={currentSelected}
            levelSpace={0}
            initialOpen={initialOpen}
            hasCounter={hasCounter}
          />
        ))}
      </div>
    );
  },
);

export default Tree;

Tree.propTypes = {
  /**
   * Tree data
   */
  data: PropTypes.array,
  /**
   * Tree max height
   */
  maxHeight: PropTypes.string,
  /**
   * Tree additional classes
   */
  additionalClasses: PropTypes.arrayOf(PropTypes.string),
  /**
   * Tree disabled
   */
  disabled: PropTypes.bool,
  /**
   * Tree on selected callback
   */
  onSelected: PropTypes.func,
  /**
   * Tree initial open
   */
  initialOpen: PropTypes.bool,
  /**
   * Tree add counter based on children
   */
  hasCounter: PropTypes.bool,
  /**
   * Tree selected object of shape {id:{checked:true,aggregate: 1}}
   */
  selected: PropTypes.object,
};

Tree.defaultProps = {
  data: [],
  maxHeight: undefined,
  additionalClasses: [],
  disabled: false,
  onSelected: undefined,
  initialOpen: false,
  hasCounter: false,
  selected: {},
};
