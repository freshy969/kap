import electron from 'electron';
import _ from 'lodash';

const {width: screenWidth, height: screenHeight} = (electron.screen && electron.screen.getPrimaryDisplay().bounds) || {};
const remote = electron.remote;
const debounceTimeout = 500;

const shake = el => {
  el.classList.add('shake');

  el.addEventListener('animationend', () => {
    el.classList.remove('shake');
  });

  return true;
};

const handleWidthInput = _.debounce(({x, y, setBounds, ratioLocked, ratio, value, widthInput, heightInput}) => {
  const updates = {};

  if (value.match(/^\d+$/)) {
    const val = parseInt(value, 10);

    if (val <= 0) {
      shake(widthInput);
      updates.width = 1;
    } else if (x + val > screenWidth) {
      shake(widthInput);
      updates.width = screenWidth - x;
    } else {
      updates.width = val;
    }

    if (ratioLocked) {
      updates.height = Math.ceil(updates.width * ratio[1] / ratio[0]);

      if (y + updates.height > screenHeight) {
        shake(heightInput);
        shake(widthInput);
        updates.height = screenHeight - y;
        updates.width = Math.ceil(updates.height * ratio[0] / ratio[1]);
      }
    }
  } else {
    // If it's not an integer keep last valid value
    shake(widthInput);
  }

  setBounds(updates);
}, debounceTimeout);

const handleHeightInput = _.debounce(({x, y, setBounds, ratioLocked, ratio, value, widthInput, heightInput}) => {
  const updates = {};

  if (value.match(/^\d+$/)) {
    const val = parseInt(value, 10);

    if (val <= 0) {
      shake(heightInput);
      updates.height = 1;
    } else if (y + val > screenHeight) {
      shake(heightInput);
      updates.height = screenHeight - y;
    } else {
      updates.height = val;
    }

    if (ratioLocked) {
      updates.width = Math.ceil(updates.height * ratio[0] / ratio[1]);

      if (x + updates.width > screenWidth) {
        shake(widthInput);
        shake(heightInput);
        updates.width = screenWidth - x;
        updates.height = Math.ceil(updates.width * ratio[1] / ratio[0]);
      }
    }
  } else {
    // If it's not an integer keep last valid value
    shake(heightInput);
  }

  setBounds(updates);
}, debounceTimeout);

const RATIOS = [
  '16:9',
  '5:4',
  '5:3',
  '4:3',
  '3:2',
  '1:1'
];

const buildAspectRatioMenu = ({setRatio, ratio}) => {
  if (!remote) {
    return;
  }

  const {Menu, MenuItem} = remote;
  const selectedRatio = ratio.join(':');
  const menu = new Menu();

  RATIOS.forEach(r => menu.append(
    new MenuItem({
      label: r,
      type: 'radio',
      checked: r === selectedRatio,
      click: () => setRatio(r.split(':').map(d => parseInt(d, 10)))
    })
  ));

  const customOption = RATIOS.includes(selectedRatio) ? {
    label: 'Custom',
    type: 'radio',
    checked: false,
    enabled: false
  } : {
    label: `Custom ${selectedRatio}`,
    type: 'radio',
    checked: true
  };

  menu.append(new MenuItem(customOption));
  return menu;
};

const handleInputKeyPress = onChange => event => {
  const multiplier = event.shiftKey ? 10 : 1;
  const parsedValue = parseInt(event.currentTarget.value, 10);

  // Fake an onChange event
  if (event.key === 'ArrowUp') {
    onChange({currentTarget: {value: `${parsedValue + multiplier}`}});
  } else if (event.key === 'ArrowDown') {
    onChange({currentTarget: {value: `${parsedValue - multiplier}`}});
  }

  // Don't let shift key lock aspect ratio
  if (event.ket === 'Shift') {
    event.preventDefault();
  }
};

export {
  handleWidthInput,
  handleHeightInput,
  buildAspectRatioMenu,
  handleInputKeyPress
};
