import { Template } from 'meteor/templating';

// callback 에 대해 () => {} 쓰면 var self = this에 오류가 발생한다. 그냥 function을 사용한다. 
// Template 
//   events/helpers의 this는 데이터 
//   lifeCycle과 관련한 onCreated/onRendered/onDestory의 this는 template instance 이다. 
Template.addressList.onCreated(function() {
	var self = this;
	console.log('>> onCreated this', this);
	// 템플릿의 this를 넣으면 자동으로 unsubscribe 해준다 
	// 두번째 파라미터는 5개이다. 
	self.subscribe("AddressBookData", 5);
});

Template.addressList.helpers({
    list() {
		console.log('>>helpers this', this);
        // 첫파라미터 : 조회 조건 
        // browser에서 AddressBook.find().fetch() 확인 가능 
        return AddressBook.find({}, {limit: 10, sort: {name: 1}});
    }
});

Template.addressListItem.events({
    'click button[name=remove]' (evt, tmpl) {
        console.log('address list remove this ', this);
        AddressBook.remove({ _id: this._id });
    },
	'click button[name=modify]' (evt, tmpl) {
		// 이벤트에서는 this가 데이터 이다. 
		Session.set("editItem", this._id);
	},
	'click button[name=save]' (evt, tmpl) {
		var address = {
			name : tmpl.find("input[name=name]").value
			,phone : tmpl.find("input[name=phone]").value
			,email : tmpl.find("input[name=email]").value
			,company : tmpl.find("input[name=company]").value
			,birthday : tmpl.find("input[name=birthday]").value
		};

		try { 
			check(address.name, NotEmptyString);
			check(address.email, EmailString);
			check(address.phone, PhoneString);
			check(address.company, NotEmptyString);
			check(address.birthday, BirthDayString);
		} catch(err) {
			console.log('update', err.message);
			return;
		}
		AddressBook.update({_id: this._id}, {$set:address});
		Session.set("editItem", null);
	},
	'click button[name=cancel]' (evt, tmpl) {
		Session.set("editItem", null);
	},
	'click .edit-thing' (evt, tmpl) {
		Session.set("editItem", this._id);
	}
});

Template.addressListItem.helpers({
	editing () {
	   return this._id === Session.get("editItem");
	}
});

Template.addressInput.events({
	'click button[name=saveAddress]' (evt, tmpl){
		var address = {
			name : tmpl.find("input[name=name]").value
			,phone : tmpl.find("input[name=phone]").value
			,email : tmpl.find("input[name=email]").value
			,company : tmpl.find("input[name=company]").value
			,birthday : tmpl.find("input[name=birthday]").value
			,owner:	Meteor.userId()
		};

		// try { 
		// 	check(address.name, NotEmptyString);
		// 	check(address.email, EmailString);
		// 	check(address.phone, PhoneString);
		// 	check(address.company, NotEmptyString);
		// 	check(address.birthday, BirthDayString);
		// } catch(err) {
		// 	console.log('insert', err.message);
		// 	return;
		// }
		AddressBook.insert(address);

		tmpl.find("input[name=name]").value = "";
		tmpl.find("input[name=phone]").value = "";
		tmpl.find("input[name=email]").value = "";
		tmpl.find("input[name=company]").value = "";
		tmpl.find("input[name=birthday]").value = "";
	}
});