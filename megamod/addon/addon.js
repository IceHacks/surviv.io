var survivAddon = function ({name, desc, version, code}) {
  This = {
    name: name,
    desc: desc,
    version: version,
    run: code
  };

  window[name] = This;

  return This;
}
