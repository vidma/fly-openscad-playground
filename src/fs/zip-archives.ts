// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import { Symlinks } from "./filesystem";

export type ZipArchives = {
  [name: string]: {
    deployed?: boolean,
    description?: string,
    mountPath: string,
    gitOrigin?: {
      repoUrl: string,
      branch: string,
      include: {
        glob: string | string[],
        ignore?: string | string[],
        replacePrefix?: {[path: string]: string},
      }[]
    }
    symlinks?: Symlinks,
    docs?: {[name: string]: string}
  }
};

export const zipArchives: ZipArchives = {
  'fonts': {
    mountPath: 'fonts',
  },
  'scads': {
    mountPath: '',
    description: 'scads',
  },
  // 'openscad': {
  //   description: 'OpenSCAD',
  //   gitOrigin: {
  //     branch: 'master',
  //     repoUrl: 'https://github.com/openscad/openscad',
  //     include: [{glob: ['examples/*.scad', 'LICENSE']}],
  //   },
  // },
  // 'MCAD': {
  //   description: 'OpenSCAD Parametric CAD Library',
  //   gitOrigin: {
  //     branch: 'master',
  //     repoUrl: 'https://github.com/openscad/MCAD',
  //     include: [{glob: ['*.scad', 'bitmap/*.scad', 'LICENSE']}],
  //   },
  // },
  // 'BOSL': {
  //   description: 'The Belfry OpenScad Library',
  //   gitOrigin: {
  //     branch: 'master',
  //     repoUrl: 'https://github.com/revarbat/BOSL',
  //     include: [{glob: ['**/*.scad', 'LICENSE']}],
  //   },
  // },
  // 'BOSL2': {
  //   description: 'The Belfry OpenScad Library, v2.0',
  //   gitOrigin: {
  //     branch: 'master',
  //     repoUrl: 'https://github.com/revarbat/BOSL2',
  //     include: [{glob: ['**/*.scad', 'LICENSE']}],
  //   },
  //   docs: {
  //     'CheatSheet': 'https://github.com/revarbat/BOSL2/wiki/CheatSheet',
  //     'Wiki': 'https://github.com/revarbat/BOSL2/wiki',
  //   },
  // },
  // 'NopSCADlib': {
  //   gitOrigin: {
  //     branch: 'master',
  //     repoUrl: 'https://github.com/nophead/NopSCADlib',
  //     include: [{
  //       glob: '**/*.scad',
  //       ignore: 'test/**',
  //     }],
  //   },
  // },
  // 'FunctionalOpenSCAD': {
  //   description: 'Implementing OpenSCAD in OpenSCAD',
  //   gitOrigin: {
  //     branch: 'master',
  //     repoUrl: 'https://github.com/thehans/FunctionalOpenSCAD',
  //     include: [{glob: ['**/*.scad', 'LICENSE']}],
  //   },
  // },
  // 'funcutils': {
  //   description: 'OpenSCAD collection of functional programming utilities, making use of function-literals.',
  //   gitOrigin: {
  //     branch: 'master',
  //     repoUrl: 'https://github.com/thehans/funcutils',
  //     include: [{glob: '**/*.scad'}],
  //   },
  // },
  // 'smooth-prim': {
  //   description: 'OpenSCAD smooth primitives library',
  //   gitOrigin: {
  //     branch: 'master',
  //     repoUrl: 'https://github.com/rcolyer/smooth-prim',
  //     include: [{glob: ['**/*.scad', 'LICENSE.txt']}],
  //   },
  //   symlinks: {'smooth_prim.scad': 'smooth_prim.scad'},
  // },
  // 'closepoints': {
  //   description: 'OpenSCAD ClosePoints Library',
  //   gitOrigin: {
  //     branch: 'master',
  //     repoUrl: 'https://github.com/rcolyer/closepoints',
  //     include: [{glob: ['**/*.scad', 'LICENSE.txt']}],
  //   },
  //   symlinks: {'closepoints.scad': 'closepoints.scad'},
  // },
  // 'plot-function': {
  //   description: 'OpenSCAD Function Plotting Library',
  //   gitOrigin: {
  //     branch: 'master',
  //     repoUrl: 'https://github.com/colyer/plot-function',
  //     include: [{glob: ['**/*.scad', 'LICENSE.txt']}],
  //   },
  //   symlinks: {'plot_function.scad': 'plot_function.scad'},
  // },
  // 'threads': {
  //   deployed: false,
  //   gitOrigin: {
  //     branch: 'master',
  //     repoUrl: 'https://github.com/colyer/threads',
  //     include: [{glob: ['**/*.scad', 'LICENSE.txt']}],
  //   },
  // },
  // 'openscad-tray': {
  //   description: 'OpenSCAD library to create rounded rectangular trays with optional subdividers.',
  //   gitOrigin: {
  //     branch: 'main',
  //     repoUrl: 'https://github.com/sofian/openscad-tray',
  //     include: [{glob: ['**/*.scad', 'LICENSE']}],
  //   },
  //   symlinks: {'tray.scad': 'tray.scad'},
  // },
  // 'YAPP_Box': {
  //   description: 'Yet Another Parametric Projectbox Box',
  //   gitOrigin: {
  //     branch: 'main',
  //     repoUrl: 'https://github.com/mrWheel/YAPP_Box',
  //     include: [{glob: ['**/*.scad', 'LICENSE']}],
  //   },
  // },
  // 'Stemfie_OpenSCAD': {
  //   description: 'OpenSCAD Stemfie Library',
  //   gitOrigin: {
  //     branch: 'main',
  //     repoUrl: 'https://github.com/Cantareus/Stemfie_OpenSCAD',
  //     include: [{glob: ['**/*.scad', 'LICENSE']}],
  //   },
  // },
  // 'UB.scad': {
  //   gitOrigin: {
  //     branch: 'main',
  //     repoUrl: 'https://github.com/UBaer21/UB.scad',
  //     include: [{glob: ['libraries/*.scad', 'LICENSE', 'examples/UBexamples/*.scad'], replacePrefix: {
  //       'libraries/': '',
  //       'examples/UBexamples/': 'examples/',
  //     }}],
  //   },
  //   symlinks: {"ub.scad": "libraries/ub.scad"}, // TODO change this after the replaces work
  // },
  // 'pathbuilder': {
  //   gitOrigin: {
  //     branch: 'main',
  //     repoUrl: 'https://github.com/dinther/pathbuilder.git',
  //     include: [{glob: ['**/*.scad', 'LICENSE']}],
  //   },
  // },
  // 'openscad_attachable_text3d': {
  //   gitOrigin: {
  //     branch: 'main',
  //     repoUrl: 'https://github.com/jon-gilbert/openscad_attachable_text3d.git',
  //     include: [{glob: ['**/*.scad', 'LICENSE']}],
  //   },
  // },
};

export const deployedArchiveNames =
  Object.entries(zipArchives)
    .filter(([_, {deployed}]) => deployed == null || deployed)
    .map(([n, v]) => n);
