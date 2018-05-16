import React from 'react';
import PropTypes from 'prop-types';
import {DropdownArrowIcon} from '../../../vectors';

const OptionType = PropTypes.shape({
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired
});

const Select = ({options}) => (
  <select>
    {options.map(option => <option key={option.value}>{option.label}</option>)}
    <style jsx>{`
    select {
      position: absolute;
      height: 100%;
      width: 100%;
      opacity: 0;
    }
  `}</style>
  </select>
);

Select.propTypes = {
  options: PropTypes.arrayOf(OptionType).isRequired
};

const ExportSelect = ({options, label}) => {
  const hasOptions = options && options.length !== 0;
  return (
    <div className="root">
      {hasOptions && <Select options={options}/>}
      <button type="button" className={`button ${hasOptions ? 'button--select' : ''}`}><span className="label">{label}</span>{hasOptions && <DropdownArrowIcon/>}</button>
      <style jsx>{`
        .root {
          display: inline-block;
          position: relative;
          margin-right: 8px;
        }
        button {
          appearance: none;
          background-color: rgba(255,255,255,.10);
          border: none;
          border-radius: 4px;
          color: #FFF;
          font-size: 12px;
          height: 24px;
          padding: 0 8px;
          transition: border .12s ease-in-out,background .12s ease-in-out;
          display: flex;
          align-items: center;
          flex-direction: row;
        }
        .button--select {
          padding-right: 0px;
        }
        button:focus {
          outline: none;
        }
        button:focus, button:hover {
          background-color: hsla(0,0%,100%,.2);
        }
      `}</style>
    </div>
  );
};

ExportSelect.propTypes = {
  options: PropTypes.arrayOf(OptionType),
  label: PropTypes.string.isRequired
};

export default ExportSelect;

