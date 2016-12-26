function PopupObject() {
    this.popupId = 'popup';
    this.closeId = 'close-popup';
}

PopupObject.prototype = {
    init: function (popupId, closeButton) {

        if (popupId) {
            this.popupId = popupId;
        }
        if (closeButton) {
            this.closeId = closeButton;
        }
        document.getElementById(this.closeId).onclick = this.hide;
        document.getElementById(this.popupId).onclick = function (e) {
            e.stopPropagation();
        }

    },

    popupAction: function () {
        event.stopPropagation();
        document.getElementById(this.popupId).classList.toggle("show");

    },

    hide: function () {
        document.getElementById(this.popupId).classList.remove("show");
    }

};

function Content() {
    this.emptyClassName = 'empty-link';
        this.emailId = 'email';
        this.email = 'imskyba@gmail.com';
        this.dateId = 'current-date'
}

Content.prototype = {
    init: function (emptyClassName, emailId, email, dateId) {

        if (emptyClassName) {
            this.emptyClassName = emptyClassName;
        }
        if (emailId) {
            this.emailId = emailId;
        }
        if (email) {
            this.email = email;
        }
        if (dateId) {
            this.dateId = dateId;
        }

        var empty = document.getElementsByClassName(this.emptyClassName);

        for (var key in empty) {
            empty[key].onclick = function () {
                alert('Only the Mail and Facebook!');
            }
        }
        document.getElementById(this.emailId).onclick = this.showEmail;

        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1; //January is 0!
        var yyyy = today.getFullYear();
        var object = document.getElementById(this.dateId);

        object.innerText = yyyy;
        object.setAttribute('title', dd+'.'+mm+'.'+yyyy);

        document.body.onclick = function() {
            jsonObject.hide();
            popupObject.hide();
        };
    },

    showEmail: function () {
        alert(this.email);
    }
};

function ThemeObject() {
    this.wrapper = 'theme'
}

ThemeObject.prototype = {
    init: function (wrapper) {

        if (wrapper) {
            this.wrapper = wrapper;
        }
        document.getElementById('white-theme').onclick = themeObject.changeTheme;
        document.getElementById('black-theme').onclick = themeObject.changeTheme;
    },

    changeTheme: function () {

        if(this.classList.contains("active")){
            return false;
        }
        document.getElementById(themeObject.wrapper).classList.toggle("black");
        document.getElementById('white-theme').classList.toggle("active");
        document.getElementById('black-theme').classList.toggle("active");
    }
};

function JsonObject() {
    this.jsonVar = {};
}

JsonObject.prototype = {
    init: function () {
        var elements = document.querySelectorAll('[data-bind]');

        this.getJsonData('data/data.json', this.appendData);
        elements.forEach(function(item){
            item.ondblclick = this.openInput;
            item.onclick = function (e) {
                e.stopPropagation();
            };
        }.bind(this));

        elements = document.querySelectorAll('[data-input]');
        elements.forEach(function(item){
            item.onclick = function (e) {
                e.stopPropagation();
            };
        })

    },

    openInput: function () {

        var inputAttr = this.getAttribute("data-bind");

        this.classList.add('hidden');
        var elements = document.querySelectorAll('[data-input]');
        elements.forEach(function(item){
            if (item.getAttribute('data-input') == inputAttr) {
                item.classList.add('active');
                item.focus();
            }
        })
    },

    hide: function () {

        var inputElements = document.querySelectorAll('[data-input]');
        var htmlElements = document.querySelectorAll('[data-bind]');
        var inputValues = {};

        inputElements.forEach(function(item){
            inputValues[item.getAttribute('data-input')] = item.value;
            item.classList.remove('active');
        });

        htmlElements.forEach(function(item){
            item.classList.remove('hidden');
        });

        if(this.checkIfDataChange(inputValues)) {
            htmlElements.forEach(function(item){
                if (item.innerText != this.jsonVar[item.getAttribute('data-bind')]) {
                    item.innerText = this.jsonVar[item.getAttribute('data-bind')];
                }
            }.bind(this));
            this.setJsonData('data/data.json')
        }
    },

    checkIfDataChange: function (data) {

        var flag = false;

        for (var key in data) {
            if (typeof data[key] != 'undefined' && (data[key] != this.jsonVar[key])) {
                this.jsonVar[key] = data[key];
                flag = true;
            }
        }

        return flag;
    },

    getJsonData: function (file, callback) {
        this.request(file, callback);
    },

    setJsonData: function (file) {
        // Some code to change data in json file;
    },

    request: function (file, callback) {

        var xobj;

        if (window.XMLHttpRequest) { // Mozilla, Safari
            xobj = new XMLHttpRequest();
        } else if (window.ActiveXObject) { // IE
            xobj = new ActiveXObject("Microsoft.XMLHTTP");
        } else{
            return false;
        }

        xobj.overrideMimeType("application/json");
        xobj.open('GET', file, true);
        xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
                callback.call(this, xobj.responseText);
            }
        }.bind(this);
        xobj.send(null);
    },

    convertTextJson: function (text) {

        var jsonData =  JSON.parse(text);

        this.jsonVar = jsonData;
        return jsonData;
    },

    convertJsonText: function (json) {
        return JSON.stringify(json)
    },

    appendData: function (text) {

        var htmlElements = document.querySelectorAll('[data-bind]');
        var inputElements = document.querySelectorAll('[data-input]');

        this.convertTextJson(text);

        htmlElements.forEach(function(item){

            var key = item.getAttribute('data-bind');

            if (jsonObject.jsonVar[key]) {
                item.innerText = jsonObject.jsonVar[key];
            }
        });

        inputElements.forEach(function(item){

            var key = item.getAttribute('data-input');

            if (jsonObject.jsonVar[key]) {
                if (item.localName == "textarea") {
                    item.innerText = jsonObject.jsonVar[key];
                } else {
                    item.setAttribute('value', jsonObject.jsonVar[key]);
                }
            }
        });

    }
};

var slider = {
    // to be continued
};