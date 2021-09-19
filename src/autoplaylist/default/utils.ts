// A fine piece of regex
export const dateRegexFull = '\\d{4}(-\\d{2}(-\\d{2}( \\d{2}(:\\d{2}(:\\d{2})?)?)?)?)?';
export const dateRegex = new RegExp(`^${dateRegexFull}$`);

export const escapeText = (s: string): string => {
  // Return metadata fields without spaces as is
  if (/^%(\w|_)+%$/.test(s)) {
    return s;
  }

  // Return string itself for plain numbers
  if (/^\d+(\.\d+)?$/.test(s)) {
    return s;
  }

  // dunno how to escape double quotes
  return `"${s.replace(/"/g, '')}"`;
};

export const timeFields = [
  // https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference#Remapped_metadata_fields
  '%last_modified%',

  // https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Components/Playback_Statistics_v3.x_(foo_playcount)
  '%first_played%',
  '%last_played%',
  '%added%'
];

export const fields = [
  // https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference#Remapped_metadata_fields
  '%album artist%',
  '%album%',
  '%artist%',
  '%discnumber%',
  '%totaldiscs%',
  '%track artist%',
  '%title%',
  '%tracknumber%',
  '%track number%',
  '%bitrate%',
  '%channels%',
  '%codec%',
  '%filesize%',
  '%filesize_natural%',
  '%length%',
  '%length_ex%',
  '%length_seconds%',
  '%length_seconds_fp%',
  '%length_samples%',
  '%samplerate%',
  '%replaygain_album_gain%',
  '%replaygain_album_peak%',
  '%replaygain_album_peak_db%',
  '%replaygain_track_gain%',
  '%replaygain_track_peak%',
  '%replaygain_track_peak_db%',
  '%filename%',
  '%filename_ext%',
  '%directoryname%',
  '%path%',
  '%_path_raw%',
  '%subsong%',

  // https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Components/Playback_Statistics_v3.x_(foo_playcount)
  '%play_count%',
  '%played_per_day%',
  '%rating%',
  '%rating_stars%',
  'rating_stars_fixed',

  ...timeFields
];
