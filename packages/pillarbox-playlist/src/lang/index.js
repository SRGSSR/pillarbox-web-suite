import de from './de.json';
import en from './en.json';
import fr from './fr.json';
import it from './it.json';
import rm from './rm.json';
import videojs from 'video.js';

function extendLanguage(code, data) {
  videojs.addLanguage(code, {
    ...videojs.options.language[code] ?? {},
    ...data
  });
}

extendLanguage('de', de);
extendLanguage('en', en);
extendLanguage('fr', fr);
extendLanguage('it', it);
extendLanguage('rm', rm);
