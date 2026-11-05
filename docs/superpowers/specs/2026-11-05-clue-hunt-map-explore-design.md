# Clue Hunt — Map Explore redesign

Status: design only. This document does not change the game. A later implementation task will rebuild `game/clue-hunt.html` to match this spec.

The design was agreed with Wu. Student-facing copy stays in English. The case names below are the English names already used in the game (Leo, Amy, Ken, the film club).

## Goal

Make Clue Hunt feel like investigating a real, P6-safe school mystery. The player explores, talks, and searches, then uses what they found. It should not feel like a quiz that unlocks sealed cards.

The case still mixes vocabulary and grammar from the revision packs. That practice sits on the solve page, after the player has already gathered the story.

Entry stays the small **Be a Detective** mark at the top-left of the cream packs panel on the home page (`index.html` → `game/clue-hunt.html`). The home header stays **Revision | Practice**. Do not put a Game link back in that header.

## What this replaces

Today, `game/clue-hunt.html` is a linear quiz. Five questions open five sealed cards, and only then can the player name who took the box and where Leo is. The player cannot wander, and a wrong quiz answer blocks the next card.

The redesign keeps the same mystery and the same true ending. It changes how the player reaches that ending.

## What stays

- Home entry: the packs-corner **Be a Detective** link. The Achievements banner in the blue header stays where it is.
- No Game item in the home header.
- `game/index.html` and `game/clue-hunt.html` stay in the repo. Be a Detective is the student entry. Do not delete the game pages.
- The same case: Leo left the charity stall, and the raffle box is gone.
- The same true solution: the film club took the raffle tickets for their comedy draw. Leo went with the box. He is in the school hall, safe. The stall can collect the tickets after the film.
- P6 tone: a school fair, a missing boy who is safe, a box borrowed for a class film. No violence, no threat, no scary crime.
- English UI, the same gentle illustration style already used by Practice, fill instead of borders, and rounded pictures that stay fully visible.

## Approach

Use approach A plus a light version of approach B.

- **A — campus map.** A simple school-fair map is the main screen. The player chooses where to go.
- **B — one false clue.** Exactly one notebook card is false or misleading. The example to ship is a person who misremembers the time. The other cards are true.

## Case canon

Reuse the current Leo case. Do not invent a second mystery in v1.

True facts the notebook should support:

- Leo has not come back from the charity stall. The raffle box went with him.
- Amy sells the raffle tickets. She left the stall with Leo.
- The raffle tickets are gone. The flags and the old books are still on the stall table.
- Ken looked beside the prize wheel. Leo was not there.
- A comedy is playing in the school hall.
- The film club asked Amy to bring the tickets in for their draw.

Misleading fact (the one false card):

- Ken says he saw Leo go into the storeroom at noon. He has the time wrong. Leo was not in the storeroom at noon. The hall card and the film-club card disagree with this memory.

People and places the player already meets may appear as talk options or search spots: Amy, Ken, Miss Chan, the caretaker, the charity stall, the prize wheel, the school hall, the film club, the storeroom. Wrong guesses on the solve page should be people and places from this case, not random names.

## Flow

### 1. Short case intro

One short screen, then the map. Reuse the current setup: Leo has not come back from the charity stall, and the raffle box is gone. Tell the player to look around the fair and write what they find in the notebook. Do not show a quiz on this screen.

### 2. School-fair map

Show a simple campus / school-fair map with four clickable hotspots:

| Hotspot | Interaction | Notebook card | Truth |
| --- | --- | --- | --- |
| Charity stall | Search the table | The raffle tickets are gone. The flags and the old books are still there. | True |
| School hall | Talk to someone at the comedy | A comedy is on in the school hall. A boy came in with the raffle box. | True |
| Film club | Talk to someone from the club | The film club asked Amy to bring the tickets for their comedy draw. | True |
| Storeroom | Talk to Ken | Ken says he saw Leo go into the storeroom at noon. | False. He misremembers the time. |

The map is free. The player may open the hotspots in any order. The map stays unlocked through exploration and while the solve page is available. It locks only after the case ending, or it may simply stay on screen under the ending. Do not force a path.

### 3. Hotspot interactions

Each hotspot is one kind of interaction. v1 has two kinds only.

**Talk.** A short dialog with one person. The player picks one question from two or three short prompts, such as “Who left with Leo?” or “What time did you see him?”. One question produces that hotspot’s notebook card. The other prompts get a short reply and no card. The player can ask again. This is how they choose what to investigate. It is not a scored grammar question, and a useless question is not a wrong answer.

**Search.** A scene with a few tappable spots. Tapping the spot that matters (the empty space where the raffle box was, the flags, the old books) adds that hotspot’s notebook card. Other taps can say that nothing useful is there. They do not add a card and they do not score.

Every hotspot adds at most one notebook card. v1 collects four cards, one from each hotspot. That sits inside the agreed range of about four or five clues. Do not add a fifth required card.

### 4. Notebook

The notebook is always visible during exploration, including on the map and inside a hotspot. Cards are short English sentences.

- A new card appears as soon as the talk or search succeeds.
- Revisiting a hotspot shows the same dialog or scene and does not add a second copy of the card.
- The false card looks like the others. Do not label it “false” or “wrong” on the notebook.
- On the solve page the notebook is fully open, so every card can be read while answering.

### 5. Unlock Solve Case

**Solve Case** stays locked until all four notebook cards are collected. The player can still wander the map after it unlocks. Opening Solve Case does not erase the notebook and does not require the hotspots to be visited in a fixed order.

### 6. Solve page

The solve page is where English practice is concentrated.

1. Show the notebook fully open.
2. Ask two or three mixed vocabulary and grammar questions. Their job is to weed out the false clue and confirm the key facts. They should use words and patterns the packs already teach (fair and charity words, film words, place, time). They are not a second copy of the five sealed-card questions.
3. Then ask the player to name both of these:
   - Who took the box?
   - Where is Leo?

Do not also ask “who is missing?”. Leo is already the missing boy. The current third picker goes away.

The two or three practice questions should make the storeroom time impossible to keep. For example, a question about when the hall comedy starts, or what is still on the stall table, should leave Ken’s “noon in the storeroom” card as the one that does not fit. Do not mark that card false until the player commits to the case answer.

Correct who and where, after the practice questions are answered, leads to the short ending.

Wrong who or where does not end the case and does not reset the notebook. Tell the player which notebook card to read again, for example the school-hall card or the storeroom card. Let them change the answer and try again. A hint names the card. It does not give the culprit or the place on the first miss.

### 7. Ending

One short ending, in the same sense as the current page:

> The film club took the raffle tickets for their comedy draw. Leo went with the box. He is in the school hall, safe, and the stall can collect the tickets after the film.

No alternate endings in v1.

## Out of scope for v1

- More ending branches.
- Interaction types other than talk and search.
- A timing minigame.
- More than one case.
- A fifth required clue, or more than one false clue.
- Putting Clue Hunt inside Practice.
- Adding a Game link to the home header.
- Scoring, streaks, or badges specific to this redesign.
- A Chinese-language play mode. The spec conversation was in Traditional Chinese; the student UI stays English.

## Success criteria for later implementation

The implementation is not part of this commit. When it is built, it is done when all of the following are true:

- The player can wander the map and open any hotspot before any quiz appears.
- The notebook gains a card from exploring, not from answering a grammar item.
- Exactly one notebook card is false or misleading, and it is Ken’s wrong time at the storeroom.
- Revisiting a hotspot does not duplicate a card.
- Solve Case unlocks only after the four cards are collected, and the map is still available until the ending.
- Vocabulary and grammar questions are concentrated on the solve page (two or three items), and they help the player drop the false clue.
- The player must pick who took the box and where Leo is. The correct pair is the film club and the school hall.
- A wrong case answer hints which notebook card to re-read and allows another try.
- The tone stays a mild P6 school mystery. Leo is safe.
- Home still opens the game only from Be a Detective on the packs panel. The header is still Revision and Practice.
- `game/clue-hunt.html` remains the page Be a Detective opens. The game files are not removed.
