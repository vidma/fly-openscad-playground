// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import defaultScad from './default-scad';
import { State } from './app-state';

export const defaultSourcePath = '/wing_model.scad';
export const defaultModelColor = '#f9d72c';

export const defaultConstants = `
// ------- main ------------

chord = 80;//SOL75
body_d = 5;//SOL75
theta = 5;//SOL75
sweep = 3;//SOL75
spar_l = 150;//SOL75
spar_w = 3;//SOL75
spar_h = 3;//SOL75
// differencial twist not implemented yet in this preview at least?
twist = 0;//SOL75
root_l = 8;//SOL75
rib_n = 3;//SOL75

//Assigned by requirements
//spar_l = 150;//SOL75
//spar_w = 3;//SOL75
// spar_h = 3;//SOL75
// theta = 5;//SOL75
// sweep = 3;//SOL75
// body_d = 5;//SOL75
use_skid = 1;//SOL75

//True DOF
skin_t = 1;//SOL75 // Upper and lower element of the beam
iso_el_t = 1.3;//SOL75 // ~ number of layers
iso_el_width = 0.5;//SOL75 // ~ nozzle thickness
perimeter_t = 0.8;//SOL75 // was 0.5

// FIXME
tube_z_pos = 1;//SOL75 //Position of the tube axis in z: How "negative" is the body tube position

insertion_l = 15;//SOL75
body_l = 12;//SOL75
pin_d = 2;//SOL75 // diameter of the pin which helds the beam in place
stand_off_l = 4;//SOL75// distance from the symmetry axis to the start of the spar

skid_l = 12; // skid lenght
hole_d = 3; //hole in the skid

// printer settings
min_tol = 0.4;//SOL75
p0 = 0.01;//SOL75

// ---------- NACA Airfoil ------------

//Assigned from req - this may generate each individual airfoil section, e.g. even NACA prantdl
//, degrees?
//sweep = 0;//SOL75
//deg
//twist = 0;//SOL75
spar_width = 3;//SOL75
//7.3
spar_height = 3;//SOL75
// mm
//chord = 80;//SOL75

// NACA params
camber_max = 2.704;//SOL75
// /10 compared to airfoiltools
camber_pos = 40.02/10;//SOL75
thickness_max = 7.971;//SOL75

// Real DOF
//. was 4
n_sections = 15;//SOL75
//perimeter_t = 0.8;//SOL75
//1.7 - height of whole rib
rib_base_h = 0.2*8;//SOL75
spar_y_offset = 1*1.5;//SOL75
protrusion_h = 5; // spar holder length (Z), was 5

//Machine settings
//min_tol = 0.4;//SOL75
//p0 = 0.01; //0.01 - is this minimum part size?
`;

export const blankProjectState: State = {
  params: {
    sourcePath: defaultSourcePath,
    source: '',
    features: [],
    constantsSource: defaultConstants
  },
  view: {
    color: defaultModelColor,
    layout: {
      mode: 'single',
      focus: 'editor'
    }
  }
};

export function createInitialState(fs: any, state: State | null) {

  type Mode = State['view']['layout']['mode'];
  const mode: Mode = window.matchMedia("(min-width: 768px)").matches 
    ? 'multi' : 'single';

  const initialState: State = {
    params: {
      sourcePath: defaultSourcePath,
      source: defaultScad,
      features: [],
      constantsSource: defaultConstants
    },
    view: {
      layout: {
        mode: 'multi',
        editor: false,
        viewer: true,
        customizer: false,
      } as any,

      color: defaultModelColor,
    },
    ...(state ?? {})
  };

  if (initialState.view.layout.mode != mode) {
    if (mode === 'multi' && initialState.view.layout.mode === 'single') {
      initialState.view.layout = {
        mode,
        editor: true,
        viewer: true,
        customizer: initialState.view.layout.focus == 'customizer'
      }
    } else if (mode === 'single' && initialState.view.layout.mode === 'multi') {
      initialState.view.layout = {
        mode,
        focus: initialState.view.layout.viewer ? 'viewer'
          : initialState.view.layout.customizer ? 'customizer'
          : 'viewer'
      }
    }
  }

  initialState.view.showAxes ??= true
  initialState.view.showShadows ??= true

  fs.writeFile(initialState.params.sourcePath, initialState.params.source);
  if (initialState.params.sourcePath !== defaultSourcePath) {
    fs.writeFile(defaultSourcePath, defaultScad);
  }
  // FIXME: this seem not available in worker FS?
  fs.writeFile('/constants.scad', initialState.params.constantsSource);
  fs.writeFile('/libraries/constants.scad', initialState.params.constantsSource);

  
  const defaultFeatures = ['manifold', 'fast-csg', 'lazy-union'];
  defaultFeatures.forEach(f => {
    if (initialState.params.features.indexOf(f) < 0)
    initialState.params.features.push(f);
  });

  return initialState;
}

