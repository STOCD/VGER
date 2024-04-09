/* Functions and variables shared across the API and app */
export const equipment_types_space = [
    'Ship Fore Weapon', 'Ship Aft Weapon', 'Ship Device', 'Hangar Bay', 'Experimental Weapon',
    'Ship Deflector Dish', 'Ship Secondary Deflector', 'Impulse Engine', 'Warp Engine',
    'Singularity Engine', 'Ship Shields', 'Ship Tactical Console', 'Ship Science Console',
    'Ship Engineering Console','Ship Weapon', 'Universal Console'
];

export const equipment_types_ground = [
    'Kit', 'Body Armor', 'EV Suit', 'Personal Shield', 'Ground Weapon', 'Ground Device', 'Kit Module'
];

export const costs = [
    '3k Zen', "Zen Bundle / Mudd's Market", 'Promo', 'Lockbox Ship', 'Phoenix', 'Event', 'Lifetime', 
    'Mission / Exchange / Specialization', 'Lobi Crystal'
];

export const rarities = ['Epic','Ultra Rare','Very Rare','Rare','Uncommon','Common'];

export const wikihttp = 'https://stowiki.net/wiki/';

export const filepath = 'Special:Redirect/file/';

export const image_path = wikihttp + filepath;

export const image_suffix = '_icon.png';

// cleans page name
export function compensate_name(text) {
    text = text.replaceAll('&#039;',"'");
    text = text.replaceAll('&amp;', '&');
    return text
}

// cleans item descriptions from wiki-specific format tags and replaces html tags
export function compensate_wiki_description(text) {
    if (text == '') {return text}
    else if (text == null) {return ''}
    if (text[0] == ':') {
        text = text.slice(1);
    }
    if (text[0] == ' ') {
        text = text.slice(1);
    }
    text = text.replaceAll('&lt;', '<').replaceAll('&gt;','>');
    text = text.replaceAll('{{ucfirst: ','').replaceAll('{{ucfirst:','');
    text = text.replaceAll('{{lc: ','').replaceAll('{{lc:','');
    text = text.replaceAll('{{','').replaceAll('}}','');
    text = text.replaceAll('&amp;','&').replaceAll('&#42;','*');
    text = text.replace(/^\*(?<line>.+?)(?=(\n)|$)/, '<ul><li>$<line></li></ul>');
    text = text.replaceAll(/::+?/g, ':');
    text = text.replaceAll('\n:*', '\n*');
    text = text.replaceAll(
        /(?<=(\n\*\*\*))(?<line>.+?)(?=(\n)|$)/g,
        '<ul><ul><ul><li>$<line></li></ul></ul></ul>'
    );
    text = text.replaceAll('\n***', '');
    text = text.replaceAll(
        /(?<=(\n\*\*))(?<line>.+?)(?=(\n)|$)/g,
        '<ul><ul><li>$<line></li></ul></ul>'
    );
    text = text.replaceAll('\n**', '');
    text = text.replaceAll(/(?<=(\n\*))(?<line>.+?)(?=(\n)|$)/g, '<ul><li>$<line></li></ul>');
    text = text.replaceAll('\n*', '');
    text = text.replaceAll(/\[\[(.*?\|)?(?<display>.*?)\]\]/g, '$<display>');
    text = text.replaceAll('[[','').replaceAll(']]','');
    text = text.replaceAll('&#39;',"'");
    text = text.replaceAll('&#039;',"'");
    text = text.replaceAll(/'''(?<bold>.*?)'''/g, '<b>$<bold></b>');
    text = text.replaceAll(/''(?<italic>.*?)''/g, '<i>$<italic></i>');
    text = text.replaceAll('&quot;','"');
    text = text.replaceAll('&#34;','"');
    text = text.replaceAll('\n:', '<br>');
    text = text.replaceAll('\n', '<br>');
    return text;
}


//replaces non url-safe characters with their url equivalents
export function compensate_url(text) {
    text = text.replaceAll(' ','_');
    text = text.replaceAll('/','_');
    text = text.replaceAll('%5F', '_');
    text = text.replaceAll('&amp;','&');
    text = text.replaceAll('&#38;','&');
    text = text.replaceAll('%C2%A0','_');
    text = text.replaceAll('%26%2339%3B','%27');
    text = text.replaceAll('%26%2334%3B','%22');
    text = text.replaceAll('"','%22');
    text = text.replaceAll('&quot;','%22');
    text = text.replaceAll('&#34;','%22');
    text = text.replaceAll("'",'%27');
    text = text.replaceAll('&#39;','%27');
    text = text.replaceAll('&#039;', '%27');
    text = text.replaceAll('&','%26');
    text = text.replaceAll(':', '%3A');
    text = text.replaceAll(' ','_');
    return text;
}