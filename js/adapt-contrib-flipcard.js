import Adapt from 'core/js/adapt';
import FlipcardView from './FlipcardView';
import FlipcardModel from './FlipcardModel';

export default Adapt.register('flipcard', {
  model: FlipcardModel,
  view: FlipcardView
});
