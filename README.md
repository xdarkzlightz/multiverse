# Multiverse

Multiverse is web app for managing and creating instant dev environments using docker and [code-server](https://github.com/cdr/code-server)

## Installation

#### Environment Variables

PASSWORD (Default - password)
HOST (Default - 0.0.0.0)
PORT (Default - 3000)

### Docker - Recommended

To make installation easy here's a one liner. Replace MyPassword with your password.
In order for multiverse to create and manage code-server instances a volume needs to be created for your docker.sock

`docker run -it -e PASSWORD="MyPassword" -v /var/run/docker.sock:/var/run/docker.sock xdarkzlightz/multiverse`

### Manual (Linux)

To manually install you'll need either `yarn` or `npm` and `node 8+`

Clone the project with git and cd into it

`git clone https://github.com/xdarkzlightz/multiverse.git && cd multiverse`

Install server dependencies

`yarn --production` or `npm install --production`

Install client dependencies

`yarn --cwd "src/client" --production` or `npm --prefix "src/client" install --production`

Make a production build

`yarn --cwd "src/client" build` or `npm --prefix "src/client" build`

Start the app

`yarn start` or `npm start`

## Screenshots

![Home Page](https://i.ibb.co/bK7Rqg6/2019-07-08-052735-1360x768-scrot.png)
![Form Filled](https://i.ibb.co/whD2JTN/2019-07-07-232410-1360x768-scrot.png)
![Form Empty](https://i.ibb.co/p21rsZF/2019-07-08-053043-1360x768-scrot.png)

## Roadmap

- [ ] Default user extensions
- [ ] Default user settings
- [ ] Instant setup for different languages
- [ ] Git support (Setting up projects from git repos)
- [ ] Project generation
- [ ] Custom setups
