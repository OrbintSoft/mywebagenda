/**
* This is data model representation of a simple agenda
 * 
* @author  Stefano Balzarotti
* @version 1.0
* @since   2019-04-20 
*/

/**Universal Module Definition*/
(function (root, factory) {
    if (typeof define === "function" && define.amd) {
        define(["MyAgenda"], factory);
    } else if (typeof module === "object" && module.exports) {
        module.exports = factory(require("MyAgenda"));
    } else {
        root.MyAgenda = factory(root.MyAgenda);
    }
}(this, function () {
    'use strict';
    /**
     * @param {String} name The name of the contact
    */
    var contact = function (name) {
        this.Name = name;
    };

    contact.prototype = {
        _id: -1,
        _name: "",
        _company: "",
        _phone: "",
        _email: "",
        _website: "",
        _notes: "",

        /**
         * @returns {Number} the unique identifier of the contact
         */
        get Id() {
            return this._id;
        },
        /**
         * @param {Number} id the unique identifier of the contact
        */
        set Id(id) {
            this._id;
        },

        /**
         * @returns {String} the Name of the contact
         */
        get Name() {
            return this._name;
        },
        /**
         * @param {String} name the Name of the contact
         */
        set Name(name) {
            if (name && typeof name === "string") {
                this._name = name;
            } else {
                throw "name is invalid";
            }
        },
        /**
         * @returns {String} the Company
         */
        get Company() {
            return this._company;
        },
        /**
         * @param {String} company the Company
         */
        set Company(company) {
            if (typeof name === "string") {
                this._company = company;
            } else {
                throw "company is invalid";
            }
        },
        /**
         * @returns {String} the Phone Number
         */
        get Phone() {
            return this._phone;
        },
        /**
         * @param {String} phone the Phone Number
         */
        set Phone(phone) {
            if (typeof name === "string") {
                this._phone = phone;
            } else {
                throw "phone is invalid";
            }
        },
        /**
         * @returns {String} the E-Mail
         */
        get Email() {
            return this._email;
        },
        /**
         * @param {String} email the E-Mail
         */
        set Email(email) {
            if (typeof name === "string") {
                this._email = email;
            } else {
                throw "email is invalid";
            }
        },
        /**
         * @returns {String} the Website
         */
        get WebSite() {
            return this._website;
        },
        /**
         * @param {String} website the WebSite
         */
        set WebSite(website) {
            if (typeof website === "string") {
                this._website = website;
            } else {
                throw "website is invalid";
            }
        },
        /**
         * @returns {String} the Notes
         */
        get Notes() {
            return this._notes;
        },
        /**
         * @param {String} notes the Notes
         */
        set Notes(notes) {
            if (typeof notes === "string") {
                this._notes = notes;
            } else {
                throw "notes is invalid";
            }
        }
    };

    /**
     * Creates a new Agenda
     * */
    var agenda = function () {
    };

    agenda.prototype = {
        _contacts: [],

        /**@returns {contacts[]} the list of contacts**/
        get Contacts() {
            return this._contacts;
        },
        /**
         * @param {contact} contact Add a contact to the list
         */
        Add: function (contact) {
            this._contacts.push(contact);
        },
        /**
         * Remove a contact from the list
         * @param {Contact} contact the contact to remove
         * @returns {Boolean} true if the element to remove is found
         */
        Remove: function (contact) {
            var index = this._contacts.indexOf(contact);
            if (index > -1) {
                this._contacts.splice(index, 1);
                return true;
            } else {
                return false;
            }
        }
    };

    agenda.Contact = contact;
    return agenda;
}));
