import React from 'react';
import PropTypes from 'prop-types';

export default function Field(props) {
  const {
    name,
    value,
    onChange,
  } = props;
  return (
      <input type="text" name={name} id="query" value={value} onChange={onChange} />
  );
}

Field.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  labelText: PropTypes.string,
  onChange: PropTypes.func,
};

Field.defaultProps = {
  name: '',
  value: '',
  labelText: '',
  onChange: undefined,
};
