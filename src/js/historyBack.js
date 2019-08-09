export default function(){
    pushHistory();
    window.addEventListener("popstate", function (e) {
        window.history.go(1);
        return false;
    }, false);
    function pushHistory() {
        var state = {
            title: "title",
            url: "#"
        };
        window.history.pushState(state, "title", "#");
    }
}
