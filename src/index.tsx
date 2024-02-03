// Portions of this file are Copyright 2021 Google LLC, and licensed under GPL2+. See COPYING.

import React from 'react';
import ReactDOM from 'react-dom/client';
import {App} from './components/App';
import { createEditorFS } from './fs/filesystem';
import { registerOpenSCADLanguage } from './language/openscad-register-language';
import { zipArchives } from './fs/zip-archives';
import {readStateFromFragment} from './state/fragment-state'
import { createInitialState } from './state/initial-state';
import './index.css';

import debug from 'debug';
import { isInStandaloneMode, registerCustomAppHeightCSSProperty } from './utils';
import { State, StatePersister } from './state/app-state';
import { writeStateInFragment } from "./state/fragment-state";

import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.min.css";

const log = debug('app:log');

if (process.env.NODE_ENV !== 'production') {
  debug.enable('*');
  log('Logging is enabled!');
} else {
  debug.disable();
}

declare var BrowserFS: BrowserFSInterface


(async () => {
  registerCustomAppHeightCSSProperty();

  const fs = await createEditorFS({prefix: '/', allowPersistence: false});

  await registerOpenSCADLanguage(fs, '/', zipArchives);

  let statePersister: StatePersister;
  let persistedState: State | null = null;

  if (isInStandaloneMode) {
    const fs: FS = BrowserFS.BFSRequire('fs')
    try {
      const data = JSON.parse(new TextDecoder("utf-8").decode(fs.readFileSync('/state.json')));
      const {view, params} = data
      persistedState = {view, params};
    } catch (e) {
      console.log('Failed to read the persisted state from local storage.', e)
    }
    statePersister = {
      set: ({view, params}) => {
        fs.writeFile('/state.json', JSON.stringify({view, params}));
      }
    };
  } else {
    persistedState = readStateFromFragment();
    statePersister = {
      set: writeStateInFragment,
    };
  }

  const initialState = createInitialState(fs, persistedState);

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
  );
  root.render(
    <React.StrictMode>
      <App initialState={initialState} statePersister={statePersister} fs={fs} />
    </React.StrictMode>
  );
})();


