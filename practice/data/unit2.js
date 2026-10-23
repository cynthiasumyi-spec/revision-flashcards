/**
 * Unit 2 · Lend a helping hand — practice data
 * Vocab from unit2/index.html CARDS
 */
window.PRACTICE_UNIT2 = {
  id: "unit2",
  title: "Unit 2 · Lend a helping hand",
  words: [
    { key: "unit2:drought", form: "noun", en: "a drought", zh: "旱災", audio: "../unit2/audio/audio_01.mp3", img: "../unit2/thumb_01.png" },
    { key: "unit2:earthquake", form: "noun", en: "an earthquake", zh: "地震", audio: "../unit2/audio/audio_02.mp3", img: "../unit2/thumb_02.jpg" },
    { key: "unit2:flood", form: "noun", en: "a flood", zh: "水災", audio: "../unit2/audio/audio_03.mp3", img: "../unit2/thumb_03.png" },
    { key: "unit2:landslip", form: "noun", en: "a landslip", zh: "山泥傾瀉", audio: "../unit2/audio/audio_04.mp3", img: "../unit2/thumb_04.png" },
    { key: "unit2:tsunami", form: "noun", en: "a tsunami", zh: "海嘯", audio: "../unit2/audio/audio_05.mp3", img: "../unit2/thumb_05.jpg" },
    { key: "unit2:typhoon", form: "noun", en: "a typhoon", zh: "颱風", audio: "../unit2/audio/audio_06.mp3", img: "../unit2/thumb_06.jpg" },
    { key: "unit2:block", form: "verb", en: "block roads", zh: "堵塞道路", audio: "../unit2/audio/audio_07.mp3", img: "../unit2/thumb_07.png" },
    { key: "unit2:damage", form: "verb", en: "damage crops", zh: "損毀農作物", audio: "../unit2/audio/audio_08.mp3", img: "../unit2/thumb_08.png" },
    { key: "unit2:destroy", form: "verb", en: "destroy buildings", zh: "摧毀建築物", audio: "../unit2/audio/audio_09.mp3", img: "../unit2/thumb_09.jpg" },
    { key: "unit2:injure", form: "verb", en: "injure people", zh: "使人受傷", audio: "../unit2/audio/audio_10.mp3", img: "../unit2/thumb_10.jpg" },
  ],

  fillIn: [
    {
      id: "u2-f1",
      wordKey: "unit2:drought",
      sentence: "The farmers worry about ______ this year.",
      blank: '______',
      options: ["a drought", "an earthquake", "a flood", "a landslip"],
      answer: "a drought",
      accept: ["a drought"]
    },
    {
      id: "u2-f2",
      wordKey: "unit2:earthquake",
      sentence: "People felt the ground shake during ______.",
      blank: '______',
      options: ["an earthquake", "a drought", "a flood", "a landslip"],
      answer: "an earthquake",
      accept: ["an earthquake"]
    },
    {
      id: "u2-f3",
      wordKey: "unit2:flood",
      sentence: "Heavy rain caused ______ in the village.",
      blank: '______',
      options: ["a flood", "a drought", "an earthquake", "a landslip"],
      answer: "a flood",
      accept: ["a flood"]
    },
    {
      id: "u2-f4",
      wordKey: "unit2:landslip",
      sentence: "The hillside fell after ______.",
      blank: '______',
      options: ["a landslip", "a drought", "an earthquake", "a flood"],
      answer: "a landslip",
      accept: ["a landslip"]
    },
    {
      id: "u2-f5",
      wordKey: "unit2:tsunami",
      sentence: "Huge waves hit the coast in ______.",
      blank: '______',
      options: ["a tsunami", "a drought", "an earthquake", "a flood"],
      answer: "a tsunami",
      accept: ["a tsunami"]
    },
    {
      id: "u2-f6",
      wordKey: "unit2:typhoon",
      sentence: "Schools close when there is ______.",
      blank: '______',
      options: ["a typhoon", "a drought", "an earthquake", "a flood"],
      answer: "a typhoon",
      accept: ["a typhoon"]
    },
    {
      id: "u2-f7",
      wordKey: "unit2:block",
      sentence: "Fallen trees can ______ after a storm.",
      blank: '______',
      options: ["block roads", "a drought", "an earthquake", "a flood"],
      answer: "block roads",
      accept: ["block roads"]
    },
    {
      id: "u2-f8",
      wordKey: "unit2:damage",
      sentence: "Strong winds may ______ in the fields.",
      blank: '______',
      options: ["damage crops", "a drought", "an earthquake", "a flood"],
      answer: "damage crops",
      accept: ["damage crops"]
    },
    {
      id: "u2-f9",
      wordKey: "unit2:destroy",
      sentence: "A big quake can ______ in the city.",
      blank: '______',
      options: ["destroy buildings", "a drought", "an earthquake", "a flood"],
      answer: "destroy buildings",
      accept: ["destroy buildings"]
    },
    {
      id: "u2-f10",
      wordKey: "unit2:injure",
      sentence: "Broken glass can ______ in an accident.",
      blank: '______',
      options: ["injure people", "a drought", "an earthquake", "a flood"],
      answer: "injure people",
      accept: ["injure people"]
    },
  ],

  fillInHard: [
    {
      id: "u2-h1",
      wordKey: "unit2:drought",
      sentence: "If there is so little rain for months, farmers who grow rice will face ______ so that their fields dry up.",
      blank: '______',
      answer: "a drought",
      accept: ["a drought"]
    },
    {
      id: "u2-h2",
      wordKey: "unit2:earthquake",
      sentence: "If the ground shakes so much, people who live in tall flats must leave quickly during ______.",
      blank: '______',
      answer: "an earthquake",
      accept: ["an earthquake"]
    },
    {
      id: "u2-h3",
      wordKey: "unit2:flood",
      sentence: "Although sandbags are ready, so much rain can still cause ______ which covers the low streets.",
      blank: '______',
      answer: "a flood",
      accept: ["a flood"]
    },
    {
      id: "u2-h4",
      wordKey: "unit2:landslip",
      sentence: "If the soil becomes so soft after heavy rain, a hillside which is steep may cause ______.",
      blank: '______',
      answer: "a landslip",
      accept: ["a landslip"]
    },
    {
      id: "u2-h5",
      wordKey: "unit2:tsunami",
      sentence: "Although warning sirens ring, so many coastal towns which sit by the sea can still be hit by ______.",
      blank: '______',
      answer: "a tsunami",
      accept: ["a tsunami"]
    },
    {
      id: "u2-h6",
      wordKey: "unit2:typhoon",
      sentence: "If the wind becomes so strong, schools which have outdoor PE will close because of ______.",
      blank: '______',
      answer: "a typhoon",
      accept: ["a typhoon"]
    },
    {
      id: "u2-h7",
      wordKey: "unit2:block",
      sentence: "Fallen trees which lie across the street can ______ so that ambulances cannot pass.",
      blank: '______',
      answer: "block roads",
      accept: ["block roads"]
    },
    {
      id: "u2-h8",
      wordKey: "unit2:damage",
      sentence: "Strong winds which last for days may ______ so that farmers lose so much food.",
      blank: '______',
      answer: "damage crops",
      accept: ["damage crops"]
    },
    {
      id: "u2-h9",
      wordKey: "unit2:destroy",
      sentence: "If the quake is so powerful, it can ______ which people need for shelter.",
      blank: '______',
      answer: "destroy buildings",
      accept: ["destroy buildings"]
    },
    {
      id: "u2-h10",
      wordKey: "unit2:injure",
      sentence: "Broken glass which falls from windows can ______ so that helpers must move carefully.",
      blank: '______',
      answer: "injure people",
      accept: ["injure people"]
    },
  ],

  missingLetters: [
    { id: "u2-m1", wordKey: "unit2:drought", word: "drought", pattern: "dr__ght", audio: "../unit2/audio/audio_01.mp3" },
    { id: "u2-m2", wordKey: "unit2:earthquake", word: "earthquake", pattern: "e_rthq_ake", audio: "../unit2/audio/audio_02.mp3" },
    { id: "u2-m3", wordKey: "unit2:flood", word: "flood", pattern: "fl__d", audio: "../unit2/audio/audio_03.mp3" },
    { id: "u2-m4", wordKey: "unit2:landslip", word: "landslip", pattern: "l_ndsl_p", audio: "../unit2/audio/audio_04.mp3" },
    { id: "u2-m5", wordKey: "unit2:tsunami", word: "tsunami", pattern: "ts_n_mi", audio: "../unit2/audio/audio_05.mp3" },
    { id: "u2-m6", wordKey: "unit2:typhoon", word: "typhoon", pattern: "typh__n", audio: "../unit2/audio/audio_06.mp3" },
    { id: "u2-m7", wordKey: "unit2:block", word: "block", pattern: "bl_ck", audio: "../unit2/audio/audio_07.mp3" },
    { id: "u2-m8", wordKey: "unit2:damage", word: "damage", pattern: "d_m_ge", audio: "../unit2/audio/audio_08.mp3" },
    { id: "u2-m9", wordKey: "unit2:destroy", word: "destroy", pattern: "d_str_y", audio: "../unit2/audio/audio_09.mp3" },
    { id: "u2-m10", wordKey: "unit2:injure", word: "injure", pattern: "inj_re", audio: "../unit2/audio/audio_10.mp3" },
  ],

  matching: [
    { id: "u2-k1", wordKey: "unit2:drought", en: "a drought", zh: "旱災", img: "../unit2/thumb_01.png" },
    { id: "u2-k2", wordKey: "unit2:earthquake", en: "an earthquake", zh: "地震", img: "../unit2/thumb_02.jpg" },
    { id: "u2-k3", wordKey: "unit2:flood", en: "a flood", zh: "水災", img: "../unit2/thumb_03.png" },
    { id: "u2-k4", wordKey: "unit2:landslip", en: "a landslip", zh: "山泥傾瀉", img: "../unit2/thumb_04.png" },
    { id: "u2-k5", wordKey: "unit2:tsunami", en: "a tsunami", zh: "海嘯", img: "../unit2/thumb_05.jpg" },
    { id: "u2-k6", wordKey: "unit2:typhoon", en: "a typhoon", zh: "颱風", img: "../unit2/thumb_06.jpg" },
    { id: "u2-k7", wordKey: "unit2:block", en: "block roads", zh: "堵塞道路", img: "../unit2/thumb_07.png" },
    { id: "u2-k8", wordKey: "unit2:damage", en: "damage crops", zh: "損毀農作物", img: "../unit2/thumb_08.png" },
    { id: "u2-k9", wordKey: "unit2:destroy", en: "destroy buildings", zh: "摧毀建築物", img: "../unit2/thumb_09.jpg" },
    { id: "u2-k10", wordKey: "unit2:injure", en: "injure people", zh: "使人受傷", img: "../unit2/thumb_10.jpg" },
  ]
};
