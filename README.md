# ppp - package.json pretty printer
![](https://travis-ci.com/susisu/ppp.svg?branch=master)

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

### Configurations
You can place a configuration file at `~/.config/ppp/config.yml` to customize output fields and text wrapping size. The default configurations are as follows:

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
