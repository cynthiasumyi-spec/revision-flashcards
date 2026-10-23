/**
 * Unit 1 · For a good cause — practice data
 * Vocab from unit1/index.html CARDS
 */
window.PRACTICE_UNIT1 = {
  id: 'unit1',
  title: 'Unit 1 · For a good cause',
  words: [
    { key: 'unit1:adopt', form: 'verb', en: 'adopt a pet', zh: '領養寵物', audio: '../unit1/audio/audio_01.mp3', img: '../unit1/thumb_01.jpg' },
    { key: 'unit1:volunteer', form: 'verb', en: 'be a volunteer', zh: '當志願者', audio: '../unit1/audio/audio_02.mp3', img: '../unit1/thumb_02.jpg' },
    { key: 'unit1:flags', form: 'verb', en: 'buy/sell flags', zh: '買／賣旗籌', audio: '../unit1/audio/audio_03.mp3', img: '../unit1/thumb_03.jpg' },
    { key: 'unit1:raffle', form: 'verb', en: 'buy/sell raffle tickets', zh: '買／賣抽獎券', audio: '../unit1/audio/audio_04.mp3', img: '../unit1/thumb_04.jpg' },
    { key: 'unit1:voluntary', form: 'verb', en: 'do voluntary work', zh: '做義務工作', audio: '../unit1/audio/audio_05.mp3', img: '../unit1/thumb_05.jpg' },
    { key: 'unit1:donate', form: 'verb', en: 'donate money', zh: '捐錢', audio: '../unit1/audio/audio_06.mp3', img: '../unit1/thumb_06.png' },
    { key: 'unit1:books', form: 'verb', en: 'give away old books', zh: '贈送舊書', audio: '../unit1/audio/audio_07.mp3', img: '../unit1/thumb_07.jpg' },
    { key: 'unit1:walkathon', form: 'verb', en: 'go on a walkathon', zh: '參加步行籌款', audio: '../unit1/audio/audio_08.mp3', img: '../unit1/thumb_08.jpg' },
    { key: 'unit1:fair', form: 'verb', en: 'take part in a fund-raising fair', zh: '參加籌款嘉年華', audio: '../unit1/audio/audio_09.mp3', img: '../unit1/thumb_09.jpg' },
    { key: 'unit1:elderly', form: 'verb', en: 'visit an elderly home', zh: '探訪安老院', audio: '../unit1/audio/audio_10.mp3', img: '../unit1/thumb_10.png' }
  ],

  fillIn: [
    {
      id: "u1-f1",
      wordKey: "unit1:adopt",
      sentence: "The family visited the animal shelter because they want to ______ and give it a forever home.",
      blank: '______',
      options: ["adopt a pet", "donate money", "go on a walkathon", "buy/sell flags"],
      answer: "adopt a pet",
      accept: ["adopt a pet"],
      explain: "A shelter keeps homeless animals. Taking one home forever means you adopt a pet (\u9818\u990a\u5bf5\u7269)."
    },
    {
      id: "u1-f2",
      wordKey: "unit1:volunteer",
      sentence: "Every Saturday Tom wears a helper badge and stays after school to ______ at the community centre.",
      blank: '______',
      options: ["be a volunteer", "give away old books", "buy/sell raffle tickets", "go on a walkathon"],
      answer: "be a volunteer",
      accept: ["be a volunteer"],
      explain: "A helper badge and free time after school show he chooses to be a volunteer (\u7576\u5fd7\u9858\u8005)."
    },
    {
      id: "u1-f3",
      wordKey: "unit1:flags",
      sentence: "On Flag Day, the children stand outside the MTR and ______ to raise money for the Red Cross.",
      blank: '______',
      options: ["buy/sell flags", "adopt a pet", "donate money", "visit an elderly home"],
      answer: "buy/sell flags",
      accept: ["buy/sell flags"],
      explain: "Flag Day is when helpers buy/sell flags (\u8cb7\uff0f\u8ce3\u65d7\u7c4c) near stations to raise money."
    },
    {
      id: "u1-f4",
      wordKey: "unit1:raffle",
      sentence: "At the school fair entrance, she holds lucky-draw stubs and helps parents ______ for prizes.",
      blank: '______',
      options: ["buy/sell raffle tickets", "visit an elderly home", "give away old books", "adopt a pet"],
      answer: "buy/sell raffle tickets",
      accept: ["buy/sell raffle tickets"],
      explain: "Lucky-draw stubs are raffle tickets \u2014 buying or selling them can win prizes (\u62bd\u734e\u5238)."
    },
    {
      id: "u1-f5",
      wordKey: "unit1:voluntary",
      sentence: "Without getting paid, the girl ______ at the elderly home every weekend.",
      blank: '______',
      options: ["does voluntary work", "adopts a pet", "buys flags", "goes on a walkathon"],
      answer: "does voluntary work",
      accept: ["does voluntary work", "do voluntary work"],
      explain: "Work done for free to help others is voluntary work (\u7fa9\u52d9\u5de5\u4f5c)."
    },
    {
      id: "u1-f6",
      wordKey: "unit1:donate",
      sentence: "The boy drops a coin into the charity box so he can ______ to help sick children.",
      blank: '______',
      options: ["donate money", "go on a walkathon", "adopt a pet", "buy/sell raffle tickets"],
      answer: "donate money",
      accept: ["donate money"],
      explain: "Putting money into a charity box means you donate money (\u6350\u9322)."
    },
    {
      id: "u1-f7",
      wordKey: "unit1:books",
      sentence: "He puts storybooks he finished into the donation box to ______ to younger pupils.",
      blank: '______',
      options: ["give away old books", "visit an elderly home", "be a volunteer", "buy/sell flags"],
      answer: "give away old books",
      accept: ["give away old books"],
      explain: "Putting finished storybooks in a donation box is to give away old books (\u8d08\u9001\u820a\u66f8)."
    },
    {
      id: "u1-f8",
      wordKey: "unit1:walkathon",
      sentence: "On charity day the class will ______ for ten kilometres along the harbour to raise money for the animal shelter.",
      blank: '______',
      options: ["go on a walkathon", "donate money", "adopt a pet", "do voluntary work"],
      answer: "go on a walkathon",
      accept: ["go on a walkathon"],
      explain: "Walking a long route to raise money is a walkathon (\u6b65\u884c\u7c4c\u6b3e) \u2014 not just a short stroll."
    },
    {
      id: "u1-f9",
      wordKey: "unit1:fair",
      sentence: "Next Friday every class will run game stalls and sell snacks when they ______ at school.",
      blank: '______',
      options: ["take part in a fund-raising fair", "give away old books", "buy/sell flags", "visit an elderly home"],
      answer: "take part in a fund-raising fair",
      accept: ["take part in a fund-raising fair"],
      explain: "Game stalls and snack sales at school mean a fund-raising fair (\u7c4c\u6b3e\u5609\u5e74\u83ef)."
    },
    {
      id: "u1-f10",
      wordKey: "unit1:elderly",
      sentence: "The children bring fruit and songs when they ______ to cheer up the grandmas and grandpas.",
      blank: '______',
      options: ["visit an elderly home", "go on a walkathon", "donate money", "buy/sell raffle tickets"],
      answer: "visit an elderly home",
      accept: ["visit an elderly home"],
      explain: "Going to cheer up grandmas and grandpas means you visit an elderly home (\u63a2\u8a2a\u5b89\u8001\u9662)."
    }
  ],

  /* Hard: P.6 textbook depth — so many/so much, who/which, charity notice/blog flavour. Type-in only (no options needed). */
  fillInHard: [
    {
      id: "u1-h1",
      wordKey: "unit1:adopt",
      sentence: "The charity which looks after stray dogs and cats hopes that so many kind families will ______ this year so that each animal finds a home.",
      blank: '______',
      answer: "adopt a pet",
      accept: ["adopt a pet"],
      explain: "Stray dogs and cats need forever homes \u2014 families adopt a pet (\u9818\u990a\u5bf5\u7269)."
    },
    {
      id: "u1-h2",
      wordKey: "unit1:volunteer",
      sentence: "Our school notice asks every student who has free time after school to ______ at the community centre so that helpers are never short.",
      blank: '______',
      answer: "be a volunteer",
      accept: ["be a volunteer"],
      explain: "Free time after school to help at a centre means you be a volunteer (\u7576\u5fd7\u9858\u8005)."
    },
    {
      id: "u1-h3",
      wordKey: "unit1:flags",
      sentence: "There are so many helpers who stand outside the MTR station early on Flag Day to ______ for the Red Cross.",
      blank: '______',
      answer: "buy/sell flags",
      accept: ["buy/sell flags"],
      explain: "Flag Day + MTR helpers = buy/sell flags (\u8cb7\uff0f\u8ce3\u65d7\u7c4c) for charity."
    },
    {
      id: "u1-h4",
      wordKey: "unit1:raffle",
      sentence: "At the charity sale which our PTA organises each spring, parents who want a chance to win prizes usually ______ near the entrance.",
      blank: '______',
      answer: "buy/sell raffle tickets",
      accept: ["buy/sell raffle tickets"],
      explain: "Tickets for a lucky draw are raffle tickets (\u62bd\u734e\u5238)."
    },
    {
      id: "u1-h5",
      wordKey: "unit1:voluntary",
      sentence: "Sam, who wants to help people in need without pay, ______ at the elderly home every Saturday afternoon.",
      blank: '______',
      answer: "does voluntary work",
      accept: ["does voluntary work", "do voluntary work"],
      explain: "Helping without pay is voluntary work (\u7fa9\u52d9\u5de5\u4f5c)."
    },
    {
      id: "u1-h6",
      wordKey: "unit1:donate",
      sentence: "The poster which hangs in the school hall reminds us that even a little pocket money can ______ when so many children need hospital care.",
      blank: '______',
      answer: "donate money",
      accept: ["donate money"],
      explain: "Giving pocket money to help sick children is to donate money (\u6350\u9322)."
    },
    {
      id: "u1-h7",
      wordKey: "unit1:books",
      sentence: "In her blog entry, Amy explains that she decided to ______ which she no longer reads so that so many other pupils can enjoy them.",
      blank: '______',
      answer: "give away old books",
      accept: ["give away old books"],
      explain: "Passing on books you finished is to give away old books (\u8d08\u9001\u820a\u66f8)."
    },
    {
      id: "u1-h8",
      wordKey: "unit1:walkathon",
      sentence: "Although it is a long harbour route of many kilometres, so many classmates who care about animals will ______ this Sunday to raise money for the shelter.",
      blank: '______',
      answer: "go on a walkathon",
      accept: ["go on a walkathon"],
      explain: "A long charity walk to raise money is a walkathon (\u6b65\u884c\u7c4c\u6b3e)."
    },
    {
      id: "u1-h9",
      wordKey: "unit1:fair",
      sentence: "The notice on the board says that every class which wants to support the hospital with game stalls should ______ next Friday.",
      blank: '______',
      answer: "take part in a fund-raising fair",
      accept: ["take part in a fund-raising fair"],
      explain: "Game stalls for the hospital = fund-raising fair (\u7c4c\u6b3e\u5609\u5e74\u83ef)."
    },
    {
      id: "u1-h10",
      wordKey: "unit1:elderly",
      sentence: "There are so many elderly people who feel lonely, so our class will ______ next Saturday and sing songs for them.",
      blank: '______',
      answer: "visit an elderly home",
      accept: ["visit an elderly home"],
      explain: "Singing for lonely elderly people means visit an elderly home (\u63a2\u8a2a\u5b89\u8001\u9662)."
    }
  ],

  missingLetters: [
    { id: 'u1-m1', wordKey: 'unit1:adopt', word: 'adopt', pattern: 'a_o_t', audio: '../unit1/audio/audio_01.mp3' },
    { id: 'u1-m2', wordKey: 'unit1:volunteer', word: 'volunteer', pattern: 'v_l_nte_r', audio: '../unit1/audio/audio_02.mp3' },
    { id: 'u1-m3', wordKey: 'unit1:flags', word: 'flags', pattern: 'fl_gs', audio: '../unit1/audio/audio_03.mp3' },
    { id: 'u1-m4', wordKey: 'unit1:raffle', word: 'raffle', pattern: 'r_ff_e', audio: '../unit1/audio/audio_04.mp3' },
    { id: 'u1-m5', wordKey: 'unit1:voluntary', word: 'voluntary', pattern: 'v_l_nt_ry', audio: '../unit1/audio/audio_05.mp3' },
    { id: 'u1-m6', wordKey: 'unit1:donate', word: 'donate', pattern: 'd_n_te', audio: '../unit1/audio/audio_06.mp3' },
    { id: 'u1-m7', wordKey: 'unit1:books', word: 'books', pattern: 'b__ks', audio: '../unit1/audio/audio_07.mp3' },
    { id: 'u1-m8', wordKey: 'unit1:walkathon', word: 'walkathon', pattern: 'w_lk_th_n', audio: '../unit1/audio/audio_08.mp3' },
    { id: 'u1-m9', wordKey: 'unit1:fair', word: 'fund-raising', pattern: 'f_nd-r_is_ng', audio: '../unit1/audio/audio_09.mp3' },
    { id: 'u1-m10', wordKey: 'unit1:elderly', word: 'elderly', pattern: 'e_d_rly', audio: '../unit1/audio/audio_10.mp3' }
  ],

  matching: [
    { id: 'u1-k1', wordKey: 'unit1:adopt', en: 'adopt a pet', zh: '領養寵物', img: '../unit1/thumb_01.jpg' },
    { id: 'u1-k2', wordKey: 'unit1:volunteer', en: 'be a volunteer', zh: '當志願者', img: '../unit1/thumb_02.jpg' },
    { id: 'u1-k3', wordKey: 'unit1:flags', en: 'buy/sell flags', zh: '買／賣旗籌', img: '../unit1/thumb_03.jpg' },
    { id: 'u1-k4', wordKey: 'unit1:raffle', en: 'buy/sell raffle tickets', zh: '買／賣抽獎券', img: '../unit1/thumb_04.jpg' },
    { id: 'u1-k5', wordKey: 'unit1:voluntary', en: 'do voluntary work', zh: '做義務工作', img: '../unit1/thumb_05.jpg' },
    { id: 'u1-k6', wordKey: 'unit1:donate', en: 'donate money', zh: '捐錢', img: '../unit1/thumb_06.png' },
    { id: 'u1-k7', wordKey: 'unit1:books', en: 'give away old books', zh: '贈送舊書', img: '../unit1/thumb_07.jpg' },
    { id: 'u1-k8', wordKey: 'unit1:walkathon', en: 'go on a walkathon', zh: '參加步行籌款', img: '../unit1/thumb_08.jpg' },
    { id: 'u1-k9', wordKey: 'unit1:fair', en: 'take part in a fund-raising fair', zh: '參加籌款嘉年華', img: '../unit1/thumb_09.jpg' },
    { id: 'u1-k10', wordKey: 'unit1:elderly', en: 'visit an elderly home', zh: '探訪安老院', img: '../unit1/thumb_10.png' }
  ]
};
