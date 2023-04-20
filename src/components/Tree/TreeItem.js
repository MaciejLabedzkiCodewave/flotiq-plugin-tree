import React from 'react';
import PropTypes from 'prop-types';

// :: Icon
import { ChevronUpIcon } from '@heroicons/react/24/outline';

// :: Component
import Checkbox from '../Checbbox/Checkbox';
import { twMerge } from 'tailwind-merge';

const TreeItem = ({
  id,
  label,
  onClick,
  onOpen,
  open,
  hasArrow,
  selected,
  treeItemColor,
  counter,
  hasCounter,
}) => {
  const colorClasses = {
    none: '',
    gray: 'bg-gray',
  };
  return (
    <div
      className={twMerge(
        'flex flex-row p-2 px-4 min-h-[70px] w-full items-center',
        'rounded-xl border-1 border-black mb-2',
        colorClasses[treeItemColor],
        'hover:bg-blue',
        selected?.[id]?.checked && 'bg-blue',
      )}
    >
      <ChevronUpIcon
        className={twMerge(
          'min-w-[35px] min-h-[35px] w-6 text-blue-600',
          'cursor-pointer',
          !open && 'rotate-180',
          !hasArrow && 'invisible',
        )}
        strokeWidth="2"
        onClick={onOpen}
      />

      <Checkbox
        id={id}
        name={'checked'}
        onClick={onClick}
        additionalClasses={['mx-4']}
        disabled={!id || !label}
        checked={selected?.[id]?.checked}
      />

      <label
        htmlFor={id}
        className={twMerge(
          'flex justify-center items-center',
          'mr-2 text-gray-150 text-lg',
          'cursor-pointer leading-5 text-ellipsis overflow-hidden',
          'max-w-[75%] py-4',
        )}
      >
        {label} {hasCounter && <div className="mx-2">({counter})</div>}
      </label>

      {selected?.[id]?.checked ? (
        <Checkbox
          id={id}
          name={'aggregate'}
          onClick={onClick}
          additionalClasses={['ml-auto']}
          disabled={!id || !label}
          checked={selected?.[id]?.aggregate}
          title={'Agreguj jako pozostałe jednostki'}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default TreeItem;

TreeItem.propTypes = {
  /**
   * TreeItem id
   */
  id: PropTypes.string,
  /**
   * TreeItem if is selected
   */
  selected: PropTypes.object,
  /**
   * TreeItem label with name
   */
  label: PropTypes.string,
  /**
   * TreeItem onClick
   */
  onClick: PropTypes.func,
  /**
   * TreeItem on open callback
   */
  onOpen: PropTypes.func,
  /**
   * TreeItem if children is visible
   */
  open: PropTypes.bool,
  /**
   * TreeItem if there is arrow to toggle visibility of childrens
   */
  hasArrow: PropTypes.bool,
  /**
   * TreeItem row background color
   */
  treeItemColor: PropTypes.oneOf(['gray', 'none']),
};

TreeItem.defaultProps = {
  id: '',
  label: '',
  onClick: undefined,
  onOpen: undefined,
  open: false,
  hasArrow: false,
  selected: {},
  treeItemColor: 'none',
  counter: 0,
};
