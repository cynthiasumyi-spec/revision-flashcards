/**
 * Mixed topic — original P.6 revision set.
 * Themes cross the course, but the phrases and sentence stems are not copied
 * from Unit 1–4 or Dictation 3.
 * Illustrations are existing irasutoya files already in the repo.
 */
window.PRACTICE_MIXED = {
  id: 'mixed',
  title: 'Mixed topic',
  words: [
    { key: 'mixed:care-home', form: 'verb', en: 'call on the care home', zh: '探望護老院', img: '../unit1/thumb_10.png' },
    { key: 'mixed:heatwave', form: 'noun', en: 'a heatwave', zh: '熱浪', img: '../unit2/thumb_01.png' },
    { key: 'mixed:pouring-rain', form: 'noun', en: 'pouring rain', zh: '傾盆大雨', img: '../unit2/thumb_03.png' },
    { key: 'mixed:simmer', form: 'verb', en: 'simmer the soup', zh: '用小火煲湯', img: '../unit3/thumb_10.png' },
    { key: 'mixed:slice', form: 'verb', en: 'slice the carrots', zh: '把紅蘿蔔切片', img: '../unit3/thumb_02.png' },
    { key: 'mixed:cartoon', form: 'noun', en: 'a cartoon', zh: '卡通片', img: '../dictation3/thumb_02.png' },
    { key: 'mixed:quiet-mouse', form: 'idiom', en: 'as quiet as a mouse', zh: '安靜得像老鼠', img: '../dictation3/thumb_09.png' },
    { key: 'mixed:left-out', form: 'verb', en: 'feel left out', zh: '感到被冷落', img: '../unit4/thumb_09.png' },
    { key: 'mixed:wise-words', form: 'verb', en: 'share wise words', zh: '分享智慧的話', img: '../unit4/thumb_14.png' },
    { key: 'mixed:bandage', form: 'verb', en: 'bandage a wound', zh: '包紮傷口', img: '../unit2/thumb_10.png' }
  ],

  fillIn: [
    {
      id: 'mx-f1',
      wordKey: 'mixed:care-home',
      sentence: 'After school the class takes oranges to the place where grandparents live and they ______.',
      blank: '______',
      options: ['call on the care home', 'simmer the soup', 'a cartoon', 'bandage a wound'],
      answer: 'call on the care home',
      accept: ['call on the care home'],
      explain: 'Going to the place where grandparents live is to call on the care home (探望護老院).'
    },
    {
      id: 'mx-f2',
      wordKey: 'mixed:heatwave',
      sentence: 'The playground is closed because the air is like an oven and there is ______.',
      blank: '______',
      options: ['a heatwave', 'pouring rain', 'a cartoon', 'as quiet as a mouse'],
      answer: 'a heatwave',
      accept: ['a heatwave'],
      explain: 'Air like an oven means a heatwave (熱浪), not rain.'
    },
    {
      id: 'mx-f3',
      wordKey: 'mixed:pouring-rain',
      sentence: 'The picnic stops when water streams down the windows and there is ______.',
      blank: '______',
      options: ['pouring rain', 'a heatwave', 'slice the carrots', 'share wise words'],
      answer: 'pouring rain',
      accept: ['pouring rain'],
      explain: 'Water streaming down the windows means pouring rain (傾盆大雨).'
    },
    {
      id: 'mx-f4',
      wordKey: 'mixed:simmer',
      sentence: 'Turn the stove to low and ______ so the vegetables stay soft.',
      blank: '______',
      options: ['simmer the soup', 'slice the carrots', 'call on the care home', 'feel left out'],
      answer: 'simmer the soup',
      accept: ['simmer the soup'],
      explain: 'A low stove and soft vegetables mean you simmer the soup (用小火煲湯).'
    },
    {
      id: 'mx-f5',
      wordKey: 'mixed:slice',
      sentence: 'Use a knife to cut the orange vegetables into thin rounds and ______.',
      blank: '______',
      options: ['slice the carrots', 'simmer the soup', 'bandage a wound', 'a cartoon'],
      answer: 'slice the carrots',
      accept: ['slice the carrots'],
      explain: 'Thin rounds of the orange vegetable means you slice the carrots (把紅蘿蔔切片).'
    },
    {
      id: 'mx-f6',
      wordKey: 'mixed:cartoon',
      sentence: 'On Friday the class watches ______ about a cat that can talk.',
      blank: '______',
      options: ['a cartoon', 'pouring rain', 'a heatwave', 'as quiet as a mouse'],
      answer: 'a cartoon',
      accept: ['a cartoon'],
      explain: 'A film about a talking cat is a cartoon (卡通片).'
    },
    {
      id: 'mx-f7',
      wordKey: 'mixed:quiet-mouse',
      sentence: 'In the library everyone must be ______ so the readers are not disturbed.',
      blank: '______',
      options: ['as quiet as a mouse', 'feel left out', 'pouring rain', 'share wise words'],
      answer: 'as quiet as a mouse',
      accept: ['as quiet as a mouse'],
      explain: 'A library needs silence, so people are as quiet as a mouse (安靜得像老鼠).'
    },
    {
      id: 'mx-f8',
      wordKey: 'mixed:left-out',
      sentence: 'Nobody passes the ball to May, so she starts to ______.',
      blank: '______',
      options: ['feel left out', 'share wise words', 'bandage a wound', 'simmer the soup'],
      answer: 'feel left out',
      accept: ['feel left out'],
      explain: 'When the team ignores May, she will feel left out (感到被冷落).'
    },
    {
      id: 'mx-f9',
      wordKey: 'mixed:wise-words',
      sentence: 'Grandfather sits with the children and likes to ______ when they ask for help.',
      blank: '______',
      options: ['share wise words', 'slice the carrots', 'a cartoon', 'call on the care home'],
      answer: 'share wise words',
      accept: ['share wise words'],
      explain: 'Helpful advice from grandfather is to share wise words (分享智慧的話).'
    },
    {
      id: 'mx-f10',
      wordKey: 'mixed:bandage',
      sentence: 'Ken cuts his finger in class, so the monitor uses a clean cloth to ______.',
      blank: '______',
      options: ['bandage a wound', 'simmer the soup', 'feel left out', 'a heatwave'],
      answer: 'bandage a wound',
      accept: ['bandage a wound'],
      explain: 'A clean cloth on a cut is to bandage a wound (包紮傷口).'
    }
  ],

  fillInHard: [
    {
      id: 'mx-h1',
      wordKey: 'mixed:care-home',
      sentence: 'The home which looks after grandparents hopes that our class will ______ so that the residents have visitors before the holidays.',
      blank: '______',
      answer: 'call on the care home',
      accept: ['call on the care home'],
      explain: 'Residents who need visitors want the class to call on the care home (探望護老院).'
    },
    {
      id: 'mx-h2',
      wordKey: 'mixed:heatwave',
      sentence: 'Although the children wanted to run outside, the teacher kept them in the hall because there was ______ and the playground felt like an oven.',
      blank: '______',
      answer: 'a heatwave',
      accept: ['a heatwave'],
      explain: 'Although marks a contrast, and an oven-like playground is a heatwave (熱浪).'
    },
    {
      id: 'mx-h3',
      wordKey: 'mixed:pouring-rain',
      sentence: 'The match which was planned for the field had to stop so that nobody slipped when there was ______.',
      blank: '______',
      answer: 'pouring rain',
      accept: ['pouring rain'],
      explain: 'A field match stops for safety when there is pouring rain (傾盆大雨).'
    },
    {
      id: 'mx-h4',
      wordKey: 'mixed:simmer',
      sentence: 'After you have washed the pot, turn the heat down and ______ so that the vegetables do not burn.',
      blank: '______',
      answer: 'simmer the soup',
      accept: ['simmer the soup'],
      explain: 'Low heat after washing the pot means you simmer the soup (用小火煲湯).'
    },
    {
      id: 'mx-h5',
      wordKey: 'mixed:slice',
      sentence: 'The cook who is preparing lunch asks you to ______ before the orange vegetables go into the pot.',
      blank: '______',
      answer: 'slice the carrots',
      accept: ['slice the carrots'],
      explain: 'The cook wants the orange vegetables cut, so you slice the carrots (把紅蘿蔔切片).'
    },
    {
      id: 'mx-h6',
      wordKey: 'mixed:cartoon',
      sentence: 'The film which the teacher chose for Friday is ______, and the cat in it can talk.',
      blank: '______',
      answer: 'a cartoon',
      accept: ['a cartoon'],
      explain: 'Which points to the film, and a talking cat makes it a cartoon (卡通片).'
    },
    {
      id: 'mx-h7',
      wordKey: 'mixed:quiet-mouse',
      sentence: 'Although the hall is full of pupils, everyone must be ______ so that the speaker can be heard.',
      blank: '______',
      answer: 'as quiet as a mouse',
      accept: ['as quiet as a mouse'],
      explain: 'Although the hall is full, the speaker still needs everyone as quiet as a mouse (安靜得像老鼠).'
    },
    {
      id: 'mx-h8',
      wordKey: 'mixed:left-out',
      sentence: 'The girl who watches from the side of the court starts to ______ because nobody passes her the ball.',
      blank: '______',
      answer: 'feel left out',
      accept: ['feel left out'],
      explain: 'Who watches from the side and is ignored will feel left out (感到被冷落).'
    },
    {
      id: 'mx-h9',
      wordKey: 'mixed:wise-words',
      sentence: 'The grandfather who has read many stories likes to ______ whenever the children ask him for help.',
      blank: '______',
      answer: 'share wise words',
      accept: ['share wise words'],
      explain: 'A grandfather who helps with stories likes to share wise words (分享智慧的話).'
    },
    {
      id: 'mx-h10',
      wordKey: 'mixed:bandage',
      sentence: 'If a classmate cuts a finger during art, you should ______ before you call the office.',
      blank: '______',
      answer: 'bandage a wound',
      accept: ['bandage a wound'],
      explain: 'If introduces the cut, and the first help is to bandage a wound (包紮傷口).'
    }
  ],

  missingLetters: [
    { id: 'mx-m1', wordKey: 'mixed:care-home', word: 'call on the care home' },
    { id: 'mx-m2', wordKey: 'mixed:heatwave', word: 'a heatwave' },
    { id: 'mx-m3', wordKey: 'mixed:pouring-rain', word: 'pouring rain' },
    { id: 'mx-m4', wordKey: 'mixed:simmer', word: 'simmer the soup' },
    { id: 'mx-m5', wordKey: 'mixed:slice', word: 'slice the carrots' },
    { id: 'mx-m6', wordKey: 'mixed:cartoon', word: 'a cartoon' },
    { id: 'mx-m7', wordKey: 'mixed:quiet-mouse', word: 'as quiet as a mouse' },
    { id: 'mx-m8', wordKey: 'mixed:left-out', word: 'feel left out' },
    { id: 'mx-m9', wordKey: 'mixed:wise-words', word: 'share wise words' },
    { id: 'mx-m10', wordKey: 'mixed:bandage', word: 'bandage a wound' }
  ],

  matching: [
    { id: 'mx-k1', wordKey: 'mixed:care-home', en: 'call on the care home', zh: '探望護老院', form: 'verb', img: '../unit1/thumb_10.png' },
    { id: 'mx-k2', wordKey: 'mixed:heatwave', en: 'a heatwave', zh: '熱浪', form: 'noun', img: '../unit2/thumb_01.png' },
    { id: 'mx-k3', wordKey: 'mixed:pouring-rain', en: 'pouring rain', zh: '傾盆大雨', form: 'noun', img: '../unit2/thumb_03.png' },
    { id: 'mx-k4', wordKey: 'mixed:simmer', en: 'simmer the soup', zh: '用小火煲湯', form: 'verb', img: '../unit3/thumb_10.png' },
    { id: 'mx-k5', wordKey: 'mixed:slice', en: 'slice the carrots', zh: '把紅蘿蔔切片', form: 'verb', img: '../unit3/thumb_02.png' },
    { id: 'mx-k6', wordKey: 'mixed:cartoon', en: 'a cartoon', zh: '卡通片', form: 'noun', img: '../dictation3/thumb_02.png' },
    { id: 'mx-k7', wordKey: 'mixed:quiet-mouse', en: 'as quiet as a mouse', zh: '安靜得像老鼠', form: 'idiom', img: '../dictation3/thumb_09.png' },
    { id: 'mx-k8', wordKey: 'mixed:left-out', en: 'feel left out', zh: '感到被冷落', form: 'verb', img: '../unit4/thumb_09.png' },
    { id: 'mx-k9', wordKey: 'mixed:wise-words', en: 'share wise words', zh: '分享智慧的話', form: 'verb', img: '../unit4/thumb_14.png' },
    { id: 'mx-k10', wordKey: 'mixed:bandage', en: 'bandage a wound', zh: '包紮傷口', form: 'verb', img: '../unit2/thumb_10.png' }
  ]
};
