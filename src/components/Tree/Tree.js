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

// :: Icon
import { XMarkIcon } from '@heroicons/react/24/outline';

// :: Utils
import { generateFlatData } from '../../utils/tree';

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
      hasSearch,
      searchPlaceholder,
      label,
      aggregateHoverTitle,
      textNoFilterData,
      onParentMatchShowAllChildren,
      textLoading,
      textNoData,
    },
    ref,
  ) => {
    const initialRender = useRef(true);
    // :: Data
    const [dataTree, setDataTree] = React.useState(data);
    const [loading, setLoading] = React.useState(true);

    // :: Selected Checked
    const [currentSelected, setCurrentSelected] = React.useState(selected);

    // :: Search
    const [filtered, setFiltered] = React.useState('');
    const [filteredList, setFilteredList] = React.useState();
    const [flatID, setFlatID] = React.useState([]);

    // :: Expanded
    const [expanded, setExpanded] = React.useState([]);

    // Case: clear method from parent on ref.current.clearSelected();
    useImperativeHandle(ref, () => ({
      clearSelected() {
        setCurrentSelected({});
      },
    }));

    useEffect(() => {
      setLoading(true);

      const res = generateFlatData(data);

      if (res) {
        setFlatID(res.flatData);
        if (initialOpen) {
          setExpanded(res.allIDs);
        }
        setDataTree(data);

        setLoading(false);
      }
    }, [data, initialOpen]);

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
      if (field === 'checked') {
        let updateListChecked = { ...currentSelected };
        // Updata root id
        updateListChecked[id] = { checked: checked, aggregate: 0 };

        // Case: Get from from flatID list of children from root id
        const rootListID = flatID[id].children;

        // Case: Generate list of selected relation
        const generateCheckedStaus = (data) => {
          for (let key in data) {
            const currentID = data[key];

            if (filtered) {
              if (filteredList.indexOf(currentID) > -1) {
                updateListChecked[currentID] = {
                  checked: checked,
                  aggregate: updateListChecked[currentID]?.aggregate || 0,
                };
              }
            } else {
              if (checked) {
                updateListChecked[currentID] = {
                  checked: checked,
                  aggregate: updateListChecked[currentID]?.aggregate || 0,
                };
              } else {
                delete updateListChecked[currentID];
              }
            }

            if (flatID[currentID].children) {
              generateCheckedStaus(flatID[currentID].children);
            }
          }
        };
        generateCheckedStaus(rootListID);

        setCurrentSelected(updateListChecked);

        filtered && handleExpandedFromSelected(updateListChecked);
      }

      if (field === 'aggregate') {
        setCurrentSelected((prevState) => ({
          ...prevState,
          [id]: {
            aggregate: 0,
            ...prevState[id],
            [field]: Number(checked),
          },
        }));
      }
    };

    const handleExpandedFromSelected = (data) => {
      const res = [];

      for (let key in data) {
        if (data[key].checked) {
          const itemID = key;

          const itemPath = flatID[itemID].path;
          if (itemPath) {
            const itemIDfromPath = itemPath.split('||');
            res.push(...itemIDfromPath);
          }

          const result = generateAllChildrenPath(flatID[itemID].children);
          if (result) {
            res.push(...result);
          }
        }
      }

      setExpanded([...new Set([...res])]);
    };

    const generateAllChildrenPath = (itemChidren) => {
      if (itemChidren) {
        let res = [];
        for (let itemKey in itemChidren) {
          const itemID = itemChidren[itemKey];
          res.push(itemID);
          const itemPath = flatID[itemID].path;
          if (itemPath) {
            const itemIDfromPath = itemPath.split('||');
            res.push(...itemIDfromPath);
          }

          if (flatID[itemID].children) {
            const result = generateAllChildrenPath(flatID[itemID].children);
            if (result) {
              res.push(...result);
            }
          }
        }

        return res;
      }
    };

    const handleFiltered = (e) => {
      setFiltered(e.target.value);

      const res = [];
      for (let key in flatID) {
        if (flatID[key].label.toLowerCase().includes(e.target.value)) {
          // Case: show path id
          const itemPath = flatID[key].path;
          if (itemPath) {
            const itemIDfromPath = itemPath.split('||');
            res.push(...itemIDfromPath);
          }

          // Case: show id
          res.push(key);

          // Case: inlude all children if filtered text match on parent
          if (onParentMatchShowAllChildren) {
            const itemChidren = flatID[key].children;
            const result = generateAllChildrenPath(itemChidren);
            if (result) {
              res.push(...result);
            }
          }
        }
      }

      if (e.target.value) {
        setFilteredList([...new Set(res)]);
      } else {
        setFilteredList();
      }
    };

    const handleClear = () => {
      setFiltered();
      setFilteredList();
      handleExpandedFromSelected(currentSelected);
    };

    const handleExpanded = (id) => {
      if (expanded.indexOf(id) > -1) {
        const updateExpanded = expanded.filter((el) => el !== id);
        setExpanded(updateExpanded);
      } else {
        setExpanded((prevState) => [...prevState, id]);
      }
    };

    return (
      <>
        {label && <div className="py-2 px-3 text-xl">{label}</div>}

        {hasSearch && (
          <div className="relative m-2 mb-4">
            <input
              onChange={handleFiltered}
              placeholder={searchPlaceholder}
              value={filtered || ''}
              className={twMerge(
                'px-3 w-full py-3 border outline-none border-gray-250 rounded-xl',
              )}
              disabled={dataTree?.length === 0}
            />
            <span
              className={twMerge(
                'text-gray-150 text-xl',
                'leading-0 cursor-pointer',
                'w-10 h-10',
                'absolute right-1 bottom-1',
                'flex justify-center items-center',
                'hover:opacity-80',
              )}
              onClick={handleClear}
            >
              <XMarkIcon className="w-6" />
            </span>
          </div>
        )}

        <div
          className={twMerge(
            'flex flex-col overflow-auto scrollbar my-2 pr-3',
            'relative min-h-[40px]',
            disabled && 'opacity-40 pointer-events-none',
            ...additionalClasses,
          )}
          style={{ maxHeight: maxHeight }}
          disabled={disabled}
        >
          {filtered && !filteredList.length && (
            <div className="p-2 text-center ">{textNoFilterData}</div>
          )}
          {loading ? (
            <div className="p-2 text-center absolute w-full">{textLoading}</div>
          ) : (
            dataTree?.map((el) => (
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
                aggregateHoverTitle={aggregateHoverTitle}
                filtered={filtered}
                filteredList={filteredList}
                expanded={expanded}
                handleExpanded={handleExpanded}
              />
            ))
          )}
          {dataTree?.length === 0 && (
            <div className="p-2 text-center absolute w-full">{textNoData}</div>
          )}
        </div>
      </>
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
  maxHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
   * Tree selected object of shape { id0: { checked: true, aggregate: 1}, id1: ...}
   */
  selected: PropTypes.object,
  /**
   * Tree add search
   */
  hasSearch: PropTypes.bool,
  /**
   * Tree title
   */
  title: PropTypes.string,
};

Tree.defaultProps = {
  data: [],
  maxHeight: '100%',
  additionalClasses: [],
  disabled: false,
  onSelected: undefined,
  initialOpen: true,
  hasCounter: false,
  hasSearch: true,
  selected: {},
  searchPlaceholder:
    'Szukaj ( prezentacja jednostki org. podczas wyszukiwania )',
  label: 'Jednostki organizacyjne, które mają znaleźć się w raporcie',
  textNoFilterData: 'Brak danych dla szukanej wartości.',
  aggregateHoverTitle: 'Agreguj jako pozostałe jednostki',
  textLoading: 'Loading ...',
  textNoData: 'Brak danych',
  onParentMatchShowAllChildren: true,
};
