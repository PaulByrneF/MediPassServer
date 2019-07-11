const mysql = require('mysql');

//Controllers
const userController = require('./controllers/users');
// const ehrsController = require('./controllers/healthrecords');
// const mediKeyController = require('./controllers/medi_key');

//Modules
const express = require("express");
const bodyParser = require('body-parser');

const app = express();
const router = express.Router();

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


// var connection =  mysql.createConnection ({
//         host: 'us-cdbr-iron-east-02.cleardb.net',
//           user: 'b795f1a2ae3d32',
//           password: 'a7fa35f1',
//           database: 'heroku_5964b350e9e6f96'
//       });

// connection.connect();

// app.get('/', async (req, res) => {

//     await connection.query('SELECT * FROM PatientAuth', (err, result, fields) => {
//         if (err) {
//             console.log('error: ', err);
//             throw err;
//         }
//         res.status(200).send(result);
//     });
//     // res.send('hello world');
// });
//     }
//     res.status(200).send('Welcome to MediPass API');
//     console.log('MediPass API');
// })

app.use("/api", router);

// //User Profile Info Routes

// // router.route('/test/:sex').get(userController.test);

router.route("/register/").post(userController.registerUser);

router.route("/loginUser/:email/:password").get(userController.loginUser);

// router.route("/user/:pid/getUserInfo/").get(userController.getUserInfo);

// router.route("/user/:pid/updatePatientDetails/").post(userController.updatePatientDetails);

// router.route("/user/:pid/updatePatientMedProfile/").post(userController.updatePatientMedProfile);

// router.route("/findDoctor/:searchContent").get(userController.findHealthPactioner);

// router.route("/user/:pid/addConnection/:mpid").get(userController.addConnection);

// router.route("/user/:pid/viewConnections").get(userController.viewConnections);

// router.route('/user/:pid/connection/:mpid/:consentStatus').get(userController.alterConnectionConsent);


// //MediKey Routes
// router.route("/user/:pid/syncMediRing/").post(mediKeyController.syncMediRing);


// //Health Records Info Routes
// router.route("/validprescriptions/:pId").get(ehrsController.getValidPrescriptions);

// router.route("/prescriptions/:pId").get(ehrsController.getPrescriptions);

// router.route("/consultations/:pId").get(ehrsController.getConsultations);

// router.route("/emr/:cId").get(ehrsController.getEMR);

// router.route("/medicinehistory/:pId").get(ehrsController.getPatientMedicineHistory);



const server = app.listen(process.env.PORT || 5000, () => {
    
    const host = server.address().address;
    const port = server.address().port;
    
    console.log("Server is listening at:%s on post %s", host, port);

});