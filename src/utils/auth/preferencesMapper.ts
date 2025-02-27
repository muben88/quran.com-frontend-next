/* eslint-disable import/prefer-default-export */
/* eslint-disable react-func/max-lines-per-function */
import AudioState from 'src/redux/types/AudioState';
import QuranReaderStyles from 'src/redux/types/QuranReaderStyles';
import ReadingPreferences from 'src/redux/types/ReadingPreferences';
import SliceName from 'src/redux/types/SliceName';
import TafsirsSettings from 'src/redux/types/TafsirsSettings';
import TranslationsSettings from 'src/redux/types/TranslationsSettings';
import PreferenceGroup from 'types/auth/PreferenceGroup';

const SLICE_NAME_TO_PREFERENCE_GROUP = {
  [SliceName.AUDIO_PLAYER_STATE]: PreferenceGroup.AUDIO,
  [SliceName.LOCALE]: PreferenceGroup.LANGUAGE,
  [SliceName.QURAN_READER_STYLES]: PreferenceGroup.QURAN_READER_STYLES,
  [SliceName.READING_PREFERENCES]: PreferenceGroup.READING,
  [SliceName.TAFSIRS]: PreferenceGroup.TAFSIRS,
  [SliceName.THEME]: PreferenceGroup.THEME,
  [SliceName.TRANSLATIONS]: PreferenceGroup.TRANSLATIONS,
};

/**
 * Convert a slice's object into preference group
 * that will be persisted in the DB.
 *
 * @param {SliceName} sliceName
 * @param {any} currentSliceValue
 * @returns {Record<string, any>}
 */
const getPreferenceGroupValue = (
  sliceName: SliceName,
  currentSliceValue: any,
): Record<string, any> => {
  if (sliceName === SliceName.LOCALE) {
    return currentSliceValue;
  }
  if (sliceName === SliceName.AUDIO_PLAYER_STATE) {
    const {
      playbackRate,
      reciter,
      showTooltipWhenPlayingAudio,
      enableAutoScrolling,
      repeatSettings,
    } = currentSliceValue as AudioState;
    // only partially pick those props
    return {
      playbackRate,
      reciter: reciter.id,
      showTooltipWhenPlayingAudio,
      enableAutoScrolling,
      repeatSettings,
    };
  }
  if (sliceName === SliceName.READING_PREFERENCES) {
    const newPreferences = {
      ...currentSliceValue,
    } as ReadingPreferences;
    delete newPreferences.isUsingDefaultWordByWordLocale;
    return newPreferences;
  }
  if (sliceName === SliceName.TRANSLATIONS) {
    const newPreferences = {
      ...currentSliceValue,
    } as TranslationsSettings;
    delete newPreferences.isUsingDefaultTranslations;
    return newPreferences;
  }
  if (sliceName === SliceName.TAFSIRS) {
    const newPreferences = {
      ...currentSliceValue,
    } as TafsirsSettings;
    delete newPreferences.isUsingDefaultTafsirs;
    return newPreferences;
  }
  if (sliceName === SliceName.QURAN_READER_STYLES) {
    const newPreferences = {
      ...currentSliceValue,
    } as QuranReaderStyles;
    delete newPreferences.isUsingDefaultFont;
    return newPreferences;
  }
  return {
    ...currentSliceValue,
  };
};

/**
 * Convert the entire state object that includes multiple
 * slices into preference groups that will be persisted
 * in the DB.
 *
 * @param {any} state
 * @returns {Record<PreferenceGroup, any>}
 */
export const stateToPreferenceGroups = (state: any): Record<PreferenceGroup, any> => {
  const preferenceGroups = {} as Record<PreferenceGroup, any>;
  Object.keys(state).forEach((sliceName: SliceName) => {
    const preferenceGroup = SLICE_NAME_TO_PREFERENCE_GROUP[sliceName];
    // if the current slice has a corresponding preference group name
    if (preferenceGroup) {
      preferenceGroups[preferenceGroup] = getPreferenceGroupValue(sliceName, state[sliceName]);
    }
  });
  return preferenceGroups;
};
