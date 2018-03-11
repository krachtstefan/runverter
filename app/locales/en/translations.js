export default {
  'meta' : {
    'title' : 'Runverter.io',
    'description' : 'The only running calculator you will ever need.'
  },
  'controlPanel' : {
    'switchLanguage' : 'Deutsche Version',
    'enableExpertMode' : 'Enable expert mode',
    'disableExpertMode' : 'Disable expert mode',
    'enableDarkMode' : 'Switch to dark theme',
    'disableDarkMode' : 'Switch to light theme',
    'share' : 'Share with your running crew',
    'shareThanks' : 'Thank you ♡',
    'learnMore' : 'Learn more about runverter',
    'feedback' : 'Tweet me your feedback',
    'imprint' : 'Imprint',
  },
  'tools' : {
    'pca' : {
      'name' : 'Pace Calculator',
      'label' : 'Hi! I\'m the',
      'description' : 'See which pace you need to finish a run in your desired time.',
      'distanceLabel' : 'Running a distance of',
      'timeLabel' : 'in',
      'paceLabel' : 'requires a pace of'
    },
    'pc' : {
      'name' : 'Pace Converter',
      'label' : 'You\'re using the',
      'description' : 'There a lots of ways to define a tempo. Here you have all in one place.',
      'minkmLabel' : 'A pace of',
      'minmiLabel' : 'or',
      'kmhLabel' : 'equals a speed of',
      'mihLabel' : 'or'
    },
    'lc' : {
      'name' : 'Length Converter',
      'label' : 'This is the',
      'description' : 'Here you can see the relation of all common length units. And yes, length matters.',
      'kmLabel' : 'A distance of',
      'miLabel' : 'equals a distance of',
      'mLabel' : 'or'
    },
    'rp' : {
      'name' : 'Race Predictor',
      'label' : 'Get ready for the',
      'description' : 'Use a previous race result to estimate an upcomming one.',
      'achievedDistanceLabel' : 'Running',
      'achievedTimeLabel' : 'in',
      'predictedDistanceLabel' : 'enables you to run a race of',
      'predictedTimeLabel' : 'in'
    },
    'sc' : {
      'name' : 'Split Time Calculator',
      'label' : 'Always use a',
      'description' : 'Cause never trust a GPS signal.',
      'distanceLabel' : 'Display splits for',
      'timeLabel' : 'in',
      'splitDistanceLabel' : 'with a split distance of',
      'splitStrategyLabel' : 'Race strategy should be',
      'evenSlopeLabel' : 'with the speed changing',
      'distanceHeader' : 'Distance',
      'timeHeader' : 'Time',
      'splitStrategies' : {
        '3' : '3% negative splits',
        '2' : '2% negative splits',
        '1' : '1% negative splits',
        '0' : 'even paced splits',
        '-1' : '1% positive splits',
        '-2' : '2% positive splits',
        '-3' : '3% positive splits'
      },
      'evenSlope' : {
        'false' : 'in the middle',
        'true' : 'gradually',
      }
    }
  },
  'flashMessages' : {
    'peterRiegelExlanation' : 'Please note that the race prediction is only suitable if both races are lasting between 3.5 minutes and 3 hours, 50 minutes.',
    'releaseNotesRacePredictor' : 'Good news you lovely runner. The race predictor has landed. Make sure to check it out &#9996;',
    'releaseNotesSplitsCalculator' : 'Just in time for race season: The split time calculator is ready and waiting for you &#9786;',
    'localstorageCleared' : 'All locally stored data have been flushed.',
    'noSplits' : 'Oooops. The selected run is shorter than the split distance. Please increase the run distance.',
    'donationMessage' : 'Hi there, good to see you! This tool is free and made from lots of spare time. If you like to motivate me, just <a target="_blank" href="https://paypal.me/stefankracht"><i class="fa fa-paypal" aria-hidden="true"></i> donate</a> me some <i class="fa fa-coffee" aria-hidden="true"></i> or tell your <i class="fa fa-twitter" aria-hidden="true"></i> and <i class="fa fa-facebook" aria-hidden="true"></i> about #runverter'
  },
  'metrics' : {
    'separator' : '.',
    'distance' : {
      'separator' : '.',
      'km' : 'km',
      'mi' : 'mi',
      'm' : 'm'
    },
    'tempo' : {
      'separator' : ':',
      'minkm' : 'min/km',
      'minmi' : 'min/mi',
      'kmh' : 'km/h',
      'mih' : 'mi/h',
    },
    'time' : {
      'separator' : ':',
      'hr' : 'h',
      'min' : 'min',
      'sec' : 'sec',
    }
  },
  'races' : {
    'label' : 'Select a race:',
    '10k' : '10k',
    'hm' : 'Half Marathon',
    'm' : 'Marathon',
    '50k' : '50k',
    '50m' : '50 Miles',
    '100k' : '100k',
    '100m' : '100 Miles',
  },
  'targetTimes' : {
    'label' : 'Select a time goal:',
    'sub23h' : 'sub 23:00',
    'sub22h' : 'sub 22:00',
    'sub21h' : 'sub 21:00',
    'sub20h' : 'sub 20:00',
    'sub19h' : 'sub 19:00',
    'sub18h' : 'sub 18:00',
    'sub15h' : 'sub 15:00',
    'sub14h' : 'sub 14:00',
    'sub13h' : 'sub 13:00',
    'sub12h' : 'sub 12:00',
    'sub11h' : 'sub 11:00',
    'sub10h' : 'sub 10:00',
    'sub9h' : 'sub 9:00',
    'sub8h' : 'sub 8:00',
    'sub7h' : 'sub 7:00',
    'sub6h' : 'sub 6:00',
    'sub5h' : 'sub 5:00',
    'sub4h30' : 'sub 4:30',
    'sub4h15' : 'sub 4:15',
    'sub4h' : 'sub 4:00',
    'sub3h45' : 'sub 3:45',
    'sub3h30' : 'sub 3:30',
    'sub3h15' : 'sub 3:15',
    'sub3h' : 'sub 3:00',
    'sub2h10' : 'sub 2:10',
    'sub2h' : 'sub 2:00',
    'sub1h50' : 'sub 1:50',
    'sub1h40' : 'sub 1:40',
    'sub1h30' : 'sub 1:30',
    'sub1h' : 'sub 1:00',
    'sub55' : 'sub 0:55',
    'sub50' : 'sub 0:50',
    'sub45' : 'sub 0:45',
    'sub40' : 'sub 0:40',
    'sub35' : 'sub 0:35',
  },
  'imprint' : {
    'about' : 'About',
    'aboutText' : 'Runverter.io is a pet project by <a href="https://twitter.com/stefan_kracht" target="_blank">Stefan Kracht</a>. Check out the <a href="http://stefankracht.de/news/runverter" target="_blank">detailed blog post</a> for more information.',
    'thanks' : 'Special thanks ♥',
    'thanksText' : 'This app is powered by <a href="http://emberjs.com/" target="_blank">Ember.js</a>. Most of the icons are from <a href="https://thenounproject.com/" target="_blank">The Noun Project</a> creators <a href="https://thenounproject.com/term/speech-bubble/358344/" target="_blank">lipi</a>, <a href="https://thenounproject.com/term/happy/350362/" target="_blank">Bernadette Little</a>, <a href="https://thenounproject.com/term/glasses/31753/" target="_blank">Simon Child</a>, <a href="https://thenounproject.com/term/share/375368/" target="_blank">Aysgl Avcu</a>, <a href="https://thenounproject.com/term/bookmark/660529/" target="_blank">Kimmi Studio</a> and <a href="https://thenounproject.com/term/information/222828/" target="_blank">Douglas Santos</a>.',
    'responsible' :'Responsible for the content',
    'responsibleText' :'Stefan Kracht<br />Hasencleverstraße 1<br />22111 Hamburg<br />',
    'disclaimer' :'Disclaimer blah blah...',
    'disclaimerText' :'I assume no liability or responsibility to any linked websites.<br />This website uses Google Analytics, a web analytics service provided by Google, Inc. (“Google”). Google Analytics uses cookies, which are text files placed on your computer, to help the website analyze how users use the site. The information generated by the cookie about your use of the website (including your IP address) will be transmitted to and stored by Google on servers in the United States. Google will use this information for the purpose of evaluating your use of the website, compiling reports on website activity for website operators and providing other services relating to website activity and internet usage. Google may also transfer this information to third parties where required to do so by law, or where such third parties process the information on Google’s behalf. Google will not associate your IP address with any other data held by Google. You may refuse the use of cookies by selecting the appropriate settings on your browser, however please note that if you do this you may not be able to use the full functionality of this website. By using this website, you consent to the processing of data about you by Google in the manner and for the purposes set out above.',
    'localstorage' : 'Local storage',
    'deleteData' : 'Flush all locally stored data'
  }
};
