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

## Create
To create a template project...

```
$ eoshuffle init [template name] [path/to/destination/folder]
```

`template name` is optional.  
If no `template name` is passed, `eoshuffle` will use the `default` template.
If a `template name` is provided, `eoshuffle` will retrieve the associated template.
Possible templates include:
 - `default` - an empty project
 - `coin` - a project with a basic coin contract
 
`path/to/destination/folder` is optional.  
If a `path` is not provided, `eoshuffle` will place your new project in the current directory.
If a `path` is provided, `eoshuffle` will place the template in the provided destination.

## Compile

(coming soon)

## deploy

(coming soon)