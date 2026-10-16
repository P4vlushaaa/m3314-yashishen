import {
    ApolloServerPlugin,
    GraphQLRequestContext,
    GraphQLRequestListener,
} from '@apollo/server';
import {
    getComplexity,
    simpleEstimator,
    fieldExtensionsEstimator,
} from 'graphql-query-complexity';

export class QueryComplexityPlugin implements ApolloServerPlugin {
    async requestDidStart(): Promise<GraphQLRequestListener<any>> {
        const maxComplexity = 20;

        return {
            async didResolveOperation(requestContext: GraphQLRequestContext<any>) {
                const complexity = getComplexity({
                    schema: requestContext.schema,
                    operationName: requestContext.request.operationName,
                    query: requestContext.document,
                    variables: requestContext.request.variables,
                    estimators: [
                        fieldExtensionsEstimator(),
                        simpleEstimator({ defaultComplexity: 1 }),
                    ],
                });

                console.log('Query complexity:', complexity);

                if (complexity > maxComplexity) {
                    throw new Error(
                        `Query is too complex: ${complexity}. Max allowed: ${maxComplexity}`,
                    );
                }
            },
        };
    }
}