# Relase Notes

- v1.6.2 - House cleaning
  - remove AppCache since most browsers dropped support
  - move `uikit`, `bignumber.js` and `decimal.js` from bower
  - update raceday.me toast message
  - fix broken blogpost link
  - add relase notes document
  - update ff1 and runy version for compass (required for aple silicon)
- v1.6.1 - Goodbye server
  - move completely to amazon s3
  - update imprint
- v1.6.0 - Dark times ahead
  - add iOS 13 darkmode theme for raceday.me app
- v1.5.3 - Pretty wrong
  - prettier destroyed rootURL placeholder
  - extend manifest.json to prepare for desktop PWA
- v1.5.2 - A miss is as good as a mile

  This release fixes an issue that caused a wrong pace output under certain circumstances. A pace of `5` Minutes and `59.6` seconds was translated to `5:00` instead of `6:00`

  ### steps to reproduce:

  - open the pace calculator
  - set up a lenght of `5.04 km`

  #### min/km

  - set time to `0:20:98`
  - pace displayed `3:00 min/km` instead of `4`

  #### min/mi

  - set time to `0:18:46`
  - pace displayed `5:00 min/mi` instead of `6:00`

- v1.5.1 - Maintenance
  - change uikit repo specs
  - enable prettier
  - fix typo
- v1.5.0 - Willpower
  - add [willpower theme](https://truthmaker.willpower-running.com)
- v1.4.1 - The Colour and the Shape
  - fix white background color when opening imprint in dark mode
  - adjust border color in select layover
- v1.4.0 - Support your local iframe
  - minor color changes throughout the whole app
  - introducing new query parameters:
  - `embedded=true` will use the calculator in a embedded context and will hide specific elements like the menu and the donation button
  - `toolselector=false` will hide the tool selector. This is helpful if you only want to embed one of the tools and/or want to integrate your own tool selector menu
  - `logo=true|false` will hide the logo
- v1.3.3 - Big apple
  - add fullscreen support for iphone homescreen shortcuts
- v1.3.2 - Apply full throttle to the propaganda machine
  - remove dark mode release notes
  - add raceday.me hint and menu item
- v1.3.1 - Let's pretend it didn't happen
  - Change `Ruverter` to `Runverter`in the latest release notes
- v1.3.0 - Hello darkmode my old friend
  - introduce dark mode theme
  - update ember-cli from 2.12.1 to 3.0.0
  - minor ember package upgrades
  - remove travis ci image from README.md
- v1.2.3 - Get things straight
  - remove splits calculator release notes
  - specify bignumber.js version by tag
- v1.2.2 - Zero misunderstandings
  - use prepend mode for pace displayed in the splits (a pace of 5:08 was displayed as 5:80 instead)
- v1.2.1 - To the infinity loop and beyond
  - update bignumber.js to `v4.0.2` which fixes the iOS Safari infinity loop
  - enable splits calculator for iOS
  - use ember-cli native PhantomJS
- v1.2.0 - Split and run
  - add split time calculator
  - add donation button
  - update ember-cli from `2.11.0` to `2.12.1`
  - update ember-cli-deploy from `0.6.4` to `1.0.0`
  - minor bugfixes and structural changes behind the scenes
  - due to a [bug in Safari 10.1](https://bugs.webkit.org/show_bug.cgi?id=170264) which causes an infinite loop, I had to temporarily disable the spits calculator for all iOS devices
- v1.1.0 - Actually, it's a time machine
  - add race predictor
  - add homescreen app support for android devices
  - add flash messages to give context-sensitive user feedback
  - add possibility to delete local data on the imprint page
  - update ember-cli from `2.9.1` to `2.11.0`
  - minor bugfixes and structural changes behind the scenes
- v1.0.1 - Typos need to be fixed
  - Change `Lenght Converter` to `Length Converter`
- v1.0.0 - Heading to the starting block
  - Initial release of runverter.io. A detailed description is available in the [blog post](http://stefankracht.de/news/runverter).
