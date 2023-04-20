import React from 'react';
import { twMerge } from 'tailwind-merge';
import PropTypes from 'prop-types';

// :: Icon
import { ChevronUpIcon } from '@heroicons/react/24/outline';

const Textarea = ({ onChange, value, label, rows, error, readonly }) => {
  const [currentValue, setCurrentValue] = React.useState(value);
  const [open, setOpen] = React.useState(true);

  React.useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleOnChange = (e) => {
    setCurrentValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleOpen = () => {
    setOpen((prevState) => !prevState);
  };

  return (
    <>
      {label && (
        <div
          className="text-black hover:opacity-80 text-md p-2 flex flex-row items-center cursor-pointer"
          onClick={handleOpen}
        >
          {label}
          <ChevronUpIcon
            className={twMerge(
              'min-w-[35px] h-6 w-6 text-blue-600',
              'cursor-pointer',
              open && 'rotate-180',
            )}
            strokeWidth="2"
          />
        </div>
      )}
      {open && (
        <textarea
          onChange={handleOnChange}
          value={currentValue}
          rows={rows}
          readOnly={readonly}
          className={twMerge(
            'w-full p-2 rounded-xl border-2',
            readonly && 'outline-none border-gray-250 bg-gray-200',
            error &&
              'border-2 border-red hover:border-red focus:border-red outline-none',
          )}
        />
      )}
    </>
  );
};

export default Textarea;

Textarea.propTypes = {
  /**
   * Textarea onChange callback
   */
  onChange: PropTypes.func,
  /**
   * Textarea value
   */
  value: PropTypes.string,
  /**
   * Textarea label
   */
  label: PropTypes.string,
  /**
   * Textarea rows
   */
  rows: PropTypes.string,
  /**
   * Textarea error
   */
  error: PropTypes.string,
};

Textarea.defaultProps = {
  onChange: undefined,
  value: '',
  label: '',
  rows: '4',
  error: '',
  readonly: false,
};
