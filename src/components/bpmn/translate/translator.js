import translations from './zh-CN';

export default function translate(template, replacements) {
  // console.log(template, replacements)
  replacements = replacements || {};
  template = translations[template] || template;
  return template.replace(/{([^}]+)}/g, function(_, key) {
    return replacements[key] || '{' + key + '}';
  });
}
