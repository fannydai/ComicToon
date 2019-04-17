(function (window, undefined) {
    console.log('omg');
    "use strict";
    var muroContainer = document.getElementsByClassName("muro-container")[0],
        muroIframe    = muroContainer.getElementsByClassName("muro")[0],
        loadingDiv    = muroContainer.getElementsByClassName("muro-loading")[0];
    function receiveMessage(message) {
        /* Whenever you're using postMessage, you should always validate
         * the source and/or origin of the message to ensure that you're
         * not being given spoofed messages by someone iframing you.
         *
         * Since this reference script doesn't know where you'll be
         * hosting the sandbox iframe, we can't check the origin, but
         * we can check that the message comes from the iframe we
         * opened it in.
         */
        if (message.source !== muroIframe.contentWindow) {
            return; // Not from our iframe, ignore it.
        }
        /* Muro can pass a number of message types, see the documentation
         * for details, in this example we only care about the 'ready' and
         * 'done' messages.
         */
        if (message.data.type === 'ready') {
            /* A ready event indicates that muro has finished setting loading
             * and importing any background image you requested.
             * On a side note, if you're hiding the muro embed, always use
             * visibility: hidden rather than display: none, otherwise muro
             * won't be able to figure out its layout correctly.
             */
            muroIframe.style.visibility = 'visible';
            loadingDiv.style.visibility = 'hidden';
        } else if (message.data.type === 'done' || (message.data.type === 'queryReply' && message.data.query === 'image')) {
            /* A done event indicates the user has pressed the "done" button,
             * within the payload is a base64-encoded data: url of the image
             * under 'image'.
             */
            var image = message.data.image;
            /* Once you've got the image data, you could save it to your server
             * by passing it in an AJAX call, or do something stupid like this:
             */
            if (!/\'/.test(image)) {
                var body = document.getElementsByTagName("body")[0];
                body.style.backgroundImage = "url('" + image + "')";
            }
            if (message.data.type === 'done') {
          muroContainer.innerHTML = "<div class=\"done\"><h1>Yay, your picture is complete</h1>" +
        "<p>Your picture is complete, the embedding site got the base64 image.<br>" +
        "Because this is an example implementation, it can't assume there's a script ready " +
        "to process the data on the host. So pretend that this base64 dump of the raw " +
        "image data was saved somewhere:</p><code>" +
        image.match(/.{1,100}/g).join("<br>") +
        "</code></div>";
            }
        }
    }
    window.addEventListener("message", receiveMessage, false);
    window.muroMessage = function (message) { muroIframe.contentWindow.postMessage(message, '*'); };
    })(window);