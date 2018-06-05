var survivAddon = function ({name, desc, version, code}) {
  this = {
    name: name,
    desc: desc,
    version: version,
    run: code
  };

  window[name] = this;

  return this;
}
