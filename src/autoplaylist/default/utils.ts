import {
  Completion,
  CompletionContext,
  CompletionResult
} from '@codemirror/autocomplete';
import { hoverTooltip } from '@codemirror/tooltip';

import {
  NumberOperator,
  OneSideOperator,
  TextOperator,
  TimeOperator
} from '@/types/autoplaylist';

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
  '%genre%',

  // https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Components/Playback_Statistics_v3.x_(foo_playcount)
  '%play_count%',
  '%played_per_day%',
  '%rating%',
  '%rating_stars%',
  '%rating_stars_fixed%',

  ...timeFields
];

export const arithmeticFunctions: string[] = [
  '$add(a, b, ...)',
  '$div(a, b, ...)',
  '$greater(a, b)',
  '$max(a, b, ...)',
  '$min(a, b, ...)',
  '$mod(a, b, ...)',
  '$mul(a, b, ...)',
  '$muldiv(a, b, c)',
  '$sub(a, b, ...)'
];

export const boolFunctions: string[] = [
  '$and(expr, ...)',
  '$or(expr, ...)',
  '$not(expr)',
  '$xor(expr, ...)'
];

export const stringFunctions: string[] = [
  '$abbr(str)',
  '$abbr(str, len)',
  '$ansi(str)',
  '$ascii(str)',
  '$caps(str)',
  '$caps2(str)',
  '$char(nbr)',
  '$crc32(str)',
  '$crlf()',
  '$cut(str, len)',
  '$directory(path)',
  '$directory(path, n)',
  '$ext(path)',
  '$filename(path)',
  '$hex(int, len)',
  '$insert(str, insert, n)',
  '$left(str, len)',
  '$len(str)',
  '$len2(str)',
  '$longer(str1, str2)',
  '$lower(str)',
  '$longest(arg,...)',
  '$num(nbr,len)',
  '$replace(str,search,replace)',
  '$right(str,len)',
  '$roman(int)',
  '$shortest(str,...)',
  '$strcmp(str1,str2)',
  '$stricmp(str1,str2)',
  '$stripprefix(str,prefix1,prefix2,...)',
  '$substr(str,from,to)',
  '$trim(str)',
  '$upper(str)'
];

// https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference#Track_info_fields_and_functions
export const infoFunctions: string[] = [
  '$meta(name)',
  '$meta(name,n)',
  '$meta_test(...)',
  '$meta_num(name)',
  '$info(name)',
  '$channels()'
];

// https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference#Time_and_date_functions
export const timeFunctions: string[] = [
  '$year(time)',
  '$month(time)',
  '$day_of_month(time)',
  '$date(time)',
  '$time(time)'
];

// https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference#Control_flow_functions
export const controlFlowFunctions: string[] = [
  '$if(cond,then,else)',
  '$if2(expr,else)',
  '$if3(a1,a2,...,aN,else)',
  '$ifequal(int1,int2,then,else)',
  '$ifgreater(int1,int2,then,else)',
  '$iflonger(str,n,then,else)',
  '$select(n,a1,...,aN)'
];

export const allFunctions = [
  ...arithmeticFunctions,
  ...boolFunctions,
  ...infoFunctions,
  ...stringFunctions,
  ...timeFunctions,
  ...controlFlowFunctions
];

// Descriptions taken from https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference
export const functionDescriptions: {[name: string]: string} = {
  $add: 'Addition of numbers. a + b + ...',
  $div: 'a / b rounding down to the closest integer. If b is zero returns a. ' +
      'Can be used with any number of arguments.',
  $greater: 'Returns true if a is greater than b, otherwise false',
  $max: 'Returns the largest number among the given arguments.',
  $min: 'Returns the smallest number among the given arguments.',
  $mod: 'Returns the division remainder of a divided by b. Can be used with any number of arguments.',
  $mul: 'a * b * ...',
  $muldiv: '(a * b) / c rounded down to the nearest integer.',
  $sub: 'Subtraction of numbers. a - b - ...',

  $and: 'Logical AND for an arbitrary number of arguments.',
  $or: 'Logical OR for an arbitrary number of argument.',
  $not: 'Logical NOT. True becomes false and false becomes true.',
  $xor: 'Logical exclusive-or for an arbitrary number of arguments.',

  $abbr: 'Returns an abbreviation of the string by shortening each word to its first letter. ' +
    'Spaces and parentheses are stripped. If the len parameter is given, returns the abbreviation if string is longer than len.',
  $ansi: 'Converts str to system codepage. Characters not present in the system codepage will be removed / replaced.',
  $ascii: 'Converts str to ASCII. Any characters not present in ASCII will be removed / replaced.',
  $caps: 'Converts the first letter of every word in str to uppercase and other letters to lowercase.',
  $caps2: 'Converts the first letter of every word in str to uppercase. Does not modify other letters.',
  $char: 'Returns Unicode character of nbr.',
  $crc32: 'Computes the CRC32 of the string as a number.',
  $crlf: 'Inserts end-of-line marker (carriage return, line feed).',
  $cut: 'Returns the first len characters from the left of the string str. Negative numbers return str.',
  $directory: 'Extracts directory name from path. If the n parameter is given goes up by n levels.',
  $ext: 'Extracts file extension from filename or path to file.',
  $filename: 'Extracts filename from path.',
  $hex: 'Returns the integer in hexadecimal notation with len digits. Left padded with zeros if necessary.',
  $insert: 'Inserts insert into str after n characters',
  $left: 'Returns the first len characters from the left of the string. Negative numbers return str.',
  $len: 'Returns the length of the string str.',
  $len2: 'Returns the length of the string str counting double width characters as two.',
  $longer: 'Returns true if str1 is longer than str2, false otherwise.',
  $lower: 'Converts str to lowercase.',
  $longest: 'Returns the longest of its arguments. Can be used with an arbitrary number of strings.',
  $num: 'Formats the integer number nbr in decimal notation with len characters. ' +
    'Pads with zeros from the left if necessary. len includes the dash when the number is negative. If nbr is not numeric, it is treated as zero.',
  $replace: 'Replaces all occurrences of string search in string str with string replace. ' +
    'Can also be used with an arbitrary number of arguments.',
  $right: 'Returns the first len characters from the right of string str.',
  $roman: 'Formats the integer number int in roman notation.',
  $shortest: 'Returns the first shortest element of its arguments. Can be used with an arbitrary number of strings.',
  $strcmp: 'Performs a case-sensitive comparison of the strings str1 and str2.',
  $stricmp: 'Performs a case-insensitive comparison of the strings str1 and str2.',
  $stripprefix: 'Removes the specified prefixes from string str.',
  $substr: 'Returns substring of string str, starting from FROM-th character and ending at TO-th character.',
  $trim: 'Removes leading and trailing spaces from string str.',
  $upper: 'Converts string str to uppercase.',

  // https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference#Track_info_fields_and_functions
  $meta: 'Returns value of tag called name. If multiple values of that tag exist, they are concatenated with ", " as separator. ' +
    'If a second parameter is given returns value of n-th (0,1,2 and so on) tag called name.',
  $meta_test: 'Returns value of tag called name. If multiple values of that tag exist, they are concatenated with sep as separator.',
  $meta_num: 'Returns the number of values for the tag called name.',
  $info: 'Returns value of technical information field called name. More info can be found here https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference#.24info.28name.29',
  $channels: 'The number of channels in text format.',

  // https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference#Time_and_date_functions
  $year: 'Retrieves the year part (formatted as four digits) from a time/date string.',
  $month: 'Retrieves the month part (formatted as two digits) from a time/date string.',
  $day_of_month: 'Retrieves the day of month part (formatted as two digits) from a time/date string.',
  $date: 'Retrieves the date part (formatted as YYYY-MM-DD) from a time/date string.',
  $time: 'Retrieves the time part (formatted as HH:MM:SS or HH:MM) from a date/time string.',

  // https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference#Control_flow_functions
  $if: 'If cond evaluates to true, the then part is evaluated and its value returned. Otherwise, the else part is evaluated and its value returned.',
  $if2: 'If expression expr is true, expr is returned, otherwise the else part is evaluated and expr is returned as true.',
  $if3: 'Evaluates arguments a1 ... aN, until one is found that evaluates to true and its value is returned. Otherwise the else part is evaluated and its value returned.',
  $ifequal: 'Compares the integer numbers int1 and int2. If int1 is equal to int2, the then part is evaluated and its value returned. Otherwise the else part is evaluated and its value returned.',
  $ifgreater: 'Compares the integer numbers int1 and int2. If int1 is greater than int2, the then part is evaluated and its value returned. Otherwise the else part is evaluated and its value returned.',
  $iflonger: 'Compares the length of the string str to the number n. If str is longer than n characters, the then part is evaluated and its value returned. Otherwise the else part is evaluated and its value returned.',
  $select: 'If the value of n is between 1 and N, an is evaluated and its value returned. Otherwise false is returned.'
};

// https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Title_Formatting_Reference#Remapped_metadata_fields
export const fieldDescriptions: {[field: string]: string} = {
  '%album artist%': 'Name of the artist of the album the track belongs to.' +
    ' Checks following metadata fields, in this order: "album artist", "artist", "composer", "performer".',
  '%album%': 'Name of the album specified track belongs to. Checks following metadata fields, in this order: "album", "venue".',
  '%artist%': 'Name of the artist of the track. Checks following metadata fields, in this order: "artist", "album artist", "composer", "performer".',
  '%discnumber%': 'Index of disc specified track belongs to, within the album. Available only when "discnumber"/"disc" field is present in track’s metadata.',
  '%totaldiscs%': 'Index of total discs specified tracks belong to, within the album. Available only when "discnumber"/"disc" field is present in track’s metadata.',
  '%track artist%': 'Name of the artist of the track; present only if %album artist% is different than %artist% for specific track.',
  '%title%': 'Title of the track. If "title" metadata field is missing, file name is used instead.',
  '%tracknumber%': 'Two-digit index of specified track within the album. Available only when "tracknumber" field is present in track’s metadata. ' +
    'An extra \'0\' is placed in front of single digit track numbers (5 becomes 05).',
  '%track number%': 'Similar to %tracknumber%, however single digit track numbers are not reformatted to have an extra 0.',
  '%bitrate%': 'Bitrate of the track in kilobits per second.',
  '%channels%': 'Number of channels in the track, as text; either "mono", "stereo" for 1 or 2 channels, respectively, otherwise a number followed by "ch", e.g. "6ch".',
  '%codec%': 'Name of codec used to encode the track, e.g. PCM, FLAC, MP3, or AAC. If exact codec name is not available, file extension is used.',
  '%filesize%': 'The exact file size in bytes.',
  '%filesize_natural%': 'The approximate file size, automatically formatted in appropriate units such as megabytes or kilobytes, e.g. "8.49 MB"',
  '%length%': 'The length of the track formatted as hours, minutes, and seconds, rounded to the nearest second.',
  '%length_ex%': 'The length of the track formatted as hours, minutes, seconds, and milliseconds, rounded to the nearest millisecond.',
  '%length_seconds%': 'The length of the track in seconds, rounded to the nearest second.',
  '%length_seconds_fp%': 'The length of the track in seconds as a floating point number.',
  '%length_samples%': 'The length of the track in samples.',
  '%samplerate%': 'Sample rate of the track, in Hz.',
  '%replaygain_album_gain%': 'The ReplayGain album gain value.',
  '%replaygain_album_peak%': 'The ReplayGain album peak value.',
  '%replaygain_album_peak_db%': 'The ReplayGain album peak value in decibels.',
  '%replaygain_track_gain%': 'The ReplayGain track gain value.',
  '%replaygain_track_peak%': 'The ReplayGain track peak value.',
  '%replaygain_track_peak_db%': 'The ReplayGain track peak value in decibels.',
  '%filename%': 'The filename without directory and extension.',
  '%filename_ext%': 'The filename with extension, but without the directory.',
  '%directoryname%': 'The name of the parent directory only, not the complete path.',
  '%last_modified%': 'The date and time the file was last modified. Eg: 2005-12-22 00:04:10',
  '%path%': 'The complete path, including the filename and extension.',
  '%subsong%': 'The subsong index.',
  '%genre%': 'Genre as a comma separated list',

  // https://wiki.hydrogenaud.io/index.php?title=Foobar2000:Components/Playback_Statistics_v3.x_(foo_playcount)
  '%first_played%': 'Date/time at which the song was played for the first time.',
  '%last_played%': 'Date/time at which the song was played last time.',
  '%play_count%': 'How many times the song has been played.',
  '%played_per_day%': 'Estimate how many times per day the song has been played, based on time first played, time last played and times played.',
  '%added%': 'Date/time at which the song was added to the Media Library.',
  '%rating%': 'Song\'s rating, on a 1–5 scale.',
  '%rating_stars%': 'Song\'s rating, formatted as up to five stars, e.g. ★★★',
  '%rating_stars_fixed%': 'Song\'s rating, formatted as five stars, e.g. ★★★☆☆'
};

export const oneSideOperators: Set<string> = new Set(Object.values(OneSideOperator));
export const timeOperators: Set<string> = new Set(Object.values(TimeOperator));

export const valueOperators: Set<string> = new Set([
  ...Object.values(TextOperator),
  ...Object.values(OneSideOperator),
  ...Object.values(NumberOperator),
  ...Object.values(TimeOperator),
  'DURING LAST',
  'SORT BY',
  'SORT DESCENDING BY',
  'SECOND',
  'MINUTE',
  'HOUR',
  'DAY',
  'WEEK',
  'SECONDS',
  'MINUTES',
  'HOURS',
  'DAYS',
  'WEEKS'
]);

const functionNameRegex = /^\s*(\$\w+).*?$/;
export function findFieldDescription(field: string): string {
  const match = field.match(functionNameRegex);
  if (match === null) return fieldDescriptions[field] || '';

  return functionDescriptions[match[1]] || '';
}

function findFunctionDescription(fn: string): string | undefined {
  const match = fn.match(functionNameRegex);
  if (match === null) return;

  return functionDescriptions[match[1]];
}

type AutocompleteList = {
  list: Completion[],
  oldMatch?: string
};

type ApplyCompletion = (s: string) => string | undefined;
type GetEndFn = ({ begin, prefix, textNoPrefix }: { begin: string, prefix: string, textNoPrefix: string}) => string;

export const defaultGetEnd: GetEndFn = ({ begin, prefix }) => (begin + prefix).split('').reverse().join('');
export const createAutocompleteFunction = (
  matcher: RegExp,
  values: string[] | (() => string[]),
  type: string,
  documentation?: (s: string) => string | undefined,
  apply: ApplyCompletion = (_: string): string | undefined => undefined,
  getEnd: GetEndFn = defaultGetEnd
) => {
  function autocompleteFn(this: AutocompleteList, ctx: CompletionContext): CompletionResult | null {
    const actualValues = Array.isArray(values) ? values : values();
    if (actualValues.length === 0) return null;

    const textMatch = ctx.matchBefore(matcher);
    if (textMatch === null) return null;

    const match = textMatch.text.match(matcher);
    if (match === null) return null;
    const { begin = '', prefix = '', text: textNoPrefix } = match.groups as { begin?: string, prefix?: string, text: string };
    const text = prefix + textNoPrefix;

    if (!this.oldMatch || !text.startsWith(this.oldMatch)) {
      this.list = [];
    }

    let newList: Completion[] = [];

    if (this.list.length > 0 && Array.isArray(values)) {
      for (const completion of this.list) {
        if (completion.label.includes(textNoPrefix)) {
          newList.push(completion);
        }
      }
    } else {
      for (const val of actualValues) {
        if (val.includes(textNoPrefix)) {
          newList.push({
            label: val,
            type,
            apply: apply(val),
            info: documentation ? documentation(val) : undefined
          });
        }
      }
    }

    newList = newList.sort((a, b) => {
      if (a.label.startsWith(text)) return -1;
      if (b.label.startsWith(text)) return 1;

      return a.label > b.label ? -1 : 1;
    });

    if (newList.length === 0) return null;

    // If user has already set characters like quotes at the end of the string we
    // want to replace those.
    const replaceEnd = getEnd({ begin, prefix, textNoPrefix });
    const endCharacters = ctx.state.sliceDoc(ctx.pos, ctx.pos + replaceEnd.length);

    const from = textMatch.from + textMatch.text.length - (text.length + begin.length);
    let to = textMatch.to;

    if (replaceEnd === endCharacters) {
      to += replaceEnd.length;
    }

    this.list = newList;

    return {
      from,
      to,
      options: newList,
      filter: false
    };
  }

  autocompleteFn.list = [] as Completion[];
  autocompleteFn.oldMatch = undefined as string | undefined;

  return autocompleteFn;
};

export const functionRegex = /(?<begin>(")?)(?<prefix>\$)(?<text>(\w|[0-9_ (])+)/i;
export const fnGetEnd: GetEndFn = ({ begin }) => begin;
export const functionApplyCompletion: ApplyCompletion = (s: string) => `"${s}"`;
export const functionAutocomplete = (apply: ApplyCompletion = functionApplyCompletion, getEnd: GetEndFn = fnGetEnd) => createAutocompleteFunction(
  functionRegex,
  allFunctions,
  'function',
  findFunctionDescription,
  apply,
  getEnd
);

export const fieldRegex = /((?<begin>(")?)(?<prefix>%)(?<text>(\w|[0-9_ ])+))/i;
export const applyField = (s: string): string | undefined => / /.test(s) ? `"${s}"` : undefined;
export const fieldAutocomplete = (apply: ApplyCompletion = applyField, getEnd = defaultGetEnd) => createAutocompleteFunction(
  fieldRegex,
  fields,
  'variable',
  (field) => fieldDescriptions[field],
  apply,
  getEnd
);

const operatorRegex = /(?:^| )(?<text>[A-Z]+)/;
export const operatorAutocomplete = createAutocompleteFunction(
  operatorRegex,
  Array.from(valueOperators),
  'keyword',
  undefined,
  () => undefined
);

export const functionTooltip = hoverTooltip((view, pos) => {
  const { from, to, text } = view.state.doc.lineAt(pos);

  const match = text.match(functionRegex);
  if (!match) return null;

  const tooltip = functionDescriptions[match[1]];
  if (!tooltip) return null;

  return {
    pos: from,
    end: to,
    above: false,
    create() {
      const dom = document.createElement('div');
      dom.textContent = tooltip;
      return { dom };
    }
  };
});
