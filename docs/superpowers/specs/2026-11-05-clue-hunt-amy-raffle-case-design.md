# Clue Hunt — Amy and the raffle box

Status: design only. Wu approved this case in chat. This document does not change the game. A later implementation task will replace the case content in `game/clue-hunt.html` and `game/clue-hunt-state.js`.

Student-facing copy stays in English. Traditional Chinese belongs in this spec and in notes to Wu, not on the student screen.

This case replaces the earlier ending in which the film club took the tickets for a comedy draw. The paper map, the lined notebook, and the Be a Detective entry stay.

## Goal

Tell the whole story first, then let the player collect scattered, subtle clues. Solving the case means naming the culprit and the motive. There is no English grammar practice on the solve page.

The player still wanders the open paper map, talks or searches, and keeps clues in the notebook.

## What the player is told first

The intro keeps two labelled blocks, with clear space between them.

**The case.** Leo was guarding the raffle box at the school charity fair. The box is gone, and Leo has not come back.

**How to play.** Tap a place on the map. Talk to a person, or search. Clues are written in the notebook. When the notes are ready, tap Solve Case and name who took the box, and why.

## Truth

Approved facts. The notebook never states this list in one place. The player has to join the clues.

- Setting: the school charity fair. Leo is guarding the raffle box. The box and Leo are missing.
- Culprit: Amy, a classmate.
- Motive: she wanted to draw a raffle ticket in secret and win the big prize, a new bike.
- 11:30 — Leo is at the charity stall with the box.
- 1:00 — people are getting the school hall ready.
- About 1:15 — a person in a blue jacket leaves the stall with Leo. The prize-wheel witness does not name her.
- 1:20 — Amy tells Leo that Miss Chan asked them to move the raffle box to the backstage of the hall. That is a lie. Leo goes with her.
- About 1:20 — the box arrives backstage. This is the time the hall clue should support. “About 1:15” at the prize wheel and “about 1:20” at the hall are the same early-afternoon leaving, not two different events. Noon is the time that does not fit.
- 1:25 — they are backstage. Amy leaves Leo waiting and opens the box to draw a ticket.
- About 2:00 — the player starts looking. Leo is still waiting backstage. He is safe.
- False clue: Ken says he saw Leo go into the storeroom at noon. He misremembers. The notebook must not label this card false or wrong.

## Six map places

The map grows from four markers to six. Order of visiting is free. Each place adds at most one notebook card. Revisiting does not add a second copy. The map stays open until the ending. Solve Case unlocks after all six cards are in the notebook.

Cards are short English sentences. Wrong talk prompts and useless search taps add no card and do not score.

### 1. Charity stall — search

An unsigned memo with an apple pattern lies where the box was. It says: “Please move the raffle box to the hall. Thanks!”

The card does not say who wrote it. It does not show Amy’s name.

### 2. Prize wheel — talk

About 1:15, someone in a blue jacket left the stall with Leo. The big prize is a new bike. People at the wheel keep guessing which ticket will be the lucky one.

The card does not say the person was Amy.

### 3. Film club — talk

Said in a casual way, not as an accusation:

- Amy’s lunch box has a red apple every day.
- She once stuck an apple sticker on a wish list.
- Amy said that if she won the bike, she would not have to wait for the bus.

Do not say that she uses apple memo paper. Do not say that she took the box.

### 4. School hall — talk or search

About 1:20 someone brought the raffle box backstage. Leo is still waiting there. A half-eaten apple core is by the side door. Near the half-open box is a wish slip that says “Win bike”, with a tiny apple sticker on it.

The card can record the time, Leo waiting, the apple core, and the wish slip. It does not name Amy.

### 5. Miss Chan’s desk — talk

Miss Chan did not ask anyone to move the raffle box.

That card contradicts the unsigned memo. It still does not name Amy.

### 6. Storeroom — talk to Ken

Ken says he saw Leo go into the storeroom at noon.

This is the only false card. It looks like the others. Leo must not be drawn inside the storeroom, or the picture would make the false memory look true.

## How the clues connect

The player is not told the chain. These are the joins the notes support:

- The apple-pattern memo, Amy’s daily apple, the apple sticker she used on a wish list, the apple core by the side door, and the “Win bike” slip with a tiny apple sticker are the same habit. No single card says “Amy wrote the memo.”
- Miss Chan’s denial shows the memo is not a real instruction from her.
- The prize wheel gives the early-afternoon leaving, the blue jacket, and the reason someone would want a ticket: the new bike. Amy’s film-club remark about the bike and the bus is the same wish, said in her own words.
- Amy wears a blue jacket in the film-club picture, so the player can notice the prize-wheel sighting. The film-club notebook card does not mention the jacket.
- Ken’s noon does not fit 1:15 or 1:20. The optional time question is what makes that card impossible to keep.

## Solve

No vocabulary blank and no grammar blank.

1. Optional short filter: about what time did the box leave the stall? The answer is about 1:20. A wrong time, including noon, hints “Read the school hall card again” or “Read the storeroom card again”, and does not reveal Amy.
2. Who took the box? Amy. The other choices are people already in the case: Ken, Miss Chan, and one more person from the fair who is not Amy.
3. Why? To draw a ticket in secret and win the big prize.

A wrong who or why names which notebook card to read again and does not give the culprit or the motive on the first miss. The player can change the answer and try again. The notebook is not cleared.

Ending, mild and P6-safe: Amy had opened the box backstage to draw a ticket for the new bike. Leo was waiting there the whole time and is safe. Amy brings the tickets back and says sorry. The stall can use the tickets again. No threat, no punishment scene, no chase.

Leo’s place is part of the ending, not a third scored question.

## What stays

- Entry is the small Be a Detective mark at the top-left of the packs panel. It opens `game/clue-hunt.html`.
- The home header stays Revision and Practice. Do not add a Game link.
- The explore screen stays the open paper map (`game/illust/map-open.png`) with place markers on it, not a grid of large cards.
- The notebook stays lined paper, with the purpose line that clues from talking and searching are written there and used to solve the case.
- English student copy. P6 tone. One unlabeled false clue.

## Art mapping

Rule for every hotspot marker and every opened scene: the picture must show that place, and the people who belong in that moment. A generic fair, a random child, or a teacher who is not Miss Chan does not count.

Use this order:

1. Prefer an existing file under `practice/grammar/illust/` or `game/illust/` when the picture already shows that place and those people.
2. If no existing irasutoya picture, and no other Japanese flat clip-art already used by this site, matches, generate a new illustration.
3. New art stays in the same flat, cute school clip-art look as the irasutoya pictures already in the repo. Do not switch to a different style.

Generated people must stay recognisable from scene to scene:

- Amy: a P6 girl with dark hair, a blue jacket over her school clothes. Her film-club picture includes her apple lunch. It does not include apple memo paper.
- Leo: a P6 boy, safe and waiting, never hurt or scared in a frightening way.
- Ken: a boy alone among stored books. Leo is not in that picture.
- Miss Chan: one adult teacher at her own desk, calm.

| Hotspot | Intended scene | Map marker | Scene art | Decision |
| --- | --- | --- | --- | --- |
| Charity stall | Unsigned apple-pattern memo on the stall: “Please move the raffle box to the hall. Thanks!” No name and no portrait of Amy. | `practice/grammar/illust/u1_s4_carnival_stalls.jpg` shows the fair stall and can be the pin. | That stall picture has no memo and no raffle box. | Marker: existing stall. Scene: generate the stall table with the apple-pattern memo. |
| Prize wheel | About 1:15 a person in a blue jacket leaves with Leo. The big prize is a new bike. People are guessing the lucky ticket. The card does not name Amy. | `practice/grammar/illust/u1_s4_lucky_draw.jpg` shows a prize wheel, so it can be the pin. | That picture has gifts and a teddy, not a bike, and nobody is leaving in a blue jacket. | Marker: existing wheel. Scene: generate the wheel, a new bike as the big prize, and the told moment of a blue jacket leaving with Leo. Do not label the girl as Amy in the picture caption. |
| Film club | Amy’s lunch has a red apple every day. An apple sticker is on a wish list she made. She says that if she won the bike she would not wait for the bus. | `practice/grammar/illust/u4_s5_studio_lights.jpg` shows students and cameras, so it can be the pin. | That picture has no Amy, no apple lunch, and no wish-list sticker. | Marker: existing film-club room. Scene: generate Amy in her blue jacket, apple lunch, and the sticker on a wish list, in that same kind of club room. No apple memo paper. |
| School hall | About 1:20 the box is backstage. Leo is still waiting. An apple core is by the side door. A “Win bike” slip with a tiny apple sticker is by the half-open box. | `practice/grammar/illust/u4_s4_musical_finale.jpg` reads as the school hall and can be the pin. | It is a stage show. It does not show backstage, Leo waiting, the box, the core, or the slip. | Marker: existing hall. Scene: generate the backstage moment above. Leo looks safe. |
| Miss Chan’s desk | Miss Chan says she did not ask anyone to move the raffle box. | No file in the repo shows Miss Chan at a teacher’s desk. `u1_s5_lemonade_teachers.jpg` is a packing table. `u2_s5_radio_desk.jpg` is children in helmets with a radio. `u4_s5_cardboard_desk.jpg` is a broadcast table. | Same gap. | Marker and scene: generate Miss Chan at her school desk. |
| Storeroom | Ken, alone, says he saw Leo go into the storeroom at noon. The card is unlabeled as false. | `practice/grammar/illust/u1_07_books.jpg` shows a boy with a storage box of books and lockers. | The same picture matches Ken in the storeroom and does not show Leo walking in. | Marker and scene: use `practice/grammar/illust/u1_07_books.jpg`. Do not generate Leo inside the storeroom. |

The open map itself stays `game/illust/map-open.png`. The six pins sit on that paper map in separate spots, with the small place picture and a short English label.

## Out of scope for this spec

- Implementing the case, the six pins, or the new pictures.
- English grammar or vocabulary questions on the solve page.
- A second case, another false clue, or a second ending.
- Putting Clue Hunt inside Practice, or adding Game back to the home header.

## Success criteria for the later implementation

- The intro still separates The case and How to play.
- Six markers sit on the paper map. Tapping one opens that place.
- The notebook gains one subtle card per place, including exactly one unlabeled false card from Ken.
- No card says Amy wrote the memo, and the film-club card does not mention apple memo paper.
- Solve Case has no grammar practice. The player names Amy and the secret ticket draw for the bike. The optional time answer is about 1:20.
- A wrong answer points at a notebook card and allows another try.
- The ending keeps Leo safe and lets Amy return the tickets and apologise.
- Scene art follows the table above: existing file only where it shows the place and the people; otherwise a new irasutoya-style school picture.
