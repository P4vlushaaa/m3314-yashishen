import SuperTokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import EmailPassword from 'supertokens-node/recipe/emailpassword';
import UserRoles from 'supertokens-node/recipe/userroles';

export function initSuperTokens() {
    SuperTokens.init({
        framework: 'express',
        supertokens: {
            connectionURI: process.env.SUPERTOKENS_CONNECTION_URI!,
            apiKey: process.env.SUPERTOKENS_API_KEY,
        },
        appInfo: {
            appName: process.env.SUPERTOKENS_APP_NAME!,
            apiDomain: process.env.SUPERTOKENS_API_DOMAIN!,
            websiteDomain: process.env.SUPERTOKENS_WEBSITE_DOMAIN!,
            apiBasePath: '/auth',
            websiteBasePath: '/auth',
        },
        recipeList: [
            EmailPassword.init(),
            Session.init(),
            UserRoles.init(),
        ],
    });
}