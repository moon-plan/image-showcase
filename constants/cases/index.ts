import type { Category } from '../../types';
import { peopleAndCharacters } from './peopleAndCharacters';
import { objectsAndProducts } from './objectsAndProducts';
import { scenesAndEnvironments } from './scenesAndEnvironments';
import { stylesAndEffects } from './stylesAndEffects';
import { creativeAndUtility } from './creativeAndUtility';

export const categories: Category[] = [
  peopleAndCharacters,
  objectsAndProducts,
  scenesAndEnvironments,
  stylesAndEffects,
  creativeAndUtility,
];
