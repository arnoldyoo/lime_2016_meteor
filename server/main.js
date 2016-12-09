import { Meteor } from 'meteor/meteor';
import { fixtures } from './fixture';

Meteor.startup(() => {
  // code to run on server at startup
  if (AddressBook.find().count() === 0) {
    console.log('There is no data');
    for (let i=0, len=100; i<len; i++) {
      AddressBook.insert(fixtures[i]);
    }
  }
});
