# School Mystery — people

Status: design only. Wu approved this character system in chat. This document does not change the game.

Student-facing copy stays in English. The game students see is **School Mystery**. The page address stays `game/clue-hunt.html`. The home easter egg stays **Be a Detective**.

## Goal

Add a small cast the student can recognise. The same face is used on the intro, in talk, and in a People album. The album is a list of people. The notebook stays a list of clues.

The case story, the correct solve answers, and the notebook sentences do not change.

## Player

The player is **You**, a Primary 6 student detective. You is not a police officer and not an adult.

On the intro, inside **The case**, show You’s illustration and a short intro of one or two English sentences. The existing case paragraph stays. Suggested intro, which does not add a clue:

> You are a Primary 6 student. You are looking into what happened to the raffle box.

**How to play** stays as it is.

## Cast

These are the only people. Do not add a film-club narrator, a stall keeper, or anyone else.

| Person | Who they are in the case | Talk control that is tied to them |
| --- | --- | --- |
| You | The player. | None. You starts unlocked. |
| May | The student at the prize wheel. The scene intro is “May is watching the prize wheel.” | Prize wheel. Every question there is May speaking. |
| Amy | The classmate the film-club questions are about. The scene intro is “Amy is here with the film club.” | Film club. The questions are about Amy. |
| Miss Chan | The teacher at her desk. | Miss Chan’s desk. |
| Ken | The student in the storeroom. His noon line is the existing unlabeled false clue. | Storeroom. |
| Leo | The boy who was with the raffle box. He is not standing at a question mark. | No hotspot of his own. |
| Sam | The boy who carried a box of old books. He is not standing at a question mark. | No hotspot of his own. |

Charity stall and School hall are searches. They have no person to unlock.

The film-club replies already say “she”, not “I”. This spec does not rewrite them. Amy’s face and name still mark that talk, because the control is tied to Amy.

## Talk

The question-mark control and the one-question-at-a-time thread stay.

Each bubble in that thread shows a round avatar and the speaker’s name beside the words.

- A question the student sends uses **You**.
- A reply uses the person that talk control is tied to: May, Amy, Miss Chan, or Ken.

Searching an object does not show a person bubble. The magnifier and the object popup stay as they are.

## People album

Approach B. People is separate from the notebook.

On the map and on a scene, a **People** button sits next to Notebook. Notebook still holds only clue cards. It does not list people.

### What is in the album

- You is there from the start.
- Other people are absent until they are unlocked. The album does not show their names, silhouettes, or a count of hidden people. Seeing “Amy” before the film-club talk would make the solve too easy.
- An entry is the round avatar, the name, and one key fact.
- Tapping a person opens a detail: a larger view of the same picture, the name, and the same key fact.
- **Back to the map** leaves the detail and the album and returns to the map. If People was opened from a scene, that back control still returns to the map, as Wu asked. Closing the list without opening a person returns to the screen they were on, map or scene.

### When someone unlocks

Unlocks follow the visit in progress. They reset when the page is reloaded, the same way the notebook does today. This spec does not add a saved game.

A person unlocks the first time the student **sends a question**, not when they only open the place or the question mark.

- Prize wheel → May.
- Film club → Amy.
- Miss Chan’s desk → Miss Chan.
- Storeroom → Ken.
- Leo unlocks the first time a reply the student receives names Leo. That can be May, Miss Chan, or Ken.
- Sam unlocks the first time a reply the student receives names Sam. That can be May, Miss Chan, or Ken.

A useless question still unlocks the speaker. It still does not write a notebook card.

A search never unlocks a person. The hall clue does not mention Leo, so searching the hall does not unlock him.

### Key fact

One English sentence the student has already been given. The album must not add a motive, name the culprit early, or mark Ken’s line as false.

- You: the intro sentence above.
- May, Amy, Miss Chan, and Ken: one sentence from the reply that unlocked them. If that reply is already one sentence, use it. Do not write a new fact.
- Leo and Sam: one sentence from the reply that first named them. Later talks do not replace that sentence.

Ken’s fact may be “I saw Leo go into the storeroom at noon.” The album does not say this is wrong.

## Art

Use only files from the Drive library [Clue Hunt - Irasutoya Asset Library](https://drive.google.com/drive/folders/1DcRpsm74eklw_ces2NqQd_dp5xcU2KwN). Do not generate portraits. Do not crop faces out of the existing scene pictures in the repo. Those scene files are not the shared avatar set, and they are not in this library as portraits.

Checked on 2026-11-06: the library has scenes, objects, signs, and the clipboard. It has **no portrait folder** and no bust of You, Amy, Leo, Ken, Sam, May, or Miss Chan.

Before implementation, download official いらすとや pictures into a new library folder `people/`, and add each source URL to `SOURCES.txt`. Seven files, one face each, simple enough to crop into a circle:

| File role | Who | What to look for |
| --- | --- | --- |
| You | P6 student detective | A child of about that age, calm, not a police officer. |
| Amy | Classmate | A schoolgirl who can be told apart from May. A blue jacket only if an official picture already has one. |
| May | Prize-wheel student | A different schoolgirl from Amy. |
| Leo | Boy who had the box | A schoolboy, safe and ordinary, not frightened. |
| Sam | Boy with the books | A schoolboy who does not look like Leo. |
| Ken | Storeroom student | A schoolboy who does not look like Leo or Sam. |
| Miss Chan | Teacher | One adult woman teacher, calm. |

Talk, People, and the intro all use this same set. Avatars are a circular crop in the page, not a second generated file. The intro may show You larger, but it is the same picture.

If a needed face is still missing from the library when implementation starts, stop and download it first. Do not substitute a generated face.

## Out of scope

- Changing who took the box, why, the time, Ken’s false noon line, or any talk or notebook sentence.
- Renaming `game/clue-hunt.html`.
- Changing the **Be a Detective** easter egg.
- Putting people into the notebook, or clue cards into the People album.
- A saved profile of unlocked people across visits.
- New scene art, new map plates, or new case facts.

## Success criteria for the later implementation

- The case page shows You’s picture and the short intro, and the old case text is still there.
- Talk bubbles show a round avatar and a name. You is on the student’s questions. May, Amy, Miss Chan, or Ken is on the replies.
- People sits next to Notebook on the map and on a scene. The notebook still has no people in it.
- A new game shows only You in People.
- Sending a question unlocks that speaker. A reply that names Leo or Sam unlocks that boy. Searching does not.
- A person page shows the larger picture and the one key fact from the unlocking talk, then can go back to the map.
- Every face is a library file, circular-cropped, and shared by intro, talk, and People.
- Solve answers and the ending text are unchanged.
