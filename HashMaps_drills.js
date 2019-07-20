class HashMap {
  constructor(initialCapacity=8) {
      this.length = 0;
      this._hashTable = [];
      this._capacity = initialCapacity;
      this._deleted = 0;
  }

  get(key) {
      const index = this._findSlot(key);
      if (this._hashTable[index] === undefined) {
          return undefined;
      }
      return this._hashTable[index].value;
  }

  set(key, value){
      const loadRatio = (this.length + this._deleted + 1) / this._capacity;
      if (loadRatio > HashMap.MAX_LOAD_RATIO) {
          this._resize(this._capacity * HashMap.SIZE_RATIO);
      }
      //Find the slot where this key should be in
      const index = this._findSlot(key);

      if(!this._hashTable[index]){
          this.length++;
      }
      this._hashTable[index] = {
          key,
          value,
          DELETED: false
      }; 
  }

  delete(key) {
      const index = this._findSlot(key);
      const slot = this._hashTable[index];
      if (slot === undefined) {
          throw new Error('Key error');
      }
      slot.DELETED = true;
      this.length--;
      this._deleted++;
  }

  _findSlot(key) {
      const hash = HashMap._hashString(key);
      const start = hash % this._capacity;

      for (let i=start; i<start + this._capacity; i++) {
          const index = i % this._capacity;
          const slot = this._hashTable[index];
          if (slot === undefined || (slot.key === key && !slot.DELETED)) {
              return index;
          }
      }
  }

  _resize(size) {
      const oldSlots = this._hashTable;
      this._capacity = size;
      // Reset the length - it will get rebuilt as you add the items back
      this.length = 0;
      this._deleted = 0;
      this._hashTable = [];

      for (const slot of oldSlots) {
          if (slot !== undefined && !slot.DELETED) {
              this.set(slot.key, slot.value);
          }
      }
  }

  static _hashString(string) {
      let hash = 5381;
      for (let i = 0; i < string.length; i++) {
          //Bitwise left shift with 5 0s - this would be similar to
          //hash*31, 31 being the decent prime number
          //but bit shifting is a faster way to do this
          //tradeoff is understandability
          hash = (hash << 5) + hash + string.charCodeAt(i);
          //converting hash to a 32 bit integer
          hash = hash & hash;
      }
      //making sure has is unsigned - meaning non-negtive number. 
      return hash >>> 0;
  }
}

const main = () => {
  HashMap.MAX_LOAD_RATIO = 0.5;
  HashMap.SIZE_RATIO = 3;

  const dict = new HashMap();

  dict.set("Hobbit", "Bilbo");
  dict.set("Hobbit", "Frodo");
  dict.set("Wizard", "Gandolf");
  dict.set("Human", "Aragon");
  dict.set("Elf", "Legolas");

  console.log(dict);
}

const WhatDoesThisDo = function(){
  let str1 = 'Hello World.';
  let str2 = 'Hello World.';
  let map1 = new HashMap();
  map1.set(str1,10);
  map1.set(str2,20);
  let map2 = new HashMap();
  let str3 = str1;
  let str4 = str2;
  map2.set(str3,20);
  map2.set(str4,10);

  console.log(map1.get(str1));
  console.log(map2.get(str3));
}

// {"Hobbit": "Bilbo"}, {"Hobbit": "Frodo"},
// {"Wizard": "Gandolf"}, {"Human": "Aragon"}, {"Elf": "Legolas"}, {"Maiar": "The Necromancer"},
// {"Maiar": "Sauron"}, {"RingBearer": "Gollum"}, {"LadyOfLight": "Galadriel"}, {"HalfElven": "Arwen"},
// {"Ent": "Treebeard"}

// main();
// WhatDoesThisDo();

const input = "google all that you think can think of";

const removeDuplicates = (str) => {
  // Create a new hashtable;
  // iterate over each character in the string;
  // insert each unique iteration into the hash table
  // add it to the return string;
  // if it already exist, do not return it;

  const uniqueChar = new HashMap();
  let returnStr = '';

  for (let i = 0; i < str.length; i++) {
    let idx = str[i];
    uniqueChar.set(idx, 1);
    if (uniqueChar.get(idx)) {
      uniqueChar.set(idx, 0);
    }
  }

  console.log(uniqueChar);

  return returnStr;
}

// console.log(removeDuplicates(input));

const palindrome = (str) => {
  const uniqueChar = new HashMap()

  // Create a new hashtable
  // iterate over each character in the string
  // insert each unique iteration into the hash table
  // if it already exists, delete the object
  // if hashmap length is zero or 1, return true


  for (let i = 0; i < str.length; i++) {
    const idx = str[i];
    if (!uniqueChar.get(idx)) {
      uniqueChar.set(idx, 1);
    } else {
      uniqueChar.delete(idx);
    }
  }
  console.log(uniqueChar);
  return uniqueChar.length === 0 || uniqueChar.length === 1;
}

// console.log(palindrome('acecarr'));

const anagrams = ['east', 'cars', 'acre', 'arcs', 'teas', 'eats', 'race'];
const expected = [['east', 'teas', 'eats'], ['cars', 'arcs'], ['acre', 'race']]

const anagramGroup = (arr) => {
  let table = new HashMap();
  arr.forEach(word => {
    let sortWord = word.split('').sort().join('');
    if (!table.get(sortWord)) {
      table.set(sortWord, [word]);
    } else {
      const key = table.get(sortWord);
      key.push(word);
    }

  });

  // console.log(table);
  // Create a new hasthable
  // iterate over the array
  // insert each word into the hashtable
  // for each inserted word, check if the following word has the same chars, if so, push the group into a new array

  const filtered = table._hashTable.filter(obj => obj.value !== undefined);

  const result = filtered.map(obj => {
      return [...obj.value]
  })

  console.log(result);
}

anagramGroup(anagrams);