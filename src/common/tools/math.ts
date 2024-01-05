import { all, create } from 'mathjs';

const math = create(all, {
  precision: 64,
});

export default math.evaluate;
