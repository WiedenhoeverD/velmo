// eslint-disable-next-line import/no-anonymous-default-export
export default {
    api: {
        output: {
            target: './api/generated.ts',
            client: 'axios',
            prettier: true,
            override: {
                mutator: {
                    path: './api/axiosInstance.ts', // eigene Axios Config
                    name: 'customAxios',
                },
            },
            mode: 'tags-split',
            schemas: './api/model',
            hooks: true,
        },
        input: {
            target: 'http://localhost:8080/api-docs/openapi.json',
        },
    },
}
