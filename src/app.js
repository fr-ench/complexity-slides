import 'highlight.js/styles/docco.css';
import 'core.css';

import './typography';
import './code';
import './list';
import './grid';
import './arrows';
import './content';
import './animation';
import './quote';
import './graph';
import './table';

import { initHighlighting } from 'highlight.js';
import { Slides } from './slides';

initHighlighting();
new Slides();
