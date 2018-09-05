## eoshuffle

An attempt to make the EOS development environment much nicer.

## TODO:

* [ ] `eoshuffle create`
* [x] `eoshuffle compile`
* [x] `eoshuffle deploy`
* [ ] Create a migrations environment
* [ ] Modularize the code (i.e. it's a collection of commands right now)

Everything else

License: MIT

Ari Lerner

## CLI Documentation

### Create
To create a starter project from an `eoshuffle` template...

```
$ ./eoshuffle/bin/eoshuffle init [template name] [path/to/destination/folder]
```
_(tbd: make eoshuffle installable globally so user can use `eoshuffle init [template] [path]` from any location)_

 - `template name` is optional.  
   - If no `template name` is passed, `eoshuffle` will use the `default` template.
   - If a `template name` is provided, `eoshuffle` will retrieve the associated template.
   - available `templates` include:
     - `default` - an empty project
     - `coin` - a project with a basic coin contract
 
 - `path/to/destination/folder` is optional.  
   - If a `path` is not provided, `eoshuffle` will place your new project in the current directory.
   - If a `path` is provided, `eoshuffle` will place the template in the provided destination.

### Compile

_(coming soon)_

### Deploy

_(coming soon)_
