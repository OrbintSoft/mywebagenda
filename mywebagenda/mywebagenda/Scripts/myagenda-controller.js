/**
* This is a sigle web page application controller based on events
 * 
* @author  Stefano Balzarotti
* @version 1.0
* @since   2019-04-21
*/
(function (context) {
    "use strict";
    var myAgenda = new context.MyAgenda();
    myAgenda.SetStorageProvider(new context.MyAgenda.StorageProviders.LocalStorage('myagenda'));
    var newform = context.document.getElementById('newContactForm');
    var loadAction = function (event) {
        myAgenda.GetStorageProvider().Load(function (contacts) {
            var agendaContainer = document.getElementById('contacts-list');
            myAgenda.Render(agendaContainer);
        });
    };

    var hashChangeHandler = function () {
        switch (context.location.hash) {
            case "":
                break;
            default:
                return;
        }
    };

    var newAction = function (evt) {
        evt.preventDefault();
        var formData = new context.FormData(newform);
        var contact = new context.MyAgenda.Contact(formData.get('contact-name'));
        contact.Company = formData.get('contact-company');
        contact.Phone = formData.get('contact-phone');
        contact.Email = formData.get('contact-email');
        contact.WebSite = formData.get('contact-website');
        contact.Notes = formData.get('contact-notes');
        myAgenda.Add(contact);
        myAgenda.GetStorageProvider().SaveContact(contact, function (c) {
            myAgenda.RenderNewContact(contact);
        });
        newform.reset();
        return false;
    };

    window.addEventListener('load', loadAction, false);
    window.addEventListener('hashchange', hashChangeHandler, false);
    newform.addEventListener('submit', newAction);
})(window);
