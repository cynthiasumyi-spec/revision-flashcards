/**
 * Thinking tips for sentence fill. English only.
 * They point at the clue in the sentence and never name the answer.
 */
window.FillThink = (function () {
  var TIPS = {
    'adopt a pet': 'A shelter animal is waiting for a forever home. Which phrase matches that idea?',
    'be a volunteer': 'Someone wears a helper badge and gives their time. Which phrase names that role?',
    'buy/sell flags': 'It is Flag Day, and helpers stand outside the station. What are they doing to raise money?',
    'buy/sell raffle tickets': 'People want a lucky-draw prize. What are they buying or selling?',
    'do voluntary work': 'The helper is not paid. If the subject is one person, the verb needs -s.',
    'does voluntary work': 'The helper is not paid. If the subject is one person, the verb needs -s.',
    'donate money': 'A coin goes into a charity box for people who need help. What happens to that money?',
    'give away old books': 'Finished storybooks are passed on so other pupils can read them. What happens to the books?',
    'go on a walkathon': 'The route is long, many kilometres, and it raises money. What kind of charity walk is that?',
    'take part in a fund-raising fair': 'Game stalls and snack sales at school are raising money. Which event is that?',
    'visit an elderly home': 'The class goes to cheer up grandmas and grandpas. Where are they going?',
    'a drought': 'Months pass with almost no rain, and the fields dry up. Too little water, not too much.',
    'an earthquake': 'The ground shakes and cups rattle or fall. What event is that?',
    'a flood': 'River water covers the streets. Too much water, not too little.',
    'a landslip': 'Soil or mud slides down a hillside. What is that called?',
    'a tsunami': 'Giant ocean waves hit the coast after a seaquake. What is that called?',
    'a typhoon': 'The signal is 8 and the wind is very strong. Which storm is that?',
    'block roads': 'Trees lie across the street and cars cannot pass. What happens to the roads?',
    'damage crops': 'Wind flattens the rice before harvest. What happens to the plants in the fields?',
    'destroy buildings': 'Walls fall and people lose their homes. What happens to the buildings?',
    'injure people': 'Glass or debris cuts arms and legs. What happens to the people?',
    'beat': 'A whisk makes eggs light and foamy. This is not a spoon, and it is not just blending flour.',
    'chop': 'A knife cuts the food into small pieces.',
    'mix': 'Dry ingredients are blended evenly. There is no whisk.',
    'pour': 'Liquid leaves a jug and goes into a pan or over the food.',
    'spread': 'A knife lays a thin layer on toast or bread.',
    'sprinkle': 'Cheese is scattered lightly on top.',
    'stir': 'A spoon moves the soup so nothing sticks to the pot.',
    'peel': 'The skin comes off the fruit.',
    'bake': 'The food goes into a hot oven.',
    'boil': 'The water has big bubbles.',
    'fry': 'The food cooks in hot oil in a pan.',
    'steam': 'The food cooks over hot water. It is not in the oil.',
    'an action film': 'There are car chases and fights. Which kind of film is that?',
    'a comedy': 'Jokes make people laugh. Which kind of film is that?',
    'a fantasy film': 'There are dragons, wizards, or a magic wand. Which kind of film is that?',
    'a horror film': 'Spooky scenes scare you. Which kind of film is that?',
    'a musical': 'People sing and dance on stage. Which kind of film is that?',
    'a science fiction film': 'There are robots, space travel, or distant planets. Not magic. Which kind of film is that?',
    'cruel': 'Someone hurts others on purpose, for no good reason.',
    'curious': 'Someone asks many questions because they want to learn.',
    'lonely': 'There are no friends, and the place feels empty.',
    'obedient': 'The dog sits and stays when it is told. It follows the command.',
    'selfish': 'Someone keeps everything and will not share.',
    'timid': 'A tiny noise is enough to make them hide.',
    'wicked': 'Someone plans a dark spell to hurt others.',
    'wise': 'The person gives careful, good advice.',
    'as blind as a bat': 'They cannot see clearly without glasses. Which simile matches?',
    'as busy as a bee': 'They work from morning to night and do not stop. Which simile matches?',
    'as free as a bird': 'No homework is left, so they can play. Which simile matches?',
    'as strong as an ox': 'Heavy bags are easy to carry. Which simile matches?',
    'as hungry as a wolf': 'They are very hungry, and there was no snack. Which simile matches?'
  };

  function tip(item) {
    var key = String(item && item.answer || '').toLowerCase().trim();
    return TIPS[key] || 'Read the sentence again. What is happening in the blank?';
  }

  return { tip: tip };
})();
