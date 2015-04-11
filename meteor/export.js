// enquire.js makes `enquire` global on the window (or global) object, while Meteor expects a file-scoped global variable
enquire = this.enquire;
delete this.enquire;
