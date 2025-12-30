'use strict';
import {readFileSync} from "fs";

export function Groups(){
  this.groups = {};
}

function generateGroupCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

Groups.prototype.getGroup = function (code) {
  return this.groups[code] || null;
};

Groups.prototype.createGroup = function (groupName) {
  let code;
  do {
    code = generateGroupCode();
  } while (this.groups[code]);

  const group = {
    code: code,
    name: groupName,
    members: [],
    wishes: []
  };
  this.groups[code] = group;
  return group;
};

Groups.prototype.joinGroup = function(code, memberId, name, wishes = []) {
  const group = this.getGroup(code);
  if(!group) return null;

  const existing = group.members.find(m => m.id === memberId);
  if (!existing) {
    const isFirst = group.members.length === 0;
    const newMember = { 
        id: memberId, 
        name: name, 
        isAdmin: isFirst,
        score: 0, 
        guesses: {}, 
        assignedTo: null 
    };
    group.members.push(newMember);

    if (Array.isArray(wishes)) {
        wishes.forEach(wishText => {
            if(wishText && wishText.trim() !== "") {
                group.wishes.push({
                    text: wishText,
                    ownerId: memberId,
                    ownerName: name
                });
            }
        });
    }
    return group;
  }
  return group;
};

Groups.prototype.assignSecretSanta = function(code) {
  const group = this.getGroup(code);
  if (!group || group.members.length < 2) return false;

  const ids = group.members.map(m => m.id);
  for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
  }
  for (let i = 0; i < ids.length; i++) {
      const giverId = ids[i];
      const receiverId = ids[(i + 1) % ids.length];
      const giver = group.members.find(m => m.id === giverId);
      const receiver = group.members.find(m => m.id === receiverId);
      giver.assignedTo = receiver.name;
  }
  return true;
};

Groups.prototype.submitGuesses = function(groupCode, playerName, guesses) {
    const group = this.getGroup(groupCode);
    if (!group) return;
    const member = group.members.find(m => m.name === playerName);
    if (member) member.guesses = guesses;
};

Groups.prototype.calculateScores = function(groupCode) {
    const group = this.getGroup(groupCode);
    if (!group) return;

    group.members.forEach(member => {
        let correct = 0;
        let total = 0;
        group.wishes.forEach(wish => {
            if(wish.ownerId === member.id) return; 
            total++;
            if (member.guesses && member.guesses[wish.text] === wish.ownerName) {
                correct++;
            }
        });
        member.score = total === 0 ? 0 : Math.round((correct / total) * 100);
    });
};

Groups.prototype.getInspirationFor = function(groupCode, targetName) {
    const group = this.getGroup(groupCode);
    if (!group) return [];
    let voteCounts = {}; 
    group.members.forEach(member => {
        if (!member.guesses) return;
        for (const [wish, guessedPerson] of Object.entries(member.guesses)) {
            if (guessedPerson === targetName) {
                voteCounts[wish] = (voteCounts[wish] || 0) + 1;
            }
        }
    });
    let maxVotes = 0;
    Object.values(voteCounts).forEach(c => { if(c > maxVotes) maxVotes = c; });
    if (maxVotes === 0) return [];
    return Object.keys(voteCounts).filter(w => voteCounts[w] === maxVotes);
};

Groups.prototype.getUILabels = function (lang) {
  try {
    const labels = readFileSync("./server/data/labels-" + lang + ".json");
    return JSON.parse(labels);
  } catch(e) { return {}; }
}