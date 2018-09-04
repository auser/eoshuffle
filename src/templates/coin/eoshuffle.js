module.exports = {
    development: {
        httpEndpoint: 'http://192.168.99.100:8888',
        chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
        keyProvider: (...args) => {
            return ['5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3'];
        },
        tokenAccount: 'eosio',
        verbose: true,
        debug: true,
    },
};