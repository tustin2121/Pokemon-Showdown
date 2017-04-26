####v2.10

^<20170408>

* **New Pokemon: Redwings1340! He can heal status and HP at the same time!**
* **A Pokemon with Speedrunner now has its Speed lowered by 1 stage at the end of the second full turn it has been on the field.**
* **No Fun Allowed now only changes opposing Pokemon's ability to No Fun on switch-in.**
* *Bug Fix: Mirror Guard interaction with partial trapping. Now it doesn't crash the battle at least!*
* *Bug Fix: Gotta Go Fast now raises the correct stat.*
* *MasterLeoZangetsu's moveset overhauled. Now it doesn't have any boosting move.*
* Iwamiger gets quotes from something completely unrelated.
* Some animation fix.

####v2.09a

^<20161112>

* **Sea and Sky now summons normal rain instead of heavy rain.**
* **Speedrunner no longer has the Technician effect.**
* *Bug Fix: Z-Sash now activates its recovery effect when the holder survives from a lethal hit.*
* *Lass zeowx now has 341 speed to surpass the crowded 339 speed tier.*
* *MasterLeoZangetsu's HP is now a multiple of 4 to make better use of his moveset/item.*
* *Whatevs4's HP is now NOT a multiple of 4.*
* *NoFunMantis and MegaCharizard now has odd HP.*
* *Natsugan's stats are optimized.*
* *Hunting of Proctors' BP increased to 65 from 60.*
* Even more quotes.

* **Known Bugs:**
 * Ganon's Sword's temporary stat boost still happening even when the opposing Pokemon has the No Fun Allowed ability.
 * Pokemon at full health with Sturdy or Focus Sash cannot die from Mine, same for Focus Band/Beat Misty if it triggers.
 * [<Pokemon>'s Speedrunner!] is shown twice when a Pokemon with the ability is switched in.
 * Spoopify doesn't remove added types (this is correct), but the client doesn't show the added types after the types are changed.

     For example, Coryn216 becomes Water/Ice+Dragon after Slick Ice, and Spoopify changes it to Ghost/Ice+Dragon. The client only shows that it's Ghost/Ice type.

----

####v2.09

^<20161111>

* **New Pokemon: MasterLeoZangetsu the Speedrunner! Literally too fast to handle. (Not really.)**
* *(Super Glitch) can now call a bunch of legendary-exclusive moves and more that cannot be called by Metronome.*
* *TM56 can no longer be used under the effect of Heal Block.*
* *TM56 and Hex Attack now target an adjacent Pokemon.*
* *Projectile Spam now targets a random adjacent Pokemon.*
* Some abilities like Spoopify are now reported on the battle screen when triggered.
* More quotes added! The engine now supports quotes in various situations, including First time switch-in, Switch-in, Switch-out, Fainting, Critting, Winning, and using signature moves.
* More move descriptions on hover during battle!
* You can now define move animations as a mix of existing animations!
* Ganon's Sword has gained a custom charging animation.
* (Super Glitch), Evolution Beam and Parting Volt Turn will no longer block the entire battle screen.

* **Now in testing:**
 * Pokemon: Redwings1340, Tustin2121, Burrito
 * Moves: Operation Lovebomb, Drama Reduction

* **Known Bugs:**
 * Ganon's Sword's temporary stat boost still happening even when the opposing Pokemon has the No Fun Allowed ability.
 * Pokemon at full health with Sturdy or Focus Sash cannot die from Mine, same for Focus Band/Beat Misty if it triggers.
 * Z-Sash doesn't activate its recovery effect when the holder survives from a lethal hit.
 * [<Pokemon>'s Speedrunner!] is shown twice when a Pokemon with the ability is switched in.
 * Spoopify doesn't remove added types (this is correct), but the client doesn't show the added types after the types are changed.

     For example, Coryn216 becomes Water/Ice+Dragon after Slick Ice, and Spoopify changes it to Ghost/Ice+Dragon. The client only shows that it's Ghost/Ice type.

----

####v2.08a

^<20161029>

* **New Item: Goat of Arms. Some Goats now has that instead of Rocket Hooves.**
* *Bug Fix: Coryn's ability now works as it should.*
* Goat Flu and Goat of Arms now have proper tags in the client thanks to some mumbo jumbo I did with new status tag things.
* Minor quote additions.

----

####v2.08

^<20161027>

* **New Pokemon: Coryn216! With new ability Slick Ice, and new move Absolute Zero!**
* *Re-Roll will now allow Natsugan to instantly Primal Evolve upon gaining a Red or Blue Orb. Previously Primal Evolution only happened on switch-in.*
* New quotes for existing moves and abilities.

* **Now in testing:** 
 * Pokemon: masterleozangetsu, tustin2121, Burrito.
 * Moves: Power Aboose, Hunting for Proctors, Operation Love
 * Items: Z-Sash
 * Abilities: SpeedRunner

* **Known Bug:** Ganon's Sword's temporary stat boost still happening even when the opposing Pokemon has the No Fun Allowed ability.

----

####v2.07

^<20161026>

* **New Pokemon: Some Goats, for STPPLB+.**
* *Rapid Spin and Defog can remove Mines now.*
* *Quick Sketch, Mimic, and standard Sketch can now no longer copy the explosion result of Set Mine.*
* *Fixed a general bug in Showdown where Sketch and Mimic wouldn't properly copy custom moves from mods (like stpplb).*
* Couple minor quote things.

* **Now in testing:**
 * Pokemon: Tustin2121, Burrito.
 * Moves: Operation Love, (Modified) Attract.

----

####v2.06a

^<20161025>

* *Set Mine can now be cleared by Rapid Spin and Defog.*
* *War Echo won't crash the battle anymore. Not that it did, IIRC.*
* In-battle quotes from the Pokemon no longer spoil move selection or outcome (they're not instantly added anymore, like normal chat messages). Normal chat messages are unaffected.
* Separated out quotes from their moves, so now different Pokemon can say different things. For example, Lorewriter Cole's Text to Speech move will still have him say "I shall smite thee with potatoes of doom! WHEEEEEE", but someone else using the move may repeat the phrase "walnut" or "potato" 20 times instead.
* Pokemon may now say a different quote when sent out in battle for the first time than when sent out subsequent times.
* The client now allows for a custom message hack for starting and ending custom side conditions. Set Mine now uses it to say something more compelling than "Set Mine Started!". I may use this technique in the future for other types of messages.
* Swahahahahaggers now presents itself on switch in, instead of mysteriously causing seemingly random confusion.

----

####v2.06

* ***Testing: Developers now only need to make a team with a name that matches (exactly) an existing mon. That mon will be replaced with the full mon (including moves, abilities, etc) upon starting the battle. For example, an Unown with the name "Natsugan", with no moves assigned, will turn into Natsugan the Flygon, with random Mega Stone in hand, Re-Roll, and other moves.***
* ***Internal refactoring, allowing us to not have to define a Pokemon three times for each of the three formats, among other things.***
* *Due to above, Natsugan now has a consistent EV set (previously, it differed by 4 HP EVs).*
* *Bug Fix: Assassinate now actually hits after using Lock 'n' Load (or any other Lock-On-like move).*
* *Bug Fix: HazorEx no longer Trace's an opponent upon Mega Evolution. (And other bugs might also be fixed due to this streamlining of Mega abilities.)*
* *Bug Fix: Re-Roll should no longer be able to select Re-Roll as a move. It should also allow Mega Evolution for Pokemon that did not start the battle with a Mega Stone.*
* *Bug Fix: Clients should now see the proper abilities of Mega-Evolved mon (ignore the "base" ability thing).*
* Some move descriptions were updated / created. There are still 22 moves without descriptions.
* Added the ability to have multiple quotes for switching in/fainting. Currently only two of Mantis's Pokemon use this to say "GGioz" or "GGCtrl27" at random when fainting. There are still 17 Pokemon without switch in/faint quotes.
* Minor text fixes.

* **Known Bug:** Upon using Re-Roll, the user does not automatically Primal Revert if it receives an orb.

----

####v2.05

* **Updated Mix and Mega code. It may or may not work.**
* *Bug Fix: Pokson and Lyca now reliably retain their abilities upon Mega.*
* *Bug Fix: Normal confusion cannot be placed when the target is already under the effect of sohippy's switch-in confusion.*
* *Bug Fix: Assassinate should now work properly? I hope?*
* *Removed Volt Switch from sohippy's moveset.*
* *Removed U-turn from BigFatMantis' moveset.*
* *Lorewriter Cole's stats are optimized.*
* *Wait4baba flinch chance increased to 30% from 20%.*
* *Blue Screen of Death BP increased to 60 from 40.*
* *Double Ascent BP increased to 95 from 80.*
* *Wail of the Banshee BP decreased to 110 from 140.*
* *Bug Fix: Witch's Curse now works as intended.*
* *God Bird BP increased to 130 from 100.*
* Added quote for War Echo.
* Changed Projectile Spam's animation.

----

####v2.04

* ***Speedy Pokson is removed from STPPLB format due to the addition of Pokson.***
* **New Pokemon: Pokson! He focuses on Water moves and can cripple his opponent's Special Attack while doing damage (if lucky)!**
* **New Pokemon: Cerebral_Harlot! He has a unique ability that forces his opponent out with just a switch-in, and possesses a powerful nuke!**
* **Speedy Pokson is now a Deoxys-Speed with an improved moveset. He now has a way to remove entry hazards!**
* **Soma Ghost now has a wider movepool, an Eviolite, and has changed his nature.**
* *TieSoul now has a consistent moveset in all 3 formats.*
* *Bug fix: Soma Ghost crashing the server when switched in.*
* A lot of entry, exit, faint and move quotes have been added.
* Soma's Ghost has changed his name to Soma Ghost.

----

####v2.03

* **New Pokemon: Trollkitten! She can sleep, confuse and toxic opponents and even trap them!**
* **Swahahahahagers no longer has the Levitate effect.**
* *Fixed various bugs and crashes that resulted from Showdown code updates.*
* *Bug fix: Assassinate now shouldn't miss after a Lock 'n' Load.*
* *Bug fix: Mine now won't crit and will ignore (Baton-passed) substitutes.*
* Numerous animation changes and additions.

----

####v2.02a

* *Bug fix: Mine now works as intended. (A Future-Sight-like attack that triggers on switch-in)*
* *Bug fix: Blue Screen of Death and Dance Riot now have correct priority.*
* God's Wrath now shows the invoked move name in the move list.

------------

####v2.02

* **New Pokemon: Lorewriter Cole! A unique mon that transforms into different fossil deities randomly when switched in, each with its own signature move!**
* *Bug fix: Assassinate and No Guard interaction*

--------------

####v2.01b

* *Assassinate now has 0% accuracy proper.*
* *The Focus Energy effect of Lock 'n' Load now always activates independent of the Lock On effect.*
* The link to the [wiki](/r/tppleague/wiki/stpplb) now shows at the beginning of a battle.

---------------

####v2.01a

* *Fixed Swahahahahagers confusion crashing the battle.*
* *Pokemon with Psychologist is now immune to Swahahahahagers-induced confusion.*
* PikalaxALT no longer riots twice when sent out.

---------------

####v2.01

* **Swahahahahagers reworked - it now always confuses for 1 turn, with 70% self-hit chance.**
* **Quick Sketch reworked - The sketched move is now added to the existing moveset rather than replacing the second move, up to a maximum of 8 moves. Otherwise, it will replace a random move within the first 8 moves the user has.**
* **Re-roll now executes a random move not called Re-roll from user's moveset before changing the user's item.**
* *Ban Evade now raises Evasion to 0 if a Pokemon with the ability has lower than 0 Evasion at turn end with higher than 50% of max HP.*
* *Ban Evade now does NOT raise Evasion to 1 between 50% and 75% of max HP.*
* *Drawing Request now does NOT announce the acquired move in chat.*
* *Hex Attack secondary effect chance raised from 20% to 25%.*
* *Quit your Bullshit now cannot miss, as opposed to having 95% accuracy.*
* *BEST now has appropriate EVs and nature to go with its moveset.*
* *Replaced Kap'n Kooma's Steam Eruption with Scald.*
* *WhatevsFur now has HP EVs, as it is supposed to.*
* *Gotta Go Fast now works properly.*

-----------

####v2.00

* ***The wiki page and the change log are established.***

-----------

***Bold italic: meta changes***

**Bold: major changes (mon remake, new mon etc.)**

*Italic: minor changes and bugfixes (mon adjustments in numbers only, item changes, moveset changes etc.)*

Normal: cosmetic changes (move animations, chat messages etc.)

[Back to STPPLB main page](/r/tppleague/wiki/stpplb)
