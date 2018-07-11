exports.BattleScripts = {
	pokemon: {
		damage(d, source, effect) {
			if (!this.hp) return 0;
			if (d < 1 && d > 0) d = 1;
			d = Math.floor(d);
			if (isNaN(d)) return 0;
			if (d <= 0) return 0;
			this.hp -= d;
			if (this.hp <= 0) {
				d += this.hp;
				if (this.battle.getTemplate(this.baseTemplate.baseSpecies).prevo && !this.transformed) {
					this.willDevolve = true;
					// return this.hp;
				}
				else
					this.faint(source, effect);
			}
			return d;
		},
		devolve: function() {
			let currTemplate = this.battle.getTemplate(this.baseTemplate.baseSpecies);
			if(!currTemplate.prevo || this.transformed) return false;
			let template = this.template.isMega ? this.battle.getTemplate(this.battle.getTemplate(this.template.baseSpecies).prevo) : this.battle.getTemplate(this.template.prevo);
			
			let abilityIndex = '0';
			for (let abilitySlot in currTemplate.abilities) {
				if (!template.abilities[abilitySlot]) continue;
				if (toId(currTemplate.abilities[abilitySlot]) === toId(this.set.ability)) {
					abilityIndex = abilitySlot;
					break;
				}
			}
			
			this.willDevolve = false;
			this.formeChange(template);
			this.baseTemplate = template;
			this.details = template.species + (this.level === 100 ? '' : ', L' + this.level) + (this.gender === '' ? '' : ', ' + this.gender) + (this.set.shiny ? ', shiny' : '');
			this.battle.add('detailschange', this, this.details);
			this.battle.add('-message', "" + this.name + " has de-volved into "+template.name+"!");
			// this.battle.add('-message', `${abilityIndex} => ${template.abilities[abilityIndex]}`);
			this.setAbility(template.abilities[abilityIndex]);
			this.baseAbility = this.ability;
			let newHP = Math.floor(Math.floor(2 * this.template.baseStats['hp'] + this.set.ivs['hp'] + Math.floor(this.set.evs['hp'] / 4) + 100) * this.level / 100 + 10);
			this.hp = newHP;
			this.maxhp = newHP;
			this.battle.add('-heal', this, this.getHealth, '[silent]');
			// this.battle.heal(this.maxhp, this, null, 'devolution', '[silent]');
			let movepool = template.learnset;
			let prevo = template.prevo;
			while(prevo) {
				let learnset = this.battle.getTemplate(prevo).learnset;
				for(let i in learnset) {
					movepool[i] = learnset[i];
				}
				prevo = this.battle.getTemplate(prevo).prevo;
			}
			let newmoves = [], newbasemoves= [];
			for(let i=0;i<this.baseMoveSlots.length; i++) {
				if(movepool[this.baseMoveSlots[i].id]) {
				 	newbasemoves.push(this.baseMoveSlots[i]);
				 	newmoves.push(this.moveSlots[i]);
				}
			}
			this.baseMoveSlots = newbasemoves;
			this.moveSlots = newmoves;
			this.clearBoosts();
			this.battle.add('-clearboost', this, "[silent]");
			this.species = this.template.species;
			this.canMegaEvo = false;
			this.cureStatus('[silent]');
			this.volatiles = {};
			return true;
		}
	}
};