import uuid from 'uuid/v1'
// TODO: generate uuid on each run of this method
// TODO: run this in the ComponentsControl rather than in multiple files
export const makeItem = value => {
  return { id: uuid(), value };
};
