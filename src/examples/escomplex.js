const { existsSync, readFileSync } = require('fs');
const util = require('util');
const escomplex = require('escomplex');
const typhonjsEscomplex = require('typhonjs-escomplex');
const fileName = process.argv[2];
const metrics = process.argv[3];

const getFileSource = filePath => {
  if (!existsSync(filePath)) {
    throw new Error(`File "${filePath}" does not exists`);
  }
  return readFileSync(filePath).toString();
};

const getMetrics = (filePath, options = {}) => {
  const source = getFileSource(filePath);
  return escomplex.analyse(source, options);
};

const getTyphonMetrics = (filePath, options = {}) => {
  const source = getFileSource(filePath);
  return typhonjsEscomplex.analyzeModule(source, options);
};

switch (metrics) {
  case 'escomplex':
    console.log('Escomplex');
    console.log(
      util.inspect(getMetrics(fileName), { showHidden: false, depth: null, colors: true })
    );
    return;

  case 'typhonjs':
    console.log('TyphonJS - Escomplex');
    console.log(
      util.inspect(getTyphonMetrics(fileName), { showHidden: false, depth: null, colors: true })
    );
    return;
}
// const metrics = getMetrics(fileName);
// const typhonMetrics = getTyphonMetrics(fileName);

// // console.log('Escomplex');
// // console.log(util.inspect(metrics, { showHidden: false, depth: null, colors: true }));
// console.log('TyphonJS - Escomplex');
// console.log(util.inspect(typhonMetrics, { showHidden: false, depth: null, colors: true  }));
