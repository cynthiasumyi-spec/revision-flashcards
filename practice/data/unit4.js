/**
 * Unit 4 · Film magic — practice data
 * Vocab from unit4/index.html CARDS
 */
window.PRACTICE_UNIT4 = {
  id: "unit4",
  title: "Unit 4 · Film magic",
  words: [
    { key: "unit4:action", form: "noun", en: "an action film", zh: "動作片", audio: "../unit4/audio/audio_01.mp3", img: "../unit4/thumb_01.png" },
    { key: "unit4:comedy", form: "noun", en: "a comedy", zh: "喜劇", audio: "../unit4/audio/audio_02.mp3", img: "../unit4/thumb_02.png" },
    { key: "unit4:fantasy", form: "noun", en: "a fantasy film", zh: "奇幻片", audio: "../unit4/audio/audio_03.mp3", img: "../unit4/thumb_03.png" },
    { key: "unit4:horror", form: "noun", en: "a horror film", zh: "恐怖片", audio: "../unit4/audio/audio_04.mp3", img: "../unit4/thumb_04.png" },
    { key: "unit4:musical", form: "noun", en: "a musical", zh: "音樂劇／歌舞片", audio: "../unit4/audio/audio_05.mp3", img: "../unit4/thumb_05.png" },
    { key: "unit4:scifi", form: "noun", en: "a science fiction film", zh: "科幻片", audio: "../unit4/audio/audio_06.mp3", img: "../unit4/thumb_06.jpg" },
    { key: "unit4:cruel", form: "adjective", en: "cruel", zh: "殘忍的", audio: "../unit4/audio/audio_07.mp3", img: "../unit4/thumb_07.jpg" },
    { key: "unit4:curious", form: "adjective", en: "curious", zh: "好奇的", audio: "../unit4/audio/audio_08.mp3", img: "../unit4/thumb_08.png" },
    { key: "unit4:lonely", form: "adjective", en: "lonely", zh: "寂寞的", audio: "../unit4/audio/audio_09.mp3", img: "../unit4/thumb_09.png" },
    { key: "unit4:obedient", form: "adjective", en: "obedient", zh: "聽話的", audio: "../unit4/audio/audio_10.mp3", img: "../unit4/thumb_10.jpg" },
    { key: "unit4:selfish", form: "adjective", en: "selfish", zh: "自私的", audio: "../unit4/audio/audio_11.mp3", img: "../unit4/thumb_11.jpg" },
    { key: "unit4:timid", form: "adjective", en: "timid", zh: "膽小的", audio: "../unit4/audio/audio_12.mp3", img: "../unit4/thumb_12.png" },
    { key: "unit4:wicked", form: "adjective", en: "wicked", zh: "邪惡的", audio: "../unit4/audio/audio_13.mp3", img: "../unit4/thumb_13.png" },
    { key: "unit4:wise", form: "adjective", en: "wise", zh: "明智的／有智慧的", audio: "../unit4/audio/audio_14.mp3", img: "../unit4/thumb_14.png" },
  ],

  fillIn: [
    {
      id: "u4-f1",
      wordKey: "unit4:action",
      sentence: "Tom loves watching ______ with car chases, jumps, and fast fights.",
      blank: '______',
      options: ["an action film", "a comedy", "a musical", "a horror film"],
      answer: "an action film",
      accept: ["an action film"],
      explain: "Car chases and fast fights = an action film (\u52d5\u4f5c\u7247)."
    },
    {
      id: "u4-f2",
      wordKey: "unit4:comedy",
      sentence: "We laughed so hard at the funny jokes in ______ last night.",
      blank: '______',
      options: ["a comedy", "an action film", "a horror film", "a science fiction film"],
      answer: "a comedy",
      accept: ["a comedy"],
      explain: "Funny jokes that make you laugh = a comedy (\u559c\u5287)."
    },
    {
      id: "u4-f3",
      wordKey: "unit4:fantasy",
      sentence: "A talking dragon and a magic castle appear in ______.",
      blank: '______',
      options: ["a fantasy film", "an action film", "a comedy", "a horror film"],
      answer: "a fantasy film",
      accept: ["a fantasy film"],
      explain: "Dragons and magic = a fantasy film (\u5947\u5e7b\u7247)."
    },
    {
      id: "u4-f4",
      wordKey: "unit4:horror",
      sentence: "She covers her eyes because the spooky scenes in ______ scare her.",
      blank: '______',
      options: ["a horror film", "a comedy", "a musical", "an action film"],
      answer: "a horror film",
      accept: ["a horror film"],
      explain: "Spooky scary scenes = a horror film (\u6050\u6016\u7247)."
    },
    {
      id: "u4-f5",
      wordKey: "unit4:musical",
      sentence: "The actors sing and dance on stage in ______.",
      blank: '______',
      options: ["a musical", "an action film", "a horror film", "a science fiction film"],
      answer: "a musical",
      accept: ["a musical"],
      explain: "Singing and dancing on stage = a musical (\u97f3\u6a02\u5287\uff0f\u6b4c\u821e\u7247)."
    },
    {
      id: "u4-f6",
      wordKey: "unit4:scifi",
      sentence: "Robots travel to distant planets in space in ______.",
      blank: '______',
      options: ["a science fiction film", "a comedy", "a musical", "a horror film"],
      answer: "a science fiction film",
      accept: ["a science fiction film"],
      explain: "Robots and space planets = a science fiction film (\u79d1\u5e7b\u7247)."
    },
    {
      id: "u4-f7",
      wordKey: "unit4:cruel",
      sentence: "The villain who hurts the villagers on purpose is ______.",
      blank: '______',
      options: ["cruel", "curious", "lonely", "obedient"],
      answer: "cruel",
      accept: ["cruel"],
      explain: "Hurting others on purpose = cruel (\u6b98\u5fcd\u7684)."
    },
    {
      id: "u4-f8",
      wordKey: "unit4:curious",
      sentence: "The little boy asks so many questions because he is ______ about how magic works.",
      blank: '______',
      options: ["curious", "cruel", "selfish", "wicked"],
      answer: "curious",
      accept: ["curious"],
      explain: "Asking many questions to learn = curious (\u597d\u5947\u7684)."
    },
    {
      id: "u4-f9",
      wordKey: "unit4:lonely",
      sentence: "The lost puppy has no friends nearby and looks ______ in the empty park.",
      blank: '______',
      options: ["lonely", "obedient", "wise", "wicked"],
      answer: "lonely",
      accept: ["lonely"],
      explain: "No friends and empty park = lonely (\u5bc2\u5bde\u7684)."
    },
    {
      id: "u4-f10",
      wordKey: "unit4:obedient",
      sentence: "The dog is ______ and sits quietly at once when its owner says \u201cSit!\u201d",
      blank: '______',
      options: ["obedient", "cruel", "selfish", "wicked"],
      answer: "obedient",
      accept: ["obedient"],
      explain: "Listening and sitting when told = obedient (\u807d\u8a71\u7684)."
    },
    {
      id: "u4-f11",
      wordKey: "unit4:selfish",
      sentence: "A ______ person keeps all the snacks and will not share with anyone.",
      blank: '______',
      options: ["selfish", "curious", "obedient", "wise"],
      answer: "selfish",
      accept: ["selfish"],
      explain: "Keeping everything and not sharing = selfish (\u81ea\u79c1\u7684)."
    },
    {
      id: "u4-f12",
      wordKey: "unit4:timid",
      sentence: "The ______ rabbit hides behind a tree whenever it hears a tiny noise.",
      blank: '______',
      options: ["timid", "cruel", "wise", "selfish"],
      answer: "timid",
      accept: ["timid"],
      explain: "Hiding from tiny noises = timid (\u81bd\u5c0f\u7684)."
    },
    {
      id: "u4-f13",
      wordKey: "unit4:wicked",
      sentence: "The ______ witch plans a dark spell to hurt the whole village.",
      blank: '______',
      options: ["wicked", "curious", "lonely", "obedient"],
      answer: "wicked",
      accept: ["wicked"],
      explain: "Planning dark spells to hurt others = wicked (\u90aa\u60e1\u7684)."
    },
    {
      id: "u4-f14",
      wordKey: "unit4:wise",
      sentence: "The ______ king gives careful, good advice that helps his people.",
      blank: '______',
      options: ["wise", "cruel", "selfish", "timid"],
      answer: "wise",
      accept: ["wise"],
      explain: "Careful good advice = wise (\u660e\u667a\u7684\uff0f\u6709\u667a\u6167\u7684)."
    }
  ],

  fillInHard: [
    {
      id: "u4-h1",
      wordKey: "unit4:action",
      sentence: "Although the plot is simple, so many viewers who like car chases and fights still choose ______ at the weekend.",
      blank: '______',
      answer: "an action film",
      accept: ["an action film"],
      explain: "Car chases and fights = an action film (\u52d5\u4f5c\u7247)."
    },
    {
      id: "u4-h2",
      wordKey: "unit4:comedy",
      sentence: "Although school was hard that day, we watched ______ which made everyone laugh so much at the jokes.",
      blank: '______',
      answer: "a comedy",
      accept: ["a comedy"],
      explain: "Jokes that make everyone laugh = a comedy (\u559c\u5287)."
    },
    {
      id: "u4-h3",
      wordKey: "unit4:fantasy",
      sentence: "The review says the kingdom which has talking dragons and magic spells belongs in ______ rather than a real-life story.",
      blank: '______',
      answer: "a fantasy film",
      accept: ["a fantasy film"],
      explain: "Talking dragons and magic = a fantasy film (\u5947\u5e7b\u7247)."
    },
    {
      id: "u4-h4",
      wordKey: "unit4:horror",
      sentence: "Although Mum prefers gentle stories, my brother who loves spooky scary scenes still picks ______.",
      blank: '______',
      answer: "a horror film",
      accept: ["a horror film"],
      explain: "Spooky scary scenes = a horror film (\u6050\u6016\u7247)."
    },
    {
      id: "u4-h5",
      wordKey: "unit4:musical",
      sentence: "The show which is full of songs and dances on stage is ______ that our class wants to see again.",
      blank: '______',
      answer: "a musical",
      accept: ["a musical"],
      explain: "Songs and dances on stage = a musical (\u97f3\u6a02\u5287\uff0f\u6b4c\u821e\u7247)."
    },
    {
      id: "u4-h6",
      wordKey: "unit4:scifi",
      sentence: "Although the effects look new, the story which is about robots and space travel is still ______ at heart.",
      blank: '______',
      answer: "a science fiction film",
      accept: ["a science fiction film"],
      explain: "Robots and space travel = a science fiction film (\u79d1\u5e7b\u7247)."
    },
    {
      id: "u4-h7",
      wordKey: "unit4:cruel",
      sentence: "The king who punishes the villagers without reason is so ______ that nobody trusts him.",
      blank: '______',
      answer: "cruel",
      accept: ["cruel"],
      explain: "Punishing without reason = cruel (\u6b98\u5fcd\u7684)."
    },
    {
      id: "u4-h8",
      wordKey: "unit4:curious",
      sentence: "The girl who asks so many questions about the castle is ______, which helps her solve the mystery.",
      blank: '______',
      answer: "curious",
      accept: ["curious"],
      explain: "Asking many questions = curious (\u597d\u5947\u7684)."
    },
    {
      id: "u4-h9",
      wordKey: "unit4:lonely",
      sentence: "Although he lives in a busy city, the hero who has no friends still feels ______ every evening.",
      blank: '______',
      answer: "lonely",
      accept: ["lonely"],
      explain: "Having no friends = lonely (\u5bc2\u5bde\u7684)."
    },
    {
      id: "u4-h10",
      wordKey: "unit4:obedient",
      sentence: "The puppy which always listens when its owner says \u201cSit!\u201d is ______, so it learns tricks quickly.",
      blank: '______',
      answer: "obedient",
      accept: ["obedient"],
      explain: "Always listening to commands = obedient (\u807d\u8a71\u7684)."
    },
    {
      id: "u4-h11",
      wordKey: "unit4:selfish",
      sentence: "Although she has so much food, the princess who will not share any snacks is ______.",
      blank: '______',
      answer: "selfish",
      accept: ["selfish"],
      explain: "Not sharing what you have = selfish (\u81ea\u79c1\u7684)."
    },
    {
      id: "u4-h12",
      wordKey: "unit4:timid",
      sentence: "The rabbit which hides from every tiny noise is ______, although its friends are brave.",
      blank: '______',
      answer: "timid",
      accept: ["timid"],
      explain: "Hiding from every noise = timid (\u81bd\u5c0f\u7684)."
    },
    {
      id: "u4-h13",
      wordKey: "unit4:wicked",
      sentence: "The queen who casts dark spells to hurt others is ______, which makes the village live in fear.",
      blank: '______',
      answer: "wicked",
      accept: ["wicked"],
      explain: "Dark spells to hurt others = wicked (\u90aa\u60e1\u7684)."
    },
    {
      id: "u4-h14",
      wordKey: "unit4:wise",
      sentence: "The old man who gives careful good advice is ______, although he speaks softly.",
      blank: '______',
      answer: "wise",
      accept: ["wise"],
      explain: "Careful good advice = wise (\u660e\u667a\u7684)."
    }
  ],

  missingLetters: [
    { id: "u4-m1", wordKey: "unit4:action", word: "an action film", audio: "../unit4/audio/audio_01.mp3" },
    { id: "u4-m2", wordKey: "unit4:comedy", word: "a comedy", audio: "../unit4/audio/audio_02.mp3" },
    { id: "u4-m3", wordKey: "unit4:fantasy", word: "a fantasy film", audio: "../unit4/audio/audio_03.mp3" },
    { id: "u4-m4", wordKey: "unit4:horror", word: "a horror film", audio: "../unit4/audio/audio_04.mp3" },
    { id: "u4-m5", wordKey: "unit4:musical", word: "a musical", audio: "../unit4/audio/audio_05.mp3" },
    { id: "u4-m6", wordKey: "unit4:scifi", word: "a science fiction film", audio: "../unit4/audio/audio_06.mp3" },
    { id: "u4-m7", wordKey: "unit4:cruel", word: "cruel", audio: "../unit4/audio/audio_07.mp3" },
    { id: "u4-m8", wordKey: "unit4:curious", word: "curious", audio: "../unit4/audio/audio_08.mp3" },
    { id: "u4-m9", wordKey: "unit4:lonely", word: "lonely", audio: "../unit4/audio/audio_09.mp3" },
    { id: "u4-m10", wordKey: "unit4:obedient", word: "obedient", audio: "../unit4/audio/audio_10.mp3" },
    { id: "u4-m11", wordKey: "unit4:selfish", word: "selfish", audio: "../unit4/audio/audio_11.mp3" },
    { id: "u4-m12", wordKey: "unit4:timid", word: "timid", audio: "../unit4/audio/audio_12.mp3" },
    { id: "u4-m13", wordKey: "unit4:wicked", word: "wicked", audio: "../unit4/audio/audio_13.mp3" },
    { id: "u4-m14", wordKey: "unit4:wise", word: "wise", audio: "../unit4/audio/audio_14.mp3" },
  ],

  matching: [
    { id: "u4-k1", wordKey: "unit4:action", en: "an action film", zh: "動作片", img: "../unit4/thumb_01.png" },
    { id: "u4-k2", wordKey: "unit4:comedy", en: "a comedy", zh: "喜劇", img: "../unit4/thumb_02.png" },
    { id: "u4-k3", wordKey: "unit4:fantasy", en: "a fantasy film", zh: "奇幻片", img: "../unit4/thumb_03.png" },
    { id: "u4-k4", wordKey: "unit4:horror", en: "a horror film", zh: "恐怖片", img: "../unit4/thumb_04.png" },
    { id: "u4-k5", wordKey: "unit4:musical", en: "a musical", zh: "音樂劇／歌舞片", img: "../unit4/thumb_05.png" },
    { id: "u4-k6", wordKey: "unit4:scifi", en: "a science fiction film", zh: "科幻片", img: "../unit4/thumb_06.jpg" },
    { id: "u4-k7", wordKey: "unit4:cruel", en: "cruel", zh: "殘忍的", img: "../unit4/thumb_07.jpg" },
    { id: "u4-k8", wordKey: "unit4:curious", en: "curious", zh: "好奇的", img: "../unit4/thumb_08.png" },
    { id: "u4-k9", wordKey: "unit4:lonely", en: "lonely", zh: "寂寞的", img: "../unit4/thumb_09.png" },
    { id: "u4-k10", wordKey: "unit4:obedient", en: "obedient", zh: "聽話的", img: "../unit4/thumb_10.jpg" },
    { id: "u4-k11", wordKey: "unit4:selfish", en: "selfish", zh: "自私的", img: "../unit4/thumb_11.jpg" },
    { id: "u4-k12", wordKey: "unit4:timid", en: "timid", zh: "膽小的", img: "../unit4/thumb_12.png" },
    { id: "u4-k13", wordKey: "unit4:wicked", en: "wicked", zh: "邪惡的", img: "../unit4/thumb_13.png" },
    { id: "u4-k14", wordKey: "unit4:wise", en: "wise", zh: "明智的／有智慧的", img: "../unit4/thumb_14.png" },
  ]
};
