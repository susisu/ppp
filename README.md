# ppp - package.json pretty printer
[![CI](https://github.com/susisu/ppp/workflows/CI/badge.svg)](https://github.com/susisu/ppp/actions?query=workflow%3ACI)

A package information viewer alternative to [`npm-view`](https://docs.npmjs.com/cli/view.html).

``` shell
npm i -g @susisu/ppp
```

## Usage
``` shell
# show package information on npm
ppp <pkg>
# or of a local one
ppp < package.json
```

### Options
- `-f, --include-field <name>`: Include an additional field. This option is repeatable. See [Configurations](#configurations) or `-h, --help` for the list of available field names.
- `-x, --exclude-field <name>`: Exclude a field. This option is repeatable.
- `-w, --wrap <int>`: Wrap output to the specified size. This overrides the setting of the [configurations file](#configurations).

### Configurations
You can place `~/.config/ppp/config.yaml` to customize output fields and text wrapping size. The default configurations are as follows:

``` yaml
fields:
  - name
  - version
  # - installed
  - description
  # - keywords
  - license
  - author
  # - maintainers
  - homepage
  # - npm
  # - repository
  # - tarball
  # - shasum
  # - module
  # - types
  - binaries
  - engines
  - os
  - cpu
  # - dependencies
  - peerDependencies
  # - optionalDependencies
  # - devDependencies
  - tags
wrap: 80
```

## License
[MIT License](http://opensource.org/licenses/mit-license.php)

## Author
Susisu ([GitHub](https://github.com/susisu), [Twitter](https://twitter.com/susisu2413))
