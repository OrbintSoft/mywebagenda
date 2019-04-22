/**
* This is defines the storage provider for my agenda
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
    var count = 0;
    /**
     * @param {HTMLElement} container the html container for the agenda
     */
    agendaPrototype.Render = function (container) {
        this.HtmlContainer = container;
        for (var i in this.Contacts) {            
            this.RenderNewContact(this.Contacts[i]);
            count++;
        }        
    };

    /**    
     * @param {agenda.Contact} contact the new contact to  be rendered
     */
    agendaPrototype.RenderNewContact = function (contact) {
        if (this.HtmlContainer instanceof HTMLElement) {
            var contactContainer = window.document.createElement('article');
            contactContainer.setAttribute('class', 'myagenda-contact')
            contactContainer.setAttribute('data-agenda-contact', count);
            contact.RenderView(this, contactContainer);
            this.HtmlContainer.appendChild(contactContainer);
            count++;
        }
    };

    /**    
     * @param {HTMLDListElement} dl the container
     * @param {String} name The name
     * @param {HTMLElement} value The Value
     */
    function addDefinitionItem(dl, name, value) {
        var dt = window.document.createElement('dt');
        dt.innerText = name;
        var dd = window.document.createElement('dd');
        dd.appendChild(value);
        dl.appendChild(dt);
        dl.appendChild(dd);
    }

    /**    
     * @param {String} type, the protocolo (http://, mailto:. tel:)
     * @param {String} value the displayed text
     * @returns {HTMLAnchorElement} the link
     */
    function createLink(type, value) {
        var a = window.document.createElement('a');
        a.setAttribute('href', type + value);
        a.innerText = value;
        return a;
    }

    /**
     * @param {agenda} agenda the agenda 
     * @param {HTMLElement} container the html container
     */
    agenda.Contact.prototype.RenderView = function (agenda, container) {
        var self = this;
        container.innerHTML = '';
        var dl = window.document.createElement('dl');
        addDefinitionItem(dl, "Name:", window.document.createTextNode(this.Name));
        if (this.Company) {
            addDefinitionItem(dl, "Company:", window.document.createTextNode(this.Company));
        }
        if (this.Phone) {
            addDefinitionItem(dl, 'Phone Number:', createLink('tel:', this.Phone));
        }
        if (this.Email) {
            addDefinitionItem(dl, 'E-mail:', createLink('mailto:', this.Email));
        }
        if (this.WebSite) {
            addDefinitionItem(dl, 'Web Site:', createLink('', this.WebSite));
        }
        if (this.Notes) {
            addDefinitionItem(dl, 'Notes:', window.document.createTextNode(this.Notes));
        }       
        container.appendChild(dl);
        var deleteButton = window.document.createElement('input');
        deleteButton.setAttribute('type', 'button');
        deleteButton.setAttribute('value', 'Remove');       
        deleteButton.onclick = function () {
            agenda.Remove(self);
            agenda.GetStorageProvider().DeleteById(self.Id, function () {
                container.parentNode.removeChild(container);
            });
        };
        container.appendChild(deleteButton);
        var editButton = window.document.createElement('input');
        editButton.setAttribute('type', 'button');
        editButton.setAttribute('value', 'Edit');
        editButton.onclick = function () {
            self.RenderEdit(agenda, container);
        };
        container.appendChild(editButton);
    };

    function createInput(type, value) {
        var el = window.document.createElement('input');
        el.setAttribute('type', type);
        el.setAttribute('value', value);
        return el;
    }

    agenda.Contact.prototype.RenderEdit = function (agenda, container) {
        var self = this;
        container.innerHTML = '';
        var dl = window.document.createElement('dl');
        var nameI = createInput('text', this.Name);
        addDefinitionItem(dl, "Name:", nameI);
        var companyI = createInput('text', this.Company);
        addDefinitionItem(dl, "Company:", companyI);
        var phoneI = createInput('phone', this.Phone);
        addDefinitionItem(dl, 'Phone Number:', phoneI);
        var emailI = createInput('email', this.Email);
        addDefinitionItem(dl, 'E-mail:', emailI);
        var websiteI = createInput('website', this.WebSite);
        addDefinitionItem(dl, 'Web Site:', websiteI);
        var notesI = document.createElement('textarea');
        notesI.value = this.Notes;
        addDefinitionItem(dl, 'Notes:', notesI);        
        container.appendChild(dl);
        var saveButton = window.document.createElement('input');
        saveButton.setAttribute('type', 'button');
        saveButton.setAttribute('value', 'Save');
        saveButton.onclick = function () {
            self.Name = nameI.value;
            self.Company = companyI.value;
            self.Phone = phoneI.value;
            self.Email = emailI.value;
            self.WebSite = websiteI.value;
            self.Notes = notesI.value;
            agenda.GetStorageProvider().SaveContact(self, function () {
                self.RenderView(agenda, container);
            });
        };
        container.appendChild(saveButton);
    };

    return agenda;
}));


