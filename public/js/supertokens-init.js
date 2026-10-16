import SuperTokens from "supertokens-web-js";
import Session from "supertokens-web-js/recipe/session";

SuperTokens.init({
    appInfo: {
        appName: "Portfolio",
        apiDomain: window.location.origin,
        websiteDomain: window.location.origin,
        apiBasePath: "/auth",
        websiteBasePath: "/auth",
    },
    recipeList: [
        Session.init(),
    ],
});

window.checkSession = async () => {
    try {
        const exists = await Session.doesSessionExist();
        console.log("Session exists:", exists);

        if (exists) {
            const userId = await Session.getUserId();
            console.log("User ID:", userId);
        }

        return exists;
    } catch (e) {
        console.error("Session error:", e);
        return false;
    }
};