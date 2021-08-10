const Pool = require('pg').Pool;

const pool = new Pool({
    user: "korbi",
    password: "korbi",
    host: "localhost",
    port: 5432,
    database: "pernshoes"
});

module.exports = pool;