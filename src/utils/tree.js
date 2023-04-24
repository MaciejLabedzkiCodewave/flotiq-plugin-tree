export const generateFlatData = (data) => {
  const flatData = {};
  const allIDs = [];

  const iterateRelation = ({
    id,
    children,
    parent,
    separator = '||',
    label,
  }) => {
    const childrensID = [];
    allIDs.push(id);

    // Case children
    if (children) {
      for (let key in children) {
        childrensID.push(children[key].id);

        iterateRelation({
          id: children[key].id,
          parent: parent ? parent + separator + id : id,
          children: children[key].children,
          label: children[key].label,
        });
      }
    }

    // Case from root no parent.
    if (!parent) {
      flatData[id] = {
        path: id,
        children: childrensID.length ? childrensID : undefined,
        parent: undefined,
        label: label,
      };
    }

    // Case from parent
    if (parent) {
      flatData[id] = {
        path: parent + separator + id,
        children: childrensID.length ? childrensID : undefined,
        parent: parent,
        label: label,
      };
    }
  };

  for (let key in data) {
    iterateRelation({
      id: data[key].id,
      children: data[key].children,
      label: data[key].label,
    });
  }

  return { flatData, allIDs };
};
