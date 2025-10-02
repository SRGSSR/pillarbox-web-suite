## [@srgssr/pillarbox-playlist-v3.0.0](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/pillarbox-playlist-v2.2.0...@srgssr/pillarbox-playlist-v3.0.0) (2025-10-02)


### ⚠ BREAKING CHANGES

* **pillarbox-playlist:** plugin options for dialog/buttons configuration are no longer
passed through plugin options but via player root and controlBar options.

### New Features 🚀

* **pillarbox-playlist:** replace default buttons with custom svg-button components ([14ad1d5](https://github.com/SRGSSR/pillarbox-web-suite/commit/14ad1d5252c2961dfb0d75718fa460b2f1d8c534)), closes [#81](https://github.com/SRGSSR/pillarbox-web-suite/issues/81)


### Docs 📖

* add playlist item api documentation ([4dfec59](https://github.com/SRGSSR/pillarbox-web-suite/commit/4dfec59d5927c7ea3af82d89e72af17177d0f446)), closes [#77](https://github.com/SRGSSR/pillarbox-web-suite/issues/77)


### Chore 🧹

* change demo oututdir ([96086d2](https://github.com/SRGSSR/pillarbox-web-suite/commit/96086d2e484833280004b3bacf713823482722a3))
* use camel case for examples and documentation ([dbfa4fc](https://github.com/SRGSSR/pillarbox-web-suite/commit/dbfa4fc146b6037b8c761ca72dd9bad2e2ac9af1))

## [@srgssr/pillarbox-playlist-v2.2.0](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/pillarbox-playlist-v2.1.0...@srgssr/pillarbox-playlist-v2.2.0) (2025-05-02)


### New Features 🚀

* add umd build for all remaining packages ([1d33c8a](https://github.com/SRGSSR/pillarbox-web-suite/commit/1d33c8a40d4a79a80aecaf8d7244cea334b83f9f))


### Chore 🧹

* **playlist-plugin:** use dynamic repeat mode length in toggle calculation ([8d5daf4](https://github.com/SRGSSR/pillarbox-web-suite/commit/8d5daf40dcdbec971118f4506eb5676bc390b892))

## [@srgssr/pillarbox-playlist-v2.1.0](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/pillarbox-playlist-v2.0.1...@srgssr/pillarbox-playlist-v2.1.0) (2024-10-22)


### New Features 🚀

* bidirectional looping when repeat all is enabled ([0674a4e](https://github.com/SRGSSR/pillarbox-web-suite/commit/0674a4ef66fa6b5995d0766966ed932c3ffa8db7)), closes [#32](https://github.com/SRGSSR/pillarbox-web-suite/issues/32)

## [@srgssr/pillarbox-playlist-v2.0.1](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/pillarbox-playlist-v2.0.0...@srgssr/pillarbox-playlist-v2.0.1) (2024-08-29)


### Enhancements and Bug Fixes 🐛

* **playlist-plugin:** expose playlist plugin version ([0b57214](https://github.com/SRGSSR/pillarbox-web-suite/commit/0b57214e4432525350c6e50701504d6c5d0207e6))

## [@srgssr/pillarbox-playlist-v2.0.0](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/pillarbox-playlist-v1.3.0...@srgssr/pillarbox-playlist-v2.0.0) (2024-08-08)


### ⚠ BREAKING CHANGES

* **playlist-plugin:** - Changed the API to toggle the repeat mode and the initialization options.
- The repeat mode is no longer a boolean. It is now a number representing each mode (0: no repeat,
  1: repeat all, 2: repeat one).

### Docs 📖

* correct type reference for button component ([57abd71](https://github.com/SRGSSR/pillarbox-web-suite/commit/57abd7169018e07b70f4ba06e1f81d68b3d93e7c))


### New Features 🚀

* **playlist-plugin:** introduce repeat one mode ([a76840c](https://github.com/SRGSSR/pillarbox-web-suite/commit/a76840c671d9cbfab579a97513968d3b0cc0cb33))

## [@srgssr/pillarbox-playlist-v1.3.0](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/pillarbox-playlist-v1.2.1...@srgssr/pillarbox-playlist-v1.3.0) (2024-07-12)


### New Features 🚀

* **playlist-plugin:** enhance configuration options for playlist modal ([78275d8](https://github.com/SRGSSR/pillarbox-web-suite/commit/78275d8e7cbf1bc10171dca2d0ffe64efaab2734)), closes [#16](https://github.com/SRGSSR/pillarbox-web-suite/issues/16)


### Docs 📖

* changed homepage in package json ([0020f92](https://github.com/SRGSSR/pillarbox-web-suite/commit/0020f92f5db6d4f0b0439e6dfa4e9ef93c3d14d5))
* fix quick start link ([82de85e](https://github.com/SRGSSR/pillarbox-web-suite/commit/82de85e6b37a072d9c8f1b836e89a9b947fd1c80))

## [@srgssr/pillarbox-playlist-v1.2.1](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/pillarbox-playlist-v1.2.0...@srgssr/pillarbox-playlist-v1.2.1) (2024-07-02)


### Enhancements and Bug Fixes 🐛

* publish pillarbox-suite to npm ([74e7ada](https://github.com/SRGSSR/pillarbox-web-suite/commit/74e7ada804bfe7a76b0972af859f57ebd2dc1270))

## [@srgssr/pillarbox-playlist-v1.2.0](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/pillarbox-playlist-v1.1.1...@srgssr/pillarbox-playlist-v1.2.0) (2024-06-21)


### New Features 🚀

* **playlist-plugin:** implement smart navigation based on playback position ([4cf92de](https://github.com/SRGSSR/pillarbox-web-suite/commit/4cf92decd4d8810ee55be183902686083115ce69)), closes [#17](https://github.com/SRGSSR/pillarbox-web-suite/issues/17)

## [@srgssr/pillarbox-playlist-v1.1.1](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/pillarbox-playlist-v1.1.0...@srgssr/pillarbox-playlist-v1.1.1) (2024-06-10)


### Enhancements and Bug Fixes 🐛

* preserve default options when adding new translations ([2efcfd1](https://github.com/SRGSSR/pillarbox-web-suite/commit/2efcfd1dbbe82f12f9f6beae65148e89e8597eae))

## [@srgssr/pillarbox-playlist-v1.1.0](https://github.com/SRGSSR/pillarbox-web-suite/compare/@srgssr/pillarbox-playlist-v1.0.0...@srgssr/pillarbox-playlist-v1.1.0) (2024-06-06)


### New Features 🚀

* **playlist-plugin:** add reverse and sort functionality ([a1a37b8](https://github.com/SRGSSR/pillarbox-web-suite/commit/a1a37b82ab0b2eaac6549206da3d04fffe7c3b8f)), closes [#18](https://github.com/SRGSSR/pillarbox-web-suite/issues/18)


### Docs 📖

* css and events documentation ([9526479](https://github.com/SRGSSR/pillarbox-web-suite/commit/9526479dfe3a8e6f21066be35db037fd1e971377))

## @srgssr/pillarbox-playlist-v1.0.0 (2024-05-28)


### Chore 🧹

* **ci:** configure semantic release workflow ([c9a57d8](https://github.com/SRGSSR/pillarbox-web-suite/commit/c9a57d83d04e9b80560cb080a2d5135959237d94)), closes [#11](https://github.com/SRGSSR/pillarbox-web-suite/issues/11)
* enhance create script and add tests ([fa2b4c6](https://github.com/SRGSSR/pillarbox-web-suite/commit/fa2b4c6392655506875efdd0bf48f85e723ed555))


### New Features 🚀

* add playlist management plugin to pillarbox player ([54520dc](https://github.com/SRGSSR/pillarbox-web-suite/commit/54520dc587384b1fb6e893006b799e1db728f3af))
* **playlist:** add optional ui for the playlist plugin ([2ef6647](https://github.com/SRGSSR/pillarbox-web-suite/commit/2ef6647bad14ab1d34215464191b1b1e0c63f838)), closes [#8](https://github.com/SRGSSR/pillarbox-web-suite/issues/8)
