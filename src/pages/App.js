import React, { useCallback, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';

// :: Components
import Textarea from '../components/Textarea/Textarea';
import Tree from '../components/Tree/Tree';

// :: Data
import DEFAULT_JSON from '../data/example.json';

// :: Utils
import { isJsonString } from '../utils/json';

const App = () => {
  const [data, setData] = React.useState(DEFAULT_JSON);
  const [error, setError] = React.useState();
  const [selectedData, setSelectedData] = React.useState([]);
  const ref = useRef();

  useEffect(() => {
    if (isJsonString(JSON.stringify(data))) {
      setError();
    } else {
      setError('Not valid json');
    }
  }, [data]);

  const handleChange = (data) => {
    if (isJsonString(data)) {
      // Case: clear selected on change in data
      ref.current.clearSelected();

      setData(JSON.parse(data));
      setError();
    } else {
      setError('Not valid json');
    }
  };

  const handleOnSelected = useCallback((data) => {
    setSelectedData(data);
  }, []);

  return (
    <div className={twMerge('flex w-full min-h-screen justify-center bg-gray')}>
      <div className="p-10 w-full max-w-screen-lg">
        <Textarea
          label="JSON Placeholder"
          onChange={handleChange}
          value={JSON.stringify(data)}
          error={error}
          rows={'10'}
        />

        {error && (
          <div className="text-red px-2 pt-0 pb-2 text-sm mb-2">{error}</div>
        )}

        <hr className="my-4 border-gray-250" />

        <Tree
          ref={ref}
          data={data}
          onSelected={handleOnSelected}
          maxHeight={'100%'}
          initialOpen={true}
        />

        <hr className="my-4 border-gray-250" />

        <button
          className="bg-white border shadow p-2 rounded-xl hover:bg-blue"
          onClick={() => ref.current.clearSelected()}
        >
          Clear Selection
        </button>

        <hr className="my-4 border-gray-250" />

        <Textarea
          label="Tree selected"
          value={JSON.stringify(selectedData)}
          readonly={true}
        />
      </div>
    </div>
  );
};

export default App;
