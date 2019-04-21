# Samplr
Samplr is a website that uses the Web Audio API to allow users to make their own music.


## Installation 

Clone or [download](https://github.com/treykris/samplr/archive/master.zip) the repository.

Run the following commands below to install Samplr:

(Must have Node.js installed)

```
$ git clone https://github.com/treykris/samplr.git
$ cd samplr
$ npm install
```


## Build

```
$ npm run build
```

to watch files run:

```
$ npm run watch
```

The webpack configuration is set to production. To set it to development mode open up the webpack.config.js and change the property "mode" to "development". It is also recommended to use a source map that is better suited for development. You can find more information about using source maps [here](https://webpack.js.org/guides/development/#using-source-maps).


## Recommended Usage
Samplr was designed with practice of sampling and resampling to build a song. First record a loop, download it, and then load it back into the program. Continually doing this gives users the ability to build full fledge songs in the browser.

Inspirations for this project: Maschine, SP404, Akai MPC

