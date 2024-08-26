const sql = require('mssql');

const config = {
    server: 'DESKTOP-D9K1P43',
    database: 'SocialMediaManagementDb',
    options: {
        trustServerCertificate: true,
        enableArithAbort: true
    },
    authentication: {
        type: 'default',
        options: {
            userName: 'myUser',
            password: '1234'   
        }
    },
    port: 1433
};

let pool;

async function connectToDatabase() {
    if (!pool) {
        try {
            pool = await sql.connect(config);
            console.log('SQL Server bağlantısı başarılı');
        } catch (err) {
            console.error('SQL Server bağlantısı başarısız:', err);
            pool = null;
        }
    }
    return pool;
}

module.exports = {
    connectToDatabase
};
