import React from 'react';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

const Checkbox = ({
  id,
  name,
  onClick,
  disabled,
  additionalClasses,
  checked,
  title,
}) => {
  const [currectChecked, setCurrentChecked] = React.useState(checked);

  React.useEffect(() => {
    setCurrentChecked(checked);
  }, [checked]);

  return (
    <div
      className={twMerge(
        'px-1 h-[40px] w-[40px] flex justify-center items-center',
        ...additionalClasses,
      )}
      title={title}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        onChange={(e) => onClick?.(id, name, e.target.checked)}
        className={twMerge(
          'h-6 w-6',
          disabled ? 'opacity-40' : 'cursor-pointer',
        )}
        checked={currectChecked}
        disabled={disabled}
      />
    </div>
  );
};

export default Checkbox;

Checkbox.propTypes = {
  /**
   * Checkbox id
   */
  id: PropTypes.string,
  /**
   * Checkbox input name
   */
  name: PropTypes.string,
  /**
   * Checkbox onClick
   */
  onClick: PropTypes.func,
  /**
   * Additional classes for component
   */
  additionalClasses: PropTypes.arrayOf(PropTypes.string),
  /**
   * Checkbox if disabled
   */
  disabled: PropTypes.bool,
};

Checkbox.defaultProps = {
  id: '',
  name: '',
  onClick: undefined,
  additionalClasses: [],
  disabled: false,
  checked: false,
};
