/**
* This defines the storage providers for MyAgenda
 * 
* @author  Stefano Balzarotti
* @version 1.0
* @since   2019-04-21
*/

(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["MyAgenda"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("MyAgenda"));
    } else {
        root.MyAgenda = factory(root.MyAgenda);
    }
}(this, function (agenda) {
    "use strict";
    var agendaPrototype = agenda.prototype;

    /**Default storage provider, used as interface for other providers */
    var baseStorageProvider = function () {
        this.Name = 'BaseStorageProvider';
    };

    baseStorageProvider.prototype = {
        /**
         * @param {Function} callback the callback
         *  load the list of contacts from storage 
         * */
        Load: function (callback) {
            if (callback && typeof callback === 'function') {
                callback.apply(this, [this._agenda.Contacts]);
            }
        },
        /**
         * Save all contacts
         * @param {Function} callback the callback
         */
        Store: function (callback) {
            if (callback && typeof callback === 'function') {
                callback.apply(this, [true]);
            }
        },
        /**
         * clear the storage
         * @param {Function} callback the callback
         */
        Clear: function (callback) {
            if (callback && typeof callback === 'function') {
                callback.apply(this, [true]);
            }
        },
        /**
         * Load a single contact by id
         * @param {Number} id the id of the contact
         * @param {Function} callback the callback
         */
        LoadById: function (id, callback) {
            var found = this.Contacts.find(function (el) {
                return el.id === id;
            });
            if (callback && typeof callback === 'function') {                
                callback.apply(this, [found]);
            }
        },
        /**
         * Save a single contact
         * @param {agenda.Contact} contact the contact
         * @param {Function} callback the callback
         */
        SaveContact: function (contact, callback) {
            if (callback && typeof callback === 'function') {
                callback.apply(this, [true]);
            }
        },
        /**
         * Delete a single contact by id
         * @param {agenda.Contact} id the id of the contact
         * @param {Function} callback the callback
         */
        DeleteById: function (id, callback) {
            if (callback && typeof callback === 'function') {
                callback.apply(this, [true]);
            }
        }
    };

    /**In memory provider, useful for tests */
    var memoryProvider = function () {
        this.Name = 'MemoryProvider';
    };

    memoryProvider.prototype = Object.create(baseStorageProvider.prototype);    
    memoryProvider.prototype._memoryArray = [];
    memoryProvider.prototype.Load = function (callback) {
        for (var i in this._memoryArray) {
            if (this._memoryArray[i]) {
                agendaPrototype.Contacts.push(this._memoryArray[i]);
            }            
        }
        if (callback && typeof callback === 'function') {
            callback.apply(this, [this._memoryArray]);
        }
    };
    memoryProvider.prototype.Store = function (callback) {
        for (var i in this._agenda.Contacts) {
            if (this._agenda.Contacts[i].Id === -1) {
                this._agenda.Contacts[i].Id = this._memoryArray.Lenght; //Generate a new auto increment id
            }
            this._memoryArray[this._agenda.Contacts[i].Id] = this._agenda.Contacts[i];
        }
        if (callback && typeof callback === 'function') {
            callback.apply(this, [true]);
        }
    };

    memoryProvider.prototype.Clear = function (callback) {
        this._memoryArray = [];
        if (callback && typeof callback === 'function') {
            callback.apply(this, [true]);
        }
    };

    memoryProvider.prototype.LoadById = function (id, callback) {
        var contact = null;
        if (this._memoryArray[id]) {
            var found = false;
            for (var i in this.Contacts) {
                if (this._agenda.Contacts[i].Id === id) {
                    this._agenda.Contacts[i] = this._memoryArray[id];
                    found = true;
                }
            }
            if (!found) {
                this._agenda.Contacts.push(this._memoryArray[id]);
            }
        }
        if (callback && typeof callback === 'function') {
            callback.apply(this, [contact]);
        }
    };

    memoryProvider.prototype.SaveContact = function (contact, callback) {
        if (contact.Id === 0) {
            contact.Id = this._memoryArray.Lenght + 1;
        }
        memoryProvider.prototype._memoryArray[contact.Id] = contact;
        if (callback && typeof callback === 'function') {
            callback.apply(this, [true]);
        }
    };

    memoryProvider.prototype.DeleteById = function (id, callback) {
        delete this._memoryArray[id];
        if (callback && typeof callback === 'function') {
            callback.apply(this, [true]);
        }
    };

    /**use the window local storage
     * @param {String} key The key to be used for storage
     * **/
    var localStorageProvider = function (key) {
        this.Name = 'LocalStorage';
        this._key = key;        
    };

    localStorageProvider.prototype = Object.create(baseStorageProvider.prototype);
    localStorageProvider.prototype.Load = function (callback) {
        var value = window.localStorage.getItem(this._key);
        if (value) {
            var contacts = JSON.parse(value);
            for (var i in contacts) {
                if (contacts[i]) {
                    var c = new agenda.Contact(contacts[i]._name);
                    c.Id = contacts[i]._id;
                    c.Company = contacts[i]._company;
                    c.Phone = contacts[i]._phone;
                    c.Email = contacts[i]._email;
                    c.WebSite = contacts[i]._website;
                    c.Notes = contacts[i]._notes;
                    this._agenda.Contacts.push(c);
                }
            }
        }
        if (callback && typeof callback === 'function') {
            callback.apply(this, [this._agenda.Contacts]);
        }
    };
    localStorageProvider.prototype.Store = function (callback) {
        for (var i in this._agenda.Contacts) {
            if (this._agenda.Contacts[i].Id === -1) {
                this._agenda.Contacts[i].Id = i;
            }
            window.localStorage.setItem(this._key, JSON.stringify(this._agenda.Contacts));
        }
        if (callback && typeof callback === 'function') {
            callback.apply(this, [true]);
        }
    };

    localStorageProvider.prototype.Clear = function (callback) {
        window.localStorage.setItem(this._key, '');
        if (callback && typeof callback === 'function') {
            callback.apply(this, [true]);
        }
    };

    localStorageProvider.prototype.LoadById = function (id, callback) {
        var self = this;
        this.Clear(function () {
            self.Load(function () {
                if (callback && typeof callback === 'function') {
                    callback.apply(self, [self._agenda.Contacts[id]]);
                }
            });
        });
    };

    localStorageProvider.prototype.SaveContact = function (contact, callback) {
        var self = this;        
        this.Clear(function () {
            self.Store(function () {
                if (callback && typeof callback === 'function') {
                    callback.apply(this, [true]);
                }
            });
        });
    };

    localStorageProvider.prototype.DeleteById = function (id, callback) {
        var self = this;
        if (this._agenda.Contacts[id]) {
            delete this._agenda.Contacts[i];
        }
        this.Clear(function () {
            self.Store(function () {
                if (callback && typeof callback === 'function') {
                    callback.apply(this, [true]);
                }
            });
        });
    };

    var indexedDbProvider = function () {
    };

    var httpRestProvider = function (configuration) {
        this._configuration = configuration;
    };


    /**
    * @param {baseStorageProvider} provider the storageProvider
    */
    agendaPrototype.SetStorageProvider = function (provider) {
        this._storageProvider = provider;
        provider._agenda = this;
    };

    /**
     * @returns {baseStorageProvider} provider
     */
    agendaPrototype.GetStorageProvider = function () {
        return this._storageProvider;
    };


    agendaPrototype.SetStorageProvider(new baseStorageProvider()); // default

    /*list of available providers*/
    agenda.StorageProviders = {
        MemoryProvider: memoryProvider,
        LocalStorage: localStorageProvider,
        IndexedDbProvider: indexedDbProvider,
        HttpRestProvider: httpRestProvider
    };

    return agenda;  
}));