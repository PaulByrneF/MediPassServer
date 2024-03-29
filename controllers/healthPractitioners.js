const crypto = require('crypto');
const mysql = require("mysql");


function handleDisconnect() {
    connection = mysql.createConnection({
        host: 'us-cdbr-iron-east-02.cleardb.net',
        user: 'b795f1a2ae3d32',
        password: 'a7fa35f1',
        database: 'heroku_5964b350e9e6f96'
    });                                           // Recreate the connection, since
    // the old one cannot be reused.

    connection.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });                                     // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            handleDisconnect();                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err;                                  // server variable configures this)
        }
    });
}

handleDisconnect();

//MediKey Util
var genRandomString = function(length) {
	return crypto.randomBytes(Math.ceil(length/2))
		.toString('hex') //Convert to Hex Format
		.slice(0, length); // return required number of characters
};

//SHA512
var sha512 = function (user_code, salt) {
	var hash = crypto.createHmac('sha512', salt); //Use SHA15
	hash.update(user_code);
	var value = hash.digest('hex');
	return {
		salt: salt,
		valueHash: value
	};
};

//Salt Hash Password
function saltHashMediKey(user_code) {
	var salt = genRandomString(16);  //Generate random string withn 16 character to salt
	var mediKey = sha512(user_code, salt);
	return mediKey;
}

function checkHashPassword(user_password, salt) {
    const passwordData = sha512(user_password, salt);
    return passwordData;
}

// //CreateMediRing
// exports.createMediRing = async function(req, res ) {

//     const pid = req.params.pid


//     const hash_data = saltHashMediKey(pid);
//     const mediKey = hash_data.valueHash;

//     // res.status(200).send('pid:'+pid+' mediKey:' +mediKey);
//     // console.log('pid:'+pid+' mediKey:' +mediKey);

//     const addMediKeySQL = 'INSERT INTO `MediRing`(`MediRingID`, `MediKey`, `status`, `PatientID`) VALUES (?,?,?,?)';

//     connection.query(addMediKeySQL, [null, mediKey, 0, pid], function(err, result, fields) {
//         connection.on('ERROR', function(err) {
//             console.log('[MySQL ERROR', err);
//             res.status(400).send('Add MediKey ERROR: ', err);
//         });
//     console.log('MediKey Successfully Added');
//     res.status(201).send(mediKey);
//     });
// };


//Search HealthPractioners
exports.getPatients = async (req, res) => {

    const sc = connection.escape(req.params.searchContent);
    console.log(sc);

    let o = {} // empty Object
    let key = 'patients';
    o[key] = []; // empty Array, which you can push() values into

    const sql = `Select * from connection as c 
    Inner Join patientdetail as p
    On p.PatientID = c.PatientID`;

    console.log(sql);

    await connection.query(sql, function (err, result, fields) {
        connection.on('Error', function (err) {
            console.log('[MySQL ERROR', err);
            res.status(400).send('Search ERROR: ', err);
        });

        //If User Found
        if (result && result.length) {

            for (i = 0; i < result.length; i++) {
                console.log(result[i]);
                o[key].push(result[i]);
            }

            console.log(o);
            res.status(200).send(o);
        }
        else {
            console.log('Not Found');
            res.status(404).send('Error No Details Found');
        }
    });
};

//Search HealthPractioners
exports.getEmergencies = async (req, res) => {

    let o = {} // empty Object
    let key = 'emergencies';
    o[key] = []; // empty Array, which you can push() values into

    const sql = `Select * from emergency`;

    console.log(sql);

    await connection.query(sql, function (err, result, fields) {
        connection.on('Error', function (err) {
            console.log('[MySQL ERROR', err);
            res.status(400).send('Search ERROR: ', err);
        });

        //If User Found
        if (result && result.length) {

            for (i = 0; i < result.length; i++) {
                console.log(result[i]);
                o[key].push(result[i]);
            }

            console.log(o);
            res.status(200).send(o);
        }
        else {
            console.log('Not Found');
            res.status(404).send('Error No Details Found');
        }
    });
};

