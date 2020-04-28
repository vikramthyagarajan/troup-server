import * as jwt from 'jsonwebtoken';

import { ContextParameters } from 'graphql-yoga/dist/types';
import { tokenRetriever } from 'utils';

export function middleware_Auth() {
    return function(
        request: ContextParameters['request'],
        response: ContextParameters['response'],
        next: Function
    ) {
        const bearer = request.get('Bearer');
        if (!bearer) {
            return next();
        }

        try {
            const { userId, teamId } = tokenRetriever(bearer);
            request.headers.userId = userId;
            request.headers.teamId = teamId;
        } catch (error) {
            console.log('AUTH_MIDDLEWARE', error.message);
            response.removeHeader('Bearer');
            response.removeHeader('userId');
            response.removeHeader('teamId');
        }

        return next();
    };
}
