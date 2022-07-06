# Spis Sekcji JBwA i tag-grupek

The database containing almost complete list of Facebook groups belonging to one of the most popular polish internet community.

## Stack

* Nuxt
* Vue
* Quasar
* Firebase

## Setup

To setup your custom development environment, modify the runtimeConfig object in nuxt.config.ts file to fit your needs.

1. `git clone https://github.com/Mensix/spis-sekcji-next.git`
2. `cd spis-sekcji-next`
3. `npm install`
4. `npm run dev`

## Important

The code has been rewritten to ground, with switching to Nuxt 3 and its ecosystem (including TypeScript support). There are some still things to be done, but they don't affect user experience that much:
- prevent from sending forms (submissions, editing group dialog) when validation error occurs
- think of splitting long lines of code

## License

[MIT](https://choosealicense.com/licenses/mit/)
